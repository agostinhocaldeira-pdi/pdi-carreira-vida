/**
 * StoicReflectionModal - Modal com a reflexão estóica do dia
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Feather, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { stoicReflections, StoicReflection } from "@/data/stoicReflections";
import { useNavigate } from "react-router-dom";

interface StoicReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoicReflectionModal = ({ open, onOpenChange }: StoicReflectionModalProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const dateKey = format(today, "MM-dd");
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Get today's reflection
  const reflection: StoicReflection = stoicReflections[dateKey] || {
    title: "Reflexão do dia",
    text: "Cada dia é uma nova oportunidade para praticar a virtude e viver com propósito.",
    question: "O que você pode fazer hoje para se tornar uma pessoa melhor?"
  };

  const handleGoToReflection = () => {
    onOpenChange(false);
    navigate("/reflexao");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1A1F2C] border-[#D4AF37]/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
              <Feather className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Reflexão Estóica
              </DialogTitle>
              <p className="text-xs text-gray-400 mt-0.5">{capitalizedDate}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <h3 className="text-[#D4AF37] font-semibold text-base">
            {reflection.title}
          </h3>

          {/* Text */}
          <p className="text-gray-300 text-sm leading-relaxed">
            {reflection.text}
          </p>

          {/* Question */}
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Pergunta para reflexão:</p>
            <p className="text-white font-medium italic">
              "{reflection.question}"
            </p>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1A1F2C] font-medium"
            onClick={handleGoToReflection}
          >
            Ir para o Diário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoicReflectionModal;
