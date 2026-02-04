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
  BookOpen, 
  Feather, 
  GraduationCap, 
  MessageCircle, 
  PlayCircle,
  Wrench,
  TrendingUp,
  Link2,
  HelpCircle,
  FileText,
  Camera,
  Sparkles,
  Zap,
  LogOut
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
import { HubCard } from "@/components/home/HubCard";
import { HubSection } from "@/components/home/HubSection";
import { DiaryQuickCard } from "@/components/home/DiaryQuickCard";
import { StoicQuickCard } from "@/components/home/StoicQuickCard";
import { AgendaLockedCard } from "@/components/home/AgendaLockedCard";

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
  const { showSurvey, setShowSurvey, completedSection } = useSatisfactionSurvey();

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
      <div className="min-h-screen bg-background">
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
        <main className="container mx-auto px-4 py-6 space-y-8 max-w-5xl">
          {/* Trial Status Banner */}
          <TrialStatusBanner />

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

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Base Pessoal - Highlighted in initiation mode */}
              <div className="col-span-1 row-span-1">
                <HubCard
                  title="Base Pessoal"
                  description="Identidade, Valores e Roda da Vida"
                  icon={<User className="w-full h-full" />}
                  to="/plano-vida/quem-sou"
                  variant={isInitiationMode ? "highlighted" : "default"}
                  badge={isInitiationMode ? `${baseProgress}%` : step1Done ? "✓" : undefined}
                  tooltipContent="Defina quem você é: sua essência (VVD), seus valores fundamentais e as áreas da sua vida que precisam de atenção."
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
                />
              </div>

              {/* Desafio */}
              <div className="col-span-1">
                <HubCard
                  title="Desafio"
                  icon={<Zap className="w-full h-full" />}
                  to="/desafio-codigo"
                  variant="compact"
                  isLocked={isInitiationMode}
                  lockMessage="Requer Base Pessoal"
                  tooltipContent="Participe do Desafio do Código Essencial - 21 dias de transformação."
                />
              </div>

              {/* Painel de Controle */}
              <div className="col-span-2 lg:col-span-1">
                <HubCard
                  title="Painel de Controle"
                  description="Acompanhe seus objetivos, agenda e realize suas ações diárias."
                  icon={<LayoutDashboard className="w-full h-full" />}
                  to="/control-panel"
                  variant="primary"
                  isLocked={isInitiationMode}
                  lockMessage="Complete a Base Pessoal primeiro"
                  tooltipContent="Acesse o painel completo com agenda, objetivos, metas e ações do dia."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Reflexão Estóica */}
              <StoicQuickCard />

              {/* Diário */}
              <DiaryQuickCard />

              {/* Agenda Locked Card (only in initiation mode) */}
              {isInitiationMode && <AgendaLockedCard />}
            </div>
          </HubSection>

          {/* ============================================================ */}
          {/* SECTION 3: Base de Conhecimento */}
          {/* ============================================================ */}
          <HubSection 
            icon={<GraduationCap className="w-3.5 h-3.5 text-primary" />} 
            title="Base de Conhecimento"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Trilha PDI - Featured */}
              <div className="sm:col-span-1">
                <HubCard
                  title="Trilha de Desenvolvimento PDI"
                  description="Siga esta jornada estruturada para construir seu Plano de Desenvolvimento Individual completo."
                  icon={<GraduationCap className="w-full h-full" />}
                  to="/construcao-guiada"
                  variant="feature"
                  tooltipContent="Aprenda os fundamentos do PDI com vídeos educativos e exercícios práticos."
                />
              </div>

              {/* Ferramentas */}
              <HubCard
                title="Ferramentas"
                description="O autodesenvolvimento é uma jornada contínua que requer clareza, estrutura e método."
                icon={<Wrench className="w-full h-full" />}
                to="/ferramentas"
                variant="feature"
                tooltipContent="Acesse todas as ferramentas de autoconhecimento: SWOT, SMART, Eisenhower e mais."
              />

              {/* Suporte */}
              <HubCard
                title="Suporte"
                description="Tire suas dúvidas sobre o sistema, peça ajuda para utilizar ferramentas."
                icon={<MessageCircle className="w-full h-full" />}
                to="/suporte"
                variant="feature"
                tooltipContent="Entre em contato com nossa equipe para tirar dúvidas."
              />

              {/* Tutoriais */}
              <HubCard
                title="Tutoriais"
                description="Guia detalhado de todas as funcionalidades do PDI. Como usar, quando e porquê usar."
                icon={<PlayCircle className="w-full h-full" />}
                to="/tutorial"
                variant="feature"
                tooltipContent="Vídeos e guias passo a passo para dominar o sistema."
              />
            </div>
          </HubSection>

          {/* ============================================================ */}
          {/* SECTION 4: Recursos Adicionais */}
          {/* ============================================================ */}
          <HubSection 
            icon={<Zap className="w-3.5 h-3.5 text-primary" />} 
            title="Recursos Adicionais"
          >
            <div className="flex flex-wrap gap-2">
              {/* Quick Links */}
              {[
                { icon: <TrendingUp className="w-4 h-4" />, label: "Progresso", to: "/progresso" },
                { icon: <Link2 className="w-4 h-4" />, label: "Integrações", to: "/integracoes" },
                { icon: <HelpCircle className="w-4 h-4" />, label: "FAQ", to: "/faq" },
                { icon: <FileText className="w-4 h-4" />, label: "Relatórios", to: "/relatorios" },
              ].map((item) => (
                <Button
                  key={item.to}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-sm font-normal"
                  onClick={() => navigate(item.to)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}

              {/* Foto de Perfil - Slightly different */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-card">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <span 
                    className="text-foreground hover:text-primary cursor-pointer transition-colors"
                    onClick={() => navigate("/perfil")}
                  >
                    Foto de Perfil
                  </span>
                  <span className="text-muted-foreground hidden sm:inline"> - Personalize sua conta com foto</span>
                </div>
              </div>
            </div>
          </HubSection>

          {/* Footer Quote */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
          >
            <p className="text-lg font-semibold text-foreground">
              O hábito certo elimina debate.
            </p>
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Home;
