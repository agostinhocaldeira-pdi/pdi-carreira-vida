// Tipos para o módulo de Empresas

export interface Company {
  id: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone?: string;
  owner_user_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyRepresentative {
  id: string;
  company_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyManager {
  id: string;
  company_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  provisional_password?: string;
  is_active: boolean;
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyEmployee {
  id: string;
  company_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  provisional_password?: string;
  is_active: boolean;
  is_subscription_exempt: boolean;
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para formulários de cadastro
export interface CompanyFormData {
  razao_social: string;
  cnpj: string;
  email: string;
  telefone?: string;
}

export interface ManagerFormData {
  name: string;
  email: string;
  phone?: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone?: string;
}

// Tipo para empresa completa com relacionamentos
export interface CompanyWithRelations extends Company {
  representatives: CompanyRepresentative[];
  managers: CompanyManager[];
  employees: CompanyEmployee[];
}

// Helpers para validação de CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, '');
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação dos dígitos verificadores
  let size = numbers.length - 2;
  let digits = numbers.substring(0, size);
  const verifiers = numbers.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(digits.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(verifiers.charAt(0))) return false;
  
  size = size + 1;
  digits = numbers.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(digits.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(verifiers.charAt(1));
};

// Gerar senha provisória
export const generateProvisionalPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
