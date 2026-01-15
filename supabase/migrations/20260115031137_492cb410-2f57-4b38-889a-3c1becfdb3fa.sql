-- Create agenda_events table for the new calendar/agenda feature
CREATE TABLE public.agenda_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL DEFAULT '06:00:00',
  source_type TEXT NOT NULL DEFAULT 'manual',
  source_id UUID,
  source_quadrant TEXT,
  label TEXT,
  label_color TEXT DEFAULT 'green',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_type TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comment to explain source_type values
COMMENT ON COLUMN public.agenda_events.source_type IS 'Values: manual, action, step, eisenhower, goal, objective';
COMMENT ON COLUMN public.agenda_events.source_quadrant IS 'For Eisenhower: do, schedule, delegate, eliminate';
COMMENT ON COLUMN public.agenda_events.recurrence_type IS 'Values: daily, weekly, null';
COMMENT ON COLUMN public.agenda_events.label_color IS 'Values: green, yellow, orange, red, blue, purple, gray';

-- Enable Row Level Security
ALTER TABLE public.agenda_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own agenda events" 
ON public.agenda_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agenda events" 
ON public.agenda_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agenda events" 
ON public.agenda_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agenda events" 
ON public.agenda_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agenda_events_updated_at
BEFORE UPDATE ON public.agenda_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries by user and date
CREATE INDEX idx_agenda_events_user_date ON public.agenda_events (user_id, scheduled_date);
CREATE INDEX idx_agenda_events_source ON public.agenda_events (user_id, source_type, source_id);