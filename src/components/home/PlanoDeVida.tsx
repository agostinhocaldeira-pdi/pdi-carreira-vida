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

interface PlanoDeVidaProps {
  onTabChange?: (tab: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const PlanoDeVida = ({ onTabChange, onOpenChange }: PlanoDeVidaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quem-sou");
  const [vvd, setVvd] = useState("");
  const [isEditingVvd, setIsEditingVvd] = useState(true);
  const [valores, setValores] = useState<string[]>(Array(12).fill(""));
  const [isEditingValores, setIsEditingValores] = useState(true);
  const [areasVida, setAreasVida] = useState([
    { area: "Carreira", notaAtual: "", notaDesejada: "" },
    { area: "Saúde", notaAtual: "", notaDesejada: "" },
    { area: "Relacionamentos", notaAtual: "", notaDesejada: "" },
    { area: "Finanças", notaAtual: "", notaDesejada: "" },
    { area: "Lazer", notaAtual: "", notaDesejada: "" },
  ]);
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

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedVvd = localStorage.getItem("vvd");
    if (savedVvd) {
      setVvd(savedVvd);
      setIsEditingVvd(false);
    }

    const savedValores = localStorage.getItem("valores");
    if (savedValores) {
      setValores(JSON.parse(savedValores));
      setIsEditingValores(false);
    }

    const savedAreas = localStorage.getItem("areasVida");
    if (savedAreas) {
      setAreasVida(JSON.parse(savedAreas));
      setIsEditingAreas(false);
    }

    const savedObjetivos = localStorage.getItem("objetivos");
    if (savedObjetivos) {
      setObjetivos(JSON.parse(savedObjetivos));
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
  };

  const handleEditVvd = () => {
    setIsEditingVvd(true);
  };

  const handleSaveValores = () => {
    localStorage.setItem("valores", JSON.stringify(valores));
    setIsEditingValores(false);
    toast.success("Valores salvos!");
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
  };

  const handleEditAreas = () => {
    setIsEditingAreas(true);
  };

  const updateArea = (index: number, field: 'notaAtual' | 'notaDesejada', value: string) => {
    const newAreas = [...areasVida];
    newAreas[index][field] = value;
    setAreasVida(newAreas);
  };

  const isAreasComplete = areasVida.every(
    (area) => area.notaAtual.trim() !== "" && area.notaDesejada.trim() !== ""
  );

  const handleGenerateInsight = async () => {
    console.log("🔍 handleGenerateInsight called");
    console.log("isAdmin:", isAdmin);
    console.log("canGenerateInsight:", canGenerateInsight);
    console.log("vvd:", vvd ? "preenchido" : "vazio");
    console.log("isValoresComplete:", isValoresComplete);
    console.log("isAreasComplete:", isAreasComplete);
    
    // Administradores não têm limite
    if (!isAdmin && !canGenerateInsight) {
      console.log("❌ Limite mensal atingido");
      toast.error("Você já gerou seu insight mensal. Contrate o plano Premium para gerar mais insights!");
      return;
    }

    if (!vvd && !isValoresComplete && !isAreasComplete) {
      console.log("❌ Nenhuma seção preenchida");
      toast.error("Preencha pelo menos uma seção para gerar insights");
      return;
    }

    console.log("✅ Iniciando geração de insight...");
    setIsGeneratingInsight(true);
    
    try {
      console.log("📡 Chamando edge function...");
      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { vvd, valores, areasVida }
      });

      console.log("📥 Resposta recebida:", { data, error });

      if (error) {
        console.error("❌ Error generating insight:", error);
        toast.error(error.message || "Erro ao gerar insight");
        return;
      }

      if (data?.insight) {
        console.log("✅ Insight gerado com sucesso");
        setInsight(data.insight);
        
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
      console.error("❌ Error:", error);
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
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
                  disabled={!isEditingVvd}
                />
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    to="/ferramentas" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Como criar seu VVD
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex gap-2">
                    {!isEditingVvd && (
                      <Button onClick={handleEditVvd} size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveVvd} 
                      size="sm" 
                      variant="outline"
                      disabled={!vvd.trim() || !isEditingVvd}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
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
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    to="/ferramentas" 
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
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium">Área</th>
                        <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium">Nota Atual</th>
                        <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium">Nota Desejada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areasVida.map((area, index) => (
                        <tr key={area.area} className="border-t">
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">{area.area}</td>
                          <td className="p-2 sm:p-3">
                            <Input 
                              type="number" 
                              min="0" 
                              max="10" 
                              className="w-16 sm:w-20 text-sm" 
                              placeholder="0-10"
                              value={area.notaAtual}
                              onChange={(e) => updateArea(index, 'notaAtual', e.target.value)}
                              disabled={!isEditingAreas}
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <Input 
                              type="number" 
                              min="0" 
                              max="10" 
                              className="w-16 sm:w-20 text-sm" 
                              placeholder="0-10"
                              value={area.notaDesejada}
                              onChange={(e) => updateArea(index, 'notaDesejada', e.target.value)}
                              disabled={!isEditingAreas}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    to="/ferramentas" 
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Acessar a Roda da Vida
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex gap-2">
                    {!isEditingAreas && (
                      <Button onClick={handleEditAreas} size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    <Button 
                      onClick={handleSaveAreas} 
                      size="sm" 
                      variant="outline"
                      disabled={!isAreasComplete || !isEditingAreas}
                    >
                      Salvar
                    </Button>
                  </div>
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
                  <Button 
                    onClick={handleGenerateInsight} 
                    size="sm" 
                    disabled={isGeneratingInsight || (!isAdmin && !canGenerateInsight) || (!vvd && !isValoresComplete && !isAreasComplete)}
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
                <h4 className="font-medium text-sm">Cadastrar Novo Objetivo</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo em Foco</Label>
                  <Input
                    id="objetivo"
                    placeholder="Descreva seu objetivo principal"
                    value={objetivo.texto}
                    onChange={(e) => setObjetivo({ ...objetivo, texto: e.target.value })}
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
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {obj.status === "em-andamento" ? "Em andamento" :
                                   obj.status === "concluido" ? "Concluído" :
                                   obj.status === "pausado" ? "Pausado" : "Pendente"}
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

              <div className="space-y-2">
                <Label>Habilidades a Desenvolver</Label>
                <Textarea
                  placeholder="Liste as habilidades que você precisa desenvolver..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" className="flex-1">
                  Cadastrar
                </Button>
                <Link 
                  to="/ferramentas" 
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
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
