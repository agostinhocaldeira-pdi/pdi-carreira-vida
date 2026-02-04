/**
 * StoicReflectionModal - Modal com a reflexão estóica do dia
 * Inclui funcionalidade de registro de resposta como no ControlPanel
 */

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Feather, Save, Check, Loader2, Volume2, VolumeX } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { stoicReflections, StoicReflection } from "@/data/stoicReflections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoicReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoicReflectionModal = ({ open, onOpenChange }: StoicReflectionModalProps) => {
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

  // State for user response
  const [userResponse, setUserResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Load existing response when modal opens
  useEffect(() => {
    if (open) {
      loadExistingResponse();
      loadAudio();
    }
    return () => {
      // Cleanup audio when modal closes
      if (audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      }
    };
  }, [open, dateKey]);

  const loadExistingResponse = async () => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from('diary_entries')
        .select('stoic_response')
        .eq('user_id', session.session.user.id)
        .eq('entry_date', format(today, 'yyyy-MM-dd'))
        .maybeSingle();

      if (!error && data?.stoic_response) {
        setUserResponse(data.stoic_response);
        setIsSaved(true);
      } else {
        setUserResponse("");
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error loading reflection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAudio = async () => {
    try {
      const { data, error } = await supabase
        .from('stoic_reflection_audio')
        .select('audio_url')
        .eq('date_key', dateKey)
        .maybeSingle();

      if (!error && data?.audio_url) {
        setAudioUrl(data.audio_url);
        const audio = new Audio(data.audio_url);
        audio.onended = () => setIsPlaying(false);
        setAudioElement(audio);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const toggleAudio = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleSaveResponse = async () => {
    if (!userResponse.trim()) return;
    
    setIsSaving(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error("Você precisa estar logado para salvar.");
        return;
      }

      const entryDate = format(today, 'yyyy-MM-dd');
      
      // Check if entry exists
      const { data: existingEntry } = await supabase
        .from('diary_entries')
        .select('id')
        .eq('user_id', session.session.user.id)
        .eq('entry_date', entryDate)
        .maybeSingle();

      if (existingEntry) {
        // Update existing entry - only stoic_response field
        const { error } = await supabase
          .from('diary_entries')
          .update({ 
            stoic_response: userResponse,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id);

        if (error) throw error;
      } else {
        // Create new entry with only stoic_response
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            user_id: session.session.user.id,
            entry_date: entryDate,
            stoic_response: userResponse,
          });

        if (error) throw error;
      }

      setIsSaved(true);
      toast.success("Reflexão salva com sucesso!");
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error("Erro ao salvar reflexão.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResponseChange = useCallback((value: string) => {
    setUserResponse(value);
    if (isSaved) setIsSaved(false);
  }, [isSaved]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#1A1F2C] border-[#D4AF37]/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
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
            {audioUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className="text-[#D4AF37] hover:text-[#D4AF37]/80 hover:bg-[#D4AF37]/10"
              >
                {isPlaying ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}
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

          {/* User Response Section */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-300">
              Sua resposta à reflexão:
            </Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
              </div>
            ) : (
              <>
                <Textarea
                  value={userResponse}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder="Escreva sua reflexão aqui..."
                  className="min-h-[100px] bg-[#2A2F3C] border-[#D4AF37]/20 text-white placeholder:text-gray-500 focus:border-[#D4AF37]/50 resize-none"
                />
                <Button 
                  className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1A1F2C] font-medium disabled:opacity-50"
                  onClick={handleSaveResponse}
                  disabled={!userResponse.trim() || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Salvo
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Reflexão
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoicReflectionModal;
