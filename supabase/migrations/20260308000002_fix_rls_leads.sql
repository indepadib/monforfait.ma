-- S'assurer que les rôles anon et authenticated peuvent insérer des données
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;

-- Au cas où une ancienne politique pose problème, on la supprime
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.leads;

-- Créer une nouvelle politique RLS qui autorise tout le monde à insérer (nécessaire pour le Quiz sans connexion)
CREATE POLICY "Enable insert for everyone" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);
