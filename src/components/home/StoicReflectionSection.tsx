import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";
import { getTodayReflection } from "@/data/stoicReflections";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const StoicReflectionSection = () => {
  const [response, setResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { date, reflection } = getTodayReflection();
  const formattedDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Load existing response
  useEffect(() => {
    const loadResponse = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const today = format(date, "yyyy-MM-dd");
      const { data } = await supabase
        .from("user_stoic_reflections")
        .select("response, updated_at")
        .eq("user_id", session.user.id)
        .eq("reflection_date", today)
        .maybeSingle();

      if (data) {
        setResponse(data.response || "");
        setLastSaved(new Date(data.updated_at));
      }
    };
    loadResponse();
  }, [date]);

  // Auto-save with debounce
  useEffect(() => {
    if (!response) return;
    
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setIsSaving(true);
      const today = format(date, "yyyy-MM-dd");
      
      await supabase
        .from("user_stoic_reflections")
        .upsert({
          user_id: session.user.id,
          reflection_date: today,
          response: response,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,reflection_date" });

      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [response, date]);

  return (
    <Card className="shadow-medium border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Filosofia Estóica em Ação
          </CardTitle>
          <Badge variant="secondary" className="gap-1.5">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{capitalizedDate}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-primary">
          "{reflection.title}"
        </h3>

        {/* Reflection Text */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {reflection.text}
        </p>

        {/* Question Card */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm sm:text-base font-medium text-foreground">
              💭 {reflection.question}
            </p>
          </CardContent>
        </Card>

        {/* Response Field */}
        <div className="space-y-2">
          <Textarea
            placeholder="Escreva sua reflexão aqui..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            {isSaving && <span>Salvando...</span>}
            {lastSaved && !isSaving && (
              <span>Salvo às {format(lastSaved, "HH:mm")}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoicReflectionSection;
