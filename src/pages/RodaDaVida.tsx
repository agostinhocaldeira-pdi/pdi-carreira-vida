import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, X, Check, Loader2, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { LifeWheelScientificModal } from "@/components/LifeWheelScientificModal";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";
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

  // Carregar áreas do Supabase
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const savedAreas = await getAreasVida();
        if (savedAreas && savedAreas.length > 0) {
          setAreas(savedAreas.map(a => ({
            area: a.area,
            notaAtual: a.nota_atual,
            notaDesejada: a.nota_desejada
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar áreas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAreas();
  }, [getAreasVida]);

  const saveAreas = useCallback(async (newAreas: LifeArea[]) => {
    setAreas(newAreas);
    // Não salva automaticamente - usuário precisa clicar em "Salvar no Plano de Vida"
  }, []);

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

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempArea({ ...areas[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && tempArea) {
      const newAreas = [...areas];
      newAreas[editingIndex] = tempArea;
      saveAreas(newAreas);
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
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm mt-3 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Entenda a importância de saber claramente sobre suas áreas da vida
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
                Clique no ícone de edição para personalizar as áreas e suas notas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {areas.map((area, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-3 rounded-lg border border-border bg-card"
                  >
                    {editingIndex === index ? (
                      <>
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
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={tempArea?.notaAtual || 0}
                            onChange={(e) =>
                              setTempArea(
                                tempArea
                                  ? {
                                      ...tempArea,
                                      notaAtual: Math.min(
                                        10,
                                        Math.max(0, Number(e.target.value))
                                      ),
                                    }
                                  : null
                              )
                            }
                            className="w-20"
                            placeholder="Atual"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={tempArea?.notaDesejada || 0}
                            onChange={(e) =>
                              setTempArea(
                                tempArea
                                  ? {
                                      ...tempArea,
                                      notaDesejada: Math.min(
                                        10,
                                        Math.max(0, Number(e.target.value))
                                      ),
                                    }
                                  : null
                              )
                            }
                            className="w-20"
                            placeholder="Desejada"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="default"
                            onClick={handleSave}
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
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{area.area}</p>
                        </div>
                        <div className="flex gap-4 items-center text-sm">
                          <span className="text-muted-foreground">
                            Atual: <span className="font-semibold text-foreground">{area.notaAtual}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Desejada: <span className="font-semibold text-foreground">{area.notaDesejada}</span>
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
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
      </div>
    </div>
  );
}
