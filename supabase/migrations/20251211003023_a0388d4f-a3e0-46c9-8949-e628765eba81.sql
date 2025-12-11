-- Additional helper functions to break all circular references

-- Function to get company_id for an employee
CREATE OR REPLACE FUNCTION public.get_employee_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.company_employees
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Function to check if user owns the company that has this employee
CREATE OR REPLACE FUNCTION public.user_owns_employee_company(_owner_user_id uuid, _company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.companies
    WHERE id = _company_id
      AND owner_user_id = _owner_user_id
  )
$$;

-- Fix companies policies
DROP POLICY IF EXISTS "Employees can view their company" ON public.companies;

CREATE POLICY "Employees can view their company" 
ON public.companies 
FOR SELECT 
USING (id = public.get_employee_company_id(auth.uid()));

-- Fix company_employees policies  
DROP POLICY IF EXISTS "Company owners can manage their employees" ON public.company_employees;

CREATE POLICY "Company owners can manage their employees" 
ON public.company_employees 
FOR ALL 
USING (public.user_owns_employee_company(auth.uid(), company_id))
WITH CHECK (public.user_owns_employee_company(auth.uid(), company_id));

-- Also fix the managers viewing employees policy
DROP POLICY IF EXISTS "Managers can view their assigned employees" ON public.company_employees;

CREATE POLICY "Managers can view their assigned employees" 
ON public.company_employees 
FOR SELECT 
USING (company_id = public.get_manager_company_id(auth.uid()));