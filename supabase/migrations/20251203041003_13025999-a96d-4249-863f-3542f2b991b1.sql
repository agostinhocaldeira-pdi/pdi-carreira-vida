-- Tabela principal de empresas
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razao_social TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Representantes da empresa (pode haver mais de um)
CREATE TABLE public.company_representatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Gestores da empresa (perfil gestor)
CREATE TABLE public.company_managers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  provisional_password TEXT,
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Funcionários da empresa (usuários vinculados)
CREATE TABLE public.company_employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  provisional_password TEXT,
  is_active BOOLEAN DEFAULT true,
  is_subscription_exempt BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_employees ENABLE ROW LEVEL SECURITY;

-- Triggers para updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_company_representatives_updated_at
  BEFORE UPDATE ON public.company_representatives
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_company_managers_updated_at
  BEFORE UPDATE ON public.company_managers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_company_employees_updated_at
  BEFORE UPDATE ON public.company_employees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies para companies
CREATE POLICY "Admins can view all companies"
  ON public.companies FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Empresa users can view their own company"
  ON public.companies FOR SELECT
  USING (owner_user_id = auth.uid());

CREATE POLICY "Empresa users can update their own company"
  ON public.companies FOR UPDATE
  USING (owner_user_id = auth.uid());

CREATE POLICY "Authenticated users can create companies"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies para company_representatives
CREATE POLICY "Admins can manage all representatives"
  ON public.company_representatives FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can manage their representatives"
  ON public.company_representatives FOR ALL
  USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Representatives can view their own record"
  ON public.company_representatives FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies para company_managers
CREATE POLICY "Admins can manage all managers"
  ON public.company_managers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can manage their managers"
  ON public.company_managers FOR ALL
  USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view their own record"
  ON public.company_managers FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies para company_employees
CREATE POLICY "Admins can manage all employees"
  ON public.company_employees FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can manage their employees"
  ON public.company_employees FOR ALL
  USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view employees of their company"
  ON public.company_employees FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.company_managers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Employees can view their own record"
  ON public.company_employees FOR SELECT
  USING (user_id = auth.uid());

-- Índices para performance
CREATE INDEX idx_companies_owner ON public.companies(owner_user_id);
CREATE INDEX idx_company_representatives_company ON public.company_representatives(company_id);
CREATE INDEX idx_company_managers_company ON public.company_managers(company_id);
CREATE INDEX idx_company_managers_user ON public.company_managers(user_id);
CREATE INDEX idx_company_employees_company ON public.company_employees(company_id);
CREATE INDEX idx_company_employees_user ON public.company_employees(user_id);