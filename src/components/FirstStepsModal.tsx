import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const FIRST_STEPS_KEY = "pdi_first_steps_shown";
const REACTIVATION_MODAL_KEY = "pdi_reactivation_modal_shown_jan27";

export const FirstStepsModal = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState<"video" | "choice">("video");
  const navigate = useNavigate();

  useEffect(() => {
    const checkFirstAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        const hasSeenFirstStepsLocal = localStorage.getItem(FIRST_STEPS_KEY);
        if (!hasSeenFirstStepsLocal) {
          const timer = setTimeout(() => {
            setOpen(true);
          }, 500);
          return () => clearTimeout(timer);
        }
        return;
      }

      setUserId(user.id);
      
      const hasSeenReactivation = localStorage.getItem(REACTIVATION_MODAL_KEY);
      
      const [
        { data: objetivos },
        { data: metas },
        { data: valores },
        { data: areasVida },
        { data: vvd }
      ] = await Promise.all([
        supabase.from('user_objectives').select('id').eq('user_id', user.id).limit(1),
        supabase.from('user_goals').select('id').eq('user_id', user.id).limit(1),
        supabase.from('user_valores').select('valores').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_life_areas').select('id, current_score').eq('user_id', user.id),
        supabase.from('user_vvd').select('vvd_text').eq('user_id', user.id).maybeSingle()
      ]);
      
      const hasObjetivos = objetivos && objetivos.length > 0;
      const hasMetas = metas && metas.length > 0;
      const hasValores = valores?.valores && valores.valores.some((v: string) => v.trim() !== "");
      const hasCompleteAreas = areasVida && areasVida.length > 0 && 
        areasVida.some((area: any) => area.current_score !== null);
      const hasVvd = vvd?.vvd_text && vvd.vvd_text.trim() !== "";
      
      const hasUsedSystem = hasObjetivos || hasMetas || hasValores || hasCompleteAreas || hasVvd;
      
      if (hasUsedSystem) {
        localStorage.setItem(FIRST_STEPS_KEY, "true");
        return;
      }

      // Verificar no Supabase se já marcou o modal inicial como visto
      const { data: onboarding } = await supabase
        .from('user_onboarding')
        .select('current_phase')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (onboarding?.current_phase === 'first_steps_completed') {
        localStorage.setItem(FIRST_STEPS_KEY, "true");
        return;
      }
      
      // Usuário não tem dados e não completou onboarding = mostrar modal
      const userSpecificKey = `${FIRST_STEPS_KEY}_${user.id}`;
      const hasSeenForThisUser = localStorage.getItem(userSpecificKey);
      
      if (hasSeenForThisUser) {
        return;
      }
      
      console.log('New user without data, showing welcome modal');
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    };

    checkFirstAccess();
  }, []);

  const markAsCompleted = async () => {
    if (userId) {
      const userSpecificKey = `${FIRST_STEPS_KEY}_${userId}`;
      localStorage.setItem(userSpecificKey, "true");
      
      try {
        await supabase
          .from('user_onboarding')
          .upsert({
            user_id: userId,
            current_phase: 'first_steps_completed',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    }
    
    localStorage.setItem(FIRST_STEPS_KEY, "true");
  };

  const handleClose = async () => {
    await markAsCompleted();
    setOpen(false);
    setIsPlaying(false);
    setStep("video");
  };

  const handleVideoClose = () => {
    setIsPlaying(false);
    setStep("choice");
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleStartBasePessoal = async () => {
    await markAsCompleted();
    setOpen(false);
    navigate("/plano-vida/quem-sou");
  };

  const handleStayHome = async () => {
    await markAsCompleted();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent 
        className="sm:max-w-[560px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-[#1A1A1A] border border-[#D4AF37]/40 shadow-2xl"
        hideCloseButton
      >
        {step === "video" ? (
          <>
            {/* Header with Title */}
            <div className="pt-6 pb-4 px-4 sm:px-6 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Recado Importante (não pule)
              </h2>
            </div>

            {/* Video Container */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <AspectRatio ratio={16 / 9}>
                  {isPlaying ? (
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/BkXG8snq6Pw?autoplay=1&rel=0&modestbranding=1"
                      title="Recado Importante"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <img 
                        src="https://img.youtube.com/vi/BkXG8snq6Pw/maxresdefault.jpg"
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Button
                          onClick={handlePlayVideo}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] shadow-lg"
                        >
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </AspectRatio>
              </div>
            </div>

            {/* Footer with Continue Button */}
            <div className="px-4 sm:px-6 pb-6 flex justify-center">
              <Button 
                variant="ghost"
                onClick={handleVideoClose} 
                className="text-white/40 hover:text-white/60 hover:bg-white/5 font-normal text-sm gap-2"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Choice Step */}
            <div className="pt-8 pb-4 px-4 sm:px-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Vamos organizar sua vida
              </h2>
              <p className="text-white/60 text-sm sm:text-base">
                Escolha como deseja iniciar sua jornada no PDI
              </p>
            </div>

            <div className="px-4 sm:px-6 pb-8 space-y-4">
              {/* Option 1: Base Pessoal */}
              <Button
                onClick={handleStartBasePessoal}
                className="w-full py-6 bg-gradient-to-r from-[#D4AF37] to-[#C9A431] hover:from-[#C9A431] hover:to-[#B8942D] text-[#1A1A1A] font-semibold text-base sm:text-lg rounded-xl shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5" />
                  <span>Iniciar Base Pessoal</span>
                </div>
              </Button>
              
              <p className="text-center text-white/40 text-xs">
                Você não precisa saber tudo agora. O sistema te guia
              </p>

              {/* Option 2: Home */}
              <Button
                onClick={handleStayHome}
                variant="outline"
                className="w-full py-5 border-white/20 bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-normal text-sm sm:text-base rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4" />
                  <span>Explorar a Home primeiro</span>
                </div>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
