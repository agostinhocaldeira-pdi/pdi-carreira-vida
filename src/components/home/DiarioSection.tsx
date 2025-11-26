import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Smile, Frown, Meh, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DiarioSection = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diario") || "[]");
    setEntradas(stored);
  }, []);

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

  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem("diario") || "[]");
    stored.push({ ...entrada, id: Date.now() });
    localStorage.setItem("diario", JSON.stringify(stored));
    setEntradas(stored);
    toast.success("Entrada do diário salva!");
    
    // Reset
    setEntrada({
      humor: "",
      reflexoes: "",
      avancos: "",
      habitos: "",
      gratidao: "",
      data: new Date().toISOString().split("T")[0],
    });
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
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Minimizar
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Expandir
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
              
              {/* Gráfico de histórico de humor */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórico de Humor</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateMockData}
                    >
                      Gerar Dados Teste
                    </Button>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-[200px]">
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
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
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
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
        {/* Humor */}
        <div className="space-y-3">
          <Label>Como você está se sentindo hoje?</Label>
          <RadioGroup value={entrada.humor} onValueChange={(value) => setEntrada({ ...entrada, humor: value })}>
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
          />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Salvar Entrada
        </Button>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default DiarioSection;
