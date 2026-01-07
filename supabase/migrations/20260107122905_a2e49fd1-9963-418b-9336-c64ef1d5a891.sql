-- Create satisfaction_surveys table
CREATE TABLE public.satisfaction_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT,
  section TEXT NOT NULL,
  survey_type TEXT NOT NULL CHECK (survey_type IN ('csat', 'ces', 'nps')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- Users can insert their own surveys
CREATE POLICY "Users can insert their own surveys"
ON public.satisfaction_surveys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own surveys
CREATE POLICY "Users can view their own surveys"
ON public.satisfaction_surveys
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all surveys
CREATE POLICY "Admins can view all surveys"
ON public.satisfaction_surveys
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_satisfaction_surveys_created_at ON public.satisfaction_surveys(created_at DESC);
CREATE INDEX idx_satisfaction_surveys_section ON public.satisfaction_surveys(section);
CREATE INDEX idx_satisfaction_surveys_type ON public.satisfaction_surveys(survey_type);