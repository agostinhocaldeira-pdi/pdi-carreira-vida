-- Create table for admin project notes
CREATE TABLE public.admin_project_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_project_notes ENABLE ROW LEVEL SECURITY;

-- Create unique constraint on user_id (one note per admin)
ALTER TABLE public.admin_project_notes ADD CONSTRAINT admin_project_notes_user_id_unique UNIQUE (user_id);

-- RLS policies - only admins can manage their notes
CREATE POLICY "Admins can view their own notes"
ON public.admin_project_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert their own notes"
ON public.admin_project_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update their own notes"
ON public.admin_project_notes
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_admin_project_notes_updated_at
BEFORE UPDATE ON public.admin_project_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();