/**
 * AIMentorFAB - Botão Flutuante do Mentor IA (Análise Estratégica)
 * Exibe um FAB no canto inferior direito para acessar o insight do dia
 */

import { useState } from "react";
import { Sparkles, X, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerClose 
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InsightAudioButton } from "@/components/home/InsightAudioButton";
import { cn } from "@/lib/utils";

interface AIMentorFABProps {
  insight: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
}

export const AIMentorFAB = ({ 
  insight, 
  isGenerating, 
  onGenerate,
  canGenerate 
}: AIMentorFABProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasInsight = !!insight;

  return (
    <>
      {/* Floating Action Button - Positioned above the "+" button on mobile */}
      {/* Container with static glow ring when insight is available */}
      <div 
        className={cn(
          "fixed z-50 bottom-24 right-4 sm:bottom-6 sm:right-6",
          hasInsight && "before:absolute before:inset-0 before:rounded-full before:bg-[#D4AF37]/30 before:blur-md before:-z-10"
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-14 h-14 rounded-full shadow-xl transition-all duration-300",
            "bg-gradient-to-br from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#D4AF37]",
            "text-black border-2 border-[#D4AF37]/50",
            "hover:scale-110 hover:shadow-2xl",
            // Subtle ring glow when insight is ready (no animation)
            hasInsight && "ring-4 ring-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          )}
          size="icon"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>

      {/* Drawer/Modal */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="border-b border-border pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">
                    Análise Estratégica
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground">
                    Seu mentor de desenvolvimento pessoal
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Analisando seu perfil...
                </p>
              </div>
            ) : insight ? (
              <div className="space-y-4">
                {/* Audio button */}
                <div className="flex justify-end">
                  <InsightAudioButton insight={insight} />
                </div>
                
                {/* Insight text */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 border border-[#D4AF37]/20">
                    {insight.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-sm leading-relaxed text-foreground mb-3 last:mb-0">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
                
                {/* Regenerate option */}
                {canGenerate && (
                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onGenerate}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Nova Análise
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    Análise do Dia
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Receba uma análise personalizada baseada no seu perfil, 
                    valores e objetivos de vida.
                  </p>
                </div>
                <Button 
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:from-[#E5C158] hover:to-[#D4AF37]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Análise Estratégica
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AIMentorFAB;
