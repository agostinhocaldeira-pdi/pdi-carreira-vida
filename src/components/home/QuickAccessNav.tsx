import { Link } from "react-router-dom";
import { BookOpen, Target, MessagesSquare, Link2, HelpCircle, FileText, Users, ChevronRight, Sparkles, TrendingUp, User, Footprints } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QuickAccessNavProps {
  isGestor?: boolean;
}

const navItems = [
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
  const visibleItems = navItems.filter(item => item.showAlways || (item.gestorOnly && isGestor));

  return (
    <div className="w-full bg-white border-b border-border relative">
      <div className="container mx-auto px-3 sm:px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-3 py-3 pr-8">
            {visibleItems.map((item) => (
              <Link key={item.path} to={item.path} className="flex-shrink-0">
                <div className={`w-20 sm:w-24 h-20 sm:h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 p-2 cursor-pointer group ${
                  item.path === "/reflexao" 
                    ? "border-primary bg-primary/10 hover:bg-primary/20 hover:border-primary" 
                    : "border-border bg-card hover:bg-primary/5 hover:border-primary/40"
                }`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors ${
                    item.path === "/reflexao"
                      ? "bg-primary/20 group-hover:bg-primary/30"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}>
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2 ${
                    item.path === "/reflexao" ? "text-primary" : "text-foreground/80"
                  }`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
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
