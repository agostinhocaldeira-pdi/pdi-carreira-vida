-- Create function to update timestamps if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table to store user insight audio
CREATE TABLE public.user_insight_audio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_insight_audio ENABLE ROW LEVEL SECURITY;

-- Users can view their own audio
CREATE POLICY "Users can view their own insight audio" 
ON public.user_insight_audio 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own audio
CREATE POLICY "Users can insert their own insight audio" 
ON public.user_insight_audio 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own audio
CREATE POLICY "Users can update their own insight audio" 
ON public.user_insight_audio 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own insight audio
CREATE POLICY "Users can delete their own insight audio" 
ON public.user_insight_audio 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_insight_audio_updated_at
BEFORE UPDATE ON public.user_insight_audio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for insight audio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('insight-audio', 'insight-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for insight audio
CREATE POLICY "Users can view their own insight audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'insight-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own insight audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'insight-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own insight audio files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'insight-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own insight audio files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'insight-audio' AND auth.uid()::text = (storage.foldername(name))[1]);