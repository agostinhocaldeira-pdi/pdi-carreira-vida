// Dados mockados para teste - execute no console do navegador
export const createMockCompanyData = () => {
  const companyId = "mock-company-001";

  // Empresa
  const company = {
    id: companyId,
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
      name: "Ana Paula Gestora",
      email: "ana@techsolutions.com.br",
      phone: "(11) 99999-2222",
      provisionalPassword: "gestor123",
      password: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "manager-002", 
      name: "Roberto Gestor",
      email: "roberto@techsolutions.com.br",
      phone: "(11) 99999-3333",
      provisionalPassword: "gestor456",
      password: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    }
  ];

  // Funcionários
  const employees = [
    {
      id: "employee-001",
      name: "Maria Funcionária",
      email: "maria@techsolutions.com.br",
      phone: "(11) 99999-4444",
      provisionalPassword: "func123",
      password: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "employee-002",
      name: "João Funcionário",
      email: "joao@techsolutions.com.br",
      phone: "(11) 99999-5555",
      provisionalPassword: "func456",
      password: null,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    }
  ];

  // Salvar no localStorage
  localStorage.setItem("companies", JSON.stringify([company]));
  localStorage.setItem(`managers_${companyId}`, JSON.stringify(managers));
  localStorage.setItem(`employees_${companyId}`, JSON.stringify(employees));

  console.log("✅ Dados mockados criados com sucesso!");
  console.log("\n📋 CREDENCIAIS DE TESTE:\n");
  console.log("🏢 EMPRESA:");
  console.log("   Email: contato@techsolutions.com.br");
  console.log("   Senha: 123456\n");
  console.log("👔 GESTORES (primeiro acesso - trocar senha):");
  console.log("   Email: ana@techsolutions.com.br | Senha: gestor123");
  console.log("   Email: roberto@techsolutions.com.br | Senha: gestor456\n");
  console.log("👤 FUNCIONÁRIOS (primeiro acesso - trocar senha):");
  console.log("   Email: maria@techsolutions.com.br | Senha: func123");
  console.log("   Email: joao@techsolutions.com.br | Senha: func456");

  return { company, managers, employees };
};

// Auto-executar se chamado diretamente
if (typeof window !== "undefined") {
  (window as any).createMockCompanyData = createMockCompanyData;
}
