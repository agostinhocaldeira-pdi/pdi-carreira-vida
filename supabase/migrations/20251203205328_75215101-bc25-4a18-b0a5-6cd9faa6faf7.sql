-- Criar tabela para vincular funcionários aos OKRs da empresa
CREATE TABLE public.company_okr_employee_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    okr_id UUID NOT NULL REFERENCES public.company_okrs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.company_employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(okr_id, employee_id)
);

-- Habilitar RLS
ALTER TABLE public.company_okr_employee_links ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Company owners can manage OKR employee links"
ON public.company_okr_employee_links
FOR ALL
USING (
    okr_id IN (
        SELECT co.id FROM company_okrs co
        JOIN companies c ON co.company_id = c.id
        WHERE c.owner_user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Employees can view their OKR links"
ON public.company_okr_employee_links
FOR SELECT
USING (
    employee_id IN (
        SELECT id FROM company_employees WHERE user_id = auth.uid()
    )
);