-- SQL Script to create the blogs table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  category text,
  author_name text,
  author_role text,
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to blogs" ON public.blogs
  FOR SELECT USING (true);

-- Allow service role or authenticated admins to insert/update/delete
CREATE POLICY "Allow admin to manage blogs" ON public.blogs
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
