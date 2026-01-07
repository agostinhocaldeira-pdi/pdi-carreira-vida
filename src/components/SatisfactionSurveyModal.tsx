import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SatisfactionSurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionCompleted: string;
}

export const SatisfactionSurveyModal = ({ open, onOpenChange, sectionCompleted }: SatisfactionSurveyModalProps) => {
  const [surveyType, setSurveyType] = useState<"csat" | "ces">("csat");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // Alterna entre CSAT e CES baseado no número de pesquisas já feitas
      const surveys = JSON.parse(localStorage.getItem("satisfaction_surveys") || "[]");
      const lastSurvey = surveys[surveys.length - 1];
      setSurveyType(lastSurvey?.type === "csat" ? "ces" : "csat");
      setRating(0);
      setComment("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to Supabase database
        const { error } = await supabase
          .from('satisfaction_surveys')
          .insert({
            user_id: user.id,
            user_email: user.email,
            section: sectionCompleted,
            survey_type: surveyType,
            rating,
            feedback: comment || null,
          });

        if (error) {
          console.error("Error saving survey:", error);
          // Fall back to localStorage if database fails
          saveToLocalStorage();
        }
      } else {
        // User not logged in, save to localStorage only
        saveToLocalStorage();
      }

      // Update last survey date in localStorage
      const completedSections = JSON.parse(localStorage.getItem("completed_sections") || "{}");
      completedSections[sectionCompleted] = {
        ...completedSections[sectionCompleted],
        lastSurveyDate: new Date().toISOString()
      };
      localStorage.setItem("completed_sections", JSON.stringify(completedSections));

      toast.success("Obrigado pelo seu feedback! 🙏");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting survey:", error);
      saveToLocalStorage();
      toast.success("Obrigado pelo seu feedback! 🙏");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalStorage = () => {
    const survey = {
      id: Date.now().toString(),
      type: surveyType,
      rating,
      comment,
      section: sectionCompleted,
      date: new Date().toISOString(),
      userEmail: JSON.parse(localStorage.getItem("user") || "{}").email || "anonimo@exemplo.com"
    };

    const surveys = JSON.parse(localStorage.getItem("satisfaction_surveys") || "[]");
    surveys.push(survey);
    localStorage.setItem("satisfaction_surveys", JSON.stringify(surveys));
  };

  const csatQuestion = "Quão satisfeito você está com a funcionalidade que acabou de usar?";
  const cesQuestion = "Quão fácil foi completar esta tarefa?";
  const maxRating = surveyType === "csat" ? 5 : 7;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {surveyType === "csat" ? (
                <Star className="w-6 h-6 text-primary" />
              ) : (
                <Zap className="w-6 h-6 text-primary" />
              )}
            </div>
            <DialogTitle className="text-xl">
              {surveyType === "csat" ? "Pesquisa de Satisfação" : "Pesquisa de Esforço"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-4">
            <p className="font-semibold text-foreground mb-4">
              {surveyType === "csat" ? csatQuestion : cesQuestion}
            </p>
            <p className="text-sm text-muted-foreground">
              Seção completada: <span className="font-medium text-foreground">{sectionCompleted}</span>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Rating Scale */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    value <= (hoveredRating || rating)
                      ? "bg-primary text-primary-foreground border-primary scale-110 shadow-glow"
                      : "border-border hover:border-primary hover:scale-105"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between w-full text-xs text-muted-foreground px-2">
              <span>{surveyType === "csat" ? "Muito insatisfeito" : "Muito difícil"}</span>
              <span>{surveyType === "csat" ? "Muito satisfeito" : "Muito fácil"}</span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Comentário adicional (opcional)
            </label>
            <Textarea
              placeholder="Compartilhe sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Pular
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};