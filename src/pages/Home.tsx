/**
 * Home Hub - Ponto Principal de Entrada
 * 
 * Página premium com layout moderno que serve como hub de navegação
 * Aplica lógica de Iniciação vs Operacional:
 * - Iniciação: Base Pessoal destacada, outros cards bloqueados
 * - Operacional: Todos cards liberados
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Target, 
  Rocket, 
  Feather, 
  Sparkles,
  Zap,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { ProfilePictureAvatar } from "@/components/profile/ProfilePictureAvatar";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { useSystemState } from "@/hooks/useSystemState";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";
import { TrialStatusBanner } from "@/components/subscription/TrialStatusBanner";
import { FirstStepsModal } from "@/components/FirstStepsModal";
import { AchievementNotification } from "@/components/gamification/AchievementNotification";
import { useGamification } from "@/hooks/useGamification";
import { SatisfactionSurveyModal } from "@/components/SatisfactionSurveyModal";
import { useSatisfactionSurvey } from "@/hooks/useSatisfactionSurvey";

import { useSubscription } from "@/hooks/useSubscription";
import { HubCard } from "@/components/home/HubCard";
import { HubSection } from "@/components/home/HubSection";
import { DiaryQuickCard } from "@/components/home/DiaryQuickCard";
import { StoicQuickCard } from "@/components/home/StoicQuickCard";
import { AgendaLockedCard } from "@/components/home/AgendaLockedCard";
import { StoicSquareCard } from "@/components/home/StoicSquareCard";
import { DiarySquareCard } from "@/components/home/DiarySquareCard";
import { AgendaSquareCard } from "@/components/home/AgendaSquareCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  
  // Hooks
  const { profilePictureUrl } = useProfilePicture();
  const { hasCompletedBase, step1Done, step2Done, isLoading: systemStateLoading, baseProgress } = useSystemState();
  const { isLoading: roleLoading } = useRoleProtection({
    allowedRoles: ["user", "gestor", "admin"],
    redirectTo: "/dashboard-empresa"
  });
  const { newAchievement, dismissNewAchievement, checkAndUnlockAchievements } = useGamification();
  const { showSurvey, setShowSurvey, completedSection, markSectionCompleted } = useSatisfactionSurvey();
  const { status: subscriptionStatus, plan: subscriptionPlan } = useSubscription();
  const isMobile = useIsMobile();
  
  // Desafio requires Black plan specifically
  const hasBlackSubscription = subscriptionStatus === 'active' && subscriptionPlan === 'black';
  
  // Jornada access: completo/black subscribers OR pdismart role
  const [hasJornadaAccess, setHasJornadaAccess] = useState(false);
  
  useEffect(() => {
    const checkJornadaAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Check pdismart role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const hasPdismart = roles?.some(r => r.role === 'pdismart');
      const hasCompleteOrBlack = subscriptionStatus === 'active' && 
        (subscriptionPlan === 'completo' || subscriptionPlan === 'black');
      
      setHasJornadaAccess(hasPdismart || hasCompleteOrBlack);
    };
    checkJornadaAccess();
  }, [subscriptionStatus, subscriptionPlan]);

  // Determine mode
  const isInitiationMode = !hasCompletedBase;

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserName(metadata?.name || session.user.email?.split("@")[0] || "");
      }
    };
    loadUserData();
  }, []);

  // Expose markSectionCompleted globally for child components
  useEffect(() => {
    (window as any).markSectionCompleted = markSectionCompleted;
  }, [markSectionCompleted]);

  // Check achievements on mount
  useEffect(() => {
    checkAndUnlockAchievements();
  }, []);

  // Loading state
  if (roleLoading || systemStateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Modals */}
        <FirstStepsModal />
        {newAchievement && (
          <AchievementNotification achievement={newAchievement} onDismiss={dismissNewAchievement} />
        )}
        <SatisfactionSurveyModal
          open={showSurvey}
          onOpenChange={setShowSurvey}
          sectionCompleted={completedSection}
        />

        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo size="sm" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  • Olá, {userName || "Usuário"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-sm" 
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
                <LogoutButton showText={false} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-10 max-w-5xl">
          {/* Trial Status Banner */}
          <TrialStatusBanner />

          {/* ============================================================ */}
          {/* PAINEL - Card único no topo */}
          {/* ============================================================ */}
          <HubCard
            title="Painel"
            description={!isMobile ? "Acesse o painel completo com agenda, objetivos, metas e ações do dia." : undefined}
            icon={<LayoutDashboard className="w-full h-full" />}
            to="/control-panel"
            variant="compact"
            isLocked={isInitiationMode}
            lockMessage="Complete a Base Pessoal primeiro"
            tooltipContent="Acesse o painel completo com agenda, objetivos, metas e ações do dia."
          />

          {/* ============================================================ */}
          {/* SECTION 1: Estrutura do Sistema */}
          {/* ============================================================ */}
          <HubSection 
            icon={<Sparkles className="w-3.5 h-3.5 text-primary" />} 
            title="A construção começa pela base."
          >
            {/* Educational message for initiation mode */}
            {isInitiationMode && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground leading-relaxed -mt-2 mb-4"
              >
                Antes de organizar metas, agenda e execução, o sistema precisa de uma base clara. 
                Este primeiro passo define quem você é e o que importa para você. 
                A partir disso, o PDI estrutura seu <span className="font-medium text-foreground">Modo Operacional</span> com precisão.
              </motion.p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {/* Base Pessoal - Highlighted in initiation mode */}
              <div className="col-span-1">
                <HubCard
                  title="Base Pessoal"
                  description={!isMobile ? "Identidade, Valores e Roda da Vida" : undefined}
                  icon={<User className="w-full h-full" />}
                  to="/plano-vida/quem-sou"
                  variant="highlighted"
                  badge={isInitiationMode ? `${baseProgress}%` : step1Done ? "✓" : undefined}
                  tooltipContent="Defina quem você é: sua essência (VVD), seus valores fundamentais e as áreas da sua vida que precisam de atenção."
                  className="aspect-square sm:aspect-auto"
                />
              </div>

              {/* Direção & Objetivos */}
              <div className="col-span-1">
                <HubCard
                  title="Direção & Objetivos"
                  icon={<Target className="w-full h-full" />}
                  to="/plano-vida/para-onde"
                  variant="compact"
                  isLocked={isInitiationMode}
                  lockMessage="Requer Base Pessoal"
                  badge={step2Done ? "✓" : undefined}
                  tooltipContent="Defina para onde você quer ir: crie objetivos claros conectados à sua essência."
                  className="aspect-square sm:aspect-auto"
                />
              </div>

              {/* Plano de Execução */}
              <div className="col-span-1">
                <HubCard
                  title="Plano de Execução"
                  icon={<Rocket className="w-full h-full" />}
                  to="/plano-vida/como-chegar"
                  variant="compact"
                  isLocked={isInitiationMode || !step2Done}
                  lockMessage={isInitiationMode ? "Requer Base Pessoal" : "Defina objetivos primeiro"}
                  tooltipContent="Transforme seus objetivos em ação: defina passos concretos e rotinas diárias."
                  className="aspect-square sm:aspect-auto"
                />
              </div>

              {/* Jornada */}
              <div className="col-span-1">
                <HubCard
                  title="Jornada"
                  icon={<Compass className="w-full h-full" />}
                  to="/jornada"
                  variant="compact"
                  isLocked={!hasJornadaAccess}
                  lockMessage="Disponível para assinantes do Plano Completo, Black ou compradores do PDI Smart."
                  tooltipContent="Método simplificado para quem tem urgência na construção de uma meta."
                  className="aspect-square sm:aspect-auto"
                />
              </div>
            </div>
          </HubSection>

          {/* ============================================================ */}
          {/* SECTION 2: Dedique 5 minutos por dia */}
          {/* ============================================================ */}
          <HubSection 
            icon={<Feather className="w-3.5 h-3.5 text-primary" />} 
            title="Dedique 5 minutos por dia"
          >
            {/* Mobile: square cards */}
            {isMobile ? (
              <div className="grid grid-cols-2 gap-2">
                <StoicSquareCard />
                <DiarySquareCard />
                <AgendaSquareCard isLocked={isInitiationMode} />
                <HubCard
                  title="Desafio"
                  icon={<Zap className="w-full h-full" />}
                  to="/desafio-30-dias"
                  variant="premium-black"
                  isLocked={isInitiationMode || !hasBlackSubscription}
                  lockMessage={isInitiationMode ? "Requer Base Pessoal" : "Exclusivo Plano Black"}
                  tooltipContent="Desafio do Código Essencial - 21 dias de transformação."
                  className="aspect-square"
                />
              </div>
            ) : (
              /* Desktop: full cards */
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StoicQuickCard />
                <DiaryQuickCard />
                {isInitiationMode && <AgendaLockedCard />}
                <HubCard
                  title="Desafio"
                  description="Desafio do Código Essencial - 21 dias de transformação."
                  icon={<Zap className="w-full h-full" />}
                  to="/desafio-30-dias"
                  variant="premium-black"
                  isLocked={isInitiationMode || !hasBlackSubscription}
                  lockMessage={isInitiationMode ? "Requer Base Pessoal" : "Exclusivo Plano Black"}
                  tooltipContent="Participe do Desafio do Código Essencial - 21 dias de transformação. Exclusivo Plano Black."
                />
              </div>
            )}
          </HubSection>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Home;
