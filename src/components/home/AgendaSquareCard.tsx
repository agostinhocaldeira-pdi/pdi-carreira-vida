/**
 * AgendaSquareCard - Card quadrado da Agenda Estratégica para mobile
 * Abre um modal com a agenda ao invés de navegar para o painel
 */

import { useState } from "react";
import { Calendar, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AgendaModal } from "./AgendaModal";

interface AgendaSquareCardProps {
  className?: string;
  isLocked?: boolean;
}

export const AgendaSquareCard = ({ className, isLocked = false }: AgendaSquareCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (isLocked) return;
    setModalOpen(true);
  };

  const cardContent = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("h-full", className)}
      onClick={handleClick}
    >
      <Card className={cn(
        "relative overflow-hidden h-full border transition-all duration-300 aspect-square flex flex-col items-center justify-center p-3",
        isLocked 
          ? "border-border/20 bg-muted/20 cursor-not-allowed" 
          : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm cursor-pointer"
      )}>
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}

        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
          isLocked ? "bg-muted/50" : "bg-primary/10"
        )}>
          <Calendar className={cn(
            "w-4 h-4",
            isLocked ? "text-muted-foreground/40" : "text-primary"
          )} />
        </div>
        <h3 className={cn(
          "font-semibold text-sm text-center leading-tight",
          isLocked ? "text-muted-foreground/60" : "text-foreground"
        )}>
          Agenda Estratégica
        </h3>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">
            {isLocked 
              ? "Será ativada após completar a Base Pessoal." 
              : "Organize suas tarefas e compromissos diários."
            }
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Agenda Modal */}
      <AgendaModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default AgendaSquareCard;
