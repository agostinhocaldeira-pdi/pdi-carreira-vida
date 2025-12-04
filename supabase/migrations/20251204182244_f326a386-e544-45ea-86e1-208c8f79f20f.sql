-- Drop existing SELECT policy for users
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create more restrictive SELECT policy
-- Users can ONLY see their own role record
CREATE POLICY "Users can view only their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: Admins already have full access via "Admins can manage all roles" policy
-- This ensures non-admin users cannot enumerate other users' roles