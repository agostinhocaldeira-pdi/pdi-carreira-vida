-- FIX 1: Drop policies that allow public access and recreate with authenticated only
-- companies table - UPDATE policy incorrectly targets 'public' role
DROP POLICY IF EXISTS "Empresa users can update their own company" ON public.companies;
CREATE POLICY "Empresa users can update their own company" 
ON public.companies 
FOR UPDATE 
TO authenticated
USING (owner_user_id = auth.uid());

-- company_managers table - policies incorrectly target 'public' role
DROP POLICY IF EXISTS "Admins can manage all managers" ON public.company_managers;
CREATE POLICY "Admins can manage all managers" 
ON public.company_managers 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Company owners can manage their managers" ON public.company_managers;
CREATE POLICY "Company owners can manage their managers" 
ON public.company_managers 
FOR ALL 
TO authenticated
USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()))
WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS "Managers can view their own record" ON public.company_managers;
CREATE POLICY "Managers can view their own record" 
ON public.company_managers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- FIX 2: Fix company_employees manager_id policy - currently checking manager's user_id incorrectly
DROP POLICY IF EXISTS "Managers can view their assigned employees" ON public.company_employees;
CREATE POLICY "Managers can view their assigned employees" 
ON public.company_employees 
FOR SELECT 
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM company_managers WHERE user_id = auth.uid()
  )
);