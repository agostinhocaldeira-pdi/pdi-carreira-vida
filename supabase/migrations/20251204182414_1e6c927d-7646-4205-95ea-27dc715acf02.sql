-- Fix companies table RLS policies
-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Employees can view their company" ON public.companies;
DROP POLICY IF EXISTS "Empresa users can view their own company" ON public.companies;
DROP POLICY IF EXISTS "Managers can view their company" ON public.companies;

-- Create comprehensive PERMISSIVE SELECT policies for companies
CREATE POLICY "Admins can view all companies"
ON public.companies
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can view their company"
ON public.companies
FOR SELECT
TO authenticated
USING (owner_user_id = auth.uid());

CREATE POLICY "Managers can view their company"
ON public.companies
FOR SELECT
TO authenticated
USING (id IN (
  SELECT company_id FROM public.company_managers WHERE user_id = auth.uid()
));

CREATE POLICY "Employees can view their company"
ON public.companies
FOR SELECT
TO authenticated
USING (id IN (
  SELECT company_id FROM public.company_employees WHERE user_id = auth.uid()
));

-- Fix company_employees table RLS policies
-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Admins can manage all employees" ON public.company_employees;
DROP POLICY IF EXISTS "Company owners can manage their employees" ON public.company_employees;
DROP POLICY IF EXISTS "Employees can view their own record" ON public.company_employees;
DROP POLICY IF EXISTS "Managers can view employees of their company" ON public.company_employees;
DROP POLICY IF EXISTS "Managers can view their assigned employees" ON public.company_employees;

-- Create comprehensive PERMISSIVE policies for company_employees
CREATE POLICY "Admins can manage all employees"
ON public.company_employees
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Company owners can manage their employees"
ON public.company_employees
FOR ALL
TO authenticated
USING (company_id IN (
  SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
))
WITH CHECK (company_id IN (
  SELECT id FROM public.companies WHERE owner_user_id = auth.uid()
));

CREATE POLICY "Employees can view their own record"
ON public.company_employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Managers can view their assigned employees"
ON public.company_employees
FOR SELECT
TO authenticated
USING (manager_id IN (
  SELECT user_id FROM public.company_managers WHERE user_id = auth.uid()
));

CREATE POLICY "Managers can view company employees"
ON public.company_employees
FOR SELECT
TO authenticated
USING (company_id IN (
  SELECT company_id FROM public.company_managers WHERE user_id = auth.uid()
));