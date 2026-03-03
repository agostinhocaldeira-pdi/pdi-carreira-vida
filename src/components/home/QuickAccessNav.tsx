import { Link } from "react-router-dom";
import { BookOpen, Target, MessagesSquare, Link2, HelpCircle, FileText, Users, ChevronRight, Sparkles, TrendingUp, User, Footprints, Trophy, Lock, Home, Compass } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PLAN_MODEL } from "@/config/planModel";

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
    label: "Jornada", 
    icon: Compass, 
    path: "/jornada",
    group: 'strategic',
    requiresJornada: true
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
    label: "Home", 
    icon: Home, 
    path: "/home",
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
  { 
    label: "Reflexão & Diário", 
    icon: Sparkles, 
    path: "/reflexao",
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
  const { status, plan } = useSubscriptionContext();
  
  // VIP2026: all features unlocked. Paid: require active subscription for premium features.
  const hasActiveSubscription = PLAN_MODEL === 'vip2026' || status === 'active';
  
  // Jornada access: completo/black OR pdismart role
  const [hasJornadaAccess, setHasJornadaAccess] = useState(false);
  
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      const hasPdismart = roles?.some(r => r.role === 'pdismart');
      const hasCompleteOrBlack = status === 'active' && (plan === 'completo' || plan === 'black');
      // VIP2026: jornada always accessible
      setHasJornadaAccess(PLAN_MODEL === 'vip2026' || hasPdismart || hasCompleteOrBlack);
    };
    checkAccess();
  }, [status, plan]);

  // Combine items with gestor item if applicable
  const allMaintenanceItems = isGestor 
    ? [...maintenanceItems, gestorItem]
    : maintenanceItems;

  const renderStrategicItem = (item: typeof strategicItems[0]) => {
    const isLockedDesafio = 'requiresSubscription' in item && item.requiresSubscription && !hasActiveSubscription;
    const isLockedJornada = 'requiresJornada' in item && item.requiresJornada && !hasJornadaAccess;
    const isLocked = isLockedDesafio || isLockedJornada;
    const isDesafio = item.path === "/desafio-30-dias";
    const isJornada = item.path === "/jornada";
    
    const navContent = (
      <div className={cn(
        "w-20 sm:w-24 h-20 sm:h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 group relative",
        isLocked && "border-border/50 bg-card/50 cursor-not-allowed opacity-60",
        !isLocked && isDesafio && "border-[#d4a853] bg-black hover:bg-[#d4a853]/20 hover:border-[#d4a853] cursor-pointer",
        !isLocked && !isDesafio && !isJornada && "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary cursor-pointer",
        !isLocked && isJornada && "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 cursor-pointer"
      )}>
        {isLocked && (
          <div className="absolute top-1 right-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
        <div className={cn(
          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors",
          isLocked && "bg-muted/50",
          !isLocked && isDesafio && "bg-[#d4a853]/20 group-hover:bg-[#d4a853]/30",
          !isLocked && isJornada && "bg-emerald-500/15 group-hover:bg-emerald-500/25",
          !isLocked && !isDesafio && !isJornada && "bg-primary/15 group-hover:bg-primary/25"
        )}>
          <item.icon className={cn(
            "w-4 h-4 sm:w-5 sm:h-5",
            isLocked && "text-muted-foreground",
            !isLocked && isDesafio && "text-[#d4a853]",
            !isLocked && isJornada && "text-emerald-500",
            !isLocked && !isDesafio && !isJornada && "text-primary"
          )} />
        </div>
        <span className={cn(
          "text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2",
          isLocked && "text-muted-foreground",
          !isLocked && isDesafio && "text-[#d4a853]",
          !isLocked && isJornada && "text-emerald-500",
          !isLocked && !isDesafio && !isJornada && "text-foreground"
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
                {isLockedJornada 
                  ? '🔒 Método simplificado para quem tem urgência na construção de uma meta. Disponível para Plano Completo, Black ou PDI Smart.'
                  : '🔒 Conteúdo exclusivo do Plano Black. Assine o Plano Black para desbloquear o Desafio 30 Dias.'}
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

  // Renderização de itens de manutenção (estilo ghost/menor)
  const renderMaintenanceItem = (item: typeof maintenanceItems[0]) => {
    return (
      <Link key={item.path} to={item.path} className="flex-shrink-0">
        <div className={cn(
          "h-14 sm:h-16 px-3 sm:px-4 rounded-lg transition-all flex items-center gap-2 group cursor-pointer",
          "bg-transparent hover:bg-muted/50 border border-transparent hover:border-border/50"
        )}>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-muted/30 flex items-center justify-center group-hover:bg-muted/50 transition-colors">
            <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
            {item.label}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full bg-background border-b border-border relative">
      <div className="container mx-auto px-3 sm:px-4">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 py-3 pr-8">
            {/* Strategic Group - Larger cards with visual prominence */}
            <div className="flex gap-2 pr-4">
              {strategicItems.map((item) => renderStrategicItem(item))}
            </div>
            
            {/* Separator */}
            <div className="h-12 w-px bg-border/60 flex-shrink-0" />
            
            {/* Maintenance Group - Ghost style, compact */}
            <div className="flex gap-1 pl-2">
              {allMaintenanceItems.map((item) => renderMaintenanceItem(item))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
      
      {/* Indicador visual de scroll */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <ChevronRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default QuickAccessNav;
