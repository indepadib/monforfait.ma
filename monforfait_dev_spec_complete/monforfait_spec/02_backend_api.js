/**
 * monforfait.ma — Voice AI Integration
 * BACKEND API — Node.js / Express
 *
 * À adapter si votre stack est PHP/Laravel (voir commentaires)
 * Chaque endpoint est commenté ligne par ligne.
 *
 * Installation des dépendances supplémentaires:
 *   npm install axios crypto-js node-cron
 */

const express  = require('express');
const axios    = require('axios');
const crypto   = require('crypto');
const cron     = require('node-cron');
const router   = express.Router();

// ─── Constantes de config (charger depuis .env) ──────────────────────────────
const VAPI_API_KEY         = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID    = process.env.VAPI_ASSISTANT_ID;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_WEBHOOK_SECRET  = process.env.VAPI_WEBHOOK_SECRET;
const VAPI_BASE_URL        = 'https://api.vapi.ai';

// Horaires d'appel Maroc (heure locale GMT+1)
const CALL_HOUR_START = 8;   // 08h00
const CALL_HOUR_END   = 20;  // 20h00
const MAX_RETRIES     = 3;   // Tentatives max par lead
const RETRY_DELAY_H   = 4;   // Heures entre tentatives


// ════════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Normalise un numéro marocain en +212XXXXXXXXX
 * Accepte: 0612345678 / 212612345678 / +212612345678 / 612345678
 */
function normalizePhone(raw) {
  if (!raw) return null;
  let n = String(raw).replace(/[\s\-\.\(\)]/g, '');
  if (n.startsWith('+212')) return n;
  if (n.startsWith('212') && n.length === 12) return '+' + n;
  if (n.startsWith('0') && n.length === 10) return '+212' + n.slice(1);
  if (n.length === 9 && /^[5-7]/.test(n)) return '+212' + n;
  return null; // Numéro non reconnu → ne pas appeler
}

/**
 * Vérifie si on est dans les horaires d'appel autorisés
 */
function isCallingHour() {
  const now  = new Date();
  const hour = now.getHours(); // Assurer que le serveur est en GMT+1
  const day  = now.getDay();   // 0=Dim, 5=Ven
  // Vendredi après 11h30 → pas d'appels (Jumaa)
  if (day === 5 && hour >= 11 && now.getMinutes() >= 30) return false;
  return hour >= CALL_HOUR_START && hour < CALL_HOUR_END;
}

/**
 * Calcule l'opérateur normalisé depuis la réponse texte du prospect
 */
function normalizeOperator(raw) {
  if (!raw) return 'Inconnu';
  const r = raw.toLowerCase();
  if (r.includes('iam') || r.includes('maroc telecom') || r.includes('itissalat')) return 'IAM';
  if (r.includes('orange') || r.includes('méditel') || r.includes('meditel')) return 'Orange';
  if (r.includes('inwi') || r.includes('wana')) return 'Inwi';
  if (r.includes('aucun') || r.includes('pas') || r.includes('non')) return 'Aucun';
  return 'Inconnu';
}

/**
 * Routing : à qui vendre ce lead selon l'opérateur actuel du prospect
 */
function computeRouting(operatorNorm, service) {
  const routingTable = {
    'IAM':    { cible1: 'Inwi',         cible2: 'Orange Maroc' },
    'Orange': { cible1: 'Inwi',         cible2: 'IAM' },
    'Inwi':   { cible1: 'IAM',          cible2: 'Orange Maroc' },
    'Aucun':  { cible1: 'Tous',         cible2: 'N/A' },
    'Inconnu':{ cible1: 'À déterminer', cible2: 'N/A' },
  };
  const serviceValue = { 'mobile': 'standard', 'box': 'élevée', 'bundle': 'premium' };
  const route = routingTable[operatorNorm] || routingTable['Inconnu'];
  return {
    ...route,
    priorite:   operatorNorm !== 'Inconnu' && operatorNorm !== 'Aucun' ? 'haute' : 'moyenne',
    lead_value: serviceValue[service] || 'standard',
  };
}

/**
 * Vérifie la signature HMAC du webhook Vapi
 */
function verifyVapiSignature(rawBody, signatureHeader) {
  if (!VAPI_WEBHOOK_SECRET) return true; // Skip en dev
  const expected = crypto
    .createHmac('sha256', VAPI_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader || '')
  );
}


// ════════════════════════════════════════════════════════════════════════════
// ENDPOINT 1 — Déclencher un appel sur un lead spécifique
// POST /api/voice/call/:leadId
// Auth: admin token requis (middleware à ajouter)
// ════════════════════════════════════════════════════════════════════════════

router.post('/voice/call/:leadId', async (req, res) => {
  const db = req.db; // Connexion DB injectée via middleware

  try {
    // 1. Charger le lead depuis la DB
    const [lead] = await db.query(
      'SELECT id, prenom, telephone, consent_voice, voice_status, voice_retry_count FROM leads WHERE id = ?',
      [req.params.leadId]
    );
    if (!lead) return res.status(404).json({ error: 'Lead introuvable' });

    // 2. Vérifications métier
    if (!lead.consent_voice)
      return res.status(400).json({ error: 'Pas de consentement — ne pas appeler' });

    if (['CONFIRMED','DECLINED','ABANDONED'].includes(lead.voice_status))
      return res.status(400).json({ error: `Lead déjà traité (${lead.voice_status})` });

    if (lead.voice_retry_count >= MAX_RETRIES)
      return res.status(400).json({ error: 'Nombre maximum de tentatives atteint' });

    // 3. Vérifier la liste noire
    const phone = normalizePhone(lead.telephone);
    if (!phone) return res.status(400).json({ error: 'Numéro invalide ou non-marocain' });

    const [blacklisted] = await db.query(
      'SELECT id FROM voice_blacklist WHERE phone_norm = ?',
      [phone]
    );
    if (blacklisted) return res.status(400).json({ error: 'Numéro sur liste noire' });

    // 4. Vérifier les horaires
    if (!isCallingHour())
      return res.status(400).json({
        error: 'Hors horaires d appel (08h-20h, pas le vendredi après 11h30)',
        retry_at: 'Demain 08h00'
      });

    // 5. Appel à l'API Vapi
    const vapiPayload = {
      assistantId:   VAPI_ASSISTANT_ID,
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
      customer: {
        number: phone,
        name:   lead.prenom || 'Client',
      },
      assistantOverrides: {
        variableValues: {
          PRENOM_LEAD: lead.prenom || 'Client',
          LEAD_ID:     String(lead.id),
        }
      },
      metadata: {
        lead_id: String(lead.id),
        source:  'monforfait.ma',
      }
    };

    const vapiResponse = await axios.post(
      `${VAPI_BASE_URL}/call/phone`,
      vapiPayload,
      { headers: { Authorization: `Bearer ${VAPI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const vapiCallId = vapiResponse.data.id;

    // 6. Enregistrer l'appel en DB
    const [callInsert] = await db.query(
      `INSERT INTO voice_calls (lead_id, vapi_call_id, started_at)
       VALUES (?, ?, NOW())`,
      [lead.id, vapiCallId]
    );

    // 7. Mettre à jour le statut du lead
    await db.query(
      `UPDATE leads
       SET voice_status = 'CALLING',
           voice_called_at = NOW(),
           voice_retry_count = voice_retry_count + 1
       WHERE id = ?`,
      [lead.id]
    );

    return res.json({
      success:      true,
      vapi_call_id: vapiCallId,
      call_db_id:   callInsert.insertId,
      phone_called: phone,
    });

  } catch (err) {
    console.error('[voice/call] Error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Erreur serveur', detail: err.message });
  }
});


// ════════════════════════════════════════════════════════════════════════════
// ENDPOINT 2 — Réception du webhook Vapi (fin d'appel)
// POST /api/voice/webhook
// PAS d'auth token — sécurisé par signature HMAC
// ════════════════════════════════════════════════════════════════════════════

router.post('/voice/webhook',
  express.raw({ type: 'application/json' }), // Raw body pour vérification signature
  async (req, res) => {
    const db = req.db;

    // 1. Vérifier la signature
    const sig = req.headers['x-vapi-signature'] || '';
    if (!verifyVapiSignature(req.body, sig)) {
      console.warn('[webhook] Signature invalide');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = JSON.parse(req.body.toString());
    const msg     = payload.message || {};

    // 2. Logger le webhook brut (pour debug)
    await db.query(
      `INSERT INTO voice_webhook_logs (vapi_call_id, event_type, payload)
       VALUES (?, ?, ?)`,
      [msg.call?.id || null, msg.type || null, JSON.stringify(payload)]
    );

    // 3. On ne traite que les événements de fin d'appel
    if (msg.type !== 'end-of-call-report') {
      return res.json({ status: 'ignored', type: msg.type });
    }

    try {
      const call       = msg.call       || {};
      const analysis   = msg.analysis   || {};
      const artifact   = msg.artifact   || {};
      const structured = analysis.structuredData || {};
      const leadId     = call.metadata?.lead_id;

      if (!leadId) {
        console.warn('[webhook] lead_id manquant dans metadata');
        return res.status(400).json({ error: 'lead_id manquant' });
      }

      // 4. Calculer les données de routing
      const opNorm  = normalizeOperator(structured.q1_operateur_actuel || '');
      const service = structured.q2_service_recherche || 'non_précisé';
      const routing = computeRouting(opNorm, service);

      // 5. Calculer la durée
      let duration = 0;
      if (call.startedAt && call.endedAt) {
        duration = Math.round(
          (new Date(call.endedAt) - new Date(call.startedAt)) / 1000
        );
      }

      // 6. Mettre à jour la table voice_calls
      await db.query(
        `UPDATE voice_calls
         SET status               = ?,
             first_name_confirmed = ?,
             q1_operator_raw      = ?,
             q1_operator_norm     = ?,
             q2_service           = ?,
             callback_preference  = ?,
             summary              = ?,
             target_operator_1    = ?,
             target_operator_2    = ?,
             lead_value           = ?,
             recording_url        = ?,
             transcript_url       = ?,
             duration_seconds     = ?,
             ended_at             = NOW()
         WHERE vapi_call_id = ?`,
        [
          structured.status             || 'ERROR',
          structured.first_name_confirmed ? 1 : 0,
          structured.q1_operateur_actuel || null,
          opNorm,
          service,
          structured.callback_preference || null,
          analysis.summary              || null,
          routing.cible1,
          routing.cible2,
          routing.lead_value,
          artifact.recordingUrl         || null,
          artifact.transcriptUrl        || null,
          duration,
          call.id,
        ]
      );

      // 7. Mettre à jour le statut du lead
      const callStatus = structured.status;
      let   leadUpdate = { voice_status: callStatus };

      if (callStatus === 'CALLBACK_REQUESTED') {
        // Planifier la prochaine tentative dans 4h
        const nextRetry = new Date(Date.now() + RETRY_DELAY_H * 3600 * 1000);
        leadUpdate.voice_next_retry = nextRetry.toISOString().slice(0, 19).replace('T', ' ');
      }

      if (callStatus === 'VOICEMAIL') {
        // Voicemail → planifier retry dans 4h aussi
        const nextRetry = new Date(Date.now() + RETRY_DELAY_H * 3600 * 1000);
        leadUpdate.voice_next_retry = nextRetry.toISOString().slice(0, 19).replace('T', ' ');
      }

      if (callStatus === 'DECLINED') {
        // Ajouter à la liste noire automatiquement
        const phone = normalizePhone(call.customer?.number);
        if (phone) {
          await db.query(
            `INSERT IGNORE INTO voice_blacklist (phone_norm, reason, added_by)
             VALUES (?, 'DECLINED sur appel IA', 'auto')`,
            [phone]
          );
        }
      }

      await db.query(
        `UPDATE leads SET voice_status = ?, voice_next_retry = ? WHERE id = ?`,
        [leadUpdate.voice_status, leadUpdate.voice_next_retry || null, leadId]
      );

      // 8. Logger comme traité
      await db.query(
        `UPDATE voice_webhook_logs SET processed = 1 WHERE vapi_call_id = ? ORDER BY id DESC LIMIT 1`,
        [call.id]
      );

      console.log(`[webhook] ✓ Lead ${leadId} → ${callStatus} | ${opNorm} | ${service}`);
      return res.json({ status: 'ok', lead_id: leadId, call_status: callStatus });

    } catch (err) {
      console.error('[webhook] Processing error:', err.message);
      // Logger l'erreur dans la DB
      await db.query(
        `UPDATE voice_webhook_logs SET error_msg = ? WHERE vapi_call_id = ? ORDER BY id DESC LIMIT 1`,
        [err.message, msg.call?.id]
      );
      return res.status(500).json({ error: 'Processing error', detail: err.message });
    }
  }
);


// ════════════════════════════════════════════════════════════════════════════
// ENDPOINT 3 — Liste des leads confirmés (pour le dashboard admin)
// GET /api/voice/leads?status=CONFIRMED&operator=IAM&service=bundle&page=1
// Auth: admin token requis
// ════════════════════════════════════════════════════════════════════════════

router.get('/voice/leads', async (req, res) => {
  const db      = req.db;
  const page    = Math.max(1, parseInt(req.query.page) || 1);
  const limit   = 50;
  const offset  = (page - 1) * limit;

  const filters = [];
  const params  = [];

  if (req.query.status) {
    filters.push('l.voice_status = ?');
    params.push(req.query.status);
  }
  if (req.query.operator) {
    filters.push('vc.q1_operator_norm = ?');
    params.push(req.query.operator);
  }
  if (req.query.service) {
    filters.push('vc.q2_service = ?');
    params.push(req.query.service);
  }
  if (req.query.date_from) {
    filters.push('vc.created_at >= ?');
    params.push(req.query.date_from);
  }

  const where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

  const [rows] = await db.query(
    `SELECT
       l.id, l.prenom, l.telephone, l.email, l.voice_status,
       vc.status         AS call_status,
       vc.q1_operator_norm,
       vc.q2_service,
       vc.target_operator_1,
       vc.lead_value,
       vc.recording_url,
       vc.transcript_url,
       vc.duration_seconds,
       vc.summary,
       vc.created_at     AS called_at
     FROM leads l
     INNER JOIN voice_calls vc ON vc.lead_id = l.id
     ${where}
     ORDER BY vc.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM leads l
     INNER JOIN voice_calls vc ON vc.lead_id = l.id ${where}`,
    params
  );

  return res.json({ data: rows, total, page, pages: Math.ceil(total / limit) });
});


// ════════════════════════════════════════════════════════════════════════════
// ENDPOINT 4 — Métriques KPI pour le dashboard
// GET /api/voice/stats?date_from=2026-05-01&date_to=2026-05-31
// Auth: admin token requis
// ════════════════════════════════════════════════════════════════════════════

router.get('/voice/stats', async (req, res) => {
  const db        = req.db;
  const dateFrom  = req.query.date_from || new Date(Date.now() - 30*86400000).toISOString().slice(0,10);
  const dateTo    = req.query.date_to   || new Date().toISOString().slice(0,10);

  const [stats] = await db.query(
    `SELECT
       COUNT(*)                                             AS total_calls,
       SUM(status = 'CONFIRMED')                           AS confirmed,
       SUM(status = 'INVALID')                             AS invalid,
       SUM(status = 'VOICEMAIL')                           AS voicemail,
       SUM(status = 'CALLBACK_REQUESTED')                  AS callbacks,
       SUM(status = 'DECLINED')                            AS declined,
       ROUND(AVG(duration_seconds))                        AS avg_duration,
       SUM(status = 'CONFIRMED') / COUNT(*) * 100          AS confirmed_rate,
       SUM(lead_value = 'premium')                         AS premium_leads,
       SUM(lead_value = 'élevée')                          AS high_leads
     FROM voice_calls
     WHERE created_at BETWEEN ? AND ?`,
    [dateFrom + ' 00:00:00', dateTo + ' 23:59:59']
  );

  const [byOperator] = await db.query(
    `SELECT q1_operator_norm AS operator, COUNT(*) AS total,
            SUM(status='CONFIRMED') AS confirmed
     FROM voice_calls
     WHERE created_at BETWEEN ? AND ? AND q1_operator_norm IS NOT NULL
     GROUP BY q1_operator_norm
     ORDER BY confirmed DESC`,
    [dateFrom + ' 00:00:00', dateTo + ' 23:59:59']
  );

  const [byService] = await db.query(
    `SELECT q2_service AS service, COUNT(*) AS total,
            SUM(status='CONFIRMED') AS confirmed
     FROM voice_calls
     WHERE created_at BETWEEN ? AND ? AND q2_service IS NOT NULL
     GROUP BY q2_service`,
    [dateFrom + ' 00:00:00', dateTo + ' 23:59:59']
  );

  return res.json({ period: { from: dateFrom, to: dateTo }, stats, byOperator, byService });
});


// ════════════════════════════════════════════════════════════════════════════
// ENDPOINT 5 — Ajouter un lead à la file d'appels
// POST /api/voice/queue (appelé après soumission du formulaire)
// ════════════════════════════════════════════════════════════════════════════

router.post('/voice/queue', async (req, res) => {
  const db     = req.db;
  const leadId = req.body.lead_id;

  if (!leadId) return res.status(400).json({ error: 'lead_id requis' });

  await db.query(
    `INSERT IGNORE INTO voice_queue (lead_id, priority, scheduled_at)
     VALUES (?, 5, NOW())`,
    [leadId]
  );

  return res.json({ status: 'queued', lead_id: leadId });
});


// ════════════════════════════════════════════════════════════════════════════
// WORKER — Traite la file d'appels toutes les 30 secondes
// À démarrer en tant que processus séparé ou via cron job
// ════════════════════════════════════════════════════════════════════════════

async function processQueue(db) {
  if (!isCallingHour()) return; // Pas d'appels hors horaires

  // Prendre jusqu'à 5 leads en attente (évite la surcharge)
  const [pending] = await db.query(
    `SELECT vq.id AS queue_id, vq.lead_id, l.prenom, l.telephone,
            l.consent_voice, l.voice_retry_count
     FROM voice_queue vq
     INNER JOIN leads l ON l.id = vq.lead_id
     WHERE vq.scheduled_at <= NOW()
       AND (vq.locked_until IS NULL OR vq.locked_until < NOW())
       AND l.consent_voice = 1
       AND l.voice_status NOT IN ('CONFIRMED','DECLINED','ABANDONED')
       AND l.voice_retry_count < ?
     ORDER BY vq.priority ASC, vq.scheduled_at ASC
     LIMIT 5`,
    [MAX_RETRIES]
  );

  for (const item of pending) {
    // Verrouiller pendant 2 minutes
    await db.query(
      `UPDATE voice_queue SET locked_until = DATE_ADD(NOW(), INTERVAL 2 MINUTE)
       WHERE id = ?`,
      [item.queue_id]
    );

    try {
      const phone = normalizePhone(item.telephone);
      if (!phone) {
        // Numéro invalide → supprimer de la file
        await db.query('DELETE FROM voice_queue WHERE id = ?', [item.queue_id]);
        await db.query("UPDATE leads SET voice_status = 'INVALID' WHERE id = ?", [item.lead_id]);
        continue;
      }

      // Vérifier la liste noire
      const [bl] = await db.query(
        'SELECT id FROM voice_blacklist WHERE phone_norm = ?', [phone]
      );
      if (bl) {
        await db.query('DELETE FROM voice_queue WHERE id = ?', [item.queue_id]);
        continue;
      }

      // Lancer l'appel
      const vapiResponse = await axios.post(
        `${VAPI_BASE_URL}/call/phone`,
        {
          assistantId:   VAPI_ASSISTANT_ID,
          phoneNumberId: VAPI_PHONE_NUMBER_ID,
          customer:      { number: phone, name: item.prenom || 'Client' },
          assistantOverrides: {
            variableValues: { PRENOM_LEAD: item.prenom || 'Client', LEAD_ID: String(item.lead_id) }
          },
          metadata: { lead_id: String(item.lead_id) }
        },
        { headers: { Authorization: `Bearer ${VAPI_API_KEY}` } }
      );

      await db.query(
        `INSERT INTO voice_calls (lead_id, vapi_call_id, started_at) VALUES (?, ?, NOW())`,
        [item.lead_id, vapiResponse.data.id]
      );

      await db.query(
        `UPDATE leads SET voice_status='CALLING', voice_called_at=NOW(),
                          voice_retry_count = voice_retry_count + 1 WHERE id = ?`,
        [item.lead_id]
      );

      // Supprimer de la file
      await db.query('DELETE FROM voice_queue WHERE id = ?', [item.queue_id]);

      // Pause entre appels
      await new Promise(r => setTimeout(r, 6000));

    } catch (err) {
      console.error(`[worker] Error on lead ${item.lead_id}:`, err.message);
      // Déverrouiller pour retry
      await db.query(
        `UPDATE voice_queue SET locked_until = NULL, attempts = attempts + 1 WHERE id = ?`,
        [item.queue_id]
      );
    }
  }
}

// Lancer le worker en production (décommenter)
// cron.schedule('*/30 * * * * *', () => processQueue(db));

module.exports = { router, processQueue, normalizePhone, normalizeOperator, computeRouting };
