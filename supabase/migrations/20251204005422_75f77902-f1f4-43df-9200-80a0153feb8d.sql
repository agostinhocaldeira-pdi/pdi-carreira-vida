-- Remove plain text password storage from company_employees and company_managers
-- These columns stored provisional passwords insecurely

ALTER TABLE public.company_employees DROP COLUMN IF EXISTS provisional_password;
ALTER TABLE public.company_managers DROP COLUMN IF EXISTS provisional_password;

-- Add a column to track if password setup email was sent
ALTER TABLE public.company_employees ADD COLUMN IF NOT EXISTS password_setup_sent_at timestamp with time zone;
ALTER TABLE public.company_managers ADD COLUMN IF NOT EXISTS password_setup_sent_at timestamp with time zone;