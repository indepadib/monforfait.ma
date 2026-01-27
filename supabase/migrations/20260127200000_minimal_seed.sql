-- First update the enum to include missing values
ALTER TYPE technology_type ADD VALUE IF NOT EXISTS '4G Box';
ALTER TYPE technology_type ADD VALUE IF NOT EXISTS '3G';

-- Note: We'll use the scraper to populate real data automatically
-- This is just a minimal seed for initial demo

-- Seed 3 basic operators if they don't exist
INSERT INTO public.operators (name, website_url, logo_url) VALUES
('Orange Morocco', 'https://www.orange.ma', '/logos/orange.png'),
('Inwi', 'https://www.inwi.ma', '/logos/inwi.png'),
('Maroc Telecom', 'https://www.iam.ma', '/logos/iam.png')
ON CONFLICT DO NOTHING;

-- Just a few sample offers - the scraper will handle the rest
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, price_dh, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 100M', 'internet', 'individual', 'FTTH', 100, 349, '{"sample": true}', true),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 100M', 'internet', 'individual', 'FTTH', 100, 349, '{"sample": true}', true),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 100M', 'internet', 'individual', 'FTTH', 100, 400, '{"sample": true}', true)
ON CONFLICT DO NOTHING;
