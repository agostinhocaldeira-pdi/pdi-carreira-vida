/**
 * Home Hub - Ponto Principal de Entrada
 * 
 * Página premium com Bento Grid que serve como hub de navegação
 * Aplica lógica de Iniciação vs Operacional:
 * - Iniciação: Base Pessoal destacada, outros cards bloqueados
 * - Operacional: Todos cards liberados
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Lock,
  Star,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { ProfilePictureAvatar } from "@/components/profile/ProfilePictureAvatar";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { useSystemState } from "@/hooks/useSystemState";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { TrialStatusBanner } from "@/components/subscription/TrialStatusBanner";
import { FirstStepsModal } from "@/components/FirstStepsModal";
import { AchievementNotification } from "@/components/gamification/AchievementNotification";
import { useGamification } from "@/hooks/useGamification";
import { SatisfactionSurveyModal } from "@/components/SatisfactionSurveyModal";
import { useSatisfactionSurvey } from "@/hooks/useSatisfactionSurvey";

// ============================================================
// TYPES
// ============================================================
interface HubCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  isLocked?: boolean;
  lockMessage?: string;
  isPrimary?: boolean;
  isHighlighted?: boolean;
  size?: 'large' | 'medium' | 'small';
  tooltipContent?: string;
  badge?: string;
}

// ============================================================
// HUB CARD COMPONENT
// ============================================================
const HubCard = ({ 
  title, 
  description, 
  icon, 
  to, 
  isLocked = false,
  lockMessage,
  isPrimary = false,
  isHighlighted = false,
  size = 'medium',
  tooltipContent,
  badge
}: HubCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLocked) return;
    navigate(to);
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer group h-full",
          // Premium dark style for primary cards
          isPrimary && "bg-[#1A1A1A] border-2 border-[#D4AF37] shadow-lg hover:shadow-xl",
          // Highlighted card with pulse effect
          isHighlighted && !isLocked && "bg-[#1A1A1A] border-2 border-[#D4AF37] shadow-lg animate-pulse",
          // Locked state
          isLocked && "bg-muted/50 border-border/30 opacity-60 cursor-not-allowed",
          // Default state
          !isPrimary && !isHighlighted && !isLocked && "bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
          // Size variations
          size === 'large' && "md:col-span-2 md:row-span-2",
          size === 'small' && ""
        )}
        onClick={handleClick}
      >
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-6 h-6 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/70">{lockMessage}</p>
            </div>
          </div>
        )}

        {/* Badge */}
        {badge && !isLocked && (
          <Badge className="absolute top-3 right-3 bg-[#D4AF37] text-[#1A1A1A] text-[10px]">
            {badge}
          </Badge>
        )}

        <CardHeader className={cn(
          "pb-2",
          size === 'large' ? "p-6 sm:p-8" : size === 'small' ? "p-3 sm:p-4" : "p-4 sm:p-5"
        )}>
          <div className={cn(
            "rounded-full flex items-center justify-center mb-3",
            isPrimary || isHighlighted 
              ? "w-12 h-12 sm:w-14 sm:h-14 bg-[#D4AF37]/20" 
              : "w-10 h-10 sm:w-12 sm:h-12 bg-primary/10",
            isLocked && "bg-muted"
          )}>
            <div className={cn(
              isPrimary || isHighlighted ? "text-[#D4AF37]" : "text-primary",
              isLocked && "text-muted-foreground/50",
              size === 'large' ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5 sm:w-6 sm:h-6"
            )}>
              {icon}
            </div>
          </div>
          <CardTitle className={cn(
            "font-bold",
            isPrimary || isHighlighted ? "text-white" : "text-foreground",
            isLocked && "text-muted-foreground/70",
            size === 'large' ? "text-xl sm:text-2xl" : size === 'small' ? "text-sm sm:text-base" : "text-base sm:text-lg"
          )}>
            {title}
          </CardTitle>
          <CardDescription className={cn(
            isPrimary || isHighlighted ? "text-gray-400" : "text-muted-foreground",
            isLocked && "text-muted-foreground/50",
            size === 'small' ? "text-xs" : "text-sm"
          )}>
            {description}
          </CardDescription>
        </CardHeader>

        {/* Arrow indicator for primary/highlighted */}
        {(isPrimary || isHighlighted) && !isLocked && (
          <CardContent className="pt-0">
            <div className="flex items-center text-[#D4AF37] text-sm font-medium group-hover:translate-x-1 transition-transform">
              Acessar
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
};

// ============================================================
// SECTION HEADER COMPONENT
// ============================================================
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
  </div>
);

// ============================================================
// MAIN HOME HUB COMPONENT
// ============================================================
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
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Determine card states based on user progress
  const isInitiationMode = !hasCompletedBase;
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle">
        {/* First Steps Modal */}
        <FirstStepsModal />

        {/* Achievement Notification */}
        {newAchievement && (
          <AchievementNotification achievement={newAchievement} onDismiss={dismissNewAchievement} />
        )}

        {/* Satisfaction Survey Modal */}
        <SatisfactionSurveyModal
          open={showSurvey}
          onOpenChange={setShowSurvey}
          sectionCompleted={completedSection}
        />

        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Logo */}
              <Logo size="md" />
              
              {/* Right: User & Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2" 
                  onClick={() => navigate("/perfil")}
                >
                  <ProfilePictureAvatar 
                    profilePictureUrl={profilePictureUrl}
                    userName={userName}
                    size="sm"
                    className="h-7 w-7"
                  />
                  <span className="hidden sm:inline text-sm font-medium">{userName || "Perfil"}</span>
                </Button>
                <LogoutButton showText={false} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-10">
          {/* Trial Status Banner */}
          <TrialStatusBanner />

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Olá, {userName || "Usuário"}! 👋
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {isInitiationMode 
                ? "Complete sua Base Pessoal para desbloquear o sistema completo."
                : "Seu hub de desenvolvimento pessoal está pronto."}
            </p>
          </motion.div>

          {/* ============================================================ */}
          {/* SECTION 1: Estrutura do Sistema (Navegação Principal) */}
          {/* ============================================================ */}
          <section>
            <SectionHeader 
              icon={<Rocket className="w-4 h-4 text-primary" />} 
              title="Estrutura do Sistema" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Painel de Controle - Destaque Principal */}
              <div className="sm:col-span-2 lg:col-span-2">
                <HubCard
                  title="Painel de Controle"
                  description="Acompanhe seus objetivos, agenda e realize suas ações diárias."
                  icon={<LayoutDashboard className="w-full h-full" />}
                  to="/control-panel"
                  isPrimary={!isInitiationMode}
                  isLocked={isInitiationMode}
                  lockMessage="Complete a Base Pessoal primeiro"
                  size="large"
                  tooltipContent="Acesse o painel completo com agenda, objetivos, metas e ações do dia. Este é o centro operacional do seu PDI."
                />
              </div>

              {/* Card 2: Base Pessoal */}
              <HubCard
                title="Base Pessoal"
                description="Identidade, Valores e Roda da Vida"
                icon={<User className="w-full h-full" />}
                to="/plano-vida/quem-sou"
                isHighlighted={isInitiationMode}
                badge={isInitiationMode ? `${baseProgress}%` : step1Done ? "✓" : undefined}
                tooltipContent="Defina quem você é: sua essência (VVD), seus valores fundamentais e as áreas da sua vida que precisam de atenção."
              />

              {/* Card 3: Direção & Objetivos */}
              <HubCard
                title="Direção & Objetivos"
                description="VVD, Objetivos e Metas"
                icon={<Target className="w-full h-full" />}
                to="/plano-vida/para-onde"
                isLocked={isInitiationMode}
                lockMessage="Requer Base Pessoal"
                badge={step2Done ? "✓" : undefined}
                tooltipContent="Defina para onde você quer ir: crie objetivos claros conectados à sua essência e estabeleça metas mensuráveis."
              />

              {/* Card 4: Plano de Execução */}
              <HubCard
                title="Plano de Execução"
                description="Ações, Rotinas e Passos"
                icon={<Rocket className="w-full h-full" />}
                to="/plano-vida/como-chegar"
                isLocked={isInitiationMode || !step2Done}
                lockMessage={isInitiationMode ? "Requer Base Pessoal" : "Requer Direção definida"}
                tooltipContent="Transforme seus objetivos em ação: defina passos concretos, rotinas diárias e o caminho para suas conquistas."
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: Dedique 5 minutos por dia (Hábitos Diários) */}
          {/* ============================================================ */}
          <section>
            <SectionHeader 
              icon={<Sparkles className="w-4 h-4 text-primary" />} 
              title="Dedique 5 minutos por dia" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Reflexão Estóica */}
              <HubCard
                title="Reflexão Estóica"
                description="Momento diário de sabedoria e clareza mental"
                icon={<Feather className="w-full h-full" />}
                to="/reflexao"
                tooltipContent="Reflexões filosóficas diárias para fortalecer sua mentalidade e manter o foco no que importa."
              />

              {/* Diário */}
              <HubCard
                title="Diário"
                description="Registre humor, gratidão e aprendizados"
                icon={<BookOpen className="w-full h-full" />}
                to="/diario"
                tooltipContent="Cultive o hábito de reflexão diária: registre seu humor, gratidão, conquistas e aprendizados do dia."
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: Base de Conhecimento */}
          {/* ============================================================ */}
          <section>
            <SectionHeader 
              icon={<GraduationCap className="w-4 h-4 text-primary" />} 
              title="Base de Conhecimento" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Trilha de Desenvolvimento */}
              <HubCard
                title="Trilha PDI"
                description="Curso completo de desenvolvimento"
                icon={<GraduationCap className="w-full h-full" />}
                to="/construcao-guiada"
                size="small"
                tooltipContent="Aprenda os fundamentos do PDI com vídeos educativos e exercícios práticos organizados em módulos."
              />

              {/* Suporte */}
              <HubCard
                title="Suporte"
                description="Tire suas dúvidas"
                icon={<MessageCircle className="w-full h-full" />}
                to="/suporte"
                size="small"
                tooltipContent="Entre em contato com nossa equipe para tirar dúvidas ou relatar problemas."
              />

              {/* Tutoriais */}
              <HubCard
                title="Tutoriais"
                description="Guias de uso do sistema"
                icon={<PlayCircle className="w-full h-full" />}
                to="/tutorial"
                size="small"
                tooltipContent="Vídeos e guias passo a passo para dominar todas as funcionalidades do PDI."
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4: Recursos Adicionais */}
          {/* ============================================================ */}
          <section>
            <SectionHeader 
              icon={<Zap className="w-4 h-4 text-primary" />} 
              title="Recursos Adicionais" 
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Ferramentas */}
              <HubCard
                title="Ferramentas"
                description="SWOT, SMART, Eisenhower..."
                icon={<Wrench className="w-full h-full" />}
                to="/ferramentas"
                size="small"
                tooltipContent="Acesse todas as ferramentas de autoconhecimento e produtividade do sistema."
              />

              {/* Progresso */}
              <HubCard
                title="Progresso"
                description="Estatísticas e evolução"
                icon={<TrendingUp className="w-full h-full" />}
                to="/progresso"
                size="small"
                tooltipContent="Visualize seu progresso ao longo do tempo com gráficos e estatísticas detalhadas."
              />

              {/* Integrações */}
              <HubCard
                title="Integrações"
                description="Google Calendar, Notion..."
                icon={<Link2 className="w-full h-full" />}
                to="/integracoes"
                size="small"
                tooltipContent="Conecte o PDI com suas ferramentas favoritas para sincronizar dados automaticamente."
              />

              {/* FAQ */}
              <HubCard
                title="FAQ"
                description="Perguntas frequentes"
                icon={<HelpCircle className="w-full h-full" />}
                to="/faq"
                size="small"
                tooltipContent="Encontre respostas para as dúvidas mais comuns sobre o sistema PDI."
              />

              {/* Relatórios */}
              <HubCard
                title="Relatórios"
                description="PDFs e exportações"
                icon={<FileText className="w-full h-full" />}
                to="/relatorios"
                size="small"
                tooltipContent="Gere relatórios em PDF do seu PDI para compartilhar ou imprimir."
              />

              {/* Foto de Perfil */}
              <HubCard
                title="Foto de Perfil"
                description="Personalize sua conta"
                icon={<Camera className="w-full h-full" />}
                to="/perfil"
                size="small"
                tooltipContent="Atualize sua foto de perfil e informações pessoais."
              />
            </div>
          </section>

          {/* Footer spacing */}
          <div className="h-8" />
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Home;
