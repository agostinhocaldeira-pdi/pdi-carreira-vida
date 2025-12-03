
-- Adicionar coluna manager_id para vincular funcionário ao gestor
ALTER TABLE public.company_employees 
ADD COLUMN manager_id uuid REFERENCES auth.users(id);

-- Criar índice para melhor performance
CREATE INDEX idx_company_employees_manager_id ON public.company_employees(manager_id);

-- Atualizar RLS para permitir que gestores vejam seus funcionários
CREATE POLICY "Managers can view their assigned employees"
ON public.company_employees
FOR SELECT
USING (manager_id = auth.uid());
