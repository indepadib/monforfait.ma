-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Operators Table
CREATE TABLE IF NOT EXISTS public.operators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    support_rating NUMERIC(2, 1),
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans Table
-- Check if type exists to avoid error on replay
DO $$ BEGIN
    CREATE TYPE technology_type AS ENUM ('FTTH', 'ADSL', '5G', '4G Box');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_id UUID REFERENCES public.operators(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    technology technology_type NOT NULL,
    download_speed_mbps INTEGER,
    upload_speed_mbps INTEGER,
    price_dh NUMERIC(10, 2) NOT NULL,
    setup_fee_dh NUMERIC(10, 2) DEFAULT 0,
    commitment_months INTEGER DEFAULT 12,
    router_model TEXT,
    features JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_phone TEXT NOT NULL,
    selected_plan_id UUID REFERENCES public.plans(id),
    city TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public read access for operators and plans
CREATE POLICY "Public read operators" ON public.operators FOR SELECT USING (true);
CREATE POLICY "Public read plans" ON public.plans FOR SELECT USING (true);

-- Insert only for leads
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_plans_operator ON public.plans(operator_id);
CREATE INDEX idx_leads_plan ON public.leads(selected_plan_id);
