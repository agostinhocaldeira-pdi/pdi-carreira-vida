-- 1. OKR key results: tenant isolation
DROP POLICY IF EXISTS "View key results through OKR access" ON public.okr_key_results;
CREATE POLICY "View key results through OKR access"
ON public.okr_key_results
FOR SELECT
TO authenticated
USING (
  okr_id IN (
    SELECT o.id FROM public.company_okrs o
    WHERE public.is_company_owner(auth.uid(), o.company_id)
       OR o.company_id = public.get_manager_company_id(auth.uid())
       OR o.company_id = public.get_employee_company_id(auth.uid())
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Support tickets / messages: use auth.uid()
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can create their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;

CREATE POLICY "Users can view their own tickets" ON public.support_tickets
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tickets" ON public.support_tickets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON public.support_tickets
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON public.support_tickets
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view messages for their tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Users can create messages for their tickets" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can create messages for any ticket" ON public.support_messages;

CREATE POLICY "Users can view messages for their tickets" ON public.support_messages
FOR SELECT TO authenticated USING (
  ticket_id IN (SELECT t.id FROM public.support_tickets t WHERE t.user_id = auth.uid())
);
CREATE POLICY "Users can create messages for their tickets" ON public.support_messages
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id
  AND ticket_id IN (SELECT t.id FROM public.support_tickets t WHERE t.user_id = auth.uid())
);
CREATE POLICY "Admins can view all messages" ON public.support_messages
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can create messages for any ticket" ON public.support_messages
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Profiles: restrict visibility
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner, admins and responsible managers"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR id IN (SELECT public.get_manager_employee_user_ids(auth.uid()))
  OR EXISTS (
    SELECT 1 FROM public.company_employees ce
    WHERE ce.user_id = public.profiles.id
      AND public.is_company_owner(auth.uid(), ce.company_id)
  )
);