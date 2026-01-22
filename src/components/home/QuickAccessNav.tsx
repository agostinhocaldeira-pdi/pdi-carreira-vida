import { Link } from "react-router-dom";
import { BookOpen, Target, MessagesSquare, Link2, HelpCircle, FileText, Users, ChevronRight, Sparkles, TrendingUp, User, Footprints, Trophy, Lock } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";

interface QuickAccessNavProps {
  isGestor?: boolean;
}

const navItems = [
  { 
    label: "Desafio", 
    icon: Trophy, 
    path: "/desafio-30-dias",
    showAlways: true,
    requiresSubscription: true
  },
  { 
    label: "Reflexão", 
    icon: Sparkles, 
    path: "/reflexao",
    showAlways: true 
  },
  { 
    label: "Progresso", 
    icon: TrendingUp, 
    path: "/progresso",
    showAlways: true 
  },
  { 
    label: "Quem sou eu", 
    icon: User, 
    path: "/plano-vida/quem-sou",
    showAlways: true 
  },
  { 
    label: "Para onde vou", 
    icon: Target, 
    path: "/plano-vida/para-onde",
    showAlways: true 
  },
  { 
    label: "Como chegar lá", 
    icon: Footprints, 
    path: "/plano-vida/como-chegar",
    showAlways: true 
  },
  {
    label: "Construção Guiada", 
    icon: BookOpen, 
    path: "/construcao-guiada",
    showAlways: true 
  },
  { 
    label: "Ferramentas", 
    icon: Target, 
    path: "/ferramentas",
    showAlways: true 
  },
  { 
    label: "Suporte", 
    icon: MessagesSquare, 
    path: "/suporte",
    showAlways: true 
  },
  { 
    label: "Integrações", 
    icon: Link2, 
    path: "/integracoes",
    showAlways: true 
  },
  { 
    label: "FAQ", 
    icon: HelpCircle, 
    path: "/faq",
    showAlways: true 
  },
  { 
    label: "Relatórios", 
    icon: FileText, 
    path: "/relatorios",
    showAlways: true 
  },
  { 
    label: "Gestão de PDI's", 
    icon: Users, 
    path: "/gestao-pdis",
    showAlways: false,
    gestorOnly: true 
  },
];

export const QuickAccessNav = ({ isGestor = false }: QuickAccessNavProps) => {
  const { status } = useSubscriptionContext();
  const visibleItems = navItems.filter(item => item.showAlways || (item.gestorOnly && isGestor));
  
  // User has active subscription if status is 'active' (paid) - trial doesn't count for premium features
  const hasActiveSubscription = status === 'active';

  const renderNavItem = (item: typeof navItems[0]) => {
    const isLocked = item.requiresSubscription && !hasActiveSubscription;
    const isDesafio = item.path === "/desafio-30-dias";
    
    const navContent = (
      <div className={`w-20 sm:w-24 h-20 sm:h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 p-2 group relative ${
        isLocked 
          ? "border-border/50 bg-card/50 cursor-not-allowed opacity-60"
          : item.path === "/reflexao" 
            ? "border-primary bg-primary/10 hover:bg-primary/20 hover:border-primary cursor-pointer" 
            : isDesafio
              ? "border-[#d4a853] bg-black hover:bg-[#d4a853]/20 hover:border-[#d4a853] cursor-pointer"
              : "border-border bg-card hover:bg-primary/5 hover:border-primary/40 cursor-pointer"
      }`}>
        {isLocked && (
          <div className="absolute top-1 right-1">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors ${
          isLocked
            ? "bg-muted/50"
            : item.path === "/reflexao"
              ? "bg-primary/20 group-hover:bg-primary/30"
              : isDesafio
                ? "bg-[#d4a853]/20 group-hover:bg-[#d4a853]/30"
                : "bg-primary/10 group-hover:bg-primary/20"
        }`}>
          <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
            isLocked 
              ? "text-muted-foreground" 
              : isDesafio 
                ? "text-[#d4a853]" 
                : "text-primary"
          }`} />
        </div>
        <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2 ${
          isLocked
            ? "text-muted-foreground"
            : item.path === "/reflexao" 
              ? "text-primary" 
              : isDesafio
                ? "text-[#d4a853]"
                : "text-foreground/80"
        }`}>
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
          <div className="flex gap-3 py-3 pr-8">
            {visibleItems.map(renderNavItem)}
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
