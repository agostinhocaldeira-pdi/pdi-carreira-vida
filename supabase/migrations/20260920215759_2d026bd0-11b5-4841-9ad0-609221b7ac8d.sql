-- Revoke execute from anon on all security definer helpers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.export_user_data(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_company_employee(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_company_manager(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_company_owner(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_employee_company_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_manager_company_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_manager_employee_user_ids(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.user_owns_employee_company(uuid, uuid) FROM anon;

-- Trigger-only functions: not callable by clients at all
REVOKE EXECUTE ON FUNCTION public.ensure_single_principal_objective() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_cache_dirty() FROM anon, authenticated;