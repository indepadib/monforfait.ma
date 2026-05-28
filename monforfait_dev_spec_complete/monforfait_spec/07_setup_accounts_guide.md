# monforfait.ma — Guide de création des comptes
## Stack cheap · Ordre de création · Étapes exactes

---

## COMPTE 1 — Vapi.ai (orchestrateur principal)

**URL** : https://dashboard.vapi.ai

1. Sign up avec email professionnel
2. Vérifier l'email
3. Dashboard → **Provider Keys** → Ajouter :
   - Groq API Key (voir Compte 2)
   - Cartesia API Key (voir Compte 3)
   - Deepgram API Key (voir Compte 4)
4. Dashboard → **Phone Numbers** → Buy Number
   - Chercher numéro Maroc (+212) si disponible
   - Sinon : Import Telnyx (voir Compte 5 d'abord)
5. Dashboard → **Assistants** → Create → Import JSON
   - Importer le fichier `04_vapi_config_final.json`
   - Remplacer `VOTRE_DOMAINE.com` et `VOTRE_WEBHOOK_SECRET_ICI`
   - Noter l'Assistant ID généré
6. Dashboard → Assistants → [Yasmine] → **Test** avec votre propre numéro
   - Valider la voix, le débit, les transitions

**Clés à récupérer** :
- API Key → `VAPI_API_KEY`
- Assistant ID → `VAPI_ASSISTANT_ID`
- Phone Number ID → `VAPI_PHONE_NUMBER_ID`

---

## COMPTE 2 — Groq (LLM ultra-rapide et pas cher)

**URL** : https://console.groq.com

1. Sign up → Vérifier email
2. Left menu → **API Keys** → Create API Key
3. Nommer : "monforfait-production"
4. Copier la clé (ne s'affiche qu'une fois)
5. Aller dans Vapi → Provider Keys → Groq → Coller la clé

**Modèle à utiliser** : `llama-3.3-70b-versatile`
**Prix** : ~$0.00059 / 1K tokens input, $0.00079 / 1K output
**Clé à récupérer** : `GROQ_API_KEY`

---

## COMPTE 3 — Cartesia (TTS naturel et moins cher)

**URL** : https://play.cartesia.ai

1. Sign up → Vérifier email
2. Top right → **API Keys** → New API Key
3. Nommer : "monforfait-vapi"
4. **Voice Library** → Chercher voix française féminine :
   - "Chloé" ou "Camille" ou "Amara" pour un accent naturel
   - Tester plusieurs → noter le Voice ID de celle choisie
5. Mettre à jour dans `vapi_config.json` le champ `voiceId` avec l'ID choisi
6. Aller dans Vapi → Provider Keys → Cartesia → Coller la clé

**Modèle** : `sonic-multilingual`
**Prix** : ~$0.09 / 1K caractères (vs $0.30 ElevenLabs)
**Clé à récupérer** : `CARTESIA_API_KEY` + Voice ID

---

## COMPTE 4 — Deepgram (STT — transcription)

**URL** : https://console.deepgram.com

1. Sign up → $200 de crédit offert au départ
2. Left menu → **API Keys** → Create a Key
3. Permissions : `Member` (pas besoin de plus)
4. Aller dans Vapi → Provider Keys → Deepgram → Coller la clé

**Modèle** : `nova-2` avec `language: fr`
**Prix** : $0.0059 / minute
**Clé à récupérer** : `DEEPGRAM_API_KEY`

---

## COMPTE 5 — Telnyx (téléphonie moins chère)

**URL** : https://portal.telnyx.com

1. Sign up → Vérifier identité (document requis)
2. Left menu → **Numbers** → Search & Buy
   - Chercher numéro +212 (Maroc)
   - Si pas disponible, prendre un numéro français +33 (les prospects peuvent recevoir des appels internationaux)
3. **Connections** → Create SIP Connection → "Vapi Integration"
   - Copier le Connection ID
4. **API Keys** → Create new key
5. Dans Vapi → Phone Numbers → Import Telnyx :
   - Entrer API Key + Connection ID + numéro

**Prix Maroc** : ~$0.025/min outbound (vs $0.052 Twilio)
**Clés à récupérer** : `TELNYX_API_KEY` + `TELNYX_CONNECTION_ID`

---

## COMPTE 6 — Google Cloud (pour Google Sheets)

**URL** : https://console.cloud.google.com

1. Créer un projet : "monforfait-voice"
2. **APIs & Services** → Enable APIs :
   - Google Sheets API
   - Google Drive API
3. **Credentials** → Create Credentials → **Service Account**
   - Nom : "monforfait-voice-bot"
   - Rôle : Editor
4. Cliquer sur le service account créé → **Keys** → Add Key → JSON
   - Télécharger `credentials.json`
   - Placer dans le dossier du projet (ne pas commiter)
5. Créer un Google Sheet vide
   - Copier l'ID depuis l'URL : `docs.google.com/spreadsheets/d/[ID_ICI]/edit`
   - Partager le Sheet avec l'email du service account
   - Permissions : Éditeur
6. Mettre l'ID dans `.env` → `GOOGLE_SHEET_ID`

**Coût** : Gratuit pour les volumes monforfait.ma
**Fichier à récupérer** : `credentials.json` + Sheet ID

---

## RÉCAPITULATIF DES COÛTS MENSUELS ESTIMÉS

| Service       | Coût / appel 70s | 1 000 appels/mois | 5 000 appels/mois |
|---------------|-------------------|---------------------|---------------------|
| Vapi          | $0.058            | $58                 | $292                |
| Telnyx Maroc  | $0.029            | $29                 | $145                |
| Groq LLM      | $0.002            | $2                  | $10                 |
| Cartesia TTS  | $0.005            | $5                  | $25                 |
| Deepgram STT  | $0.007            | $7                  | $35                 |
| Google Cloud  | —                 | $0                  | $0                  |
| **TOTAL USD** | **$0.101**        | **$101 (~1 010 MAD)** | **$507 (~5 070 MAD)** |

---

## ORDRE DE SETUP RECOMMANDÉ POUR LES DEVS

```
Jour 1 matin:
  ✓ Créer comptes Groq, Cartesia, Deepgram (15 min chacun)
  ✓ Créer compte Vapi, ajouter les 3 clés providers
  ✓ Importer vapi_config.json dans Vapi

Jour 1 après-midi:
  ✓ Créer compte Telnyx, acheter numéro, connecter à Vapi
  ✓ Setup Google Cloud + créer Service Account + Google Sheet

Jour 2:
  ✓ Exécuter les migrations SQL (01_database_schema.sql)
  ✓ Déployer webhook (02_backend_api.js) sur Railway/Render
  ✓ Configurer l'URL webhook dans Vapi
  ✓ Test end-to-end sur 3 numéros contrôlés

Jour 3:
  ✓ Intégrer le formulaire frontend (03_frontend_form.html)
  ✓ Déployer le dashboard admin (06_admin_dashboard.html)
  ✓ Test complet avec 10 vrais leads
  ✓ Valider le Google Sheets auto-update
```
