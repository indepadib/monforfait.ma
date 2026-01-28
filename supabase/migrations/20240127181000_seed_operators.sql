-- Add unique constraint to name to prevent duplicates
BEGIN;

ALTER TABLE public.operators DROP CONSTRAINT IF EXISTS operators_name_key;
ALTER TABLE public.operators ADD CONSTRAINT operators_name_key UNIQUE (name);

-- Seed operators required by the scraper
INSERT INTO public.operators (name, website_url) VALUES 
('Orange Morocco', 'https://www.orange.ma'),
('Inwi', 'https://www.inwi.ma'),
('Maroc Telecom', 'https://www.iam.ma')
ON CONFLICT (name) DO NOTHING;

COMMIT;
