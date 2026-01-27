-- SEED ALL REAL OFFERS (50+) - Run this in Supabase SQL Editor
-- Make sure operators exist first from previous migrations

-- ============================================
-- ORANGE MOROCCO - MOBILE (7 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, price_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Smart 3Go', 'mobile', 'individual', 3, 30, 19, 1, '{"network": "4G"}', true, 'Mini Prix'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 10Go Yo', 'mobile', 'individual', 10, 60, 49, 1, '{"network": "4G", "youth": true}', true, 'Jeunes'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 15Go', 'mobile', 'individual', 15, 90, 69, 1, '{"network": "4G/5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 25Go', 'mobile', 'individual', 25, 120, 89, 1, '{"network": "5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 40Go International', 'mobile', 'individual', 40, -1, 129, 1, '{"network": "5G", "international": "1h"}', true, 'International'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 60Go Premium', 'mobile', 'individual', 60, -1, 179, 1, '{"network": "5G", "prime_video": true}', true, 'Prime Video'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Forfait 100Go Max', 'mobile', 'individual', 100, -1, 299, 1, '{"network": "5G", "cloud": "100Go"}', true, 'Cloud Inclus');

-- ============================================
-- ORANGE MOROCCO - INTERNET (13 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'ADSL Eco 8M', 'internet', 'individual', 'ADSL', 8, 1, 149, 0, 12, '{"budget": true}', true, 'Budget'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'ADSL 20M', 'internet', 'individual', 'ADSL', 20, 1, 240, 0, 12, '{"calls": "unlimited"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 20M Promo', 'internet', 'individual', 'FTTH', 20, 10, 199, 0, 12, '{"promo": "-50 DH"}', true, '-50 DH'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 20M', 'internet', 'individual', 'FTTH', 20, 10, 249, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 50M', 'internet', 'individual', 'FTTH', 50, 25, 299, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 50M Sans Engagement', 'internet', 'individual', 'FTTH', 50, 25, 349, 200, 0, '{"no_commitment": true}', true, 'Flex'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 100M', 'internet', 'individual', 'FTTH', 100, 50, 349, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 100M Triple Play', 'internet', 'individual', 'FTTH', 100, 50, 399, 0, 12, '{"tv": "200 channels"}', true, 'TV Incluse'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 200M Gaming', 'internet', 'individual', 'FTTH', 200, 100, 499, 0, 12, '{"gaming": true, "low_ping": true}', true, 'Gamers'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 500M Premium', 'internet', 'individual', 'FTTH', 500, 250, 749, 0, 12, '{"tv_4k": true}', true, null),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Fibre 1 Giga', 'internet', 'individual', 'FTTH', 1000, 500, 999, 0, 24, '{"wifi7": true}', true, 'Ultra'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Flybox 4G 100Go', 'internet', 'individual', '4G Box', 50, 10, 249, 0, 12, '{"portable": true, "data_cap": "100Go"}', true, 'Nomade'),
((SELECT id FROM public.operators WHERE name = 'Orange Morocco'), 'Flybox 5G Illimitée', 'internet', 'individual', '5G', 300, 50, 499, 0, 12, '{"unlimited": true}', true, '5G');

-- ============================================
-- INWI - MOBILE (8 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, price_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 5Go Starter', 'mobile', 'individual', 5, 30, 29, 1, '{"network": "4G", "youth": true}', true, 'Jeunes'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 11Go', 'mobile', 'individual', 11, 60, 49, 1, '{"network": "4G/5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 15Go', 'mobile', 'individual', 15, 90, 69, 1, '{"network": "5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 20Go WhatsApp', 'mobile', 'individual', 20, 120, 79, 1, '{"network": "5G", "whatsapp_unlimited": true}', true, 'WhatsApp Illimité'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 30Go Social+', 'mobile', 'individual', 30, 180, 99, 1, '{"network": "5G", "social_media": "unlimited"}', true, 'Réseaux Sociaux'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 50Go Streamer', 'mobile', 'individual', 50, -1, 149, 1, '{"network": "5G", "spotify": "6 months"}', true, 'Spotify'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 80Go', 'mobile', 'individual', 80, -1, 199, 1, '{"network": "5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Win 100Go Ultimate', 'mobile', 'individual', 100, -1, 249, 1, '{"network": "5G", "roaming": true}', true, 'Roaming');

-- ============================================
-- INWI - INTERNET (11 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'ADSL Xtra 12M', 'internet', 'individual', 'ADSL', 12, 1, 179, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'ADSL 20M Senior', 'internet', 'individual', 'ADSL', 20, 1, 199, 0, 12, '{"senior": true}', true, '-25%'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 20M Étudiant', 'internet', 'individual', 'FTTH', 20, 10, 199, 0, 12, '{"student": true}', true, 'Étudiants'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 20M', 'internet', 'individual', 'FTTH', 20, 10, 249, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 50M', 'internet', 'individual', 'FTTH', 50, 25, 299, 0, 12, '{}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 100M WiFi 7', 'internet', 'individual', 'FTTH', 100, 50, 399, 0, 12, '{"wifi7": true}', true, 'WiFi 7'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 200M Famille', 'internet', 'individual', 'FTTH', 200, 100, 499, 0, 12, '{"parental_control": true}', true, 'Contrôle Parental'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 500M 4K', 'internet', 'individual', 'FTTH', 500, 250, 749, 0, 12, '{"netflix": "6 months"}', true, 'Netflix'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Fibre 1G Flex', 'internet', 'individual', 'FTTH', 1000, 500, 1099, 500, 0, '{"no_commitment": true}', true, 'Sans Engagement'),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Box 4G 200Go', 'internet', 'individual', '4G Box', 60, 15, 299, 0, 12, '{"data_cap": "200Go"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Inwi'), 'Box 5G Unlimited', 'internet', 'individual', '5G', 400, 80, 549, 0, 12, '{"unlimited": true, "gaming": true}', true, 'Gaming');

-- ============================================
-- MAROC TELECOM - MOBILE (6 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, price_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Jawal 5Go', 'mobile', 'individual', 5, 30, 39, 1, '{"network": "4G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Liberté 15Go', 'mobile', 'individual', 15, 90, 69, 1, '{"network": "4G/5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Liberté 25Go', 'mobile', 'individual', 25, 120, 99, 1, '{"network": "5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Liberté 30Go Music', 'mobile', 'individual', 30, 180, 109, 1, '{"network": "5G", "music_streaming": true}', true, 'Music Unlimited'),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Liberté 50Go', 'mobile', 'individual', 50, -1, 149, 1, '{"network": "5G"}', true, null),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Liberté 70Go', 'mobile', 'individual', 70, -1, 189, 1, '{"network": "5G", "international": "2h"}', true, null);

-- ============================================
-- MAROC TELECOM - INTERNET (6 offers)
-- ============================================
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge, is_sponsored) VALUES
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 50M Découverte', 'internet', 'individual', 'FTTH', 50, 25, 299, 0, 12, '{"first_month_free": true}', true, '1er Mois Offert', true),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 100M Essentiel', 'internet', 'individual', 'FTTH', 100, 50, 400, 0, 12, '{}', true, null, false),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 100M + TV', 'internet', 'individual', 'FTTH', 100, 50, 499, 0, 12, '{"tv": "beIN Sports"}', true, 'Sports & Cinéma', false),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 200M Confort', 'internet', 'individual', 'FTTH', 200, 100, 550, 0, 12, '{}', true, null, false),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), 'Fibre 500M Premium', 'internet', 'individual', 'FTTH', 500, 250, 899, 0, 24, '{"tv_4k": true}', true, null, false),
((SELECT id FROM public.operators WHERE name = 'Maroc Telecom'), '4G Box 150Go', 'internet', 'individual', '4G Box', 40, 10, 269, 0, 12, '{"data_cap": "150Go"}', true, null, false);

-- Count total
SELECT COUNT(*) as total_offers FROM public.plans WHERE is_active = true;
