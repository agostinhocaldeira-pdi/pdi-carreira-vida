// Definição dos perfis de usuário da aplicação
// Os perfis estão sincronizados com o enum app_role no banco de dados

export type AppRole = 'user' | 'admin' | 'gestor' | 'empresa';

export interface RoleConfig {
  id: AppRole;
  label: string;
  description: string;
  permissions: string[];
}

export const ROLES: Record<AppRole, RoleConfig> = {
  user: {
    id: 'user',
    label: 'Usuário',
    description: 'Usuário padrão da aplicação com acesso às ferramentas de desenvolvimento pessoal',
    permissions: [
      'view_own_profile',
      'edit_own_profile',
      'use_tools',
      'create_objectives',
      'create_goals',
      'create_actions',
      'use_diary',
    ],
  },
  admin: {
    id: 'admin',
    label: 'Administrador',
    description: 'Administrador do sistema com acesso total à plataforma',
    permissions: [
      'view_all_users',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'view_satisfaction_surveys',
      'unlimited_ai_access',
      'unlimited_insights',
    ],
  },
  gestor: {
    id: 'gestor',
    label: 'Gestor',
    description: 'Representante da empresa com acesso às informações dos funcionários vinculados',
    permissions: [
      'view_company_employees',
      'view_employee_progress',
      'view_company_analytics',
      'manage_employee_access',
    ],
  },
  empresa: {
    id: 'empresa',
    label: 'Empresa',
    description: 'Perfil corporativo que pode assinar a aplicação para seus funcionários',
    permissions: [
      'manage_subscription',
      'add_employees',
      'remove_employees',
      'assign_gestores',
      'view_company_reports',
      'billing_access',
    ],
  },
};

// Helper para verificar se um role tem uma permissão específica
export const hasPermission = (role: AppRole, permission: string): boolean => {
  return ROLES[role]?.permissions.includes(permission) ?? false;
};

// Helper para obter o label do role
export const getRoleLabel = (role: AppRole): string => {
  return ROLES[role]?.label ?? role;
};

// Lista de todos os roles para uso em selects/dropdowns
export const ROLE_OPTIONS = Object.values(ROLES).map(role => ({
  value: role.id,
  label: role.label,
  description: role.description,
}));
