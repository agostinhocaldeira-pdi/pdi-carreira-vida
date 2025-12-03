-- Tabela para endereços dos usuários
CREATE TABLE public.user_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  cep TEXT NOT NULL,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para dados do onboarding (fase atual e expectativas)
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_phase TEXT,
  expectations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para pesquisa de perfil/comportamento
CREATE TABLE public.user_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  wake_up_time TEXT,
  sleep_time TEXT,
  exercise_frequency TEXT,
  reading_habit TEXT,
  main_goal TEXT,
  biggest_challenge TEXT,
  learning_style TEXT,
  motivation_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_surveys ENABLE ROW LEVEL SECURITY;

-- Políticas para user_addresses
CREATE POLICY "Users can view their own address"
ON public.user_addresses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own address"
ON public.user_addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own address"
ON public.user_addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
ON public.user_addresses FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para user_onboarding
CREATE POLICY "Users can view their own onboarding"
ON public.user_onboarding FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding"
ON public.user_onboarding FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding"
ON public.user_onboarding FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding data"
ON public.user_onboarding FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para user_surveys
CREATE POLICY "Users can view their own survey"
ON public.user_surveys FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey"
ON public.user_surveys FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey"
ON public.user_surveys FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all surveys"
ON public.user_surveys FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON public.user_onboarding
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_surveys_updated_at
BEFORE UPDATE ON public.user_surveys
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();