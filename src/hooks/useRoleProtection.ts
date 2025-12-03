import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AllowedRole = "user" | "gestor" | "empresa" | "admin";

interface UseRoleProtectionOptions {
  allowedRoles?: AllowedRole[];
  redirectTo?: string;
}

export const useRoleProtection = (options: UseRoleProtectionOptions = {}) => {
  const navigate = useNavigate();
  const { allowedRoles = ["user", "gestor", "admin"], redirectTo } = options;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userData = JSON.parse(user);
    const userRole = userData.role as AllowedRole;

    // Verificar se é admin (admins têm acesso total)
    const administrators = JSON.parse(localStorage.getItem("administrators") || "[]");
    const isAdmin = administrators.some(
      (admin: { email: string }) => admin.email?.toLowerCase() === userData.email?.toLowerCase()
    );

    if (isAdmin) return; // Admin tem acesso a tudo

    // Verificar se o role do usuário é permitido
    if (!allowedRoles.includes(userRole)) {
      const destination = redirectTo || getDefaultRedirect(userRole);
      navigate(destination);
    }
  }, [navigate, allowedRoles, redirectTo]);
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
