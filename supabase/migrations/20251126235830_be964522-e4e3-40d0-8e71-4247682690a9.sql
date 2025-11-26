-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create support categories enum
CREATE TYPE public.support_category AS ENUM (
  'progresso',
  'diario',
  'plano_de_vida',
  'mao_na_massa',
  'ferramentas',
  'outros'
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category support_category NOT NULL,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create support messages table
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_admin_response BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (user_id = (SELECT id FROM auth.users WHERE email = current_user));

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role((SELECT id FROM auth.users WHERE email = current_user), 'admin'));

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets
  FOR SELECT
  USING (user_id = (SELECT id FROM auth.users WHERE email = current_user));

CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets
  FOR SELECT
  USING (public.has_role((SELECT id FROM auth.users WHERE email = current_user), 'admin'));

CREATE POLICY "Users can create their own tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM auth.users WHERE email = current_user));

CREATE POLICY "Users can update their own tickets"
  ON public.support_tickets
  FOR UPDATE
  USING (user_id = (SELECT id FROM auth.users WHERE email = current_user));

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages for their tickets"
  ON public.support_messages
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.support_tickets 
      WHERE user_id = (SELECT id FROM auth.users WHERE email = current_user)
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.support_messages
  FOR SELECT
  USING (public.has_role((SELECT id FROM auth.users WHERE email = current_user), 'admin'));

CREATE POLICY "Users can create messages for their tickets"
  ON public.support_messages
  FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM public.support_tickets 
      WHERE user_id = (SELECT id FROM auth.users WHERE email = current_user)
    )
  );

CREATE POLICY "Admins can create messages for any ticket"
  ON public.support_messages
  FOR INSERT
  WITH CHECK (public.has_role((SELECT id FROM auth.users WHERE email = current_user), 'admin'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();