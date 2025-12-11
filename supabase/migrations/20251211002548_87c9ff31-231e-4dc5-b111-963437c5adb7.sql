-- Create helper functions to avoid infinite recursion in RLS policies

-- Function to check if user is a company owner
CREATE OR REPLACE FUNCTION public.is_company_owner(_user_id uuid, _company_id uuid)
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
      AND owner_user_id = _user_id
  )
$$;

-- Function to check if user is a manager of a company
CREATE OR REPLACE FUNCTION public.is_company_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_managers
    WHERE user_id = _user_id
  )
$$;

-- Function to get company_id for a manager
CREATE OR REPLACE FUNCTION public.get_manager_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id
  FROM public.company_managers
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Function to check if user is an employee
CREATE OR REPLACE FUNCTION public.is_company_employee(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.company_employees
    WHERE user_id = _user_id
  )
$$;

-- Function to get employee user_ids for a manager
CREATE OR REPLACE FUNCTION public.get_manager_employee_user_ids(_manager_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ce.user_id
  FROM public.company_employees ce
  JOIN public.company_managers cm ON ce.company_id = cm.company_id
  WHERE cm.user_id = _manager_user_id
    AND ce.user_id IS NOT NULL
$$;

-- Drop problematic policies on companies
DROP POLICY IF EXISTS "Managers can view their company" ON public.companies;

-- Recreate with security definer function
CREATE POLICY "Managers can view their company" 
ON public.companies 
FOR SELECT 
USING (id = public.get_manager_company_id(auth.uid()));

-- Drop problematic policies on company_managers  
DROP POLICY IF EXISTS "Company owners can manage their managers" ON public.company_managers;

-- Recreate without recursion
CREATE POLICY "Company owners can manage their managers" 
ON public.company_managers 
FOR ALL 
USING (public.is_company_owner(auth.uid(), company_id))
WITH CHECK (public.is_company_owner(auth.uid(), company_id));

-- Update user_objectives policies
DROP POLICY IF EXISTS "Managers can view employee objectives" ON public.user_objectives;

CREATE POLICY "Managers can view employee objectives" 
ON public.user_objectives 
FOR SELECT 
USING (user_id IN (SELECT public.get_manager_employee_user_ids(auth.uid())));

-- Update user_goals policies
DROP POLICY IF EXISTS "Managers can view employee goals" ON public.user_goals;

CREATE POLICY "Managers can view employee goals" 
ON public.user_goals 
FOR SELECT 
USING (user_id IN (SELECT public.get_manager_employee_user_ids(auth.uid())));

-- Update user_actions policies
DROP POLICY IF EXISTS "Managers can view employee actions" ON public.user_actions;

CREATE POLICY "Managers can view employee actions" 
ON public.user_actions 
FOR SELECT 
USING (user_id IN (SELECT public.get_manager_employee_user_ids(auth.uid())));