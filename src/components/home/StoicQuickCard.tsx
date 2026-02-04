/**
 * StoicQuickCard - Card da Reflexão Estóica
 */

import { useState } from "react";
import { Feather, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StoicReflectionModal } from "./StoicReflectionModal";

interface StoicQuickCardProps {
  className?: string;
}

export const StoicQuickCard = ({ className }: StoicQuickCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn("h-full", className)}
        onClick={() => setIsModalOpen(true)}
      >
        <Card className="relative overflow-hidden h-full border border-border/50 bg-[#1A1F2C] hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="p-4 sm:p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                <Feather className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Reflexão Estóica</h3>
                <p className="text-xs text-gray-400">{capitalizedDate}</p>
              </div>
            </div>

            {/* Quote preview - hidden on mobile */}
            <div className="flex-1 flex-col justify-center hidden sm:flex">
              <p className="text-sm text-gray-300 italic leading-relaxed mb-4">
                "Controle o tom, não só as palavras"
              </p>
            </div>
            
            {/* CTA Button */}
            <Button 
              className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1A1F2C] font-medium mt-auto"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Reflexão
            </Button>
          </div>
        </Card>
      </motion.div>

      <StoicReflectionModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};

export default StoicQuickCard;
