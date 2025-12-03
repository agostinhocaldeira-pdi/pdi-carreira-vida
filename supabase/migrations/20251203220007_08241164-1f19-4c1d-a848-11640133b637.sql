-- Adicionar política de INSERT para user_roles (apenas admins podem criar roles)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));