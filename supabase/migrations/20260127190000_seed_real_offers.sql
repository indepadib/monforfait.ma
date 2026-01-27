-- Comprehensive Seed Data for Morocco Telco Comparison Platform
-- Based on real 2026 pricing from Orange, Inwi, and Maroc Telecom
-- Last updated: January 2026

-- ============================================
-- INTERNET OFFERS - B2C (Particuliers)
-- ============================================

-- ORANGE MOROCCO - Fibre B2C
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre 20 Mega', 'internet', 'individual', 'FTTH', 20, 10, 249, 0, 12, '{"calls": "illimité fixes nationaux", "mobile_hours": 2}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre 50 Mega', 'internet', 'individual', 'FTTH', 50, 25, 299, 0, 12, '{"calls": "illimité fixes nationaux", "mobile_hours": 2, "promo": "Prix réduit 2025"}', true, 'Promo'),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre 100 Mega', 'internet', 'individual', 'FTTH', 100, 50, 349, 0, 12, '{"calls": "illimité fixes nationaux", "mobile_hours": 3}', true, 'Populaire'),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre 200 Mega', 'internet', 'individual', 'FTTH', 200, 100, 449, 0, 12, '{"calls": "illimité fixes nationaux", "mobile_hours": 4}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre 500 Mega', 'internet', 'individual', 'FTTH', 500, 250, 749, 0, 12, '{"calls": "illimité fixes nationaux", "mobile_hours": 5, "wifi_sans_coupures": true}', true, null);

-- INWI MOROCCO - Fibre B2C
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 20 Mega', 'internet', 'individual', 'FTTH', 20, 10, 249, 0, 12, '{"router_included": true, "wifi": "WiFi 6"}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 50 Mega', 'internet', 'individual', 'FTTH', 50, 25, 299, 0, 12, '{"router_included": true, "wifi": "WiFi 6"}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 100 Mega', 'internet', 'individual', 'FTTH', 100, 50, 349, 0, 12, '{"router_included": true, "wifi": "WiFi 7"}', true, 'WiFi 7'),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 200 Mega', 'internet', 'individual', 'FTTH', 200, 100, 449, 0, 12, '{"router_included": true, "wifi": "WiFi 7"}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 500 Mega', 'internet', 'individual', 'FTTH', 500, 250, 749, 0, 12, '{"router_included": true, "wifi": "WiFi 7", "streaming_4k": true}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Fibre 1 Giga', 'internet', 'individual', 'FTTH', 1000, 500, 949, 0, 12, '{"router_included": true, "wifi": "WiFi 7", "pro_ready": true}', true, 'Ultra Rapide');

-- MAROC TELECOM - Fibre B2C (Estimated based on typical pricing)
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Maroc Telecom%' OR name ILIKE '%IAM%' LIMIT 1), 'Fibre 100 Mega', 'internet', 'individual', 'FTTH', 100, 50, 400, 0, 12, '{"calls": "illimité fixes", "mobile_hours": 2}', true, null),
((SELECT id FROM public.operators WHERE name ILIKE '%Maroc Telecom%' OR name ILIKE '%IAM%' LIMIT 1), 'Fibre 200 Mega', 'internet', 'individual', 'FTTH', 200, 100, 500, 0, 12, '{"calls": "illimité fixes", "mobile_hours": 3}', true, 'Upgrade Gratuit 2025');

-- ORANGE - ADSL B2C
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Pack Duo ADSL 12M', 'internet', 'individual', 'ADSL', 12, 1, 240, 0, 12, '{"calls": "illimité fixes", "mobile_hours": 2}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'ADSL Ultra', 'internet', 'individual', 'ADSL', 20, 1, 149, 0, 12, '{"unlimited": true}', true);

-- INWI - ADSL B2C
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'ADSL Xtra 20M', 'internet', 'individual', 'ADSL', 20, 1, 149, 0, 12, '{"unlimited": true}', true);

-- ============================================
-- MOBILE OFFERS - B2C (Particuliers)
-- ============================================

-- INWI WIN - Mobile B2C
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, sms_count, price_dh, commitment_months, features, is_active, highlight_badge) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Forfait Win 15Go', 'mobile', 'individual', 15, 60, -1, 49, 1, '{"network": "4G/5G", "social_media": false}', true, 'Meilleur Prix'),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Forfait Win 25Go Social', 'mobile', 'individual', 25, 180, -1, 95, 1, '{"network": "4G/5G", "social_media": "illimité"}', true, 'Réseaux Sociaux Offerts'),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Forfait Win 80Go Premium', 'mobile', 'individual', 80, 180, -1, 199, 1, '{"network": "4G/5G", "social_media": "illimité", "priority_support": true}', true, null);

-- ORANGE - Mobile B2C (Estimated typical plans)
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, sms_count, price_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Forfait Orange 10Go', 'mobile', 'individual', 10, 60, -1, 49, 1, '{"network": "4G", "roaming": false}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Forfait Orange 30Go', 'mobile', 'individual', 30, 180, -1, 99, 1, '{"network": "4G/5G", "roaming": "zone 1"}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Forfait Orange 50Go+', 'mobile', 'individual', 50, -1, -1, 149, 1, '{"network": "4G/5G", "roaming": "zone 1", "calls": "illimité"}', true);

-- MAROC TELECOM - Mobile B2C (Estimated)
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, sms_count, price_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Maroc Telecom%' OR name ILIKE '%IAM%' LIMIT 1), 'Forfait Liberté 25Go', 'mobile', 'individual', 25, 120, -1, 99, 1, '{"network": "4G/5G"}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Maroc Telecom%' OR name ILIKE '%IAM%' LIMIT 1), 'Forfait Liberté 50Go', 'mobile', 'individual', 50, 240, -1, 149, 1, '{"network": "4G/5G", "international": "2h zone 1"}', true);

-- ============================================
-- INTERNET OFFERS - B2B (Professionnels)
-- ============================================

-- ORANGE - Fibre Pro
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, highlight_badge, is_sponsored) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre Pro 100M', 'internet', 'professional', 'FTTH', 100, 100, 490, 500, 24, '{"static_ip": true, "support": "premium", "sla": "99.9%"}', true, null, false),
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Fibre Pro 200M', 'internet', 'professional', 'FTTH', 200, 200, 690, 500, 24, '{"static_ip": true, "support": "premium", "sla": "99.9%", "backup_4g": true}', true, 'Recommandé Pros', true);

-- INWI - Business Link
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Business Link 100M', 'internet', 'professional', 'FTTH', 100, 50, 449, 300, 24, '{"static_ip": true, "support": "business"}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Business Link 500M', 'internet', 'professional', 'FTTH', 500, 250, 849, 300, 24, '{"static_ip": true, "support": "business", "vpn_ready": true}', true);

-- MAROC TELECOM - Fibre Entreprise
INSERT INTO public.plans (operator_id, title, category, target_audience, technology, download_speed_mbps, upload_speed_mbps, price_dh, setup_fee_dh, commitment_months, features, is_active, is_sponsored) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Maroc Telecom%' OR name ILIKE '%IAM%' LIMIT 1), 'Fibre Optique Entreprise 200M', 'internet', 'professional', 'FTTH', 200, 100, 990, 800, 24, '{"static_ip": true, "security": "advanced", "support": "24/7"}', true, true);

-- ============================================
-- MOBILE OFFERS - B2B (Professionnels)
-- ============================================

-- ORANGE - Flotte Pro
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, sms_count, price_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Orange%' LIMIT 1), 'Flotte Pro 50Go', 'mobile', 'professional', 50, -1, -1, 150, 12, '{"network": "4G/5G", "fleet_management": true, "pooling": true}', true);

-- INWI - Business Mobile
INSERT INTO public.plans (operator_id, title, category, target_audience, mobile_data_gb, voice_minutes, sms_count, price_dh, commitment_months, features, is_active) VALUES
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Business Mobile 40Go', 'mobile', 'professional', 40, -1, -1, 120, 12, '{"network": "4G/5G", "fleet_management": true}', true),
((SELECT id FROM public.operators WHERE name ILIKE '%Inwi%' LIMIT 1), 'Business Mobile 100Go', 'mobile', 'professional', 100, -1, -1, 249, 12, '{"network": "4G/5G", "fleet_management": true, "pooling": true, "priority": true}', true);
