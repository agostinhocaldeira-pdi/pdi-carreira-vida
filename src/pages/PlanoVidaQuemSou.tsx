import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight, Edit, ArrowLeft, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import LogoutButton from "@/components/LogoutButton";

const PlanoVidaQuemSou = () => {
  const { isLoading: roleLoading, userRole } = useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const storage = usePDIStorage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [vvd, setVvd] = useState("");
  const [isEditingVvd, setIsEditingVvd] = useState(true);
  const [valores, setValores] = useState<string[]>(Array(6).fill(""));
  const [isEditingValores, setIsEditingValores] = useState(true);
  const [areasVida, setAreasVida] = useState<Array<{
    area: string;
    notaAtual: string | number;
    notaDesejada: string | number;
  }>>([]);
  const [isEditingAreas, setIsEditingAreas] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Sincronizar valores com a página de exercício
  useEffect(() => {
    const syncValores = () => {
      const savedMeusValores = localStorage.getItem("meus_valores");
      if (savedMeusValores) {
        const meusValores = JSON.parse(savedMeusValores);
        const valoresCompletos = [...meusValores.slice(0, 6), ...Array(Math.max(0, 6 - meusValores.length)).fill("")];
        setValores(valoresCompletos);
      }
    };

    syncValores();
    window.addEventListener("valoresUpdated", syncValores);

    return () => {
      window.removeEventListener("valoresUpdated", syncValores);
    };
  }, []);

  // Sincronizar VVD com a ferramenta Método VVD
  useEffect(() => {
    const syncVvd = () => {
      const savedVvd = localStorage.getItem("vvd");
      if (savedVvd) {
        setVvd(savedVvd);
        setIsEditingVvd(false);
      }
    };

    syncVvd();
    window.addEventListener("vvdUpdated", syncVvd);

    return () => {
      window.removeEventListener("vvdUpdated", syncVvd);
    };
  }, []);

  // Carregar dados salvos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // VVD
        const savedVvd = await storage.getVvd();
        if (savedVvd) {
          setVvd(savedVvd);
          setIsEditingVvd(false);
        } else {
          const localVvd = localStorage.getItem("vvd");
          if (localVvd) {
            setVvd(localVvd);
            setIsEditingVvd(false);
          }
        }

        // Valores - limitado a 6 campos
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        } else {
          const localValores = localStorage.getItem("valores");
          if (localValores) {
            const parsed = JSON.parse(localValores);
            const limitedValores = parsed.slice(0, 6);
            const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
            setValores(valoresCompletos);
            setIsEditingValores(false);
          }
        }

        // Áreas da Vida
        const savedAreas = await storage.getAreasVida();
        if (savedAreas && savedAreas.length > 0) {
          const normalizedAreas = savedAreas.map((area: any) => ({
            area: area.area,
            notaAtual: String(area.nota_atual ?? area.notaAtual ?? ""),
            notaDesejada: String(area.nota_desejada ?? area.notaDesejada ?? "")
          }));
          setAreasVida(normalizedAreas);
          setIsEditingAreas(false);
        } else {
          const localAreas = localStorage.getItem("areasVida");
          if (localAreas) {
            const loadedAreas = JSON.parse(localAreas);
            const normalizedAreas = loadedAreas.map((area: any) => ({
              ...area,
              notaAtual: String(area.notaAtual ?? ""),
              notaDesejada: String(area.notaDesejada ?? "")
            }));
            setAreasVida(normalizedAreas);
            setIsEditingAreas(false);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  // Listen for valores updates from the Valores tool
  useEffect(() => {
    const handleValoresUpdated = async () => {
      try {
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        }
      } catch (error) {
        console.error("Error reloading valores:", error);
      }
    };

    window.addEventListener("valoresUpdated", handleValoresUpdated);
    return () => window.removeEventListener("valoresUpdated", handleValoresUpdated);
  }, [storage]);

  const handleSaveVvd = () => {
    localStorage.setItem("vvd", vvd);
    setIsEditingVvd(false);
    toast.success("Visão de Vida Desejada salva!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Visão de Vida Desejada (VVD)");
    }
    
    storage.saveVvd(vvd).catch(error => {
      console.error("Background VVD sync error:", error);
    });
  };

  const handleEditVvd = () => {
    setIsEditingVvd(true);
  };

  const handleSaveValores = () => {
    const filteredValores = valores.filter(v => v.trim() !== "");
    localStorage.setItem("valores", JSON.stringify(valores));
    setIsEditingValores(false);
    toast.success("Valores salvos!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Valores");
    }
    
    storage.saveValores(filteredValores).catch(error => {
      console.error("Background valores sync error:", error);
    });
  };

  const handleEditValores = () => {
    setIsEditingValores(true);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores];
    newValores[index] = value;
    setValores(newValores);
  };

  const isValoresComplete = valores.some((valor) => valor.trim() !== "");

  // Calcular progresso
  const calculateProgress = () => {
    let count = 0;
    if (vvd && vvd.trim()) count++;
    if (isValoresComplete) count++;
    if (areasVida.length > 0 && areasVida.every(
      (area) => String(area.notaAtual).trim() !== "" && String(area.notaDesejada).trim() !== ""
    )) count++;
    return Math.round((count / 3) * 100);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PDILoader text="Carregando..." size="lg" variant="sparkles" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/home")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <LogoutButton />
        </div>

        <Card className="shadow-medium overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Passo 1</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl">Quem sou Eu</CardTitle>
                <CardDescription>VVD, Valores e Roda da Vida</CardDescription>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{calculateProgress()}%</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="py-8">
                <PDILoader text="Carregando dados..." size="md" variant="sparkles" />
              </div>
            ) : (
              <>
                {/* VVD */}
                <div className="space-y-3">
                  <Label htmlFor="vvd">Visão de Vida Desejada (VVD)</Label>
                  <Textarea
                    id="vvd"
                    placeholder="Escreva sua visão de vida ideal em uma frase..."
                    value={vvd}
                    onChange={(e) => setVvd(e.target.value)}
                    disabled={!isEditingVvd}
                    rows={4}
                    spellCheck="true"
                    className="text-sm"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link 
                      to="/ferramentas/metodo-vvd" 
                      className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline"
                    >
                      <span className="truncate">Construir VVD (Ferramenta)</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Link>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {!isEditingVvd && (
                        <Button onClick={handleEditVvd} size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      )}
                      <Button 
                        onClick={handleSaveVvd} 
                        size="sm" 
                        variant="outline"
                        disabled={!vvd || !isEditingVvd}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Valores */}
                <div className="space-y-3">
                  <Label>Meus Valores (6 principais)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {valores.slice(0, 6).map((valor, index) => (
                      <Input
                        key={index}
                        placeholder={`Valor ${index + 1}`}
                        value={valor}
                        onChange={(e) => updateValor(index, e.target.value)}
                        disabled={!isEditingValores}
                        className="text-sm"
                        spellCheck="true"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link 
                      to="/ferramentas/valores" 
                      className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline max-w-full truncate"
                    >
                      <span className="truncate">Descobrir valores</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Link>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {!isEditingValores && (
                        <Button onClick={handleEditValores} size="sm" variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                      )}
                      <Button 
                        onClick={handleSaveValores} 
                        size="sm" 
                        variant="outline"
                        disabled={!isValoresComplete || !isEditingValores}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Áreas da Vida */}
                <div className="space-y-3">
                  <Label>Áreas da Vida</Label>
                  
                  {areasVida.length > 0 ? (
                    <div className="rounded-lg border p-4 bg-card max-w-full overflow-hidden">
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={areasVida.map(area => ({
                          area: area.area,
                          atual: Number(area.notaAtual) || 0,
                          desejada: Number(area.notaDesejada) || 0
                        }))}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis
                            dataKey="area"
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 10]}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
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
                    </div>
                  ) : (
                    <div className="rounded-lg border p-6 bg-muted/20 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma área da vida cadastrada. Acesse a Roda da Vida para configurar.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-start">
                    <Link 
                      to="/roda-da-vida" 
                      className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline"
                    >
                      <span className="truncate">Acessar Roda da Vida</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation to next step */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/home")} className="gap-2">
            <Home className="w-4 h-4" />
            Voltar à Home
          </Button>
          <Button onClick={() => navigate("/plano-vida/para-onde")} className="gap-2">
            Próximo: Para onde vou
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanoVidaQuemSou;
