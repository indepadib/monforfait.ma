-- ============================================================
-- monforfait.ma — Voice AI Integration
-- DATABASE MIGRATIONS
-- Run in order. All tables use UTF8MB4 for Arabic/French support.
-- ============================================================

-- ─── 1. Ajouter les colonnes manquantes à la table leads existante ────────────
-- ADAPTER le nom de ta table leads si différent (ex: contacts, form_submissions)

ALTER TABLE leads
  ADD COLUMN voice_status       ENUM('PENDING','CALLING','CONFIRMED','INVALID','VOICEMAIL','CALLBACK_REQUESTED','DECLINED','ABANDONED')
                                DEFAULT 'PENDING'
                                COMMENT 'Statut après appel IA'
                                AFTER status,

  ADD COLUMN voice_called_at    DATETIME    NULL COMMENT 'Timestamp du dernier appel',
  ADD COLUMN voice_retry_count  TINYINT     NOT NULL DEFAULT 0 COMMENT 'Nombre de tentatives',
  ADD COLUMN voice_next_retry   DATETIME    NULL COMMENT 'Prochaine tentative planifiée',
  ADD COLUMN consent_voice      TINYINT(1)  NOT NULL DEFAULT 0 COMMENT '1 = prospect a accepté d être rappelé',
  ADD COLUMN consent_at         DATETIME    NULL COMMENT 'Timestamp du consentement';

-- Index pour les requêtes fréquentes
CREATE INDEX idx_leads_voice_status ON leads(voice_status);
CREATE INDEX idx_leads_voice_next_retry ON leads(voice_next_retry);


-- ─── 2. Table des appels voix (un enregistrement par tentative) ───────────────

CREATE TABLE voice_calls (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id               BIGINT UNSIGNED NOT NULL COMMENT 'FK vers leads.id',
  vapi_call_id          VARCHAR(100)    NULL     COMMENT 'ID retourné par Vapi',

  -- Résultat
  status                ENUM(
                          'CONFIRMED',
                          'INVALID',
                          'VOICEMAIL',
                          'CALLBACK_REQUESTED',
                          'DECLINED',
                          'ERROR'
                        ) NULL,

  -- Données collectées
  first_name_confirmed  TINYINT(1)      NULL,
  q1_operator_raw       VARCHAR(100)    NULL COMMENT 'Ce que le prospect a dit exactement',
  q1_operator_norm      ENUM('IAM','Orange','Inwi','Aucun','Inconnu') NULL,
  q2_service            ENUM('mobile','box','bundle','non_précisé')   NULL,
  callback_preference   ENUM('matin','après-midi')                    NULL,
  summary               TEXT            NULL COMMENT 'Résumé IA de l appel',

  -- Routing
  target_operator_1     VARCHAR(50)     NULL COMMENT 'Opérateur à qui vendre ce lead en priorité',
  target_operator_2     VARCHAR(50)     NULL,
  lead_value            ENUM('standard','élevée','premium') NULL,

  -- Médias
  recording_url         VARCHAR(500)    NULL COMMENT 'URL MP3 de l enregistrement',
  transcript_url        VARCHAR(500)    NULL COMMENT 'URL du transcript texte',

  -- Timing
  duration_seconds      SMALLINT        NULL,
  started_at            DATETIME        NULL,
  ended_at              DATETIME        NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_vc_lead_id    (lead_id),
  KEY idx_vc_status     (status),
  KEY idx_vc_created_at (created_at),
  CONSTRAINT fk_vc_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─── 3. Liste noire (opt-out définitif) ──────────────────────────────────────

CREATE TABLE voice_blacklist (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  phone_norm    VARCHAR(20)  NOT NULL COMMENT 'Format +212XXXXXXXXX',
  reason        VARCHAR(255) NULL,
  added_by      VARCHAR(100) NULL COMMENT 'admin | auto (DECLINED)',
  added_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_vb_phone (phone_norm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── 4. File d'attente des appels à lancer ────────────────────────────────────
-- Le worker lit cette table toutes les N secondes

CREATE TABLE voice_queue (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id       BIGINT UNSIGNED NOT NULL,
  priority      TINYINT         NOT NULL DEFAULT 5 COMMENT '1=haute, 10=basse',
  scheduled_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  locked_until  DATETIME        NULL COMMENT 'Verrouillé par le worker en cours',
  attempts      TINYINT         NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_vq_scheduled (scheduled_at),
  KEY idx_vq_lead_id   (lead_id),
  CONSTRAINT fk_vq_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── 5. Logs d'erreurs des webhooks (debug) ──────────────────────────────────

CREATE TABLE voice_webhook_logs (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  received_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vapi_call_id  VARCHAR(100)    NULL,
  event_type    VARCHAR(100)    NULL,
  payload       JSON            NULL,
  processed     TINYINT(1)      NOT NULL DEFAULT 0,
  error_msg     TEXT            NULL,
  PRIMARY KEY (id),
  KEY idx_vwl_call_id   (vapi_call_id),
  KEY idx_vwl_received  (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
