import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Book, Smile, Frown, Meh, ChevronDown, PenLine, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";

type ViewMode = "registro" | "historico";

const DiarioSection = () => {
  const { getDiario, getDiarioByDate, saveDiarioEntry, isAuthenticated } = usePDIStorage();
  const { celebrateAction } = useActionCelebration();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("registro");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [entrada, setEntrada] = useState({
    humor: "",
    reflexoes: "",
    avancos: "",
    habitos: "",
    gratidao: "",
    data: new Date().toISOString().split("T")[0],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30dias");
  const [entradas, setEntradas] = useState<any[]>([]);

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
      entrada.humor &&
      entrada.reflexoes.trim() &&
      entrada.avancos.trim() &&
      entrada.habitos.trim() &&
      entrada.gratidao.trim()
    );
  }, [entrada]);

  // Carregar entradas do diário
  const loadEntradas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDiario();
      // Normalizar dados para formato esperado
      const normalized = data.map((entry: any) => ({
        id: entry.id,
        data: entry.data,
        humor: entry.humor,
        reflexoes: entry.reflexao || entry.reflexoes || '',
        avancos: entry.conquistas || entry.avancos || '',
        habitos: Array.isArray(entry.habitos) ? entry.habitos.join(', ') : entry.habitos || '',
        gratidao: entry.gratidao || '',
      }));
      setEntradas(normalized);
    } catch (error) {
      console.error('Error loading diary entries:', error);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem("diario") || "[]");
      setEntradas(stored);
    } finally {
      setIsLoading(false);
    }
  }, [getDiario]);

  useEffect(() => {
    loadEntradas();
  }, [loadEntradas]);

  // Carregar entrada da data selecionada
  useEffect(() => {
    const loadEntryForDate = async () => {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const existingEntry = entradas.find((e) => e.data === dateStr);
      
      if (existingEntry) {
        setEntrada({
          humor: existingEntry.humor || "",
          reflexoes: existingEntry.reflexoes || "",
          avancos: existingEntry.avancos || "",
          habitos: existingEntry.habitos || "",
          gratidao: existingEntry.gratidao || "",
          data: dateStr,
        });
      } else {
        setEntrada({
          humor: "",
          reflexoes: "",
          avancos: "",
          habitos: "",
          gratidao: "",
          data: dateStr,
        });
      }
    };
    loadEntryForDate();
  }, [selectedDate, entradas]);

  // Reset para hoje ao mudar para modo registro
  useEffect(() => {
    if (viewMode === "registro") {
      setSelectedDate(new Date());
    }
  }, [viewMode]);

  const generateMockData = () => {
    const mockEntradas = [];
    const now = new Date();
    const humores = ["feliz", "neutro", "triste"];
    const reflexoesExemplos = [
      "Hoje foi um dia produtivo, consegui avançar bastante nos meus objetivos.",
      "Refleti sobre minhas escolhas e percebi que estou no caminho certo.",
      "Aprendi uma lição importante sobre paciência e perseverança.",
      "Sinto que estou crescendo a cada dia, mesmo nos desafios.",
    ];
    const avancosExemplos = [
      "Completei 3 tarefas importantes do meu PDI.",
      "Consegui manter o foco durante todo o dia.",
      "Avancei significativamente no meu projeto principal.",
      "Superei um obstáculo que me bloqueava há dias.",
    ];
    const habitosExemplos = [
      "Meditação, exercício físico, leitura",
      "Caminhada matinal, diário, estudo",
      "Yoga, alimentação saudável, networking",
      "Exercício, planejamento do dia, gratidão",
    ];
    const gratidaoExemplos = [
      "Grato pela saúde e pela família que me apoia.",
      "Agradeço pelas oportunidades que surgiram hoje.",
      "Grato pelo aprendizado constante e crescimento.",
      "Agradeço pela paz e equilíbrio na minha vida.",
    ];

    // Gerar entradas para os últimos 365 dias
    for (let i = 0; i < 365; i++) {
      // Pular alguns dias aleatoriamente para simular realidade
      if (Math.random() > 0.7) continue;

      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Distribuição de humor com tendência positiva
      const rand = Math.random();
      let humor;
      if (rand < 0.5) humor = "feliz";
      else if (rand < 0.8) humor = "neutro";
      else humor = "triste";

      mockEntradas.push({
        id: Date.now() + i,
        data: dateStr,
        humor,
        reflexoes: reflexoesExemplos[Math.floor(Math.random() * reflexoesExemplos.length)],
        avancos: avancosExemplos[Math.floor(Math.random() * avancosExemplos.length)],
        habitos: habitosExemplos[Math.floor(Math.random() * habitosExemplos.length)],
        gratidao: gratidaoExemplos[Math.floor(Math.random() * gratidaoExemplos.length)],
      });
    }

    localStorage.setItem("diario", JSON.stringify(mockEntradas));
    setEntradas(mockEntradas);
    toast.success("Dados mockados gerados com sucesso! (365 dias)");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const entryToSave = {
        id: entrada.data,
        data: entrada.data,
        humor: entrada.humor,
        reflexao: entrada.reflexoes,
        conquistas: entrada.avancos,
        habitos: entrada.habitos.split(',').map(h => h.trim()).filter(Boolean),
        gratidao: entrada.gratidao,
      };
      
      await saveDiarioEntry(entryToSave as any);
      
      // Atualizar lista local
      const existingIndex = entradas.findIndex((e) => e.data === entrada.data);
      const updatedEntradas = [...entradas];
      
      if (existingIndex >= 0) {
        updatedEntradas[existingIndex] = { ...updatedEntradas[existingIndex], ...entrada };
        celebrateAction('diary', 'Registro no Diário');
        toast.success("Entrada do diário atualizada!");
      } else {
        updatedEntradas.push({ ...entrada, id: Date.now() });
        celebrateAction('diary', 'Registro no Diário');
        toast.success("Entrada do diário salva!");
        
        if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
          (window as any).markSectionCompleted("Diário");
        }
      }
      
      setEntradas(updatedEntradas);
      
      // Também salvar em localStorage como backup
      localStorage.setItem("diario", JSON.stringify(updatedEntradas));
    } catch (error) {
      console.error('Error saving diary entry:', error);
      toast.error("Erro ao salvar entrada");
    } finally {
      setIsSaving(false);
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
    
    // Para 30 dias, mantém visualização diária
    if (selectedPeriod === "30dias") {
      const data = [];
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const entry = entradas.find((e) => e.data === dateStr);
        
        let humorValue = null;
        if (entry) {
          if (entry.humor === "feliz") humorValue = 3;
          else if (entry.humor === "neutro") humorValue = 2;
          else if (entry.humor === "triste") humorValue = 1;
        }
        
        data.push({
          dia: date.getDate(),
          data: dateStr,
          humor: humorValue,
          entry: entry || null,
        });
      }
      return data;
    }
    
    // Para períodos maiores, agrupa por semana
    const data = [];
    const numWeeks = Math.ceil(numDays / 7);
    
    for (let weekIndex = numWeeks - 1; weekIndex >= 0; weekIndex--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (weekIndex * 7) - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (weekIndex * 7));
      
      const weekEntries = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const entry = entradas.find((e) => e.data === dateStr);
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
  }, [entradas, selectedPeriod]);

  // Verificar se a data selecionada tem entrada
  const selectedDateHasEntry = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return entradas.some((e) => e.data === dateStr);
  }, [selectedDate, entradas]);

  // Obter entrada da data selecionada no histórico
  const selectedHistoryEntry = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return entradas.find((e) => e.data === dateStr);
  }, [selectedDate, entradas]);

  // Datas que possuem entradas (para destacar no calendário)
  const datesWithEntries = useMemo(() => {
    return entradas.map((e) => new Date(e.data + "T12:00:00"));
  }, [entradas]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      
      // Tooltip para visualização diária
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
      
      // Tooltip para visualização semanal
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Book className="w-6 h-6 text-primary" />
                Diário
              </CardTitle>
              <CardDescription>
                Registre seu dia: {new Date().toLocaleDateString("pt-BR", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm min-w-[44px] border border-border"
              >
                {!isOpen && (
                  <span className="text-xs font-medium">Expandir</span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          {/* Toggle de Modo */}
          <div className="px-3 sm:px-6 pb-4">
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <Button
                variant={viewMode === "registro" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-1 gap-2 transition-all",
                  viewMode === "registro" 
                    ? "shadow-sm" 
                    : "hover:bg-background/50"
                )}
                onClick={() => setViewMode("registro")}
              >
                <PenLine className="w-4 h-4" />
                <span className="hidden sm:inline">Registro de Hoje</span>
                <span className="sm:hidden">Hoje</span>
              </Button>
              <Button
                variant={viewMode === "historico" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-1 gap-2 transition-all",
                  viewMode === "historico" 
                    ? "shadow-sm" 
                    : "hover:bg-background/50"
                )}
                onClick={() => setViewMode("historico")}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Histórico</span>
                <span className="sm:hidden">Histórico</span>
              </Button>
            </div>
          </div>

          {/* MODO REGISTRO */}
          {viewMode === "registro" && (
            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
              {/* Humor */}
              <div className="space-y-3">
                <Label>Como você está se sentindo hoje?</Label>
                <RadioGroup 
                  value={entrada.humor} 
                  onValueChange={(value) => setEntrada({ ...entrada, humor: value })}
                >
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feliz" id="feliz" />
                      <Label htmlFor="feliz" className="flex items-center gap-2 cursor-pointer">
                        <Smile className="w-5 h-5 text-primary" />
                        Feliz
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutro" id="neutro" />
                      <Label htmlFor="neutro" className="flex items-center gap-2 cursor-pointer">
                        <Meh className="w-5 h-5 text-muted-foreground" />
                        Neutro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="triste" id="triste" />
                      <Label htmlFor="triste" className="flex items-center gap-2 cursor-pointer">
                        <Frown className="w-5 h-5 text-destructive" />
                        Triste
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Reflexões */}
              <div className="space-y-2">
                <Label htmlFor="reflexoes">Reflexões do Dia</Label>
                <Textarea
                  id="reflexoes"
                  placeholder="O que você aprendeu ou percebeu hoje?"
                  value={entrada.reflexoes}
                  onChange={(e) => setEntrada({ ...entrada, reflexoes: e.target.value })}
                  rows={4}
                  spellCheck="true"
                />
              </div>

              {/* Avanços */}
              <div className="space-y-2">
                <Label htmlFor="avancos">Avanços e Conquistas</Label>
                <Textarea
                  id="avancos"
                  placeholder="Quais foram seus avanços em relação ao seu PDI?"
                  value={entrada.avancos}
                  onChange={(e) => setEntrada({ ...entrada, avancos: e.target.value })}
                  rows={3}
                  spellCheck="true"
                />
              </div>

              {/* Hábitos */}
              <div className="space-y-2">
                <Label htmlFor="habitos">Hábitos Realizados</Label>
                <Textarea
                  id="habitos"
                  placeholder="Quais hábitos você praticou hoje?"
                  value={entrada.habitos}
                  onChange={(e) => setEntrada({ ...entrada, habitos: e.target.value })}
                  rows={3}
                  spellCheck="true"
                />
              </div>

              {/* Gratidão */}
              <div className="space-y-2">
                <Label htmlFor="gratidao">Gratidão</Label>
                <Textarea
                  id="gratidao"
                  placeholder="Pelo que você é grato hoje?"
                  value={entrada.gratidao}
                  onChange={(e) => setEntrada({ ...entrada, gratidao: e.target.value })}
                  rows={3}
                  spellCheck="true"
                />
              </div>

              <Button onClick={handleSave} className="w-full" size="lg" disabled={!isFormComplete}>
                {entradas.some((e) => e.data === entrada.data) ? "Atualizar reflexões do dia" : "Salvar reflexões do dia"}
              </Button>

              {/* Dica sobre importância do diário */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  💡 <strong>Por que ter um diário?</strong> Manter um registro diário fortalece o autoconhecimento, 
                  ajuda a identificar padrões emocionais e permite acompanhar seu progresso ao longo do tempo. 
                  É uma ferramenta poderosa para reflexão e crescimento pessoal.
                </p>
              </div>
            </CardContent>
          )}

          {/* MODO HISTÓRICO */}
          {viewMode === "historico" && (
            <CardContent className="space-y-6 px-3 sm:px-6">
              {/* Calendário e Detalhes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendário */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Selecione uma data</Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border pointer-events-auto"
                      modifiers={{
                        hasEntry: datesWithEntries,
                      }}
                      modifiersStyles={{
                        hasEntry: {
                          backgroundColor: "hsl(var(--primary) / 0.15)",
                          fontWeight: "bold",
                        },
                      }}
                      disabled={(date) => date > new Date()}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    📅 Dias com registro estão destacados
                  </p>
                </div>

                {/* Detalhes da Data Selecionada */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </Label>
                  
                  {selectedHistoryEntry ? (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4 space-y-4">
                        {/* Humor */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Humor:</span>
                          {selectedHistoryEntry.humor === "feliz" && (
                            <span className="flex items-center gap-1 text-primary">
                              <Smile className="w-4 h-4" /> Feliz
                            </span>
                          )}
                          {selectedHistoryEntry.humor === "neutro" && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Meh className="w-4 h-4" /> Neutro
                            </span>
                          )}
                          {selectedHistoryEntry.humor === "triste" && (
                            <span className="flex items-center gap-1 text-destructive">
                              <Frown className="w-4 h-4" /> Triste
                            </span>
                          )}
                        </div>

                        <ScrollArea className="h-[250px] pr-4">
                          <div className="space-y-4">
                            {selectedHistoryEntry.reflexoes && (
                              <div>
                                <p className="font-semibold text-sm text-primary mb-1">Reflexões:</p>
                                <p className="text-sm text-muted-foreground">{selectedHistoryEntry.reflexoes}</p>
                              </div>
                            )}
                            {selectedHistoryEntry.avancos && (
                              <div>
                                <p className="font-semibold text-sm text-primary mb-1">Avanços e Conquistas:</p>
                                <p className="text-sm text-muted-foreground">{selectedHistoryEntry.avancos}</p>
                              </div>
                            )}
                            {selectedHistoryEntry.habitos && (
                              <div>
                                <p className="font-semibold text-sm text-primary mb-1">Hábitos Realizados:</p>
                                <p className="text-sm text-muted-foreground">{selectedHistoryEntry.habitos}</p>
                              </div>
                            )}
                            {selectedHistoryEntry.gratidao && (
                              <div>
                                <p className="font-semibold text-sm text-primary mb-1">Gratidão:</p>
                                <p className="text-sm text-muted-foreground">{selectedHistoryEntry.gratidao}</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] bg-muted/30 rounded-lg border border-dashed">
                      <Book className="w-12 h-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-center">
                        Nenhum registro encontrado para esta data.
                      </p>
                      {isToday && (
                        <Button 
                          variant="link" 
                          className="mt-2"
                          onClick={() => setViewMode("registro")}
                        >
                          Criar registro de hoje
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Gráfico de Histórico de Humor */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-semibold">Histórico de Humor</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-full sm:w-[180px]">
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
                </div>
                
                <div className="h-[250px] sm:h-[300px] w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                    {selectedPeriod === "30dias" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="dia" 
                          label={{ value: "Dia", position: "insideBottom", offset: -5 }}
                          className="text-xs"
                        />
                        <YAxis 
                          domain={[0, 4]}
                          ticks={[1, 2, 3]}
                          tickFormatter={(value) => {
                            if (value === 1) return "Triste";
                            if (value === 2) return "Neutro";
                            if (value === 3) return "Feliz";
                            return "";
                          }}
                          className="text-xs"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="humor" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    ) : (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="semana" 
                          className="text-xs"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          label={{ value: "%", position: "insideLeft" }}
                          className="text-xs"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="feliz" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          name="Feliz"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="neutro" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--muted-foreground))", r: 4 }}
                          name="Neutro"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="triste" 
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                          name="Triste"
                          connectNulls={false}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Legenda do gráfico */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                    <span className="text-sm text-muted-foreground">😊 Feliz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }} />
                    <span className="text-sm text-muted-foreground">😐 Neutro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
                    <span className="text-sm text-muted-foreground">😔 Triste</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default DiarioSection;
