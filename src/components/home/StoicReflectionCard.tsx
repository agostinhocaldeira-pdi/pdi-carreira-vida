import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar as CalendarIcon } from "lucide-react";
import StoicInteractiveExperience from "./StoicInteractiveExperience";
import { getTodayReflection } from "@/data/stoicReflections";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";

const StoicReflectionCard = () => {
  const [stoicResponse, setStoicResponse] = useState("");
  const [originalStoicResponse, setOriginalStoicResponse] = useState("");
  const [isSavingStoic, setIsSavingStoic] = useState(false);
  const [isStoicSaved, setIsStoicSaved] = useState(false);
  const { celebrateAction } = useActionCelebration();
  
  const { date, reflection } = getTodayReflection();
  const formattedDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const hasStoicChanges = stoicResponse.trim() !== originalStoicResponse.trim();
  const canSaveStoic = stoicResponse.trim().length > 0 && hasStoicChanges;

  // Load existing stoic response
  useEffect(() => {
    const loadStoicResponse = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const today = format(date, "yyyy-MM-dd");
      const { data } = await supabase
        .from("user_stoic_reflections")
        .select("response")
        .eq("user_id", session.user.id)
        .eq("reflection_date", today)
        .maybeSingle();

      if (data) {
        setStoicResponse(data.response || "");
        setOriginalStoicResponse(data.response || "");
      }
    };
    loadStoicResponse();
  }, [date]);

  const handleSaveStoic = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    setIsSavingStoic(true);
    const today = format(date, "yyyy-MM-dd");
    
    const { error } = await supabase
      .from("user_stoic_reflections")
      .upsert({
        user_id: session.user.id,
        reflection_date: today,
        response: stoicResponse,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,reflection_date" });

    setIsSavingStoic(false);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar sua reflexão.",
        variant: "destructive"
      });
    } else {
      setOriginalStoicResponse(stoicResponse);
      setIsStoicSaved(true);
      setTimeout(() => setIsStoicSaved(false), 2000);
      celebrateAction('stoic_reflection', 'Reflexão Estóica');
      toast({
        title: "Reflexão salva",
        description: "Sua reflexão foi salva com sucesso."
      });
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg">Reflexão Estóica do Dia</CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1.5 hidden sm:flex">
            <CalendarIcon className="w-3 h-3" />
            <span className="text-xs">{capitalizedDate}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <StoicInteractiveExperience
          reflection={reflection}
          date={date}
          stoicResponse={stoicResponse}
          onStoicResponseChange={setStoicResponse}
          onSave={handleSaveStoic}
          isSaving={isSavingStoic}
          canSave={canSaveStoic}
        />
      </CardContent>
    </Card>
  );
};

export default StoicReflectionCard;
