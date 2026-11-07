-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  full_bio TEXT,
  avatar_url TEXT,
  hero_video_url TEXT,
  hero_mode TEXT NOT NULL DEFAULT 'photo',
  cv_url TEXT,
  email TEXT NOT NULL,
  github_url TEXT,
  linkedin_url TEXT,
  google_scholar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  research_problem TEXT,
  methodology TEXT,
  github_url TEXT,
  demo_url TEXT,
  paper_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Publications Table
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  venue TEXT NOT NULL,
  year INT NOT NULL,
  doi TEXT,
  paper_url TEXT,
  pdf_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activities / Feed Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('research_update', 'milestone', 'publication', 'achievement', 'learning')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Research Interests Table
CREATE TABLE IF NOT EXISTS public.research_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('languages', 'ml_ai', 'frameworks', 'tools', 'database')),
  proficiency INT DEFAULT 80,
  order_index INT DEFAULT 0
);

-- ----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Anonymous / Public Read Access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public projects viewable if published" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Public publications viewable if published" ON public.publications FOR SELECT USING (published = true);
CREATE POLICY "Public activities viewable if published" ON public.activities FOR SELECT USING (published = true);
CREATE POLICY "Public research interests viewable by everyone" ON public.research_interests FOR SELECT USING (true);
CREATE POLICY "Public skills viewable by everyone" ON public.skills FOR SELECT USING (true);

-- Admin Mutation Policies (Authenticated users only)
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert publications" ON public.publications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update publications" ON public.publications FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE USING (auth.role() = 'authenticated');