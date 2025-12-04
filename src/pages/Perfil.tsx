import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, User, Building2, Eye, EyeOff, Save, Crown, Sparkles, Star, Database, Check, Loader2 } from "lucide-react";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { ExportPDFButton } from "@/components/reports/ExportPDFButton";
import { LGPDDataSection } from "@/components/lgpd/LGPDDataSection";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

const generateMockData = (userName: string) => {
  // Onboarding
  localStorage.setItem("onboarding_data", JSON.stringify({
    currentPhase: "Transição de Carreira",
    expectations: "Busco clareza sobre meus próximos passos profissionais, desenvolver habilidades de liderança e encontrar equilíbrio entre vida pessoal e profissional. Quero me tornar uma profissional mais completa e realizada."
  }));

  // VVD
  localStorage.setItem("visao_vida_desejada", "Em 5 anos, me vejo como uma líder reconhecida em minha área, trabalhando com propósito e impacto positivo na sociedade. Terei equilíbrio entre trabalho e família, saúde física e mental em dia, e liberdade financeira para realizar meus sonhos. Serei uma pessoa mais presente, consciente e grata por cada conquista.");

  // Valores
  localStorage.setItem("meus_valores", JSON.stringify([
    "Integridade", "Família", "Crescimento", "Liberdade", "Empatia", "Excelência",
    "Autenticidade", "Equilíbrio", "Gratidão", "Resiliência", "Colaboração", "Inovação"
  ]));

  // Áreas da Vida
  localStorage.setItem("areas_vida", JSON.stringify([
    { area: "Saúde Física", nota_atual: 6, nota_desejada: 9 },
    { area: "Saúde Mental", nota_atual: 7, nota_desejada: 9 },
    { area: "Carreira", nota_atual: 5, nota_desejada: 9 },
    { area: "Finanças", nota_atual: 6, nota_desejada: 8 },
    { area: "Relacionamentos", nota_atual: 8, nota_desejada: 9 },
    { area: "Família", nota_atual: 7, nota_desejada: 9 },
    { area: "Lazer", nota_atual: 4, nota_desejada: 8 },
    { area: "Espiritualidade", nota_atual: 5, nota_desejada: 8 },
    { area: "Desenvolvimento Pessoal", nota_atual: 6, nota_desejada: 9 },
    { area: "Contribuição Social", nota_atual: 4, nota_desejada: 7 }
  ]));

  // Objetivos - Salvar em "objetivos" que é a chave usada pelo PlanoDeVida
  const objetivos = [
    {
      id: 1001,
      texto: "Assumir uma posição de liderança na empresa",
      dataAlvo: "2025-06-30",
      conexaoVvd: "Ser reconhecida como líder na minha área",
      status: "em-andamento"
    },
    {
      id: 1002,
      texto: "Conquistar independência financeira",
      dataAlvo: "2026-12-31",
      conexaoVvd: "Ter liberdade financeira para realizar sonhos",
      status: "em-andamento"
    },
    {
      id: 1003,
      texto: "Melhorar qualidade de vida e saúde",
      dataAlvo: "2025-12-31",
      conexaoVvd: "Saúde física e mental em dia",
      status: "a-fazer"
    }
  ];
  localStorage.setItem("objetivos", JSON.stringify(objetivos));
  // Também salvar em meus_objetivos para compatibilidade
  localStorage.setItem("meus_objetivos", JSON.stringify(objetivos.map(obj => ({
    ...obj,
    id: `obj_${obj.id}`,
    objetivo: obj.texto,
    data_alvo: obj.dataAlvo,
    conexao_vvd: obj.conexaoVvd
  }))));

  // Metas com ações e passos
  const metas = [
    {
      id: "meta_1",
      texto: "Concluir curso de Gestão de Pessoas",
      meta: "Concluir curso de Gestão de Pessoas",
      objetivo_id: "obj_1",
      concluida: false,
      status: "em_andamento",
      data_alvo: "2025-03-31",
      acoes: [
        {
          id: "acao_1",
          texto: "Assistir 2 aulas por semana",
          acao: "Assistir 2 aulas por semana",
          status: "em_andamento",
          periodicidade: "Semanal",
          passos: [
            { texto: "Reservar horário na agenda", concluido: true },
            { texto: "Fazer anotações das aulas", concluido: true },
            { texto: "Revisar conteúdo no fim de semana", concluido: false }
          ]
        },
        {
          id: "acao_2",
          texto: "Realizar exercícios práticos",
          acao: "Realizar exercícios práticos",
          status: "a_fazer",
          periodicidade: "Semanal",
          passos: []
        }
      ]
    },
    {
      id: "meta_2",
      texto: "Desenvolver habilidades de comunicação",
      meta: "Desenvolver habilidades de comunicação",
      objetivo_id: "obj_1",
      concluida: true,
      status: "concluido",
      data_alvo: "2024-12-15",
      acoes: [
        {
          id: "acao_3",
          texto: "Participar de 1 workshop por mês",
          acao: "Participar de 1 workshop por mês",
          status: "concluido",
          periodicidade: "Mensal",
          passos: []
        }
      ]
    },
    {
      id: "meta_3",
      texto: "Poupar 20% do salário mensalmente",
      meta: "Poupar 20% do salário mensalmente",
      objetivo_id: "obj_2",
      concluida: false,
      status: "em_andamento",
      data_alvo: "2025-12-31",
      acoes: [
        {
          id: "acao_4",
          texto: "Revisar gastos semanalmente",
          acao: "Revisar gastos semanalmente",
          status: "em_andamento",
          periodicidade: "Semanal",
          passos: [
            { texto: "Anotar todos os gastos", concluido: true },
            { texto: "Categorizar despesas", concluido: true },
            { texto: "Identificar gastos desnecessários", concluido: false }
          ]
        },
        {
          id: "acao_5",
          texto: "Transferir poupança no dia do pagamento",
          acao: "Transferir poupança no dia do pagamento",
          status: "concluido",
          periodicidade: "Mensal",
          passos: []
        }
      ]
    },
    {
      id: "meta_4",
      texto: "Praticar exercícios 4x por semana",
      meta: "Praticar exercícios 4x por semana",
      objetivo_id: "obj_3",
      concluida: false,
      status: "em_andamento",
      data_alvo: "2025-06-30",
      acoes: [
        {
          id: "acao_6",
          texto: "Academia segunda, quarta e sexta",
          acao: "Academia segunda, quarta e sexta",
          status: "em_andamento",
          periodicidade: "Semanal",
          passos: []
        },
        {
          id: "acao_7",
          texto: "Caminhada aos sábados",
          acao: "Caminhada aos sábados",
          status: "em_andamento",
          periodicidade: "Semanal",
          passos: []
        }
      ]
    }
  ];
  localStorage.setItem("metas", JSON.stringify(metas));

  // Competências
  localStorage.setItem("competencias", JSON.stringify([
    "Liderança situacional",
    "Comunicação assertiva",
    "Gestão de conflitos",
    "Inteligência emocional",
    "Planejamento estratégico"
  ]));

  // Pontos Fortes e a Melhorar
  localStorage.setItem("pontos_fortes", JSON.stringify([
    "Organização e planejamento",
    "Empatia e escuta ativa",
    "Resiliência em momentos difíceis",
    "Criatividade na resolução de problemas"
  ]));

  localStorage.setItem("pontos_a_melhorar", JSON.stringify([
    "Delegação de tarefas",
    "Dizer não quando necessário",
    "Gestão do tempo",
    "Paciência com processos lentos"
  ]));

  // SWOT
  localStorage.setItem("analise_swot", JSON.stringify({
    forcas: [
      "Boa capacidade analítica",
      "Experiência em gestão de projetos",
      "Network profissional sólido",
      "Formação acadêmica relevante"
    ],
    fraquezas: [
      "Dificuldade em delegar",
      "Perfeccionismo excessivo",
      "Pouca experiência em gestão de pessoas",
      "Inglês intermediário"
    ],
    oportunidades: [
      "Mercado aquecido na área",
      "Empresa em expansão",
      "Possibilidade de promoção interna",
      "Cursos online acessíveis"
    ],
    ameacas: [
      "Concorrência por vagas de liderança",
      "Instabilidade econômica",
      "Mudanças tecnológicas rápidas",
      "Pressão por resultados imediatos"
    ]
  }));

  // Crenças Transformadas
  localStorage.setItem("crencas_transformadas", JSON.stringify([
    {
      crencaLimitante: "Não sou boa o suficiente para liderar uma equipe",
      crencaFortalecedora: "Tenho todas as habilidades necessárias e estou em constante evolução para ser uma excelente líder",
      transformedAt: "2024-11-15"
    },
    {
      crencaLimitante: "Dinheiro é difícil de conseguir",
      crencaFortalecedora: "Sou capaz de gerar abundância através do meu trabalho e escolhas inteligentes",
      transformedAt: "2024-10-20"
    },
    {
      crencaLimitante: "Não tenho tempo para cuidar da minha saúde",
      crencaFortalecedora: "Priorizo minha saúde porque sei que ela é a base para todas as minhas conquistas",
      transformedAt: "2024-12-01"
    }
  ]));

  // Diário com histórico de humor
  const today = new Date();
  const diaryEntries = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const moods = ['feliz', 'feliz', 'feliz', 'neutro', 'neutro', 'triste'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    diaryEntries.push({
      date: date.toISOString().split('T')[0],
      data: date.toISOString().split('T')[0],
      mood: randomMood,
      humor: randomMood,
      reflexao: [
        "Hoje foi um dia produtivo, consegui avançar em várias tarefas importantes.",
        "Me senti um pouco sobrecarregada, mas consegui manter o foco.",
        "Tive uma conversa inspiradora com meu mentor.",
        "Dia tranquilo, aproveitei para refletir sobre meus objetivos.",
        "Enfrentei alguns desafios, mas aprendi muito com eles."
      ][Math.floor(Math.random() * 5)],
      gratidao: [
        "Gratidão pela saúde e pela família",
        "Agradeço pelas oportunidades de aprendizado",
        "Sou grata pelo apoio dos colegas",
        "Gratidão por mais um dia de vida"
      ][Math.floor(Math.random() * 4)],
      conquistas: [
        "Finalizei uma apresentação importante",
        "Consegui fazer exercício",
        "Li 30 páginas do livro",
        "Tive uma reunião produtiva"
      ][Math.floor(Math.random() * 4)]
    });
  }
  localStorage.setItem("diary_entries", JSON.stringify(diaryEntries));

  // Streak e Gamificação
  localStorage.setItem("user_streak", JSON.stringify({
    current_streak: 12,
    longest_streak: 25,
    level: 5,
    total_points: 1250,
    last_activity_date: today.toISOString().split('T')[0]
  }));

  // Conquistas
  localStorage.setItem("user_achievements", JSON.stringify([
    { name: "Primeiro Passo", achievement_name: "Primeiro Passo", unlocked_at: "2024-10-01" },
    { name: "Semana Consistente", achievement_name: "Semana Consistente", unlocked_at: "2024-10-08" },
    { name: "Objetivo Definido", achievement_name: "Objetivo Definido", unlocked_at: "2024-10-15" },
    { name: "Meta Concluída", achievement_name: "Meta Concluída", unlocked_at: "2024-11-20" },
    { name: "Reflexão Profunda", achievement_name: "Reflexão Profunda", unlocked_at: "2024-11-25" },
    { name: "Streak de 10 dias", achievement_name: "Streak de 10 dias", unlocked_at: "2024-12-01" }
  ]));

  // Insight
  localStorage.setItem("userInsight", "Com base na sua jornada, você demonstra forte compromisso com seu desenvolvimento. Sua VVD está bem alinhada com seus objetivos de liderança e equilíbrio. As áreas que mais precisam de atenção são Lazer e Contribuição Social - considere integrar atividades que combinem ambas. Seu progresso nas metas financeiras é consistente, e a transformação de crenças limitantes mostra maturidade emocional. Recomendação: foque em delegar mais para ter tempo para as áreas deficitárias da Roda da Vida.");
  localStorage.setItem("lastInsightDate", new Date().toISOString());

  // Eisenhower
  localStorage.setItem("eisenhower_tasks", JSON.stringify({
    urgente_importante: ["Finalizar relatório trimestral", "Reunião com diretoria"],
    nao_urgente_importante: ["Curso de liderança", "Planejamento anual", "Networking"],
    urgente_nao_importante: ["Responder e-mails", "Ligação com fornecedor"],
    nao_urgente_nao_importante: ["Organizar desktop", "Atualizar redes sociais"]
  }));

  // ==== EMPRESA E OKRs ====
  const companyId = "company_mock_001";
  const employeeId = "emp_mock_001";

  // Empresa mockada
  const companies = [{
    id: companyId,
    razao_social: "TechVision Soluções Ltda",
    cnpj: "12.345.678/0001-99",
    email: "contato@techvision.com.br",
    telefone: "(11) 99999-0000",
    is_active: true,
    created_at: "2024-01-15"
  }];
  localStorage.setItem("companies", JSON.stringify(companies));

  // Funcionário vinculado
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    const employees = [{
      id: employeeId,
      company_id: companyId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      is_active: true,
      accepted_at: "2024-02-01",
      user_id: userData.id || "user_001"
    }];
    localStorage.setItem("company_employees", JSON.stringify(employees));

    // Atualizar user com companyId para o OKRLinkSection funcionar
    userData.companyId = companyId;
    localStorage.setItem("user", JSON.stringify(userData));
  }

  // OKRs da empresa
  const companyOKRs = [
    {
      id: "okr_001",
      title: "Aumentar satisfação dos clientes em 30%",
      description: "Melhorar NPS e reduzir churn através de melhorias no produto e atendimento",
      period_start: "2025-01-01",
      period_end: "2025-06-30",
      status: "active",
      linked_employee_ids: [employeeId],
      key_results: [
        { id: "kr_001", title: "NPS de 50 para 70", target: 70, current: 58, unit: "pts" },
        { id: "kr_002", title: "Reduzir churn de 5% para 2%", target: 2, current: 3.5, unit: "%" },
        { id: "kr_003", title: "100 avaliações positivas", target: 100, current: 72, unit: "avaliações" }
      ]
    },
    {
      id: "okr_002",
      title: "Expandir equipe e desenvolver talentos",
      description: "Contratar e desenvolver profissionais de alta performance",
      period_start: "2025-01-01",
      period_end: "2025-12-31",
      status: "active",
      linked_employee_ids: [employeeId],
      key_results: [
        { id: "kr_004", title: "Contratar 10 novos colaboradores", target: 10, current: 4, unit: "pessoas" },
        { id: "kr_005", title: "90% de conclusão em treinamentos", target: 90, current: 65, unit: "%" },
        { id: "kr_006", title: "Promover 3 líderes internos", target: 3, current: 1, unit: "promoções" }
      ]
    },
    {
      id: "okr_003",
      title: "Aumentar receita em 25%",
      description: "Crescer faturamento através de novos clientes e upsell",
      period_start: "2025-01-01",
      period_end: "2025-12-31",
      status: "active",
      linked_employee_ids: [],
      key_results: [
        { id: "kr_007", title: "50 novos clientes", target: 50, current: 18, unit: "clientes" },
        { id: "kr_008", title: "Upsell em 30% da base", target: 30, current: 12, unit: "%" }
      ]
    }
  ];
  localStorage.setItem(`okrs_${companyId}`, JSON.stringify(companyOKRs));

  // Vincular objetivo pessoal ao OKR corporativo
  const okrLinks = [
    {
      objetivoId: "1001",
      okrId: "okr_002",
      okrTitle: "Expandir equipe e desenvolver talentos"
    }
  ];
  localStorage.setItem("user_okr_links", JSON.stringify(okrLinks));
};


interface UserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

interface CompanyInfo {
  razao_social: string;
  cnpj: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscription = useSubscription();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Check for successful checkout return
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      toast.success("Assinatura realizada com sucesso! Bem-vindo ao Plano Básico!");
      subscription.refreshSubscription?.();
      // Remove the query param
      navigate('/perfil', { replace: true });
    } else if (checkoutStatus === 'canceled') {
      toast.info("Checkout cancelado. Você pode tentar novamente quando quiser.");
      navigate('/perfil', { replace: true });
    }
  }, [searchParams, navigate, subscription]);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado para assinar");
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error("Não foi possível criar a sessão de pagamento");
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || "Erro ao processar checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado");
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw new Error(error.message);

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Portal error:', error);
      toast.error("Erro ao acessar portal de assinatura");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    setFormData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      password: parsedUser.password || "",
    });

    // Verificar se usuário está associado a uma empresa
    checkCompanyAssociation(parsedUser.email);
  }, [navigate]);

  const checkCompanyAssociation = (userEmail: string) => {
    // Verificar se é funcionário de alguma empresa
    const employees = JSON.parse(localStorage.getItem("company_employees") || "[]");
    const employee = employees.find((emp: any) => 
      emp.email?.toLowerCase() === userEmail?.toLowerCase() && emp.is_active
    );

    if (employee) {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const company = companies.find((c: any) => c.id === employee.company_id);
      if (company) {
        setCompanyInfo({
          razao_social: company.razao_social,
          cnpj: company.cnpj,
        });
        return;
      }
    }

    // Verificar se é gestor de alguma empresa
    const managers = JSON.parse(localStorage.getItem("company_managers") || "[]");
    const manager = managers.find((mgr: any) => 
      mgr.email?.toLowerCase() === userEmail?.toLowerCase() && mgr.is_active
    );

    if (manager) {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const company = companies.find((c: any) => c.id === manager.company_id);
      if (company) {
        setCompanyInfo({
          razao_social: company.razao_social,
          cnpj: company.cnpj,
        });
        return;
      }
    }

    setCompanyInfo(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserData(updatedUser as UserData);
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const formatCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, "");
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                generateMockData(userData?.name || "Usuário");
                toast.success("Dados de teste gerados com sucesso!");
              }}
              className="text-xs"
            >
              <Database className="w-4 h-4 mr-1" />
              Gerar Dados Teste
            </Button>
            <ExportPDFButton />
          </div>
        </div>

        {/* Dados do Usuário */}
        <Card className="shadow-large">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações do seu cadastro</CardDescription>
                </div>
              </div>
              {userData.role && (
                <Badge variant="secondary" className="capitalize">
                  {userData.role}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={!isEditing}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                  Editar Dados
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empresa Associada */}
        {companyInfo && (
          <Card className="shadow-large border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Empresa Vinculada</CardTitle>
                  <CardDescription>Você está associado a uma empresa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">Razão Social</Label>
                <p className="font-medium">{companyInfo.razao_social}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">CNPJ</Label>
                <p className="font-medium">{formatCNPJ(companyInfo.cnpj)}</p>
              </div>
              <Badge variant="secondary" className="mt-2">
                ✓ Assinatura coberta pela empresa
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Planos de Assinatura (apenas quando não vinculado a empresa) */}
        {!companyInfo && (
          <Card className="shadow-large">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Planos de Assinatura</CardTitle>
                  <CardDescription>Escolha o melhor plano para você</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Plano Gratuito */}
                <Card className={`border-2 transition-colors ${subscription.plan === 'basico' ? 'border-muted opacity-60' : 'border-muted hover:border-primary/50'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Gratuito</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Acesso por 30 dias</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Dashboard "Seu Progresso"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Gerar 1 insight</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Diário completo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>1 objetivo, 1 meta, 5 ações</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">Ferramentas ilimitadas: Roda da Vida, VVD, Valores, Eisenhower</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">1 uso: SWOT, SMART, Autoavaliação 360º, Crenças</span>
                      </div>
                    </div>
                    {(subscription.plan === 'gratuito' || subscription.status === 'trial') && (
                      <Button variant="outline" className="w-full mt-4" disabled>
                        ✓ Plano Atual
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Plano Básico */}
                <Card className="border-2 border-green-500 hover:border-green-600 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium animate-pulse">
                    🎉 Promoção de lançamento!
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">Básico</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">
                      R$ 14,90<span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Dashboard "Seu Progresso"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>1 insight por mês</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Diário completo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Plano de Vida ilimitado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Todas as ferramentas ilimitadas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Integração Google Calendar</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Construção Guiada</span>
                      </div>
                    </div>
                    {subscription.plan === 'basico' ? (
                      <div className="space-y-2 mt-4">
                        <Button className="w-full bg-green-500 hover:bg-green-600" disabled>
                          ✓ Plano Atual
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-xs"
                          onClick={handleManageSubscription}
                        >
                          Gerenciar Assinatura
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button 
                          className="w-full mt-4 bg-green-500 hover:bg-green-600" 
                          onClick={handleCheckout}
                          disabled={isCheckoutLoading}
                        >
                          {isCheckoutLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            "Assinar Agora"
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          acesso ilimitado* a todas funcionalidades
                        </p>
                        <p className="text-[10px] text-center text-muted-foreground">
                          *exceto insights com limite de 1 por mês
                        </p>
                      </>
                    
                    )}
                  </CardContent>
                </Card>

                {/* Plano Completo */}
                <Card className="border-2 border-amber-500/50 hover:border-amber-500 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Recomendado
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">Completo</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Dashboard "Seu Progresso"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Insights ilimitados</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Diário completo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Plano de Vida ilimitado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Todas as ferramentas ilimitadas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Integração Google Calendar</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Notificações e-mail e WhatsApp</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Construção Guiada</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Gerar relatórios PDF</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600" disabled>
                      Em breve
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  🚀 Promoção de lançamento: acesso do plano completo liberado no Plano Básico por apenas R$ 14,90/mês!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notificações */}
        <NotificationPreferences />

        {/* Seção LGPD - Privacidade e Dados */}
        <LGPDDataSection />
      </div>
    </div>
  );
};

export default Perfil;
