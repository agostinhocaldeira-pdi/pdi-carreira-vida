import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Target, TrendingUp, BookOpen, MessagesSquare, Book, Sparkles, User, Zap, Star, Shield, Lock, ChevronDown, AlertCircle, Link2, Users, Bell, HelpCircle, FileText, ClipboardCheck, Focus, Loader2, Crosshair, Play, Footprints, PartyPopper } from "lucide-react";
import { Agenda } from "@/components/agenda";
import { AgendaTaskModal } from "@/components/agenda/AgendaTaskModal";
import { useAgenda } from "@/hooks/useAgenda";


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

import { getTodayReflection } from "@/data/stoicReflections";
import { useStoicAudioPreload } from "@/hooks/useStoicAudioPreload";
import { useDailyQuote } from "@/hooks/useDailyQuote";
import { QuickAccessNav } from "@/components/home/QuickAccessNav";
import { ProductivityTipsSection } from "@/components/home/ProductivityTipsSection";
import { HomeInitiation } from "@/components/home/HomeInitiation";
import { HomeOperational } from "@/components/home/HomeOperational";
import { AIMentorFAB } from "@/components/home/AIMentorFAB";
import { useSystemState } from "@/hooks/useSystemState";


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DEBUG: helps confirm which build is running on device/browser
  useEffect(() => {
    console.warn("[Home] build=2026-01-09 planovida=v2");
  }, []);
  
  // Optimized role protection - uses cached role data (no blocking RPC)
  const { isLoading: roleLoading, userRole, isAdmin, isGestor, isEmployee } = useRoleProtection({
    allowedRoles: ["user", "gestor", "admin"],
    redirectTo: "/dashboard-empresa"
  });
  
  // Estado central do sistema: Iniciação vs Operacional
  const { hasCompletedBase, isLoading: systemStateLoading } = useSystemState();
  
  const [userName, setUserName] = useState("");
  
  // Daily quote from database (365 phrases)
  const { quote: dailyQuote, isLoading: isDailyQuoteLoading } = useDailyQuote();
  
  const [showDiaryWarningModal, setShowDiaryWarningModal] = useState(false);
  const [showPlanoVidaCompleteModal, setShowPlanoVidaCompleteModal] = useState(false);
  const [agendaOpen, setAgendaOpen] = useState(true);
  
  // Estados para o modal de tarefa pré-preenchida (acionado pelo FirstStepsModal)
  const [showPrefilledTaskModal, setShowPrefilledTaskModal] = useState(false);
  const [prefilledTaskTitle, setPrefilledTaskTitle] = useState("");
  const [prefilledTaskDescription, setPrefilledTaskDescription] = useState("");
  
  // Flag para habilitar agenda no modo iniciação (após "Fazer depois" + salvar tarefa)
  const [agendaEnabledInInitiation, setAgendaEnabledInInitiation] = useState(false);
  
  // Hook da agenda para criar tarefas
  const { createEvent } = useAgenda();
  
  // Listener para o evento do FirstStepsModal "Fazer depois"
  useEffect(() => {
    const handleOpenWithData = (event: CustomEvent<{ title: string; description: string }>) => {
      setPrefilledTaskTitle(event.detail.title);
      setPrefilledTaskDescription(event.detail.description);
      setShowPrefilledTaskModal(true);
    };

    window.addEventListener('openTaskModalWithData', handleOpenWithData as EventListener);
    return () => {
      window.removeEventListener('openTaskModalWithData', handleOpenWithData as EventListener);
    };
  }, []);
  
  
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
  const vvd = pdiData?.vvd || "";
  const valores = pdiData?.valores || [];
  const areasVida = pdiData?.areasVida || [];
  // AI Usage e Insight
  const storage = usePDIStorage();
  const aiUsage = useAIUsage('insight');
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightOpen, setInsightOpen] = useState(() => window.innerWidth >= 640); // Start collapsed on mobile

  // Plano de Vida (passo 3 depende de habilidades)
  const [habilidadesCount, setHabilidadesCount] = useState(0);
  
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

  // Carregar habilidades (usado para completar o Passo 3)
  useEffect(() => {
    const loadHabilidades = async () => {
      try {
        const habs = await storage.getHabilidades();
        setHabilidadesCount(habs?.length || 0);
      } catch (error) {
        // Não bloquear a Home por isso
        console.error("Erro ao carregar habilidades:", error);
      }
    };

    loadHabilidades();
  }, [storage]);
  
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
      // Collect all user data for comprehensive insight
      const { collectInsightData } = await import('@/services/insightDataCollector');
      const insightData = await collectInsightData(storage);

      const response = await supabase.functions.invoke('generate-insight', {
        body: insightData
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

  // Check if coming from Plano de Vida completion
  useEffect(() => {
    if (location.state?.showPlanoVidaCompleteModal) {
      setShowPlanoVidaCompleteModal(true);
      // Clear the state to prevent modal from showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  // Fallback to stoic reflection title if daily quote is not available
  const motivationalQuote = dailyQuote || (() => {
    const { reflection } = getTodayReflection();
    return reflection.title;
  })();
  
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

  // ============================================================
  // RENDERIZAÇÃO CONDICIONAL: Iniciação vs Operacional
  // ============================================================
  // 
  // hasCompletedBase = true  → Modo Operacional (usuário completou Base Pessoal)
  // hasCompletedBase = false → Modo Iniciação (foco em completar Base Pessoal)
  //
  // TODO (Fase 2/3): Mover o conteúdo atual para dentro de HomeOperational
  // ============================================================

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

      {/* Modal de Plano de Vida Concluído */}
      <Dialog open={showPlanoVidaCompleteModal} onOpenChange={setShowPlanoVidaCompleteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <PartyPopper className="w-6 h-6 text-success" />
              </div>
              <DialogTitle className="text-xl">Excelente, você concluiu seu plano de vida! 🎉</DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed pt-4 space-y-4">
              <p>
                Essa foi a etapa mais "teórica" do sistema.
              </p>
              <p>
                <strong>Agora vem a parte prática. Agir.</strong>
              </p>
              <p>
                A seguir, veja as <strong>"Dicas de Eficiência, Produtividade e Clareza"</strong> para tirar o melhor proveito desta jornada.
              </p>
              <p className="text-primary font-medium">
                Estou muito feliz por você! 😊
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowPlanoVidaCompleteModal(false)}>
              Entendi
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
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-primary line-clamp-2">
              {isDailyQuoteLoading ? '...' : motivationalQuote}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Access Navigation - Horizontal Scroll */}
      <QuickAccessNav isGestor={isGestor} />

      {/* Main Content - Renderização Condicional */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Trial Status Banner */}
        <TrialStatusBanner />

        {/* ============================================================ */}
        {/* SWITCH: Modo Iniciação vs Modo Operacional                   */}
        {/* ============================================================ */}
        {hasCompletedBase ? (
          <HomeOperational />
        ) : (
          <HomeInitiation showAgenda={agendaEnabledInInitiation} />
        )}

      </main>

      {/* AI Mentor FAB - Apenas no modo operacional */}
      {hasCompletedBase && (
        <AIMentorFAB
          insight={insight}
          isGenerating={isGeneratingInsight}
          onGenerate={handleGenerateInsight}
          canGenerate={canGenerateInsight}
        />
      )}

      {/* Modal de Tarefa Pré-preenchida (acionado pelo FirstStepsModal "Fazer depois") */}
      <AgendaTaskModal
        open={showPrefilledTaskModal}
        onOpenChange={(open) => {
          setShowPrefilledTaskModal(open);
          if (!open) {
            setPrefilledTaskTitle("");
            setPrefilledTaskDescription("");
          }
        }}
        onSave={async (task) => {
          await createEvent(task);
          // Habilita a agenda no modo iniciação após salvar a tarefa do "Fazer depois"
          setAgendaEnabledInInitiation(true);
        }}
        task={null}
        selectedDate={new Date()}
        initialTitle={prefilledTaskTitle}
        initialDescription={prefilledTaskDescription}
      />
    </div>
  );
};

export default Home;
