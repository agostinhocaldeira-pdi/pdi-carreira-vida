-- Create table to store daily completions for recurring tasks
CREATE TABLE public.agenda_daily_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES public.agenda_events(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint to prevent duplicate completions per event per day
  CONSTRAINT unique_event_daily_completion UNIQUE (event_id, completed_date)
);

-- Enable RLS
ALTER TABLE public.agenda_daily_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily completions" 
ON public.agenda_daily_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily completions" 
ON public.agenda_daily_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily completions" 
ON public.agenda_daily_completions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_agenda_daily_completions_event_date 
ON public.agenda_daily_completions (event_id, completed_date);

CREATE INDEX idx_agenda_daily_completions_user_date 
ON public.agenda_daily_completions (user_id, completed_date);