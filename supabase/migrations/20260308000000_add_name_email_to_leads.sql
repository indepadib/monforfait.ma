-- Ajouter les colonnes manquantes à la table leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT;
