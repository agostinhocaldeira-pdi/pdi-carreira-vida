-- Tabela unificada para rastrear compras e usos de IA
CREATE TABLE public.user_ai_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_type TEXT NOT NULL, -- 'insight', 'vvd', 'smart', 'autoavaliacao', etc.
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER NOT NULL DEFAULT 1000, -- centavos (R$ 10,00)
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'used', 'expired'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_ai_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own AI purchases"
ON public.user_ai_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own purchases (will be created by edge function)
CREATE POLICY "Users can insert their own AI purchases"
ON public.user_ai_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own purchases
CREATE POLICY "Users can update their own AI purchases"
ON public.user_ai_purchases
FOR UPDATE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_ai_purchases_user_feature ON public.user_ai_purchases(user_id, feature_type);
CREATE INDEX idx_user_ai_purchases_session ON public.user_ai_purchases(stripe_session_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_ai_purchases_updated_at
BEFORE UPDATE ON public.user_ai_purchases
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();