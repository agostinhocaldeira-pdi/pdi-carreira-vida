
-- Track when a user completes the Jornada (reaches final screen)
CREATE TABLE public.user_jornada_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One completion per user
CREATE UNIQUE INDEX idx_user_jornada_completions_user ON public.user_jornada_completions(user_id);

-- Enable RLS
ALTER TABLE public.user_jornada_completions ENABLE ROW LEVEL SECURITY;

-- Users can view their own completion
CREATE POLICY "Users can view own jornada completion"
ON public.user_jornada_completions FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own completion
CREATE POLICY "Users can insert own jornada completion"
ON public.user_jornada_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);
