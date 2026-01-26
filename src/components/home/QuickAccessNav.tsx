import { Link } from "react-router-dom";
import { BookOpen, Target, MessagesSquare, Link2, HelpCircle, FileText, Users, ChevronRight, Sparkles, TrendingUp, User, Footprints, Trophy, Lock } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";

interface QuickAccessNavProps {
  isGestor?: boolean;
}

// GRUPO ESTRATÉGICO - Destaque (tamanho normal)
const strategicItems = [
  { 
    label: "Base Pessoal", 
    icon: User, 
    path: "/plano-vida/quem-sou",
    group: 'strategic'
  },
  { 
    label: "Direção & Objetivos", 
    icon: Target, 
    path: "/plano-vida/para-onde",
    group: 'strategic'
  },
  { 
    label: "Plano de Execução", 
    icon: Footprints, 
    path: "/plano-vida/como-chegar",
    group: 'strategic'
  },
  { 
    label: "Desafio", 
    icon: Trophy, 
    path: "/desafio-30-dias",
    group: 'strategic',
    requiresSubscription: true
  },
];

// GRUPO MANUTENÇÃO - Secundário (estilo ghost/menor)
const maintenanceItems = [
  { 
    label: "Reflexão", 
    icon: Sparkles, 
    path: "/reflexao",
    group: 'maintenance'
  },
  { 
    label: "Progresso", 
    icon: TrendingUp, 
    path: "/progresso",
    group: 'maintenance'
  },
  {
    label: "Construção Guiada", 
    icon: BookOpen, 
    path: "/construcao-guiada",
    group: 'maintenance'
  },
  { 
    label: "Ferramentas", 
    icon: Target, 
    path: "/ferramentas",
    group: 'maintenance'
  },
  { 
    label: "Suporte", 
    icon: MessagesSquare, 
    path: "/suporte",
    group: 'maintenance'
  },
  { 
    label: "Integrações", 
    icon: Link2, 
    path: "/integracoes",
    group: 'maintenance'
  },
  { 
    label: "FAQ", 
    icon: HelpCircle, 
    path: "/faq",
    group: 'maintenance'
  },
  { 
    label: "Relatórios", 
    icon: FileText, 
    path: "/relatorios",
    group: 'maintenance'
  },
];

// Item exclusivo para gestores
const gestorItem = { 
  label: "Gestão de PDI's", 
  icon: Users, 
  path: "/gestao-pdis",
  group: 'maintenance',
  gestorOnly: true 
};

export const QuickAccessNav = ({ isGestor = false }: QuickAccessNavProps) => {
  const { status } = useSubscriptionContext();
  
  // User has active subscription if status is 'active' (paid) - trial doesn't count for premium features
  const hasActiveSubscription = status === 'active';

  // Combine items with gestor item if applicable
  const allMaintenanceItems = isGestor 
    ? [...maintenanceItems, gestorItem]
    : maintenanceItems;

  const renderNavItem = (item: typeof strategicItems[0] | typeof maintenanceItems[0], isStrategic: boolean) => {
    const isLocked = 'requiresSubscription' in item && item.requiresSubscription && !hasActiveSubscription;
    const isDesafio = item.path === "/desafio-30-dias";
    const isReflexao = item.path === "/reflexao";
    
    // Different sizes for strategic vs maintenance
    const cardSize = isStrategic 
      ? "w-20 sm:w-24 h-20 sm:h-24" 
      : "w-16 sm:w-20 h-16 sm:h-20";
    
    const iconContainerSize = isStrategic
      ? "w-8 h-8 sm:w-10 sm:h-10"
      : "w-6 h-6 sm:w-8 sm:h-8";
    
    const iconSize = isStrategic
      ? "w-4 h-4 sm:w-5 sm:h-5"
      : "w-3 h-3 sm:w-4 sm:h-4";
    
    const textSize = isStrategic
      ? "text-[10px] sm:text-xs"
      : "text-[9px] sm:text-[10px]";
    
    const navContent = (
      <div className={cn(
        cardSize,
        "rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 group relative",
        isLocked && "border-border/50 bg-card/50 cursor-not-allowed opacity-60",
        !isLocked && isDesafio && "border-[#d4a853] bg-black hover:bg-[#d4a853]/20 hover:border-[#d4a853] cursor-pointer",
        !isLocked && isReflexao && "border-primary bg-primary/10 hover:bg-primary/20 hover:border-primary cursor-pointer",
        !isLocked && !isDesafio && !isReflexao && isStrategic && "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary cursor-pointer",
        !isLocked && !isDesafio && !isReflexao && !isStrategic && "border-border bg-card/50 hover:bg-muted/50 hover:border-border cursor-pointer"
      )}>
        {isLocked && (
          <div className="absolute top-1 right-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
        <div className={cn(
          iconContainerSize,
          "rounded-lg flex items-center justify-center transition-colors",
          isLocked && "bg-muted/50",
          !isLocked && isDesafio && "bg-[#d4a853]/20 group-hover:bg-[#d4a853]/30",
          !isLocked && isReflexao && "bg-primary/20 group-hover:bg-primary/30",
          !isLocked && !isDesafio && !isReflexao && isStrategic && "bg-primary/15 group-hover:bg-primary/25",
          !isLocked && !isDesafio && !isReflexao && !isStrategic && "bg-muted/50 group-hover:bg-muted"
        )}>
          <item.icon className={cn(
            iconSize,
            isLocked && "text-muted-foreground",
            !isLocked && isDesafio && "text-[#d4a853]",
            !isLocked && !isDesafio && isStrategic && "text-primary",
            !isLocked && !isDesafio && !isStrategic && "text-muted-foreground"
          )} />
        </div>
        <span className={cn(
          textSize,
          "font-medium text-center leading-tight line-clamp-2",
          isLocked && "text-muted-foreground",
          !isLocked && isDesafio && "text-[#d4a853]",
          !isLocked && isReflexao && "text-primary",
          !isLocked && !isDesafio && !isReflexao && isStrategic && "text-foreground",
          !isLocked && !isDesafio && !isReflexao && !isStrategic && "text-muted-foreground"
        )}>
          {item.label}
        </span>
      </div>
    );

    if (isLocked) {
      return (
        <TooltipProvider key={item.path}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex-shrink-0">
                {navContent}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px] text-center">
              <p className="text-sm">
                🔒 Conteúdo exclusivo para assinantes. Faça sua assinatura para desbloquear o Desafio 30 Dias.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link key={item.path} to={item.path} className="flex-shrink-0">
        {navContent}
      </Link>
    );
  };

  return (
    <div className="w-full bg-white border-b border-border relative">
      <div className="container mx-auto px-3 sm:px-4">
        <ScrollArea className="w-full">
          <div className="flex items-end gap-2 py-3 pr-8">
            {/* Strategic Group - Larger cards */}
            <div className="flex gap-2 pr-3 border-r border-border/50">
              {strategicItems.map((item) => renderNavItem(item, true))}
            </div>
            
            {/* Maintenance Group - Smaller cards */}
            <div className="flex gap-2 pl-1">
              {allMaintenanceItems.map((item) => renderNavItem(item, false))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
      
      {/* Indicador visual de scroll */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <ChevronRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default QuickAccessNav;
