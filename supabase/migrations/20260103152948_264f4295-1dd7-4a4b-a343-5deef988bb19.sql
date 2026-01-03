-- Add column to track if the "Plano de Vida complete" congratulation email was sent
ALTER TABLE public.user_insights 
ADD COLUMN IF NOT EXISTS plano_vida_email_sent BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.user_insights.plano_vida_email_sent IS 'Tracks if the congratulation email for completing Plano de Vida was sent';