-- Tabela para rastrear uso da IA SMART por usuário
CREATE TABLE public.user_smart_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  free_usage_consumed BOOLEAN NOT NULL DEFAULT false,
  total_paid_usages INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_smart_ai_usage ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own SMART AI usage"
ON public.user_smart_ai_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SMART AI usage"
ON public.user_smart_ai_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMART AI usage"
ON public.user_smart_ai_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_user_smart_ai_usage_updated_at
  BEFORE UPDATE ON public.user_smart_ai_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();