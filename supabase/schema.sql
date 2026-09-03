-- Vidora Database Schema
-- Run this in your Supabase SQL Editor
-- Designed so authentication can be added later without major changes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Downloads / Jobs table (public for now, user_id nullable for future auth)
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- nullable for anonymous use
  youtube_url TEXT NOT NULL,
  video_id TEXT,
  title TEXT,
  thumbnail_url TEXT,
  format_type TEXT NOT NULL CHECK (format_type IN ('video', 'audio')),
  quality TEXT,
  file_format TEXT, -- mp4, mp3, webm, etc.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  file_size BIGINT,
  download_url TEXT, -- temporary signed URL or path
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_status ON public.downloads(status);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_video_id ON public.downloads(video_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_downloads_updated_at ON public.downloads;
CREATE TRIGGER update_downloads_updated_at
  BEFORE UPDATE ON public.downloads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (open for now since no auth; tighten when auth is added)
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and reads for now (public downloader)
CREATE POLICY "Allow public insert on downloads"
  ON public.downloads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public select on downloads"
  ON public.downloads
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public update on downloads"
  ON public.downloads
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Future: when auth is added, replace above with user-scoped policies e.g.
-- USING (auth.uid() = user_id OR user_id IS NULL)

-- Optional: rate limiting table or use Supabase edge functions later
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON public.rate_limits(ip_hash);

-- Cleanup function for expired downloads (can be scheduled via pg_cron or external)
CREATE OR REPLACE FUNCTION cleanup_expired_downloads()
RETURNS void AS $$
BEGIN
  DELETE FROM public.downloads
  WHERE expires_at < NOW() AND status = 'completed';
END;
$$ LANGUAGE plpgsql;
