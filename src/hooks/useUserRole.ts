/**
 * Centralized hook for user role management with caching
 * Eliminates redundant RPC calls across components
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/roles';

// Query key for role caching
export const USER_ROLE_KEY = ['user-role'] as const;

interface UserRoleData {
  userId: string | null;
  role: AppRole | null;
  isAdmin: boolean;
  isGestor: boolean;
  isEmployee: boolean;
  companyId: string | null;
}

// Cache duration: 10 minutes (roles rarely change)
const ROLE_CACHE_TIME = 1000 * 60 * 10;

/**
 * Fetch user role data from Supabase
 * Batches multiple role-related queries into a single fetch
 */
async function fetchUserRoleData(): Promise<UserRoleData> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.id) {
    return {
      userId: null,
      role: null,
      isAdmin: false,
      isGestor: false,
      isEmployee: false,
      companyId: null,
    };
  }

  const userId = session.user.id;

  // Batch all role-related queries in parallel
  const [roleResult, isAdminResult, employeeResult] = await Promise.all([
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single(),
    supabase.rpc('has_role', { _user_id: userId, _role: 'admin' }),
    supabase
      .from('company_employees')
      .select('company_id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle(),
  ]);

  const role = (roleResult.data?.role as AppRole) || 'user';
  const isAdmin = !!isAdminResult.data;
  const isGestor = role === 'gestor';
  const isEmployee = !!employeeResult.data;
  const companyId = employeeResult.data?.company_id || null;

  return {
    userId,
    role,
    isAdmin,
    isGestor,
    isEmployee,
    companyId,
  };
}

/**
 * Hook to get cached user role data
 * - Loads instantly from cache if available
 * - Fetches from Supabase in background
 * - Never blocks component rendering
 */
export function useUserRole() {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: USER_ROLE_KEY,
    queryFn: fetchUserRoleData,
    staleTime: ROLE_CACHE_TIME,
    gcTime: ROLE_CACHE_TIME * 2,
    // Don't refetch on window focus - roles don't change often
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Return immediately even if loading
    placeholderData: {
      userId: null,
      role: null,
      isAdmin: false,
      isGestor: false,
      isEmployee: false,
      companyId: null,
    },
  });

  return {
    userId: data?.userId ?? null,
    role: data?.role ?? null,
    isAdmin: data?.isAdmin ?? false,
    isGestor: data?.isGestor ?? false,
    isEmployee: data?.isEmployee ?? false,
    companyId: data?.companyId ?? null,
    isLoading,
    isFetched,
  };
}
