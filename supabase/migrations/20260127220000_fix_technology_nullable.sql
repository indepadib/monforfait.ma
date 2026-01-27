-- Fix schema: make technology nullable for mobile plans
ALTER TABLE public.plans ALTER COLUMN technology DROP NOT NULL;

-- Now re-run the scraper script
