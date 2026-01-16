import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, X, Check, Loader2, HelpCircle, Sparkles, Home, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { LifeWheelScientificModal } from "@/components/LifeWheelScientificModal";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AreaVida } from "@/types/pdi";

interface LifeArea {
  area: string;
  notaAtual: number;
  notaDesejada: number;
}

const defaultAreas: LifeArea[] = [
  { area: "Saúde e Bem-estar", notaAtual: 0, notaDesejada: 0 },
  { area: "Carreira e Profissão", notaAtual: 0, notaDesejada: 0 },
  { area: "Finanças", notaAtual: 0, notaDesejada: 0 },
  { area: "Relacionamentos", notaAtual: 0, notaDesejada: 0 },
  { area: "Família", notaAtual: 0, notaDesejada: 0 },
  { area: "Desenvolvimento Pessoal", notaAtual: 0, notaDesejada: 0 },
  { area: "Lazer e Diversão", notaAtual: 0, notaDesejada: 0 },
  { area: "Espiritualidade", notaAtual: 0, notaDesejada: 0 },
  { area: "Ambiente Físico", notaAtual: 0, notaDesejada: 0 },
  { area: "Contribuição Social", notaAtual: 0, notaDesejada: 0 },
];

export default function RodaDaVida() {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const navigate = useNavigate();
  const { getAreasVida, saveAreasVida, loading: storageLoading } = usePDIStorage();
  const { celebrateAction } = useActionCelebration();
  const [areas, setAreas] = useState<LifeArea[]>(defaultAreas);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempArea, setTempArea] = useState<LifeArea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLifeWheelModalOpen, setIsLifeWheelModalOpen] = useState(false);
  const [hoveredSlider, setHoveredSlider] = useState<{ index: number; type: 'atual' | 'desejada' } | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Carregar áreas do Supabase
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const savedAreas = await getAreasVida();
        if (savedAreas && savedAreas.length > 0) {
          // Verificar se tem notas preenchidas (não só zeros)
          const hasFilledAreas = savedAreas.some(a => a.nota_atual > 0 || a.nota_desejada > 0);
          
          setAreas(savedAreas.map(a => ({
            area: a.area,
            notaAtual: a.nota_atual,
            notaDesejada: a.nota_desejada
          })));
          
          // Se não tem notas preenchidas, mostrar modal de boas-vindas
          if (!hasFilledAreas) {
            setShowWelcomeModal(true);
          }
        } else {
          // Nenhuma área salva, mostrar modal de boas-vindas
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAreas();
  }, [getAreasVida]);

  const updateAreaScore = useCallback((index: number, type: 'atual' | 'desejada', value: number) => {
    const newAreas = [...areas];
    if (type === 'atual') {
      newAreas[index].notaAtual = value;
    } else {
      newAreas[index].notaDesejada = value;
    }
    setAreas(newAreas);
  }, [areas]);

  const handleSaveToPlanoDeVida = async () => {
    setIsSaving(true);
    try {
      const areasVida: AreaVida[] = areas.map((a, idx) => ({
        id: idx + 1,
        area: a.area,
        nota_atual: a.notaAtual,
        nota_desejada: a.notaDesejada
      }));
      await saveAreasVida(areasVida);
      celebrateAction('tool_roda', 'Roda da Vida');
      toast.success("Áreas da Vida atualizadas no Plano de Vida com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error("Erro ao salvar áreas da vida");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAreaName = (index: number) => {
    setEditingIndex(index);
    setTempArea({ ...areas[index] });
  };

  const handleSaveAreaName = () => {
    if (editingIndex !== null && tempArea) {
      const newAreas = [...areas];
      newAreas[editingIndex] = { ...newAreas[editingIndex], area: tempArea.area };
      setAreas(newAreas);
      setEditingIndex(null);
      setTempArea(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempArea(null);
  };

  const chartData = areas.map((area) => ({
    area: area.area,
    atual: area.notaAtual,
    desejada: area.notaDesejada,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/ferramentas")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Ferramentas
          </Button>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Roda da Vida</CardTitle>
            <CardDescription className="text-base mt-2">
              A Roda da Vida é uma ferramenta poderosa de autoconhecimento que permite visualizar o equilíbrio
              entre diferentes áreas da sua vida. Avalie cada área com uma nota de 0 a 10, onde 0 representa
              total insatisfação e 10 representa plena realização. Compare seu estado atual com onde você
              deseja chegar e identifique as áreas que precisam de mais atenção no seu desenvolvimento pessoal.
            </CardDescription>
            <button
              onClick={() => setIsLifeWheelModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span className="sm:hidden">Entenda melhor</span>
              <span className="hidden sm:inline">Entenda a importância de saber claramente sobre suas áreas da vida</span>
            </button>
          </CardHeader>
        </Card>

        <LifeWheelScientificModal 
          open={isLifeWheelModalOpen} 
          onOpenChange={setIsLifeWheelModalOpen} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mandala/Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visualização da Roda</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Radar
                    name="Nota Atual"
                    dataKey="atual"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Nota Desejada"
                    dataKey="desejada"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela Editável */}
          <Card>
            <CardHeader>
              <CardTitle>Áreas da Vida</CardTitle>
              <CardDescription>
                Arraste as barras para definir suas notas de 0 a 10
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {areas.map((area, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border bg-card space-y-4"
                    >
                      {/* Nome da área */}
                      <div className="flex items-center justify-between gap-2">
                        {editingIndex === index ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={tempArea?.area || ""}
                              onChange={(e) =>
                                setTempArea(
                                  tempArea ? { ...tempArea, area: e.target.value } : null
                                )
                              }
                              className="flex-1"
                              placeholder="Nome da área"
                            />
                            <Button
                              size="icon"
                              variant="default"
                              onClick={handleSaveAreaName}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-foreground">{area.area}</p>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditAreaName(index)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Linha 1: Nota Atual */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Atual</span>
                          <span className="text-sm font-semibold text-primary min-w-[2rem] text-right">
                            {area.notaAtual}
                          </span>
                        </div>
                        <Tooltip open={hoveredSlider?.index === index && hoveredSlider?.type === 'atual'}>
                          <TooltipTrigger asChild>
                            <div
                              onMouseEnter={() => setHoveredSlider({ index, type: 'atual' })}
                              onMouseLeave={() => setHoveredSlider(null)}
                              onTouchStart={() => setHoveredSlider({ index, type: 'atual' })}
                              onTouchEnd={() => setHoveredSlider(null)}
                            >
                              <Slider
                                value={[area.notaAtual]}
                                onValueChange={(value) => updateAreaScore(index, 'atual', value[0])}
                                min={0}
                                max={10}
                                step={1}
                                className="cursor-pointer"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-primary text-primary-foreground font-bold">
                            {area.notaAtual}
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>10</span>
                        </div>
                      </div>

                      {/* Linha 2: Nota Desejada */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Desejada</span>
                          <span className="text-sm font-semibold text-accent min-w-[2rem] text-right">
                            {area.notaDesejada}
                          </span>
                        </div>
                        <Tooltip open={hoveredSlider?.index === index && hoveredSlider?.type === 'desejada'}>
                          <TooltipTrigger asChild>
                            <div
                              onMouseEnter={() => setHoveredSlider({ index, type: 'desejada' })}
                              onMouseLeave={() => setHoveredSlider(null)}
                              onTouchStart={() => setHoveredSlider({ index, type: 'desejada' })}
                              onTouchEnd={() => setHoveredSlider(null)}
                            >
                              <Slider
                                value={[area.notaDesejada]}
                                onValueChange={(value) => updateAreaScore(index, 'desejada', value[0])}
                                min={0}
                                max={10}
                                step={1}
                                className="cursor-pointer [&_[data-orientation=horizontal]]:bg-accent/20 [&_[role=slider]]:border-accent [&_[role=slider]]:bg-accent [&_.bg-primary]:bg-accent"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-accent text-accent-foreground font-bold">
                            {area.notaDesejada}
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="flex flex-col gap-4 items-center">
              <Button
                onClick={handleSaveToPlanoDeVida}
                className="gap-2 w-full sm:w-auto"
                size="lg"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {isSaving ? "Salvando..." : "Salvar no Plano de Vida"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/home")}
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de boas-vindas para usuários que não preencheram */}
        <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">
                <CircleDot className="w-8 h-8 text-primary mx-auto mb-2" />
                Roda da Vida
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                A <strong>3ª atividade</strong> do Passo 1 "Quem sou eu" é o exercício sobre <strong>Áreas da Vida</strong>.
                <br /><br />
                Você quer continuar e fazer agora, ou voltar para o Dashboard?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowWelcomeModal(false);
                  navigate("/home");
                }}
                className="w-full sm:w-auto gap-2"
              >
                <Home className="w-4 h-4" />
                Voltar ao Dashboard
              </Button>
              <Button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full sm:w-auto gap-2"
              >
                <CircleDot className="w-4 h-4" />
                Fazer agora
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
