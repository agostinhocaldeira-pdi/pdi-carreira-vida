/**
 * AgendaSquareCard - Card quadrado da Agenda Estratégica para mobile
 * Abre um modal com a agenda ao invés de navegar para o painel
 */

import { useState } from "react";
import { Calendar, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AgendaModal } from "./AgendaModal";

interface AgendaSquareCardProps {
  className?: string;
  isLocked?: boolean;
}

export const AgendaSquareCard = ({ className, isLocked = false }: AgendaSquareCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showLockedDialog, setShowLockedDialog] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      setShowLockedDialog(true);
      return;
    }
    setModalOpen(true);
  };

  const cardContent = (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("h-full", className)}
      onClick={handleClick}
    >
      <Card className="relative overflow-hidden h-full border transition-all duration-300 aspect-square flex flex-col items-center justify-center p-3 border-border/50 bg-card hover:border-primary/30 hover:shadow-sm cursor-pointer">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-primary/10">
          <Calendar className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-sm text-center leading-tight text-foreground">
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
            Organize suas tarefas e compromissos diários.
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Agenda Modal */}
      <AgendaModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Locked Dialog */}
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

export default AgendaSquareCard;
