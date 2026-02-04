/**
 * AgendaLockedCard - Card da Agenda bloqueada (modo iniciação)
 */

import { Calendar, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AgendaLockedCardProps {
  className?: string;
}

export const AgendaLockedCard = ({ className }: AgendaLockedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("h-full", className)}
    >
      <Card className="relative overflow-hidden h-full border border-border/20 bg-muted/20">
        <div className="p-4 sm:p-5 h-full flex flex-col items-center justify-center text-center min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <h3 className="font-semibold text-muted-foreground/60 mb-1">Agenda Estratégica</h3>
          <p className="text-xs text-muted-foreground/40 max-w-[200px] leading-relaxed">
            O módulo de Agenda Estratégica será ativado assim que sua Base Pessoal estiver definida.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground/30">
            <Lock className="w-3 h-3" />
            <span className="text-[10px]">Bloqueado</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AgendaLockedCard;
