/**
 * AgendaLockedCard - Card da Agenda (modo iniciação - aparece normal mas com popup)
 */

import { useState } from "react";
import { Calendar, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgendaLockedCardProps {
  className?: string;
}

export const AgendaLockedCard = ({ className }: AgendaLockedCardProps) => {
  const [showLockedDialog, setShowLockedDialog] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn("h-full cursor-pointer", className)}
        onClick={() => setShowLockedDialog(true)}
      >
        <Card className="relative overflow-hidden h-full border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-300">
          <div className="p-4 sm:p-5 h-full flex flex-col items-center justify-center text-center min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Agenda Estratégica</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
              Organize suas tarefas e compromissos diários.
            </p>
          </div>
        </Card>
      </motion.div>

      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Acesso Restrito
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              O módulo de Agenda Estratégica será ativado assim que sua Base Pessoal estiver definida.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowLockedDialog(false)}>
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgendaLockedCard;
