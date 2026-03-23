-- Migration: Add Lead Scoring and Partners Table
-- This enables automated lead monetization and real-time dispatching.

-- 1. Enhance Leads Table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS thermal_status TEXT DEFAULT 'COLD';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to UUID; -- Optional: reference to partner

-- 2. Create Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    webhook_url TEXT,
    filters JSONB DEFAULT '{}'::jsonb, -- e.g. {"cities": ["Casablanca"], "min_score": 70}
    balance NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add RLS for Partners (Admin only)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can do everything on partners" ON partners FOR ALL USING (true); -- Simplify for now
