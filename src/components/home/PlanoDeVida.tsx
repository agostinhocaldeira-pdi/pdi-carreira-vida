import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Compass, Heart, Target, Lightbulb, ChevronDown, ArrowRight, Edit, Sparkles, Loader2, ExternalLink, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlanoDeVidaProps {
  onTabChange?: (tab: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  forcedTab?: string;
  forcedOpen?: boolean;
}

const PlanoDeVida = ({ onTabChange, onOpenChange, forcedTab, forcedOpen }: PlanoDeVidaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quem-sou");
  const [vvd, setVvd] = useState("");
  const [isEditingVvd, setIsEditingVvd] = useState(true);
  const [valores, setValores] = useState<string[]>(Array(12).fill(""));
  const [isEditingValores, setIsEditingValores] = useState(true);
  const [areasVida, setAreasVida] = useState<Array<{
    area: string;
    notaAtual: string | number;
    notaDesejada: string | number;
  }>>([]);
  const [isEditingAreas, setIsEditingAreas] = useState(true);
  const [insight, setInsight] = useState("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [lastInsightDate, setLastInsightDate] = useState<string | null>(null);
  const [canGenerateInsight, setCanGenerateInsight] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [objetivo, setObjetivo] = useState({
    texto: "",
    dataAlvo: "",
    conexaoVvd: "",
    status: "em-andamento",
  });

  const [objetivos, setObjetivos] = useState<Array<{
    id: number;
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
  }>>([]);

  const [editandoObjetivoId, setEditandoObjetivoId] = useState<number | null>(null);
  const [objetivoEditado, setObjetivoEditado] = useState<{
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
  } | null>(null);

  // Estados para Habilidades
  const [novaHabilidade, setNovaHabilidade] = useState("");
  const [habilidades, setHabilidades] = useState<Array<{ id: number; texto: string }>>([]);
  const [editandoHabilidadeId, setEditandoHabilidadeId] = useState<number | null>(null);
  const [habilidadeEditada, setHabilidadeEditada] = useState("");

  // Sincronizar com props externas (para navegação via eventos)
  useEffect(() => {
    if (forcedTab !== undefined && forcedTab !== activeTab) {
      setActiveTab(forcedTab);
    }
  }, [forcedTab]);

  useEffect(() => {
    if (forcedOpen !== undefined && forcedOpen !== isOpen) {
      setIsOpen(forcedOpen);
    }
  }, [forcedOpen]);

  // Sincronizar insight entre seções
  useEffect(() => {
    const syncInsight = () => {
      const savedInsight = localStorage.getItem("userInsight");
      if (savedInsight) {
        setInsight(savedInsight);
      }
    };

    // Carregar insight inicial
    syncInsight();

    // Escutar mudanças no localStorage
    window.addEventListener("storage", syncInsight);
    
    // Evento customizado para sincronizar na mesma aba
    window.addEventListener("insightUpdated", syncInsight);

    return () => {
      window.removeEventListener("storage", syncInsight);
      window.removeEventListener("insightUpdated", syncInsight);
    };
  }, []);

  // Sincronizar valores com a página de exercício
  useEffect(() => {
    const syncValores = () => {
      const savedMeusValores = localStorage.getItem("meus_valores");
      if (savedMeusValores) {
        const meusValores = JSON.parse(savedMeusValores);
        // Preencher com os 6 valores + 6 vazios para manter compatibilidade
        const valoresCompletos = [...meusValores, ...Array(12 - meusValores.length).fill("")];
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

  // Sincronizar habilidades com a ferramenta SWOT
  useEffect(() => {
    const syncHabilidades = () => {
      const savedHabilidades = localStorage.getItem("habilidades");
      if (savedHabilidades) {
        setHabilidades(JSON.parse(savedHabilidades));
      }
    };

    syncHabilidades();
    window.addEventListener("habilidadesUpdated", syncHabilidades);

    return () => {
      window.removeEventListener("habilidadesUpdated", syncHabilidades);
    };
  }, []);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedVvd = localStorage.getItem("vvd");
    if (savedVvd) {
      setVvd(savedVvd);
      setIsEditingVvd(false);
    } else {
      // Dados mockados para VVD
      const mockVvd = "Quero construir uma carreira sólida no desenvolvimento de software, com equilíbrio entre vida pessoal e profissional. Desejo ter tempo para cuidar da minha saúde física e mental, manter relacionamentos significativos com família e amigos, e ter estabilidade financeira que me permita realizar sonhos como viajar pelo mundo e ter minha própria casa. Busco ser uma pessoa íntegra, que contribui positivamente para a sociedade e inspira outros ao meu redor.";
      setVvd(mockVvd);
      localStorage.setItem("vvd", mockVvd);
      setIsEditingVvd(false);
    }

    const savedValores = localStorage.getItem("valores");
    if (savedValores) {
      setValores(JSON.parse(savedValores));
      setIsEditingValores(false);
    } else {
      // Dados mockados para Valores
      const mockValores = [
        "Integridade",
        "Respeito",
        "Crescimento",
        "Família",
        "Saúde",
        "Equilíbrio",
        "Criatividade",
        "Liberdade",
        "Excelência",
        "Empatia",
        "Gratidão",
        "Resiliência"
      ];
      setValores(mockValores);
      localStorage.setItem("valores", JSON.stringify(mockValores));
      setIsEditingValores(false);
    }

    const savedAreas = localStorage.getItem("areasVida");
    if (savedAreas) {
      const loadedAreas = JSON.parse(savedAreas);
      // Converter números para strings se necessário
      const normalizedAreas = loadedAreas.map((area: any) => ({
        ...area,
        notaAtual: String(area.notaAtual || ""),
        notaDesejada: String(area.notaDesejada || "")
      }));
      setAreasVida(normalizedAreas);
      setIsEditingAreas(false);
    } else {
      // Dados mockados para Áreas da Vida (10 áreas)
      const mockAreas = [
        { area: "Saúde e Bem-estar", notaAtual: "5", notaDesejada: "9" },
        { area: "Carreira e Profissão", notaAtual: "6", notaDesejada: "9" },
        { area: "Finanças", notaAtual: "5", notaDesejada: "8" },
        { area: "Relacionamentos", notaAtual: "7", notaDesejada: "9" },
        { area: "Família", notaAtual: "8", notaDesejada: "10" },
        { area: "Desenvolvimento Pessoal", notaAtual: "6", notaDesejada: "9" },
        { area: "Lazer e Diversão", notaAtual: "4", notaDesejada: "8" },
        { area: "Espiritualidade", notaAtual: "5", notaDesejada: "8" },
        { area: "Ambiente Físico", notaAtual: "6", notaDesejada: "9" },
        { area: "Contribuição Social", notaAtual: "4", notaDesejada: "7" },
      ];
      setAreasVida(mockAreas);
      localStorage.setItem("areasVida", JSON.stringify(mockAreas));
      setIsEditingAreas(false);
    }

    const savedObjetivos = localStorage.getItem("objetivos");
    if (savedObjetivos) {
      setObjetivos(JSON.parse(savedObjetivos));
    } else {
      // Dados mockados para Objetivos
      const mockObjetivos = [
        {
          id: 1,
          texto: "Concluir certificação em Cloud Computing",
          dataAlvo: "2025-06-30",
          conexaoVvd: "Crescimento profissional e desenvolvimento de habilidades técnicas",
          status: "em-andamento"
        },
        {
          id: 2,
          texto: "Praticar exercícios físicos 3x por semana",
          dataAlvo: "2025-12-31",
          conexaoVvd: "Cuidar da saúde física e ter mais energia no dia a dia",
          status: "em-andamento"
        },
        {
          id: 3,
          texto: "Economizar 20% da renda mensal",
          dataAlvo: "2025-12-31",
          conexaoVvd: "Alcançar estabilidade financeira e realizar sonhos",
          status: "a-fazer"
        }
      ];
      setObjetivos(mockObjetivos);
      localStorage.setItem("objetivos", JSON.stringify(mockObjetivos));
    }

    // Verificar se o usuário é administrador
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      const savedAdmins = localStorage.getItem("administrators");
      if (savedAdmins) {
        const administrators = JSON.parse(savedAdmins);
        const userIsAdmin = administrators.some(
          (admin: { email: string }) => admin.email === userData.email
        );
        setIsAdmin(userIsAdmin);
        
        // Administradores não têm limite
        if (userIsAdmin) {
          setCanGenerateInsight(true);
          return;
        }
      }
    }

    // Verificar última geração de insight para usuários não-admin
    const savedLastInsightDate = localStorage.getItem("lastInsightDate");
    if (savedLastInsightDate) {
      setLastInsightDate(savedLastInsightDate);
      const lastDate = new Date(savedLastInsightDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Permite gerar novamente após 30 dias
      setCanGenerateInsight(diffDays >= 30);
    }
  }, []);

  const handleSaveVvd = () => {
    localStorage.setItem("vvd", vvd);
    setIsEditingVvd(false);
    toast.success("Visão de Vida Desejada salva!");
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Visão de Vida Desejada (VVD)");
    }
  };

  const handleEditVvd = () => {
    setIsEditingVvd(true);
  };

  const handleSaveValores = () => {
    localStorage.setItem("valores", JSON.stringify(valores));
    setIsEditingValores(false);
    toast.success("Valores salvos!");
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Valores");
    }
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

  const handleSaveAreas = () => {
    localStorage.setItem("areasVida", JSON.stringify(areasVida));
    setIsEditingAreas(false);
    toast.success("Áreas da Vida salvas!");
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Áreas da Vida");
    }
  };

  const handleEditAreas = () => {
    setIsEditingAreas(true);
  };

  const updateArea = (index: number, field: 'notaAtual' | 'notaDesejada', value: string) => {
    const newAreas = [...areasVida];
    newAreas[index] = {
      ...newAreas[index],
      [field]: value
    };
    setAreasVida(newAreas);
  };

  const isAreasComplete = areasVida.length > 0 && areasVida.every(
    (area) => String(area.notaAtual).trim() !== "" && String(area.notaDesejada).trim() !== ""
  );

  const handleGenerateInsight = async () => {
    // Administradores não têm limite
    if (!isAdmin && !canGenerateInsight) {
      toast.error("Você já gerou seu insight mensal. Contrate o plano Premium para gerar mais insights!");
      return;
    }

    if (!vvd && !isValoresComplete && !isAreasComplete) {
      toast.error("Preencha pelo menos uma seção para gerar insights");
      return;
    }

    setIsGeneratingInsight(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { vvd, valores, areasVida }
      });

      if (error) {
        console.error("Error generating insight:", error);
        toast.error(error.message || "Erro ao gerar insight");
        return;
      }

      if (data?.insight) {
        setInsight(data.insight);
        localStorage.setItem("userInsight", data.insight);
        
        // Disparar evento para sincronizar na mesma aba
        window.dispatchEvent(new Event("insightUpdated"));
        
        // Salvar data da geração apenas para não-admins
        if (!isAdmin) {
          const today = new Date().toISOString();
          localStorage.setItem("lastInsightDate", today);
          setLastInsightDate(today);
          setCanGenerateInsight(false);
        }
        
        toast.success("Insight gerado com sucesso!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao gerar insight");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const getNextInsightDate = () => {
    if (!lastInsightDate) return null;
    const lastDate = new Date(lastInsightDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 30);
    return nextDate.toLocaleDateString('pt-BR');
  };

  const handleSaveObjetivo = () => {
    if (!objetivo.texto || !objetivo.dataAlvo) {
      toast.error("Preencha pelo menos o objetivo e a data alvo");
      return;
    }

    const novoObjetivo = { ...objetivo, id: Date.now() };
    const novosObjetivos = [...objetivos, novoObjetivo];
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo cadastrado!");
    setObjetivo({ texto: "", dataAlvo: "", conexaoVvd: "", status: "em-andamento" });
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  const handleRemoveObjetivo = (id: number) => {
    const novosObjetivos = objetivos.filter((obj) => obj.id !== id);
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo removido!");
  };

  const handleStartEditObjetivo = (obj: any) => {
    setEditandoObjetivoId(obj.id);
    setObjetivoEditado({
      texto: obj.texto,
      dataAlvo: obj.dataAlvo,
      conexaoVvd: obj.conexaoVvd,
      status: obj.status,
    });
  };

  const handleCancelEditObjetivo = () => {
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
  };

  const handleSaveEditObjetivo = (id: number) => {
    if (!objetivoEditado) return;

    const novosObjetivos = objetivos.map((obj) => 
      obj.id === id ? { ...obj, ...objetivoEditado } : obj
    );
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
    toast.success("Objetivo atualizado!");
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  // Funções para gerenciar habilidades
  const handleAddHabilidade = () => {
    if (!novaHabilidade.trim()) {
      toast.error("Digite uma habilidade para adicionar");
      return;
    }

    const novaHab = { id: Date.now(), texto: novaHabilidade };
    const novasHabilidades = [...habilidades, novaHab];
    setHabilidades(novasHabilidades);
    localStorage.setItem("habilidades", JSON.stringify(novasHabilidades));
    setNovaHabilidade("");
    toast.success("Habilidade adicionada!");
  };

  const handleRemoveHabilidade = (id: number) => {
    const novasHabilidades = habilidades.filter((hab) => hab.id !== id);
    setHabilidades(novasHabilidades);
    localStorage.setItem("habilidades", JSON.stringify(novasHabilidades));
    toast.success("Habilidade removida!");
  };

  const handleStartEditHabilidade = (habilidade: { id: number; texto: string }) => {
    setEditandoHabilidadeId(habilidade.id);
    setHabilidadeEditada(habilidade.texto);
  };

  const handleCancelEditHabilidade = () => {
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
  };

  const handleSaveEditHabilidade = (id: number) => {
    if (!habilidadeEditada.trim()) {
      toast.error("A habilidade não pode estar vazia");
      return;
    }

    const novasHabilidades = habilidades.map((hab) =>
      hab.id === id ? { ...hab, texto: habilidadeEditada } : hab
    );
    setHabilidades(novasHabilidades);
    localStorage.setItem("habilidades", JSON.stringify(novasHabilidades));
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
    toast.success("Habilidade atualizada!");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Compass className="w-6 h-6 text-primary" />
                Plano de Vida
              </CardTitle>
              <CardDescription>Construa sua visão e defina seus objetivos</CardDescription>
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
          <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full h-auto gap-1 sm:gap-0 p-1">
            <TabsTrigger value="quem-sou" className="w-full justify-start sm:justify-center text-sm px-3 py-2.5 sm:py-2">
              <Heart className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Quem sou Eu</span>
            </TabsTrigger>
            <TabsTrigger value="para-onde" className="w-full justify-start sm:justify-center text-sm px-3 py-2.5 sm:py-2">
              <Target className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Para onde vou</span>
            </TabsTrigger>
            <TabsTrigger value="como-chegar" className="w-full justify-start sm:justify-center text-sm px-3 py-2.5 sm:py-2">
              <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Como chegar lá</span>
            </TabsTrigger>
          </TabsList>

          {/* Quem sou Eu */}
          <TabsContent value="quem-sou" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Minha Essência</h3>
              </div>

              {/* VVD */}
              <div className="space-y-2">
                <Label htmlFor="vvd">Minha Visão de Vida Desejada</Label>
                <Textarea
                  id="vvd"
                  placeholder="Descreva como você imagina sua vida ideal em todos os aspectos..."
                  value={vvd}
                  onChange={(e) => setVvd(e.target.value)}
                  rows={4}
                  disabled
                  spellCheck="true"
                />
                <Link 
                  to="/ferramentas/metodo-vvd" 
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Como criar seu VVD
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Valores */}
              <div className="space-y-3">
                <Label>Meus Valores</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {valores.map((valor, index) => (
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
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    to="/ferramentas/valores" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Descobrir meus valores
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex gap-2">
                    {!isEditingValores && (
                      <Button onClick={handleEditValores} size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveValores} 
                      size="sm" 
                      variant="outline"
                      disabled={!isValoresComplete || !isEditingValores}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Áreas da Vida */}
              <div className="space-y-3">
                <Label>Áreas da Vida</Label>
                
                {/* Visualização Desktop - Tabela */}
                <div className="hidden md:block rounded-lg border overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">Área</th>
                        <th className="p-3 text-left text-sm font-medium">Nota Atual</th>
                        <th className="p-3 text-left text-sm font-medium">Nota Desejada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areasVida.map((area, index) => (
                        <tr key={area.area} className="border-t">
                          <td className="p-3 text-sm">{area.area}</td>
                          <td className="p-3">
                            <Input 
                              type="number" 
                              min="0" 
                              max="10" 
                              className="w-20 text-sm" 
                              placeholder="0-10"
                              value={area.notaAtual}
                              disabled
                              readOnly
                            />
                          </td>
                          <td className="p-3">
                            <Input 
                              type="number" 
                              min="0" 
                              max="10" 
                              className="w-20 text-sm" 
                              placeholder="0-10"
                              value={area.notaDesejada}
                              disabled
                              readOnly
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Visualização Mobile - Cards */}
                <div className="md:hidden space-y-3">
                  {areasVida.map((area, index) => (
                    <div 
                      key={area.area} 
                      className="p-4 rounded-lg border bg-card space-y-3"
                    >
                      <h4 className="font-semibold text-foreground">{area.area}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Nota Atual</Label>
                          <div className="text-2xl font-bold text-primary">
                            {area.notaAtual || "-"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Nota Desejada</Label>
                          <div className="text-2xl font-bold text-accent">
                            {area.notaDesejada || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-start gap-4">
                  <Link 
                    to="/roda-da-vida" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Acessar a Roda da Vida para editar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Insight */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Insight</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Uma análise personalizada do seu Plano de Vida baseada nas informações que você preencheu
                </p>
                
                {!canGenerateInsight && !isAdmin && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                    <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                      <strong>Limite mensal atingido.</strong> Você poderá gerar um novo insight em {getNextInsightDate()}. 
                      Contrate o plano <strong>Premium</strong> para gerar insights ilimitados!
                    </p>
                  </div>
                )}
                
                {isAdmin && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
                    <p className="text-xs sm:text-sm text-primary">
                      <strong>Acesso Admin:</strong> Você tem insights ilimitados como administrador.
                    </p>
                  </div>
                )}
                
                {insight ? (
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4 border">
                      <div className="prose prose-sm max-w-none whitespace-pre-line">
                        {insight}
                      </div>
                    </div>
                    <Button 
                      onClick={handleGenerateInsight} 
                      size="sm" 
                      variant="outline"
                      disabled={isGeneratingInsight || (!isAdmin && !canGenerateInsight)}
                    >
                      {isGeneratingInsight ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gerando novo insight...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Gerar novo insight
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-block">
                          <Button 
                            onClick={handleGenerateInsight} 
                            size="sm" 
                            disabled={isGeneratingInsight || (!isAdmin && !canGenerateInsight) || (!vvd && !isValoresComplete && !isAreasComplete)}
                            className="w-full"
                          >
                            {isGeneratingInsight ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gerando insight...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar Insight
                              </>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {(!vvd && !isValoresComplete && !isAreasComplete) && (
                        <TooltipContent>
                          <p className="text-sm">
                            Preencha pelo menos uma seção acima<br />
                            (VVD, Valores ou Áreas da Vida)
                          </p>
                        </TooltipContent>
                      )}
                      {!isAdmin && !canGenerateInsight && (vvd || isValoresComplete || isAreasComplete) && (
                        <TooltipContent>
                          <p className="text-sm">
                            Limite mensal atingido.<br />
                            Próxima geração disponível em {getNextInsightDate()}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Para onde vou */}
          <TabsContent value="para-onde" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Meus Objetivos</h3>
              </div>

              {/* Formulário de cadastro */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm">"Quem muito quer, pouco consegue"</h4>
                <p className="text-xs text-muted-foreground">Sugestão: Tenha um único grande objetivo, quebrado em metas e ações!</p>
                
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo em Foco</Label>
                  <Input
                    id="objetivo"
                    placeholder="Descreva seu objetivo principal"
                    value={objetivo.texto}
                    onChange={(e) => setObjetivo({ ...objetivo, texto: e.target.value })}
                    spellCheck="true"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataAlvo">Data Alvo</Label>
                    <Input
                      id="dataAlvo"
                      type="date"
                      value={objetivo.dataAlvo}
                      onChange={(e) => setObjetivo({ ...objetivo, dataAlvo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={objetivo.status}
                      onValueChange={(value) => setObjetivo({ ...objetivo, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a-iniciar">A iniciar</SelectItem>
                        <SelectItem value="em-andamento">Em andamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pausado">Pausado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conexaoVvd">Conexão com o VVD</Label>
                  <Textarea
                    id="conexaoVvd"
                    placeholder="Como este objetivo se conecta com sua visão de vida?"
                    value={objetivo.conexaoVvd}
                    onChange={(e) => setObjetivo({ ...objetivo, conexaoVvd: e.target.value })}
                    rows={3}
                    spellCheck="true"
                  />
                </div>

                <Button onClick={handleSaveObjetivo} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Objetivo
                </Button>
              </div>

              {/* Lista de objetivos cadastrados */}
              {objetivos.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Objetivos Cadastrados</h4>
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Objetivo</TableHead>
                          <TableHead className="text-xs sm:text-sm">Data Alvo</TableHead>
                          <TableHead className="text-xs sm:text-sm">Status</TableHead>
                          <TableHead className="text-xs sm:text-sm">Conexão VVD</TableHead>
                          <TableHead className="text-xs sm:text-sm text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {objetivos.map((obj) => (
                          <TableRow key={obj.id}>
                            <TableCell className="text-xs sm:text-sm">
                              {editandoObjetivoId === obj.id ? (
                                <Input
                                  value={objetivoEditado?.texto || ""}
                                  onChange={(e) =>
                                    setObjetivoEditado({ ...objetivoEditado!, texto: e.target.value })
                                  }
                                  className="text-xs sm:text-sm"
                                />
                              ) : (
                                obj.texto
                              )}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {editandoObjetivoId === obj.id ? (
                                <Input
                                  type="date"
                                  value={objetivoEditado?.dataAlvo || ""}
                                  onChange={(e) =>
                                    setObjetivoEditado({ ...objetivoEditado!, dataAlvo: e.target.value })
                                  }
                                  className="text-xs sm:text-sm"
                                />
                              ) : (
                                new Date(obj.dataAlvo).toLocaleDateString("pt-BR")
                              )}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {editandoObjetivoId === obj.id ? (
                                <Select
                                  value={objetivoEditado?.status || "em-andamento"}
                                  onValueChange={(value) =>
                                    setObjetivoEditado({ ...objetivoEditado!, status: value })
                                  }
                                >
                                  <SelectTrigger className="text-xs sm:text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="a-iniciar">A iniciar</SelectItem>
                                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                                    <SelectItem value="concluido">Concluído</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="pausado">Pausado</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  obj.status === "concluido" ? "bg-green-100 text-green-800" :
                                  obj.status === "em-andamento" ? "bg-blue-100 text-blue-800" :
                                  obj.status === "pausado" ? "bg-yellow-100 text-yellow-800" :
                                  obj.status === "a-iniciar" ? "bg-purple-100 text-purple-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {obj.status === "em-andamento" ? "Em andamento" :
                                   obj.status === "concluido" ? "Concluído" :
                                   obj.status === "pausado" ? "Pausado" :
                                   obj.status === "a-iniciar" ? "A iniciar" : "Pendente"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm max-w-[200px] truncate">
                              {editandoObjetivoId === obj.id ? (
                                <Textarea
                                  value={objetivoEditado?.conexaoVvd || ""}
                                  onChange={(e) =>
                                    setObjetivoEditado({ ...objetivoEditado!, conexaoVvd: e.target.value })
                                  }
                                  rows={2}
                                  className="text-xs sm:text-sm"
                                />
                              ) : (
                                obj.conexaoVvd
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                                {editandoObjetivoId === obj.id ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSaveEditObjetivo(obj.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEditObjetivo}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartEditObjetivo(obj)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveObjetivo(obj.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Como chegar lá */}
          <TabsContent value="como-chegar" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Desenvolvimento</h3>
              </div>

              <div className="space-y-3">
                <Label>Habilidades a Desenvolver</Label>

                <div className="flex gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <Input
                    placeholder="Digite uma habilidade"
                    value={novaHabilidade}
                    onChange={(e) => setNovaHabilidade(e.target.value)}
                    spellCheck="true"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddHabilidade();
                      }
                    }}
                  />
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddHabilidade}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Habilidade
                </Button>

                {habilidades.length > 0 && (
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Habilidade</TableHead>
                          <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {habilidades.map((habilidade) => {
                          const isEditing = editandoHabilidadeId === habilidade.id;
                          
                          return (
                            <TableRow key={habilidade.id}>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    value={habilidadeEditada}
                                    onChange={(e) => setHabilidadeEditada(e.target.value)}
                                    spellCheck="true"
                                  />
                                ) : (
                                  habilidade.texto
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {isEditing ? (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSaveEditHabilidade(habilidade.id)}
                                      >
                                        <Check className="w-4 h-4 text-green-600" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancelEditHabilidade}
                                      >
                                        <X className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleStartEditHabilidade(habilidade)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveHabilidade(habilidade.id)}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Link 
                  to="/ferramentas" 
                  className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                >
                  Ferramenta de Habilidades (FF)
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PlanoDeVida;
