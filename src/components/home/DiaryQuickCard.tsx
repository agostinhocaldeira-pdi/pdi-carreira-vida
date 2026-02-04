/**
 * DiaryQuickCard - Card do Diário com seleção de humor
 */

import { useNavigate } from "react-router-dom";
import { BookOpen, History, Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiaryQuickCardProps {
  className?: string;
}

export const DiaryQuickCard = ({ className }: DiaryQuickCardProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const handleMoodClick = (mood: string) => {
    // Navigate to diary with mood pre-selected
    navigate(`/diario?mood=${mood}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("h-full", className)}
    >
      <Card className="relative overflow-hidden h-full border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
        <div className="p-4 sm:p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Diário</h3>
                <p className="text-xs text-muted-foreground">{capitalizedDate}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary hover:text-primary/80 h-auto py-1 px-2"
              onClick={() => navigate("/diario")}
            >
              <History className="w-3 h-3 mr-1" />
              Histórico
            </Button>
          </div>

          {/* Mood Question */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-4">
              Como você está se sentindo hoje?
            </p>
            
            {/* Mood Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleMoodClick("happy")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smile className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">Feliz</span>
              </button>

              <button
                onClick={() => handleMoodClick("neutral")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Meh className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs text-muted-foreground">Neutro</span>
              </button>

              <button
                onClick={() => handleMoodClick("sad")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Frown className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground">Triste</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DiaryQuickCard;
