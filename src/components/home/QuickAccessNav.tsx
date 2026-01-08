import { Link } from "react-router-dom";
import { BookOpen, Target, MessagesSquare, Link2, HelpCircle, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QuickAccessNavProps {
  isGestor?: boolean;
}

const navItems = [
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
    <div className="w-full bg-white border-b border-border">
      <div className="container mx-auto px-3 sm:px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 py-3">
            {visibleItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-shrink-0 hover:bg-primary/5 hover:border-primary/40 transition-all"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default QuickAccessNav;
