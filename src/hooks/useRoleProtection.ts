import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, USER_ROLE_KEY } from "./useUserRole";
import type { AppRole } from "@/types/roles";

type AllowedRole = AppRole;

interface UseRoleProtectionOptions {
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
}

interface UseRoleProtectionReturn {
  isLoading: boolean;
  userRole: AllowedRole | null;
  isAdmin: boolean;
  isGestor: boolean;
  isEmployee: boolean;
}

/**
 * Optimized role protection hook
 * - Uses cached role data from useUserRole (React Query)
 * - No blocking RPC calls during render
 * - Instant loading from cache
 */
export const useRoleProtection = (options: UseRoleProtectionOptions = {}): UseRoleProtectionReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { allowedRoles = ["user", "gestor", "admin"], redirectTo } = options;
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Get cached role data (non-blocking)
  const { role, isAdmin, isGestor, isEmployee, isFetched, isLoading: roleLoading } = useUserRole();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/login");
        return;
      }
      
      setHasCheckedAuth(true);
    };

    checkAuth();

    // Listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        // Clear role cache on logout
        queryClient.removeQueries({ queryKey: USER_ROLE_KEY });
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, queryClient]);

  // Handle role-based redirects after role is fetched
  useEffect(() => {
    if (!hasCheckedAuth || !isFetched || !role) return;

    // Admin has full access
    if (isAdmin) return;

    // Check if user's role is allowed
    if (!allowedRoles.includes(role)) {
      const destination = redirectTo || getDefaultRedirect(role);
      navigate(destination);
    }
  }, [hasCheckedAuth, isFetched, role, isAdmin, allowedRoles, redirectTo, navigate]);

  // Consider loading complete when:
  // 1. Auth has been checked AND
  // 2. Role data has been fetched (or we're still loading but have placeholder data)
  const isLoading = !hasCheckedAuth || (roleLoading && !isFetched);

  return { 
    isLoading, 
    userRole: role, 
    isAdmin,
    isGestor,
    isEmployee,
  };
};

function getDefaultRedirect(role: AllowedRole): string {
  switch (role) {
    case "empresa":
      return "/dashboard-empresa";
    case "gestor":
      return "/home";
    default:
      return "/home";
  }
}

export default useRoleProtection;
