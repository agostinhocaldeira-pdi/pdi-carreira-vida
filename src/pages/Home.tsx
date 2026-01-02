import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Target, TrendingUp, BookOpen, MessagesSquare, Book, Sparkles, User, Zap, Star, Shield, Lock, ChevronDown, AlertCircle, Link2, Users, Bell, HelpCircle, FileText } from "lucide-react";
import ProgressSection from "@/components/home/ProgressSection";

import PlanoDeVida from "@/components/home/PlanoDeVida";
import LanguageSelector from "@/components/LanguageSelector";
import LogoutButton from "@/components/LogoutButton";
import { SatisfactionSurveyModal } from "@/components/SatisfactionSurveyModal";
import { useSatisfactionSurvey } from "@/hooks/useSatisfactionSurvey";
import { AchievementNotification } from "@/components/gamification/AchievementNotification";
import { useGamification } from "@/hooks/useGamification";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";
import { TrialStatusBanner } from "@/components/subscription/TrialStatusBanner";
import Logo from "@/components/Logo";
import { FirstStepsModal } from "@/components/FirstStepsModal";
import StoicReflectionSection from "@/components/home/StoicReflectionSection";
import { getTodayReflection } from "@/data/stoicReflections";
import { useStoicAudioPreload } from "@/hooks/useStoicAudioPreload";

const Home = () => {
  const navigate = useNavigate();
  
  // Optimized role protection - uses cached role data (no blocking RPC)
  const { isLoading: roleLoading, userRole, isAdmin, isGestor, isEmployee } = useRoleProtection({
    allowedRoles: ["user", "gestor", "admin"],
    redirectTo: "/dashboard-empresa"
  });
  
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("quem-sou");
  const [planoDeVidaOpen, setPlanoDeVidaOpen] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [recursosOpen, setRecursosOpen] = useState(false);
  const [showDiaryWarningModal, setShowDiaryWarningModal] = useState(false);
  
  // Estados para notificações
  const [unreadSupportMessages, setUnreadSupportMessages] = useState(0);
  const [unreadManagerMessages, setUnreadManagerMessages] = useState(0);
  const [unreadEmployeeMessages, setUnreadEmployeeMessages] = useState(0);
  
  const { showSurvey, setShowSurvey, completedSection, markSectionCompleted } = useSatisfactionSurvey();
  const { newAchievement, dismissNewAchievement, checkAndUnlockAchievements } = useGamification();

  // Preload stoic audio in background with low priority
  useStoicAudioPreload();

  // Check achievements on mount
  useEffect(() => {
    checkAndUnlockAchievements();
  }, []);

  // Expor função globalmente para ser chamada pelas seções
  useEffect(() => {
    (window as any).markSectionCompleted = markSectionCompleted;
  }, [markSectionCompleted]);

  const quotes = [
    "Acredite em si mesmo e todo o resto se encaixará. 💪",
    "O sucesso é a soma de pequenos esforços repetidos. 🌟",
    "Sua única limitação é você mesmo. 🚀",
    "Grandes conquistas exigem tempo. Continue avançando! ⭐",
    "Cada passo conta na sua jornada de crescimento. 🎯",
    "O melhor momento para começar é agora. ✨",
    "Transforme seus sonhos em objetivos e seus objetivos em realidade. 🌈",
  ];

  // Carregar dados do usuário autenticado
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserName(metadata?.name || session.user.email?.split("@")[0] || "");
        
        // Atualizar localStorage para compatibilidade
        localStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: metadata?.name || "",
          role: userRole
        }));
        
        // Carregar notificações (use isEmployee from hook instead of fetching)
        loadUnreadMessages({ email: session.user.email }, isEmployee);
      }
    };
    
    if (!roleLoading && userRole) {
      loadUserData();
    }
  }, [roleLoading, userRole, isEmployee]);

  // Usa o título da reflexão estoica do dia como frase motivacional
  useEffect(() => {
    const { reflection } = getTodayReflection();
    setMotivationalQuote(reflection.title);

    // Escutar evento de navegação para Plano de Vida
    const handleNavigateToPlanoDeVida = (event: CustomEvent) => {
      const { tab } = event.detail;
      setPlanoDeVidaOpen(true);
      setActiveTab(tab);
      
      // Scroll suave até a seção Plano de Vida
      setTimeout(() => {
        const planoSection = document.querySelector('[data-section="plano-de-vida"]');
        if (planoSection) {
          planoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    window.addEventListener("navigateToPlanoDeVida", handleNavigateToPlanoDeVida as EventListener);

    return () => {
      window.removeEventListener("navigateToPlanoDeVida", handleNavigateToPlanoDeVida as EventListener);
    };
  }, []);
  
  const loadUnreadMessages = (userData: any, employeeStatus: boolean) => {
    // 1. Mensagens do suporte (admin para usuário)
    const supportTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    const supportMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");
    
    let supportUnread = 0;
    const userTickets = supportTickets.filter((t: any) => 
      t.user_email?.toLowerCase() === userData.email?.toLowerCase()
    );
    userTickets.forEach((ticket: any) => {
      supportMessages.forEach((msg: any) => {
        if (msg.ticket_id === ticket.id && msg.is_admin_response && !msg.read_by_user) {
          supportUnread++;
        }
      });
    });
    setUnreadSupportMessages(supportUnread);
    
    // 2. Mensagens do gestor (para funcionários) - use cached isEmployee
    if (employeeStatus) {
      const managerConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
      const managerMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
      
      let managerUnread = 0;
      const employeeConversations = managerConversations.filter((c: any) => 
        c.employee_email?.toLowerCase() === userData.email?.toLowerCase()
      );
      employeeConversations.forEach((conv: any) => {
        managerMessages.forEach((msg: any) => {
          if (msg.conversation_id === conv.id && msg.is_manager_response && !msg.read_by_employee) {
            managerUnread++;
          }
        });
      });
      setUnreadManagerMessages(managerUnread);
    }
    
    // 3. Mensagens dos funcionários (para gestores) - use isGestor from hook
    if (isGestor) {
      const mockManagers = JSON.parse(localStorage.getItem("mockManagers") || "[]");
      const currentManager = mockManagers.find((m: any) => 
        m.email?.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (currentManager) {
        const managerConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
        const managerMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
        
        let employeeUnread = 0;
        const gestorConversations = managerConversations.filter((c: any) => 
          c.manager_id === currentManager.id
        );
        gestorConversations.forEach((conv: any) => {
          managerMessages.forEach((msg: any) => {
            if (msg.conversation_id === conv.id && !msg.is_manager_response && !msg.read_by_manager) {
              employeeUnread++;
            }
          });
        });
        setUnreadEmployeeMessages(employeeUnread);
      }
    }
  };
  
  const totalUnread = unreadSupportMessages + unreadManagerMessages + unreadEmployeeMessages;

  // Mostrar loading enquanto verifica role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Modal de Primeiros Passos */}
      <FirstStepsModal />

      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification achievement={newAchievement} onDismiss={dismissNewAchievement} />
      )}

      {/* Modal de Pesquisa de Satisfação */}
      <SatisfactionSurveyModal
        open={showSurvey}
        onOpenChange={setShowSurvey}
        sectionCompleted={completedSection}
      />

      {/* Modal de Aviso do Diário */}
      <Dialog open={showDiaryWarningModal} onOpenChange={setShowDiaryWarningModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-xl">Momento de Reflexão 📝</DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
              <p>
                <strong>Olá! Notamos que você não preenche seu diário há alguns dias.</strong>
              </p>
              <p>
                O diário é uma ferramenta poderosa de autoconhecimento e desenvolvimento pessoal. 
                Reservar alguns minutos por dia para refletir sobre suas experiências, conquistas 
                e aprendizados ajuda você a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Manter clareza sobre seus objetivos e progresso</li>
                <li>Identificar padrões de comportamento e emoções</li>
                <li>Cultivar gratidão e pensamento positivo</li>
                <li>Fortalecer o compromisso com seu PDI</li>
              </ul>
              <p className="font-semibold text-primary">
                Que tal dedicar alguns minutos agora para registrar seu dia?
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDiaryWarningModal(false)}>
              Mais tarde
            </Button>
            <Button onClick={() => setShowDiaryWarningModal(false)}>
              Vou registrar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header - Fundo branco */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Top row - Logo, Quote and Actions */}
          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Logo size="md" showText={false} />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-primary truncate">
                    PDI - Carreira & Vida
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-warning text-warning flex-shrink-0" />
                    <span className="truncate">Olá, {userName || "Usuário"}!</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <LanguageSelector />
              {/* Ícone de notificação no header */}
              {totalUnread > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative px-2 sm:px-3"
                  onClick={() => {
                    if (unreadEmployeeMessages > 0) {
                      navigate("/gestao-pdis");
                    } else {
                      navigate("/suporte");
                    }
                  }}
                >
                  <Bell className="w-4 h-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 min-w-[16px] p-0 flex items-center justify-center text-[10px]"
                  >
                    {totalUnread}
                  </Badge>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 sm:gap-2 px-2 sm:px-3" 
                onClick={() => navigate("/perfil")}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
              <LogoutButton />
            </div>
          </div>

          {/* Bottom row - Motivational quote and progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground/80 line-clamp-2">
                {motivationalQuote}
              </p>
            </div>
            
            <Badge className="gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 whitespace-nowrap self-start sm:self-auto bg-secondary text-secondary-foreground">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Em progresso</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Trial Status Banner */}
        <TrialStatusBanner />

        {/* Stoic Reflection Section */}
        <section className="animate-slide-up">
          <StoicReflectionSection />
        </section>

        {/* Progresso Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <ProgressSection />
        </section>

        {/* Plano de Vida Section */}
        <section className="animate-slide-up overflow-hidden max-w-full" style={{ animationDelay: "0.2s" }} data-section="plano-de-vida">
          <PlanoDeVida 
            onTabChange={setActiveTab} 
            onOpenChange={setPlanoDeVidaOpen} 
            forcedTab={activeTab}
            forcedOpen={planoDeVidaOpen}
          />
        </section>


        {/* Recursos Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Collapsible open={recursosOpen} onOpenChange={setRecursosOpen}>
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Recursos
                    </CardTitle>
                    <CardDescription>Acesse ferramentas e suporte para sua jornada</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 hover:bg-primary/10 hover:border-primary transition-all shadow-sm min-w-[44px]"
                    >
                      {!recursosOpen && (
                        <span className="text-xs font-medium">Abrir</span>
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${recursosOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/construcao-guiada">
                      <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">Construção Guiada</h3>
                          <p className="text-sm text-muted-foreground">
                            Trilha passo a passo para construir seu PDI
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/ferramentas">
                      <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">Ferramentas</h3>
                          <p className="text-sm text-muted-foreground">
                            SWOT, Roda da Vida e mais
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/suporte">
                      <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <MessagesSquare className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">Suporte</h3>
                          <p className="text-sm text-muted-foreground">
                            Chat de ajuda e orientação
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/integracoes">
                      <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Link2 className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">Integrações</h3>
                          <p className="text-sm text-muted-foreground">
                            Conecte com Google Calendar, Notion e mais
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/faq">
                      <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                        <CardContent className="pt-6 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">FAQ</h3>
                          <p className="text-sm text-muted-foreground">
                            Perguntas frequentes e dúvidas comuns
                          </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/relatorios">
                    <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-primary">
                      <CardContent className="pt-6 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">Relatórios</h3>
                        <p className="text-sm text-muted-foreground">
                          Exporte seu PDI e acompanhe progresso
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Card de Gestão de PDIs - apenas para gestores */}
                    {isGestor && (
                      <Link to="/gestao-pdis">
                        <Card className="hover:shadow-medium transition-all cursor-pointer h-full border-2 hover:border-green-500 bg-gradient-to-br from-card to-green-500/5">
                          <CardContent className="pt-6 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="font-semibold">Gestão de PDI's</h3>
                            <p className="text-sm text-muted-foreground">
                              Acompanhe o desenvolvimento da sua equipe
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </section>

        {/* Área Restrita - Apenas para Administradores */}
        {isAdmin && (
          <section className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <Card className="shadow-medium border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-xl">Área Restrita</CardTitle>
                </div>
                <CardDescription>Acesso exclusivo para administradores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1">Painel Administrativo</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Gerencie usuários, visualize estatísticas e configure o sistema
                      </p>
                    </div>
                  </div>
                  <Link to="/admin" className="w-full sm:w-auto">
                    <Button variant="destructive" className="w-full sm:w-auto gap-2">
                      <Shield className="w-4 h-4" />
                      Acessar Painel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

      </main>
    </div>
  );
};

export default Home;
