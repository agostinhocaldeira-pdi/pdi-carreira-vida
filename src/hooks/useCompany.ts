import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Company, 
  CompanyRepresentative, 
  CompanyManager, 
  CompanyEmployee,
  CompanyFormData,
  ManagerFormData,
  EmployeeFormData,
  generateProvisionalPassword
} from '@/types/company';
import { toast } from 'sonner';

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [representatives, setRepresentatives] = useState<CompanyRepresentative[]>([]);
  const [managers, setManagers] = useState<CompanyManager[]>([]);
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar empresa do usuário logado
  const fetchUserCompany = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return null;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCompany(data as Company);
        await fetchCompanyRelations(data.id);
      }
      
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar relacionamentos da empresa
  const fetchCompanyRelations = async (companyId: string) => {
    try {
      const [repsRes, managersRes, employeesRes] = await Promise.all([
        supabase.from('company_representatives').select('*').eq('company_id', companyId),
        supabase.from('company_managers').select('*').eq('company_id', companyId),
        supabase.from('company_employees').select('*').eq('company_id', companyId)
      ]);

      if (repsRes.data) setRepresentatives(repsRes.data as CompanyRepresentative[]);
      if (managersRes.data) setManagers(managersRes.data as CompanyManager[]);
      if (employeesRes.data) setEmployees(employeesRes.data as CompanyEmployee[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Criar empresa
  const createCompany = async (formData: CompanyFormData): Promise<Company | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('companies')
        .insert({
          ...formData,
          owner_user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setCompany(data as Company);
      toast.success('Empresa cadastrada com sucesso!');
      return data as Company;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao cadastrar empresa: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar empresa
  const updateCompany = async (id: string, formData: Partial<CompanyFormData>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchUserCompany();
      toast.success('Empresa atualizada com sucesso!');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar empresa: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar representante
  const addRepresentative = async (companyId: string, data: { name: string; email: string; phone?: string; is_primary?: boolean }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_representatives')
        .insert({ company_id: companyId, ...data });

      if (error) throw error;
      
      await fetchCompanyRelations(companyId);
      toast.success('Representante adicionado com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao adicionar representante: ' + err.message);
      return false;
    }
  };

  // Remover representante
  const removeRepresentative = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_representatives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRepresentatives(prev => prev.filter(r => r.id !== id));
      toast.success('Representante removido com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover representante: ' + err.message);
      return false;
    }
  };

  // Adicionar gestor (com senha provisória e role)
  const addManager = async (companyId: string, data: ManagerFormData): Promise<boolean> => {
    try {
      const provisionalPassword = generateProvisionalPassword();
      
      const { error } = await supabase
        .from('company_managers')
        .insert({ 
          company_id: companyId, 
          ...data,
          provisional_password: provisionalPassword
        });

      if (error) throw error;
      
      await fetchCompanyRelations(companyId);
      toast.success(`Gestor adicionado! Senha provisória: ${provisionalPassword}`);
      return true;
    } catch (err: any) {
      toast.error('Erro ao adicionar gestor: ' + err.message);
      return false;
    }
  };

  // Atualizar gestor
  const updateManager = async (id: string, data: Partial<ManagerFormData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_managers')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      if (company) await fetchCompanyRelations(company.id);
      toast.success('Gestor atualizado com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar gestor: ' + err.message);
      return false;
    }
  };

  // Remover gestor
  const removeManager = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_managers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setManagers(prev => prev.filter(m => m.id !== id));
      toast.success('Gestor removido com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover gestor: ' + err.message);
      return false;
    }
  };

  // Adicionar funcionário (com senha provisória)
  const addEmployee = async (companyId: string, data: EmployeeFormData): Promise<boolean> => {
    try {
      const provisionalPassword = generateProvisionalPassword();
      
      const { error } = await supabase
        .from('company_employees')
        .insert({ 
          company_id: companyId, 
          ...data,
          provisional_password: provisionalPassword,
          is_subscription_exempt: true
        });

      if (error) throw error;
      
      await fetchCompanyRelations(companyId);
      toast.success(`Funcionário adicionado! Senha provisória: ${provisionalPassword}`);
      return true;
    } catch (err: any) {
      toast.error('Erro ao adicionar funcionário: ' + err.message);
      return false;
    }
  };

  // Atualizar funcionário
  const updateEmployee = async (id: string, data: Partial<EmployeeFormData & { is_active: boolean }>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_employees')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      if (company) await fetchCompanyRelations(company.id);
      toast.success('Funcionário atualizado com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar funcionário: ' + err.message);
      return false;
    }
  };

  // Remover funcionário
  const removeEmployee = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company_employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast.success('Funcionário removido com sucesso!');
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover funcionário: ' + err.message);
      return false;
    }
  };

  return {
    company,
    representatives,
    managers,
    employees,
    loading,
    error,
    fetchUserCompany,
    createCompany,
    updateCompany,
    addRepresentative,
    removeRepresentative,
    addManager,
    updateManager,
    removeManager,
    addEmployee,
    updateEmployee,
    removeEmployee
  };
};

// Hook para gestores visualizarem funcionários
export const useManagerEmployees = () => {
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar empresa do gestor
      const { data: managerData } = await supabase
        .from('company_managers')
        .select('company_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (managerData?.company_id) {
        const { data } = await supabase
          .from('company_employees')
          .select('*')
          .eq('company_id', managerData.company_id)
          .eq('is_active', true);

        if (data) setEmployees(data as CompanyEmployee[]);
      }
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading, refetch: fetchEmployees };
};
