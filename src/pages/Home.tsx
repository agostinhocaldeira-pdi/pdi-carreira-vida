import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { Target, TrendingUp, BookOpen, MessagesSquare, Book, Sparkles, User, Zap, Star, Shield, Lock, ChevronDown, AlertCircle, Link2, Users, Bell, HelpCircle, FileText, ClipboardCheck, Focus, Loader2, Crosshair, Play, Footprints } from "lucide-react";
import { DailyCheckout } from "@/components/gamification/DailyCheckout";
import StoicReflectionCard from "@/components/home/StoicReflectionCard";
import ProgressSection from "@/components/home/ProgressSection";
import { usePDIData } from "@/hooks/usePDIQueries";
import { useAIUsage } from "@/hooks/useAIUsage";
import { AIUsageLimitModal } from "@/components/AIUsageLimitModal";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { InsightAudioButton } from "@/components/home/InsightAudioButton";
import { ProfilePictureAvatar } from "@/components/profile/ProfilePictureAvatar";
import { useProfilePicture } from "@/hooks/useProfilePicture";

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
import { QuickAccessNav } from "@/components/home/QuickAccessNav";

const Home = () => {
  const navigate = useNavigate();
  
  // Optimized role protection - uses cached role data (no blocking RPC)
  const { isLoading: roleLoading, userRole, isAdmin, isGestor, isEmployee } = useRoleProtection({
    allowedRoles: ["user", "gestor", "admin"],
    redirectTo: "/dashboard-empresa"
  });
  
  const [userName, setUserName] = useState("");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  
  const [showDiaryWarningModal, setShowDiaryWarningModal] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(true);
  const [stoicOpen, setStoicOpen] = useState(true);
  
  // Estados para notificações
  const [unreadSupportMessages, setUnreadSupportMessages] = useState(0);
  const [unreadManagerMessages, setUnreadManagerMessages] = useState(0);
  const [unreadEmployeeMessages, setUnreadEmployeeMessages] = useState(0);
  
  const { showSurvey, setShowSurvey, completedSection, markSectionCompleted } = useSatisfactionSurvey();
  const { newAchievement, dismissNewAchievement, checkAndUnlockAchievements } = useGamification();
  
  // Carregar objetivos do usuário
  const { data: pdiData } = usePDIData();
  const objetivos = pdiData?.objetivos || [];
  const metas = pdiData?.metas || [];
  
  // AI Usage e Insight
  const storage = usePDIStorage();
  const aiUsage = useAIUsage('insight');
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightOpen, setInsightOpen] = useState(true);
  
  // Profile picture
  const { profilePictureUrl } = useProfilePicture();
  
  // Carregar insight salvo
  useEffect(() => {
    const loadInsight = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;
        
        const { data } = await supabase
          .from('user_insights')
          .select('insight_text')
          .eq('user_id', session.session.user.id)
          .maybeSingle();
        
        if (data?.insight_text) {
          setInsight(data.insight_text);
        }
      } catch (error) {
        console.error("Erro ao carregar insight:", error);
      }
    };
    loadInsight();
  }, []);
  
  // Verificar se pode gerar insight
  const canGenerateInsight = isAdmin || aiUsage.hasAvailablePurchase;
  
  // Função para gerar insight
  const handleGenerateInsight = async () => {
    if (!canGenerateInsight && !isAdmin) {
      setShowAILimitModal(true);
      return;
    }
    
    setIsGeneratingInsight(true);
    try {
      const vvd = await storage.getVvd();
      const valores = await storage.getValores();
      const areasVida = await storage.getAreasVida();
      
      const response = await supabase.functions.invoke('generate-insight', {
        body: { vvd, valores, areasVida, objetivos }
      });
      
      if (response.error) throw response.error;
      
      const newInsight = response.data?.insight;
      if (newInsight) {
        setInsight(newInsight);
        
        // Consumir uso se não for admin
        if (!isAdmin && aiUsage.hasAvailablePurchase) {
          await aiUsage.consumePurchase();
        }
      }
    } catch (error) {
      console.error("Erro ao gerar insight:", error);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

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

      {/* Modal de Limite de AI */}
      <AIUsageLimitModal
        isOpen={showAILimitModal}
        onClose={() => setShowAILimitModal(false)}
        onPurchase={async () => {
          const url = await aiUsage.createPurchase('/home');
          if (url) window.open(url, '_blank');
          setShowAILimitModal(false);
        }}
        isLoading={aiUsage.isLoading}
        featureType="insight"
        featureName="Insight Personalizado"
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
                <ProfilePictureAvatar 
                  profilePictureUrl={profilePictureUrl}
                  userName={userName}
                  size="sm"
                  className="h-6 w-6"
                />
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

      {/* Quick Access Navigation - Horizontal Scroll */}
      <QuickAccessNav isGestor={isGestor} />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Trial Status Banner */}
        <TrialStatusBanner />

        {/* Seu Objetivo Principal - Exibição no topo */}
        {objetivos.some((obj: any) => obj.is_principal || obj.isPrincipal) && (
          <section className="animate-slide-up">
            <div className="rounded-xl border-2 border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Focus className="w-4 h-4 text-accent" />
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-foreground">
                  Seu Objetivo Principal
                </h2>
              </div>
              {objetivos
                .filter((objetivo: any) => objetivo.is_principal || objetivo.isPrincipal)
                .map((objetivo: any) => {
                  // Contar metas, ações e passos para este objetivo
                  const objetivoMetas = metas.filter((m: any) => 
                    m.objetivo_id === objetivo.id || m.objetivoId === objetivo.id
                  );
                  const metasCount = objetivoMetas.length;
                  const acoesCount = objetivoMetas.reduce((acc: number, m: any) => 
                    acc + (m.acoes?.length || 0), 0
                  );
                  const passosCount = objetivoMetas.reduce((acc: number, m: any) => 
                    acc + (m.passos?.length || 0), 0
                  );
                  
                  return (
                    <div key={objetivo.id} className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border border-accent/20 shadow-sm">
                        <Target className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                          {objetivo.texto}
                        </span>
                      </div>
                      
                      {/* Contadores de metas, ações e passos */}
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Crosshair className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium">{metasCount} {metasCount === 1 ? 'meta' : 'metas'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Play className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium">{acoesCount} {acoesCount === 1 ? 'ação' : 'ações'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Footprints className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium">{passosCount} {passosCount === 1 ? 'passo' : 'passos'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <p className="text-xs text-muted-foreground mt-3 italic">
                Mantenha o foco. Cada ação te aproxima do seu objetivo.
              </p>
            </div>
          </section>
        )}

        {/* Daily Checkout Section */}
        <section className="animate-slide-up">
          <Collapsible open={checkoutOpen} onOpenChange={setCheckoutOpen}>
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors py-3 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg">Check-out do Dia</CardTitle>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${checkoutOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <DailyCheckout />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </section>

        {/* Stoic Reflection Card - After Checkout */}
        <section className="animate-slide-up">
          <StoicReflectionCard isOpen={stoicOpen} onOpenChange={setStoicOpen} />
        </section>

        {/* Diary & Reflection Section */}
        <section className="animate-slide-up">
          <StoicReflectionSection />
        </section>

        {/* Progresso Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <ProgressSection />
        </section>

        {/* Plano de Vida Section - Navegação para páginas */}
        <section className="animate-slide-up overflow-hidden max-w-full" style={{ animationDelay: "0.2s" }} data-section="plano-de-vida">
          <Card className="shadow-medium border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Plano de Vida</CardTitle>
                  <CardDescription>Construa e acompanhe sua jornada de desenvolvimento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Passo 1 - Quem sou eu */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all group"
                  onClick={() => navigate("/plano-vida/quem-sou")}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Quem sou eu</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left whitespace-normal break-words">
                    Clique aqui para iniciar sua jornada de autoconhecimento e obter clareza do que realmente deseja para sua vida
                  </p>
                </Button>

                {/* Passo 2 - Para onde vou */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all group"
                  onClick={() => navigate("/plano-vida/para-onde")}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Para onde vou</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left whitespace-normal break-words">
                    Clique aqui para registrar os objetivos que você quer alcançar na vida pessoal ou profissional
                  </p>
                </Button>

                {/* Passo 3 - Como chegar lá */}
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all group"
                  onClick={() => navigate("/plano-vida/como-chegar")}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Como chegar lá</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left whitespace-normal break-words">
                    Clique aqui para cadastrar metas e objetivos que te levarão a alcançar seus objetivos
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Insight Personalizado Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Collapsible open={insightOpen} onOpenChange={setInsightOpen}>
            <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Insight Personalizado</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Análise baseada no seu Plano de Vida
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 sm:w-5 sm:h-5 text-muted-foreground transition-transform duration-200 ${insightOpen ? 'rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                  
                  {!isAdmin && aiUsage.hasAvailablePurchase && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-xs sm:text-sm text-green-900 dark:text-green-200">
                        <strong>Você tem 1 insight disponível!</strong> Clique no botão abaixo para gerar seu insight personalizado.
                      </p>
                    </div>
                  )}
                  
                  {isAdmin && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs sm:text-sm text-primary">
                        <strong>Acesso Admin:</strong> Você tem insights ilimitados como administrador.
                      </p>
                    </div>
                  )}
                  
                  {insight ? (
                    <div className="space-y-4">
                      <div className="bg-card rounded-lg p-4 border shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="prose prose-sm max-w-none whitespace-pre-line text-sm flex-1">
                            {insight}
                          </div>
                          <InsightAudioButton insight={insight} />
                        </div>
                      </div>
                      {/* Botão Gerar novo insight */}
                      {!isAdmin && !aiUsage.hasAvailablePurchase ? (
                        <Button 
                          onClick={() => setShowAILimitModal(true)} 
                          size="sm" 
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Gerar novo insight
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleGenerateInsight()} 
                          size="sm" 
                          variant="outline"
                          disabled={isGeneratingInsight}
                          className="w-full sm:w-auto"
                        >
                          {isGeneratingInsight ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Gerando novo insight...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Gerar novo insight
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block w-full">
                            <Button 
                              onClick={() => handleGenerateInsight()} 
                              disabled={isGeneratingInsight || objetivos.length === 0}
                              className="w-full"
                              size="lg"
                            >
                              {isGeneratingInsight ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Gerando insight...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Gerar Insight
                                </>
                              )}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {objetivos.length === 0 && (
                          <TooltipContent>
                            <p className="text-sm">
                              Para gerar insights, preencha seu Plano de Vida
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CollapsibleContent>
            </div>
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
