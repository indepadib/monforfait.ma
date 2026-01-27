# Supabase Configuration Guide

Your Supabase credentials have been provided. You need to create a `.env.local` file manually with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://gpoylrecftylldgslkdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwb3lscmVjZnR5bGxkZ3Nsa2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzEwNzksImV4cCI6MjA4NTEwNzA3OX0.AcMla0hXab5qV8XovA2RaRN6cqlyMhP8n_-5vkXtJVs
```

## For Admin/Scraping Operations
To run `scripts/scrape.ts`, you'll also need the Service Role Key (for bypassing RLS):
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get this from: **Supabase Dashboard** > **Settings** > **API** > **Service Role Key** (secret)

## Create the file
Run this command in your terminal:
```bash
cd /Users/mac/.gemini/antigravity/scratch/morocco-telco-compare
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://gpoylrecftylldgslkdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwb3lscmVjZnR5bGxkZ3Nsa2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzEwNzksImV4cCI6MjA4NTEwNzA3OX0.AcMla0hXab5qV8XovA2RaRN6cqlyMhP8n_-5vkXtJVs
EOF
```
