import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { BookOpen, Calendar as CalendarIcon, Save, Check, ChevronDown, PenLine, History, Loader2, Smile, Frown, Meh } from "lucide-react";
import { getTodayReflection } from "@/data/stoicReflections";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type DiaryViewMode = "registro" | "historico";

const StoicReflectionSection = () => {
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

  // Diary state
  const { getDiario, saveDiarioEntry } = usePDIStorage();
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryViewMode, setDiaryViewMode] = useState<DiaryViewMode>("registro");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoadingDiary, setIsLoadingDiary] = useState(false);
  const [isSavingDiary, setIsSavingDiary] = useState(false);
  const [diaryEntry, setDiaryEntry] = useState({
    humor: "",
    reflexoes: "",
    avancos: "",
    habitos: "",
    gratidao: "",
    data: new Date().toISOString().split("T")[0],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30dias");
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);

  // Verificar se a data selecionada é hoje
  const isToday = useMemo(() => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return (
      today.getFullYear() === selected.getFullYear() &&
      today.getMonth() === selected.getMonth() &&
      today.getDate() === selected.getDate()
    );
  }, [selectedDate]);

  // Verificar se todos os campos estão preenchidos
  const isFormComplete = useMemo(() => {
    return !!(
      diaryEntry.humor &&
      diaryEntry.reflexoes.trim() &&
      diaryEntry.avancos.trim() &&
      diaryEntry.habitos.trim() &&
      diaryEntry.gratidao.trim()
    );
  }, [diaryEntry]);

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

  // Load diary entries
  const loadDiaryEntries = useCallback(async () => {
    setIsLoadingDiary(true);
    try {
      const data = await getDiario();
      const normalized = data.map((entry: any) => ({
        id: entry.id,
        data: entry.data,
        humor: entry.humor,
        reflexoes: entry.reflexao || entry.reflexoes || '',
        avancos: entry.conquistas || entry.avancos || '',
        habitos: Array.isArray(entry.habitos) ? entry.habitos.join(', ') : entry.habitos || '',
        gratidao: entry.gratidao || '',
      }));
      setDiaryEntries(normalized);
    } catch (error) {
      console.error('Error loading diary entries:', error);
      const stored = JSON.parse(localStorage.getItem("diario") || "[]");
      setDiaryEntries(stored);
    } finally {
      setIsLoadingDiary(false);
    }
  }, [getDiario]);

  useEffect(() => {
    loadDiaryEntries();
  }, [loadDiaryEntries]);

  // Load entry for selected date
  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const existingEntry = diaryEntries.find((e) => e.data === dateStr);
    
    if (existingEntry) {
      setDiaryEntry({
        humor: existingEntry.humor || "",
        reflexoes: existingEntry.reflexoes || "",
        avancos: existingEntry.avancos || "",
        habitos: existingEntry.habitos || "",
        gratidao: existingEntry.gratidao || "",
        data: dateStr,
      });
    } else {
      setDiaryEntry({
        humor: "",
        reflexoes: "",
        avancos: "",
        habitos: "",
        gratidao: "",
        data: dateStr,
      });
    }
  }, [selectedDate, diaryEntries]);

  // Reset to today when switching to registro mode
  useEffect(() => {
    if (diaryViewMode === "registro") {
      setSelectedDate(new Date());
    }
  }, [diaryViewMode]);

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

  const handleSaveDiary = async () => {
    setIsSavingDiary(true);
    try {
      const entryToSave = {
        id: diaryEntry.data,
        data: diaryEntry.data,
        humor: diaryEntry.humor,
        reflexao: diaryEntry.reflexoes,
        conquistas: diaryEntry.avancos,
        habitos: diaryEntry.habitos.split(',').map(h => h.trim()).filter(Boolean),
        gratidao: diaryEntry.gratidao,
      };
      
      await saveDiarioEntry(entryToSave as any);
      
      const existingIndex = diaryEntries.findIndex((e) => e.data === diaryEntry.data);
      const updatedEntries = [...diaryEntries];
      
      if (existingIndex >= 0) {
        updatedEntries[existingIndex] = { ...updatedEntries[existingIndex], ...diaryEntry };
        celebrateAction('diary', 'Registro no Diário');
        sonnerToast.success("Entrada do diário atualizada!");
      } else {
        updatedEntries.push({ ...diaryEntry, id: Date.now() });
        celebrateAction('diary', 'Registro no Diário');
        sonnerToast.success("Entrada do diário salva!");
        
        if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
          (window as any).markSectionCompleted("Diário");
        }
      }
      
      setDiaryEntries(updatedEntries);
      localStorage.setItem("diario", JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving diary entry:', error);
      sonnerToast.error("Erro ao salvar entrada");
    } finally {
      setIsSavingDiary(false);
    }
  };

  const periodOptions = [
    { value: "30dias", label: "30 dias" },
    { value: "trimestre", label: "Trimestre" },
    { value: "semestre", label: "Semestre" },
    { value: "ano", label: "Ano" },
  ];

  const chartData = useMemo(() => {
    const now = new Date();
    let numDays = 30;
    
    if (selectedPeriod === "30dias") numDays = 30;
    else if (selectedPeriod === "trimestre") numDays = 90;
    else if (selectedPeriod === "semestre") numDays = 180;
    else if (selectedPeriod === "ano") numDays = 365;
    
    if (selectedPeriod === "30dias") {
      const data = [];
      for (let i = numDays - 1; i >= 0; i--) {
        const dateItem = new Date(now);
        dateItem.setDate(dateItem.getDate() - i);
        const dateStr = dateItem.toISOString().split("T")[0];
        const entry = diaryEntries.find((e) => e.data === dateStr);
        
        let humorValue = null;
        if (entry) {
          if (entry.humor === "feliz") humorValue = 3;
          else if (entry.humor === "neutro") humorValue = 2;
          else if (entry.humor === "triste") humorValue = 1;
        }
        
        data.push({
          dia: dateItem.getDate(),
          data: dateStr,
          humor: humorValue,
          entry: entry || null,
        });
      }
      return data;
    }
    
    const data = [];
    const numWeeks = Math.ceil(numDays / 7);
    
    for (let weekIndex = numWeeks - 1; weekIndex >= 0; weekIndex--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (weekIndex * 7) - 6);
      
      const weekEntries = [];
      for (let i = 0; i < 7; i++) {
        const dateItem = new Date(weekStart);
        dateItem.setDate(dateItem.getDate() + i);
        const dateStr = dateItem.toISOString().split("T")[0];
        const entry = diaryEntries.find((e) => e.data === dateStr);
        if (entry) weekEntries.push(entry);
      }
      
      const total = weekEntries.length;
      const felizCount = weekEntries.filter(e => e.humor === "feliz").length;
      const neutroCount = weekEntries.filter(e => e.humor === "neutro").length;
      const tristeCount = weekEntries.filter(e => e.humor === "triste").length;
      
      data.push({
        semana: `Sem ${numWeeks - weekIndex}`,
        feliz: total > 0 ? Math.round((felizCount / total) * 100) : null,
        neutro: total > 0 ? Math.round((neutroCount / total) * 100) : null,
        triste: total > 0 ? Math.round((tristeCount / total) * 100) : null,
        entries: weekEntries,
      });
    }
    return data;
  }, [diaryEntries, selectedPeriod]);

  const selectedHistoryEntry = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return diaryEntries.find((e) => e.data === dateStr);
  }, [selectedDate, diaryEntries]);

  const datesWithEntries = useMemo(() => {
    return diaryEntries.map((e) => new Date(e.data + "T12:00:00"));
  }, [diaryEntries]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      
      if (data.entry) {
        const entry = data.entry;
        return (
          <Card className="w-[300px] shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {new Date(entry.data).toLocaleDateString("pt-BR", { 
                  day: "2-digit", 
                  month: "long", 
                  year: "numeric" 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3 text-sm">
                  {entry.reflexoes && (
                    <div>
                      <p className="font-semibold text-primary">Reflexões:</p>
                      <p className="text-muted-foreground">{entry.reflexoes}</p>
                    </div>
                  )}
                  {entry.avancos && (
                    <div>
                      <p className="font-semibold text-primary">Avanços e Conquistas:</p>
                      <p className="text-muted-foreground">{entry.avancos}</p>
                    </div>
                  )}
                  {entry.habitos && (
                    <div>
                      <p className="font-semibold text-primary">Hábitos Realizados:</p>
                      <p className="text-muted-foreground">{entry.habitos}</p>
                    </div>
                  )}
                  {entry.gratidao && (
                    <div>
                      <p className="font-semibold text-primary">Gratidão:</p>
                      <p className="text-muted-foreground">{entry.gratidao}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      }
      
      if (data.entries) {
        return (
          <Card className="w-[250px] shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{data.semana}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                {data.feliz !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-primary">😊 Feliz:</span>
                    <span className="font-semibold">{data.feliz}%</span>
                  </div>
                )}
                {data.neutro !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">😐 Neutro:</span>
                    <span className="font-semibold">{data.neutro}%</span>
                  </div>
                )}
                {data.triste !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-destructive">😔 Triste:</span>
                    <span className="font-semibold">{data.triste}%</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {data.entries.length} {data.entries.length === 1 ? 'registro' : 'registros'}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      }
    }
    return null;
  };

  return (
    <Card className="shadow-medium border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            "{reflection.title}"
          </CardTitle>
          <Badge variant="secondary" className="gap-1.5">
            <CalendarIcon className="w-3 h-3" />
            <span className="text-xs">{capitalizedDate}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="space-y-3">
          <Textarea
            placeholder="Escreva sua reflexão aqui..."
            value={stoicResponse}
            onChange={(e) => setStoicResponse(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-end">
            <Button
              onClick={handleSaveStoic}
              disabled={!canSaveStoic || isSavingStoic}
              className="gap-2"
            >
              {isSavingStoic ? (
                <>Salvando...</>
              ) : isStoicSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Salvo
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Diary Section - Collapsible */}
        <Collapsible open={isDiaryOpen} onOpenChange={setIsDiaryOpen}>
          <div className="border-t border-primary/20 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-primary" />
                  Diário
                </h3>
                <p className="text-sm text-muted-foreground">
                  Registre seu dia: {new Date().toLocaleDateString("pt-BR", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm min-w-[44px] border border-border"
                >
                  {!isDiaryOpen && (
                    <span className="text-xs font-medium">Abrir</span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDiaryOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="pt-4">
            {/* Toggle de Modo */}
            <div className="pb-4">
              <div className="flex rounded-lg bg-muted p-1 gap-1">
                <Button
                  variant={diaryViewMode === "registro" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-1 gap-2 transition-all",
                    diaryViewMode === "registro" 
                      ? "shadow-sm" 
                      : "hover:bg-background/50"
                  )}
                  onClick={() => setDiaryViewMode("registro")}
                >
                  <PenLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Registro de Hoje</span>
                  <span className="sm:hidden">Registro</span>
                </Button>
                <Button
                  variant={diaryViewMode === "historico" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-1 gap-2 transition-all",
                    diaryViewMode === "historico" 
                      ? "shadow-sm" 
                      : "hover:bg-background/50"
                  )}
                  onClick={() => setDiaryViewMode("historico")}
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Histórico</span>
                  <span className="sm:hidden">Histórico</span>
                </Button>
              </div>
            </div>

            {isLoadingDiary ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : diaryViewMode === "registro" ? (
              /* Registro View */
              <div className="space-y-4">
                {/* Humor */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    Como você está se sentindo hoje?
                    {diaryEntry.humor && <span className="text-xs text-muted-foreground">(selecionado)</span>}
                  </Label>
                  <RadioGroup
                    value={diaryEntry.humor}
                    onValueChange={(value) => setDiaryEntry((prev) => ({ ...prev, humor: value }))}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                      <div className={cn(
                        "rounded-full p-2 sm:p-3 transition-all",
                        diaryEntry.humor === "feliz" 
                          ? "bg-primary/20 ring-2 ring-primary" 
                          : "bg-muted hover:bg-primary/10"
                      )}>
                        <RadioGroupItem value="feliz" id="feliz" className="sr-only" />
                        <label htmlFor="feliz" className="cursor-pointer">
                          <Smile className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 transition-colors",
                            diaryEntry.humor === "feliz" ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                          )} />
                        </label>
                      </div>
                      <span className="text-xs font-medium">Feliz</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                      <div className={cn(
                        "rounded-full p-2 sm:p-3 transition-all",
                        diaryEntry.humor === "neutro" 
                          ? "bg-primary/20 ring-2 ring-primary" 
                          : "bg-muted hover:bg-primary/10"
                      )}>
                        <RadioGroupItem value="neutro" id="neutro" className="sr-only" />
                        <label htmlFor="neutro" className="cursor-pointer">
                          <Meh className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 transition-colors",
                            diaryEntry.humor === "neutro" ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                          )} />
                        </label>
                      </div>
                      <span className="text-xs font-medium">Neutro</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                      <div className={cn(
                        "rounded-full p-2 sm:p-3 transition-all",
                        diaryEntry.humor === "triste" 
                          ? "bg-primary/20 ring-2 ring-primary" 
                          : "bg-muted hover:bg-primary/10"
                      )}>
                        <RadioGroupItem value="triste" id="triste" className="sr-only" />
                        <label htmlFor="triste" className="cursor-pointer">
                          <Frown className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 transition-colors",
                            diaryEntry.humor === "triste" ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                          )} />
                        </label>
                      </div>
                      <span className="text-xs font-medium">Triste</span>
                    </div>
                  </RadioGroup>
                </div>

                {/* Reflexões */}
                <div className="space-y-2">
                  <Label htmlFor="reflexoes" className="font-semibold">Reflexões do dia</Label>
                  <Textarea
                    id="reflexoes"
                    placeholder="O que está em sua mente hoje? Como foi seu dia?"
                    value={diaryEntry.reflexoes}
                    onChange={(e) => setDiaryEntry((prev) => ({ ...prev, reflexoes: e.target.value }))}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* Avanços e Conquistas */}
                <div className="space-y-2">
                  <Label htmlFor="avancos" className="font-semibold">Avanços e Conquistas</Label>
                  <Textarea
                    id="avancos"
                    placeholder="Quais foram suas pequenas ou grandes vitórias hoje?"
                    value={diaryEntry.avancos}
                    onChange={(e) => setDiaryEntry((prev) => ({ ...prev, avancos: e.target.value }))}
                    className="min-h-[60px] resize-none"
                  />
                </div>

                {/* Hábitos Realizados */}
                <div className="space-y-2">
                  <Label htmlFor="habitos" className="font-semibold">Hábitos Realizados</Label>
                  <Textarea
                    id="habitos"
                    placeholder="Quais hábitos positivos você praticou hoje? (ex: exercício, leitura, meditação)"
                    value={diaryEntry.habitos}
                    onChange={(e) => setDiaryEntry((prev) => ({ ...prev, habitos: e.target.value }))}
                    className="min-h-[60px] resize-none"
                  />
                </div>

                {/* Gratidão */}
                <div className="space-y-2">
                  <Label htmlFor="gratidao" className="font-semibold">Gratidão</Label>
                  <Textarea
                    id="gratidao"
                    placeholder="Pelo que você é grato hoje?"
                    value={diaryEntry.gratidao}
                    onChange={(e) => setDiaryEntry((prev) => ({ ...prev, gratidao: e.target.value }))}
                    className="min-h-[60px] resize-none"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {isFormComplete && (
                      <Badge variant="secondary" className="gap-1">
                        <Check className="w-3 h-3" />
                        Completo
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={handleSaveDiary} 
                    disabled={!diaryEntry.humor || isSavingDiary}
                    className="gap-2"
                  >
                    {isSavingDiary ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar Registro
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Histórico View */
              <div className="space-y-6">
                {/* Calendar and Entry Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      Selecione uma data
                    </h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ptBR}
                      modifiers={{
                        hasEntry: datesWithEntries
                      }}
                      modifiersStyles={{
                        hasEntry: {
                          backgroundColor: "hsl(var(--primary) / 0.2)",
                          borderRadius: "50%"
                        }
                      }}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Entry Details */}
                  <div>
                    <h4 className="font-semibold mb-3">
                      {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </h4>
                    {selectedHistoryEntry ? (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Humor:</span>
                          {selectedHistoryEntry.humor === "feliz" && <Smile className="w-5 h-5 text-primary" />}
                          {selectedHistoryEntry.humor === "neutro" && <Meh className="w-5 h-5 text-muted-foreground" />}
                          {selectedHistoryEntry.humor === "triste" && <Frown className="w-5 h-5 text-destructive" />}
                        </div>
                        {selectedHistoryEntry.reflexoes && (
                          <div>
                            <p className="font-medium text-sm">Reflexões:</p>
                            <p className="text-sm text-muted-foreground">{selectedHistoryEntry.reflexoes}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.avancos && (
                          <div>
                            <p className="font-medium text-sm">Avanços:</p>
                            <p className="text-sm text-muted-foreground">{selectedHistoryEntry.avancos}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.habitos && (
                          <div>
                            <p className="font-medium text-sm">Hábitos:</p>
                            <p className="text-sm text-muted-foreground">{selectedHistoryEntry.habitos}</p>
                          </div>
                        )}
                        {selectedHistoryEntry.gratidao && (
                          <div>
                            <p className="font-medium text-sm">Gratidão:</p>
                            <p className="text-sm text-muted-foreground">{selectedHistoryEntry.gratidao}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 rounded-lg text-center text-muted-foreground">
                        Nenhum registro para esta data
                      </div>
                    )}
                  </div>
                </div>

                {/* Mood Chart */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Tendência de Humor</h4>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey={selectedPeriod === "30dias" ? "dia" : "semana"} 
                          tick={{ fontSize: 12 }}
                          className="text-muted-foreground"
                        />
                        <YAxis 
                          domain={[0, 4]}
                          ticks={[1, 2, 3]}
                          tickFormatter={(value) => {
                            if (value === 1) return "😔";
                            if (value === 2) return "😐";
                            if (value === 3) return "😊";
                            return "";
                          }}
                          tick={{ fontSize: 14 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {selectedPeriod === "30dias" ? (
                          <Line 
                            type="monotone" 
                            dataKey="humor" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                            connectNulls
                          />
                        ) : (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey="feliz" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                              connectNulls
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default StoicReflectionSection;
