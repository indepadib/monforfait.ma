-- Ajouter la colonne address à la table leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS address TEXT;
