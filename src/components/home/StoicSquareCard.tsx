/**
 * StoicSquareCard - Card quadrado da Reflexão Estóica para mobile
 */

import { useState } from "react";
import { Feather } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StoicReflectionModal } from "./StoicReflectionModal";

interface StoicSquareCardProps {
  className?: string;
}

export const StoicSquareCard = ({ className }: StoicSquareCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={cn("h-full", className)}
            onClick={() => setIsModalOpen(true)}
          >
            <Card className="relative overflow-hidden h-full border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-300 cursor-pointer aspect-square flex flex-col items-center justify-center p-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Feather className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground text-center leading-tight">
                Reflexão Estóica
              </h3>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">Reflexão filosófica diária para clareza mental e foco.</p>
        </TooltipContent>
      </Tooltip>

      <StoicReflectionModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};

export default StoicSquareCard;
