-- Add missing columns to leads table to support LeadModal.tsx
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS needs_details JSONB;

-- Ensure RLS allows inserting these new columns (the existing policy is likely broad enough, but good to verify)
-- Existing: CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
-- This allows all columns.
