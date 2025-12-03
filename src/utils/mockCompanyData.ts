// Dados mockados para teste - execute no console do navegador
export const createMockCompanyData = () => {
  const companyId = "mock-company-001";

  // Criar usuário admin principal
  const adminUser = {
    name: "Agostinho Caldeira",
    email: "agostinhocmcaldeira@gmail.com",
    phone: "(00) 00000-0000",
    password: "123456",
    role: "user",
  };
  localStorage.setItem("user", JSON.stringify(adminUser));

  // Criar lista de administradores
  const administrators = [
    {
      id: "1",
      name: "Agostinho Caldeira",
      email: "agostinhocmcaldeira@gmail.com",
      phone: "(00) 00000-0000",
      createdAt: new Date().toISOString(),
    }
  ];
  localStorage.setItem("administrators", JSON.stringify(administrators));

  // Empresa
  const company = {
    id: companyId,
    razao_social: "Tech Solutions Ltda",
    razaoSocial: "Tech Solutions Ltda",
    cnpj: "12345678000190",
    email: "contato@techsolutions.com.br",
    telefone: "(11) 99999-0000",
    password: "123456",
    role: "empresa",
    representatives: [
      { name: "Carlos Silva", email: "carlos@techsolutions.com.br", phone: "(11) 99999-1111", isPrimary: true }
    ],
    createdAt: new Date().toISOString(),
  };

  // Gestores
  const managers = [
    {
      id: "manager-001",
      company_id: companyId,
      name: "Ana Paula Gestora",
      email: "ana@techsolutions.com.br",
      phone: "(11) 99999-2222",
      provisionalPassword: "gestor123",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "manager-002",
      company_id: companyId,
      name: "Roberto Gestor",
      email: "roberto@techsolutions.com.br",
      phone: "(11) 99999-3333",
      provisionalPassword: "gestor456",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    }
  ];

  // Funcionários com associação a gestores
  const employees = [
    {
      id: "employee-001",
      company_id: companyId,
      manager_id: "manager-001", // Associado à Ana Paula
      name: "Maria Funcionária",
      email: "maria@techsolutions.com.br",
      phone: "(11) 99999-4444",
      provisionalPassword: "func123",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "employee-002",
      company_id: companyId,
      manager_id: "manager-001", // Associado à Ana Paula
      name: "João Funcionário",
      email: "joao@techsolutions.com.br",
      phone: "(11) 99999-5555",
      provisionalPassword: "func456",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "employee-003",
      company_id: companyId,
      manager_id: "manager-002", // Associado ao Roberto
      name: "Pedro Funcionário",
      email: "pedro@techsolutions.com.br",
      phone: "(11) 99999-6666",
      provisionalPassword: "func789",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "employee-004",
      company_id: companyId,
      manager_id: null, // Sem gestor associado
      name: "Carla Funcionária",
      email: "carla@techsolutions.com.br",
      phone: "(11) 99999-7777",
      provisionalPassword: "func000",
      password: null,
      acceptedAt: null,
      is_active: true,
      createdAt: new Date().toISOString(),
    }
  ];

  // Salvar no localStorage - formato antigo (para DashboardEmpresa)
  localStorage.setItem("companies", JSON.stringify([company]));
  localStorage.setItem(`managers_${companyId}`, JSON.stringify(managers));
  localStorage.setItem(`employees_${companyId}`, JSON.stringify(employees));

  // Salvar no localStorage - formato para GestaoPDIs
  localStorage.setItem("mockCompanies", JSON.stringify([company]));
  localStorage.setItem("mockManagers", JSON.stringify(managers));
  localStorage.setItem("mockEmployees", JSON.stringify(employees));

  console.log("✅ Dados mockados criados com sucesso!");
  console.log("\n📋 CREDENCIAIS DE TESTE:\n");
  console.log("👑 ADMINISTRADOR:");
  console.log("   Email: agostinhocmcaldeira@gmail.com");
  console.log("   Senha: 123456\n");
  console.log("🏢 EMPRESA:");
  console.log("   Email: contato@techsolutions.com.br");
  console.log("   Senha: 123456\n");
  console.log("👔 GESTORES (primeiro acesso - trocar senha):");
  console.log("   Email: ana@techsolutions.com.br | Senha: gestor123");
  console.log("   Email: roberto@techsolutions.com.br | Senha: gestor456\n");
  console.log("👤 FUNCIONÁRIOS (primeiro acesso - trocar senha):");
  console.log("   Email: maria@techsolutions.com.br | Senha: func123 (Gestora: Ana Paula)");
  console.log("   Email: joao@techsolutions.com.br | Senha: func456 (Gestora: Ana Paula)");
  console.log("   Email: pedro@techsolutions.com.br | Senha: func789 (Gestor: Roberto)");
  console.log("   Email: carla@techsolutions.com.br | Senha: func000 (Sem gestor)");

  return { company, managers, employees, adminUser };
};

// Auto-executar se chamado diretamente
if (typeof window !== "undefined") {
  (window as any).createMockCompanyData = createMockCompanyData;
}
