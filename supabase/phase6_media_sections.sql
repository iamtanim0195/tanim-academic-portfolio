-- 1. Create Public Storage Bucket for Portfolio Media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public media read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated admin media upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated admin media delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- 2. Media Assets Metadata Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  is_public BOOLEAN DEFAULT true,
  is_hero_bg BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Homepage Sections Configuration Table
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  is_enabled BOOLEAN DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Homepage Sections
INSERT INTO public.site_sections (section_key, title, subtitle, is_enabled, order_index)
VALUES
  ('hero', 'Hero Banner', 'Primary introduction and media', true, 1),
  ('about', 'About Preview', 'Short academic biography', true, 2),
  ('research', 'Research Interests', 'Core focus domains', true, 3),
  ('skills', 'Technical Skills', 'Languages, ML frameworks, and tools', true, 4),
  ('projects', 'Featured Projects', 'Selected research and engineering builds', true, 5),
  ('publications', 'Selected Publications', 'Peer-reviewed papers and preprints', true, 6),
  ('feed', 'Recent Activity Feed', 'Latest research updates and milestones', true, 7),
  ('contact', 'Contact Section', 'Academic inquiries and links', true, 8)
ON CONFLICT (section_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled media" ON public.media_assets FOR SELECT USING (is_public = true);
CREATE POLICY "Admins manage media" ON public.media_assets FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view site sections" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Admins manage site sections" ON public.site_sections FOR ALL USING (auth.role() = 'authenticated');