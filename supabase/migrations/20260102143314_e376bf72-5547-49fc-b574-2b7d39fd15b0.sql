-- Create table to track generated stoic reflection audio
CREATE TABLE public.stoic_reflection_audio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date_key TEXT NOT NULL UNIQUE, -- Format: "MM-DD" to match stoicReflections keys
  audio_url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stoic_reflection_audio ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public reflections)
CREATE POLICY "Anyone can view stoic reflection audio"
ON public.stoic_reflection_audio
FOR SELECT
USING (true);

-- Only authenticated users can insert (for generation)
CREATE POLICY "Authenticated users can insert audio"
ON public.stoic_reflection_audio
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('stoic-audio', 'stoic-audio', true);

-- Allow public read access to audio files
CREATE POLICY "Public read access for stoic audio"
ON storage.objects
FOR SELECT
USING (bucket_id = 'stoic-audio');

-- Allow authenticated users to upload audio
CREATE POLICY "Authenticated users can upload stoic audio"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'stoic-audio' AND auth.uid() IS NOT NULL);