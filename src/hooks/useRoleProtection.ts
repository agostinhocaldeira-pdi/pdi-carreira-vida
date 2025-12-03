import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
}

export const useRoleProtection = (options: UseRoleProtectionOptions = {}): UseRoleProtectionReturn => {
  const navigate = useNavigate();
  const { allowedRoles = ["user", "gestor", "admin"], redirectTo } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<AllowedRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/login");
          return;
        }

        // Buscar role do usuário na tabela user_roles
        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (error || !roleData) {
          console.error("Erro ao buscar role:", error);
          navigate("/login");
          return;
        }

        const role = roleData.role as AllowedRole;
        setUserRole(role);

        // Verificar se é admin usando a função do banco
        const { data: isAdminResult } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin"
        });

        setIsAdmin(!!isAdminResult);

        // Admin tem acesso total
        if (isAdminResult) {
          setIsLoading(false);
          return;
        }

        // Verificar se o role do usuário é permitido
        if (!allowedRoles.includes(role)) {
          const destination = redirectTo || getDefaultRedirect(role);
          navigate(destination);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro na verificação de role:", error);
        navigate("/login");
      }
    };

    checkRole();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, allowedRoles, redirectTo]);

  return { isLoading, userRole, isAdmin };
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
