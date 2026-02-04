/**
 * HubSection - Componente para seções do Hub com ícone e título
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HubSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

export const HubSection = ({ icon, title, children, className }: HubSectionProps) => (
  <section className={cn("space-y-4", className)}>
    <div className="pb-2 border-b border-border/50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
      </div>
    </div>
    {children}
  </section>
);

export default HubSection;
