-- Security Hardening: Fix overly permissive RLS policies

-- Fix 1: company_employees table
-- Remove policy that allows managers to see ALL company employees
-- Keep only the policy that restricts to assigned employees (manager_id matches)
DROP POLICY IF EXISTS "Managers can view company employees" ON public.company_employees;

-- Fix 2: diary_entries table  
-- Remove company owner access to employee diary entries (privacy violation)
-- Diaries are personal data and should only be visible to the user themselves
DROP POLICY IF EXISTS "Company can view employee diary" ON public.diary_entries;

-- Fix 3: user_goals table
-- Also remove company owner access to employee goals for consistency
DROP POLICY IF EXISTS "Company can view employee goals" ON public.user_goals;