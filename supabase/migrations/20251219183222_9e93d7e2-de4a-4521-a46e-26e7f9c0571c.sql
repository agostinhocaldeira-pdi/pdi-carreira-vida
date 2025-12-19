-- Create table for user stoic reflections responses
CREATE TABLE public.user_stoic_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reflection_date DATE NOT NULL,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reflection_date)
);

-- Enable Row Level Security
ALTER TABLE public.user_stoic_reflections ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own reflections
CREATE POLICY "Users can manage their own stoic reflections" 
ON public.user_stoic_reflections 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to view all reflections
CREATE POLICY "Admins can view all stoic reflections" 
ON public.user_stoic_reflections 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates using existing function
CREATE TRIGGER update_user_stoic_reflections_updated_at
BEFORE UPDATE ON public.user_stoic_reflections
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();