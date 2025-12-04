-- Add RLS policies for employees and managers to view their company

-- Policy for employees to view their company
CREATE POLICY "Employees can view their company"
ON public.companies
FOR SELECT
USING (
  id IN (
    SELECT company_id FROM public.company_employees WHERE user_id = auth.uid()
  )
);

-- Policy for managers to view their company
CREATE POLICY "Managers can view their company"
ON public.companies
FOR SELECT
USING (
  id IN (
    SELECT company_id FROM public.company_managers WHERE user_id = auth.uid()
  )
);