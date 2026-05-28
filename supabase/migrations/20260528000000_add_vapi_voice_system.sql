-- ============================================================
-- monforfait.ma — Voice AI Integration
-- DATABASE MIGRATIONS (PostgreSQL / Supabase compatible)
-- ============================================================

-- ─── 1. Création des Types Enums s'ils n'existent pas ──────────

DO $$ BEGIN
    CREATE TYPE public.voice_status_type AS ENUM (
        'PENDING', 'CALLING', 'CONFIRMED', 'INVALID', 'VOICEMAIL', 'CALLBACK_REQUESTED', 'DECLINED', 'ABANDONED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.voice_call_status_type AS ENUM (
        'CONFIRMED', 'INVALID', 'VOICEMAIL', 'CALLBACK_REQUESTED', 'DECLINED', 'ERROR'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ─── 2. Ajouter les colonnes à la table leads existante ────────

ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS voice_status public.voice_status_type DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS voice_called_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS voice_retry_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS voice_next_retry TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS consent_voice BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMP WITH TIME ZONE NULL;

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_leads_voice_status ON public.leads(voice_status);
CREATE INDEX IF NOT EXISTS idx_leads_voice_next_retry ON public.leads(voice_next_retry);


-- ─── 3. Table des appels voix ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.voice_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    vapi_call_id TEXT NULL,
    status public.voice_call_status_type NULL,
    first_name_confirmed BOOLEAN NULL,
    q1_operator_raw TEXT NULL,
    q1_operator_norm TEXT NULL, -- IAM, Orange, Inwi, Aucun, Inconnu
    q2_service TEXT NULL, -- mobile, box, bundle, non_précisé
    callback_preference TEXT NULL, -- matin, après-midi
    summary TEXT NULL,
    target_operator_1 TEXT NULL,
    target_operator_2 TEXT NULL,
    lead_value TEXT NULL, -- standard, élevée, premium
    recording_url TEXT NULL,
    transcript_url TEXT NULL,
    duration_seconds INTEGER NULL,
    started_at TIMESTAMP WITH TIME ZONE NULL,
    ended_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vc_lead_id ON public.voice_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_vc_status ON public.voice_calls(status);
CREATE INDEX IF NOT EXISTS idx_vc_created_at ON public.voice_calls(created_at);


-- ─── 4. Liste noire (opt-out définitif) ────────────────────────

CREATE TABLE IF NOT EXISTS public.voice_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_norm TEXT NOT NULL UNIQUE, -- Format +212XXXXXXXXX
    reason TEXT NULL,
    added_by TEXT NULL, -- admin | auto
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- ─── 5. File d'attente des appels ──────────────────────────────

CREATE TABLE IF NOT EXISTS public.voice_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    priority INTEGER NOT NULL DEFAULT 5, -- 1=haute, 10=basse
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vq_scheduled ON public.voice_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_vq_lead_id ON public.voice_queue(lead_id);


-- ─── 6. Logs d'erreurs et webhooks (débogage) ──────────────────

CREATE TABLE IF NOT EXISTS public.voice_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    vapi_call_id TEXT NULL,
    event_type TEXT NULL,
    payload JSONB NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    error_msg TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_vwl_call_id ON public.voice_webhook_logs(vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_vwl_received ON public.voice_webhook_logs(received_at);

-- ─── 7. Droits d'accès RLS et permissions ──────────────────────

-- S'assurer que les tables créées sont accessibles par l'application
GRANT ALL ON public.voice_calls TO anon;
GRANT ALL ON public.voice_calls TO authenticated;

GRANT ALL ON public.voice_blacklist TO anon;
GRANT ALL ON public.voice_blacklist TO authenticated;

GRANT ALL ON public.voice_queue TO anon;
GRANT ALL ON public.voice_queue TO authenticated;

GRANT ALL ON public.voice_webhook_logs TO anon;
GRANT ALL ON public.voice_webhook_logs TO authenticated;
