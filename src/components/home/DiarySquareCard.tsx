/**
 * DiarySquareCard - Card quadrado do Diário para mobile
 */

import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DiarySquareCardProps {
  className?: string;
}

export const DiarySquareCard = ({ className }: DiarySquareCardProps) => {
  const navigate = useNavigate();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn("h-full", className)}
          onClick={() => navigate("/diario")}
        >
          <Card className="relative overflow-hidden h-full border border-border/50 bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-300 cursor-pointer aspect-square flex flex-col items-center justify-center p-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground text-center leading-tight">
              Diário
            </h3>
          </Card>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-sm">Registre seus pensamentos, humor e conquistas diárias.</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DiarySquareCard;
