DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='companies' AND cmd='INSERT' LOOP
    EXECUTE format('DROP POLICY %I ON public.companies', p.policyname);
  END LOOP;
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename IN ('audit_logs','email_logs') AND cmd='INSERT' LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, (SELECT tablename FROM pg_policies WHERE policyname=p.policyname AND schemaname='public' LIMIT 1));
  END LOOP;
END $$;

CREATE POLICY "Users can create companies they own"
ON public.companies FOR INSERT TO authenticated
WITH CHECK (owner_user_id = auth.uid());

REVOKE INSERT ON public.audit_logs FROM anon, authenticated;
REVOKE INSERT ON public.email_logs FROM anon, authenticated;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.email_logs TO service_role;

CREATE POLICY "Only service role can insert audit logs"
ON public.audit_logs FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Only service role can insert email logs"
ON public.email_logs FOR INSERT TO service_role WITH CHECK (true);