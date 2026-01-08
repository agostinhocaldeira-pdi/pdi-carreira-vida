import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, ArrowRight, ArrowLeft, Home, Plus, Trash2, Pencil, Check, X, ChevronDown, Lightbulb, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { OKRLinkSection, CompanyOKRsOverview } from "@/components/home/OKRLinkSection";
import { useQueryClient } from "@tanstack/react-query";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { PDI_QUERY_KEYS, usePDIData } from "@/hooks/usePDIQueries";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import LogoutButton from "@/components/LogoutButton";

const PlanoVidaParaOnde = () => {
  const { isLoading: roleLoading, userRole } = useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const storage = usePDIStorage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: pdiData, isLoading: isQueryLoading } = usePDIData();
  
  const [isLoading, setIsLoading] = useState(true);
  const [objetivo, setObjetivo] = useState({
    texto: "",
    dataAlvo: "",
    conexaoVvd: "",
    status: "em-andamento",
    isPrincipal: false,
  });

  const [objetivos, setObjetivos] = useState<Array<{
    id: number;
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
    isPrincipal: boolean;
  }>>([]);

  const [editandoObjetivoId, setEditandoObjetivoId] = useState<number | null>(null);
  const [objetivoEditado, setObjetivoEditado] = useState<{
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
    isPrincipal: boolean;
  } | null>(null);

  // Estado para confirmação de alteração de objetivo principal
  const [showPrincipalConfirm, setShowPrincipalConfirm] = useState(false);
  const [pendingPrincipalAction, setPendingPrincipalAction] = useState<{ type: 'new' | 'edit' | 'toggle', objetivoId?: number } | null>(null);

  // Estado para modal de cadastro de meta
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [objetivoRecemCriado, setObjetivoRecemCriado] = useState<number | null>(null);

  // Estados para confirmação de exclusão
  const [deleteObjetivoId, setDeleteObjetivoId] = useState<string | number | null>(null);

  // Estado para insight inicial
  const [insightInicial, setInsightInicial] = useState("");

  // Carregar dados salvos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Objetivos
        const savedObjetivos = await storage.getObjetivos();
        if (savedObjetivos && savedObjetivos.length > 0) {
          setObjetivos(savedObjetivos.map((obj: any) => ({
            id: obj.id,
            texto: obj.texto,
            dataAlvo: obj.data_alvo || obj.dataAlvo || "",
            conexaoVvd: obj.conexao_vvd || obj.conexaoVvd || "",
            status: obj.status || "em-andamento",
            isPrincipal: obj.is_principal || obj.isPrincipal || false,
          })));
        } else {
          const localObjetivos = localStorage.getItem("objetivos");
          if (localObjetivos) {
            setObjetivos(JSON.parse(localObjetivos));
          }
        }

        // Load insight inicial
        const savedInsightInicial = localStorage.getItem("insightInicial");
        if (savedInsightInicial) {
          const parsed = JSON.parse(savedInsightInicial);
          setInsightInicial(parsed.insight || "");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  // Sync objetivos from React Query cache
  useEffect(() => {
    if (pdiData?.objetivos) {
      setObjetivos(
        pdiData.objetivos.map((obj: any) => ({
          id: obj.id,
          texto: obj.texto,
          dataAlvo: obj.data_alvo || obj.dataAlvo || "",
          conexaoVvd: obj.conexao_vvd || obj.conexaoVvd || "",
          status: obj.status || "em-andamento",
          isPrincipal: obj.is_principal || obj.isPrincipal || false,
        }))
      );
    }
  }, [pdiData?.objetivos]);

  // Verificar se já existe objetivo principal
  const hasExistingPrincipal = () => {
    return objetivos.some(obj => obj.isPrincipal);
  };

  // Handler para mudança do checkbox de objetivo principal no formulário
  const handlePrincipalChange = (checked: boolean) => {
    if (checked && hasExistingPrincipal()) {
      setPendingPrincipalAction({ type: 'new' });
      setShowPrincipalConfirm(true);
    } else {
      setObjetivo({ ...objetivo, isPrincipal: checked });
    }
  };

  // Handler para mudança do checkbox de objetivo principal na edição
  const handleEditPrincipalChange = (checked: boolean) => {
    if (checked && hasExistingPrincipal() && !objetivoEditado?.isPrincipal) {
      setPendingPrincipalAction({ type: 'edit', objetivoId: editandoObjetivoId! });
      setShowPrincipalConfirm(true);
    } else {
      setObjetivoEditado({ ...objetivoEditado!, isPrincipal: checked });
    }
  };

  // Handler para toggle de objetivo principal na lista
  const handleTogglePrincipal = (objetivoId: number, currentValue: boolean) => {
    if (!currentValue && hasExistingPrincipal()) {
      setPendingPrincipalAction({ type: 'toggle', objetivoId });
      setShowPrincipalConfirm(true);
    } else {
      const novosObjetivos = objetivos.map(obj => ({
        ...obj,
        isPrincipal: obj.id === objetivoId ? !currentValue : false,
      }));
      setObjetivos(novosObjetivos);
      saveObjetivosToStorage(novosObjetivos);
      toast.success(currentValue ? "Objetivo desmarcado como principal" : "Objetivo marcado como principal!");
    }
  };

  // Confirmar alteração de objetivo principal
  const confirmPrincipalChange = () => {
    if (!pendingPrincipalAction) return;

    if (pendingPrincipalAction.type === 'new') {
      // Desmarcar o objetivo principal atual e marcar o novo
      const novosObjetivos = objetivos.map(obj => ({ ...obj, isPrincipal: false }));
      setObjetivos(novosObjetivos);
      setObjetivo({ ...objetivo, isPrincipal: true });
    } else if (pendingPrincipalAction.type === 'edit') {
      // Na edição, desmarcar outros e marcar o atual
      const novosObjetivos = objetivos.map(obj => ({
        ...obj,
        isPrincipal: obj.id === pendingPrincipalAction.objetivoId ? false : obj.isPrincipal,
      }));
      setObjetivos(novosObjetivos.map(obj => ({ ...obj, isPrincipal: false })));
      setObjetivoEditado({ ...objetivoEditado!, isPrincipal: true });
    } else if (pendingPrincipalAction.type === 'toggle') {
      // No toggle, desmarcar outros e marcar o selecionado
      const novosObjetivos = objetivos.map(obj => ({
        ...obj,
        isPrincipal: obj.id === pendingPrincipalAction.objetivoId,
      }));
      setObjetivos(novosObjetivos);
      saveObjetivosToStorage(novosObjetivos);
      toast.success("Objetivo principal alterado!");
    }

    setShowPrincipalConfirm(false);
    setPendingPrincipalAction(null);
  };

  // Função auxiliar para salvar objetivos no storage
  const saveObjetivosToStorage = (objetivosToUpdate: typeof objetivos) => {
    localStorage.setItem("objetivos", JSON.stringify(objetivosToUpdate));
    const objetivosToSave = objetivosToUpdate.map(obj => ({
      id: obj.id,
      texto: obj.texto,
      data_alvo: obj.dataAlvo,
      conexao_vvd: obj.conexaoVvd,
      status: obj.status?.replace('-', ' ') || 'a fazer',
      is_principal: obj.isPrincipal,
    }));
    storage.saveObjetivos(objetivosToSave as any).then(() => {
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    }).catch(error => {
      console.error("Background objetivos sync error:", error);
    });
  };

  const handleSaveObjetivo = async () => {
    if (!objetivo.texto || !objetivo.dataAlvo) {
      toast.error("Preencha pelo menos o objetivo e a data alvo");
      return;
    }

    const novoObjetivo = { ...objetivo, id: Date.now() };
    
    // Se o novo objetivo é principal, desmarcar os outros
    const novosObjetivos = objetivo.isPrincipal 
      ? [...objetivos.map(obj => ({ ...obj, isPrincipal: false })), novoObjetivo]
      : [...objetivos, novoObjetivo];
    
    setObjetivos(novosObjetivos);
    
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo cadastrado!");
    
    const objetivosToSave = novosObjetivos.map(obj => ({
      id: obj.id,
      texto: obj.texto,
      data_alvo: obj.dataAlvo,
      conexao_vvd: obj.conexaoVvd,
      status: obj.status?.replace('-', ' ') || 'a fazer',
      is_principal: obj.isPrincipal,
    }));
    storage.saveObjetivos(objetivosToSave as any).catch(error => {
      console.error("Background objetivos sync error:", error);
    });
    setObjetivo({ texto: "", dataAlvo: "", conexaoVvd: "", status: "em-andamento", isPrincipal: false });
    
    setObjetivoRecemCriado(novoObjetivo.id);
    setShowMetaModal(true);
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  const handleMetaModalConfirm = () => {
    setShowMetaModal(false);
    
    // Navigate to step 3 and trigger the meta form
    if (objetivoRecemCriado) {
      navigate("/plano-vida/como-chegar", { 
        state: { openMetaFor: objetivoRecemCriado.toString() } 
      });
    }
    setObjetivoRecemCriado(null);
  };

  const handleMetaModalCancel = () => {
    setShowMetaModal(false);
    setObjetivoRecemCriado(null);
  };

  const handleRemoveObjetivo = (id: string | number) => {
    setDeleteObjetivoId(id);
  };

  const confirmRemoveObjetivo = () => {
    if (deleteObjetivoId == null) return;

    const prevObjetivos = objetivos;
    const novosObjetivos = prevObjetivos.filter((obj) => String(obj.id) !== String(deleteObjetivoId));
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo removido!");
    setDeleteObjetivoId(null);

    const objetivosToSave = novosObjetivos.map((obj) => ({
      id: obj.id,
      texto: obj.texto,
      data_alvo: obj.dataAlvo,
      conexao_vvd: obj.conexaoVvd,
      status: obj.status || 'a fazer',
      is_principal: obj.isPrincipal,
    }));
    storage.saveObjetivos(objetivosToSave as any).then(() => {
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    }).catch(error => {
      console.error("Background objetivos sync error:", error);
    });
  };

  const handleStartEditObjetivo = (obj: any) => {
    setEditandoObjetivoId(obj.id);
    setObjetivoEditado({
      texto: obj.texto,
      dataAlvo: obj.dataAlvo,
      conexaoVvd: obj.conexaoVvd,
      status: obj.status,
      isPrincipal: obj.isPrincipal || false,
    });
  };

  const handleCancelEditObjetivo = () => {
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
  };

  const handleSaveEditObjetivo = (id: number) => {
    if (!objetivoEditado) return;

    // Se o objetivo editado é principal, desmarcar os outros
    const novosObjetivos = objetivoEditado.isPrincipal
      ? objetivos.map((obj) => 
          obj.id === id 
            ? { ...obj, ...objetivoEditado } 
            : { ...obj, isPrincipal: false }
        )
      : objetivos.map((obj) => 
          obj.id === id ? { ...obj, ...objetivoEditado } : obj
        );
    
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
    toast.success("Objetivo atualizado!");
    
    // Salvar no storage
    saveObjetivosToStorage(novosObjetivos);
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  // Calcular progresso
  const calculateProgress = () => {
    return objetivos.length > 0 ? 100 : 0;
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PDILoader text="Carregando..." size="lg" variant="target" />
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

        {/* Insight Inicial - Read Only */}
        {insightInicial && (
          <Collapsible defaultOpen>
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-background">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-md">
                        <Lightbulb className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">Seu Insight Inicial</CardTitle>
                        <CardDescription className="text-xs font-bold">Crie objetivos que te conectam a quem você é. Utilize o insight acima para refletir sobre isso.</CardDescription>
                      </div>
                    </div>
                    <ChevronDown className="w-7 h-7 sm:w-6 sm:h-6 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 pt-0">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                      {insightInicial}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground italic text-center">
                    Crie objetivos que te conectam a quem você é. Utilize o insight acima para refletir sobre isso.
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        <Card className="shadow-medium overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Passo 2</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl">Para onde vou</CardTitle>
                <CardDescription>Defina seus objetivos</CardDescription>
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
                <PDILoader text="Carregando objetivos..." size="md" variant="target" />
              </div>
            ) : (
              <>
                {/* Overview de OKRs da empresa */}
                <CompanyOKRsOverview />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Meus Objetivos</h3>
                  </div>

                  {/* Lista de objetivos cadastrados - agora primeiro */}
                  {objetivos.length > 0 && (
                    <div className="space-y-3 max-w-full overflow-hidden">
                      <h4 className="font-medium text-sm">Objetivos Cadastrados</h4>
                      {/* Mobile - Cards */}
                      <div className="md:hidden space-y-3">
                        {objetivos.map((obj) => (
                          <div key={obj.id} className={`rounded-lg border p-3 bg-card space-y-2 ${obj.isPrincipal ? 'ring-2 ring-warning border-warning/50' : ''}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                {obj.isPrincipal && (
                                  <Star className="w-4 h-4 text-warning fill-warning flex-shrink-0" />
                                )}
                                <p className="text-sm font-medium line-clamp-2">{obj.texto}</p>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => handleTogglePrincipal(obj.id, obj.isPrincipal)}
                                  title={obj.isPrincipal ? "Desmarcar como principal" : "Marcar como principal"}
                                >
                                  <Star className={`w-4 h-4 ${obj.isPrincipal ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleStartEditObjetivo(obj)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleRemoveObjetivo(obj.id)}>
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{new Date(obj.dataAlvo).toLocaleDateString("pt-BR")}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                obj.status === "concluido" ? "bg-success/15 text-success" :
                                obj.status === "em-andamento" ? "bg-primary/15 text-primary" :
                                obj.status === "pausado" ? "bg-warning/15 text-warning" :
                                obj.status === "a-iniciar" ? "bg-secondary/20 text-secondary" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {obj.status === "em-andamento" ? "Em andamento" :
                                 obj.status === "concluido" ? "Concluído" :
                                 obj.status === "pausado" ? "Pausado" :
                                 obj.status === "a-iniciar" ? "A iniciar" : "Pendente"}
                              </span>
                            </div>
                            {obj.conexaoVvd && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{obj.conexaoVvd}</p>
                            )}
                            <OKRLinkSection objetivoId={obj.id.toString()} objetivoTexto={obj.texto} />
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:block rounded-lg border overflow-x-auto max-w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm w-10">
                                <Star className="w-4 h-4 text-warning" />
                              </TableHead>
                              <TableHead className="text-xs sm:text-sm">Objetivo</TableHead>
                              <TableHead className="text-xs sm:text-sm">Data Alvo</TableHead>
                              <TableHead className="text-xs sm:text-sm">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm">Conexão VVD</TableHead>
                              <TableHead className="text-xs sm:text-sm text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {objetivos.map((obj) => (
                              <TableRow key={obj.id} className={obj.isPrincipal ? 'bg-warning/5' : ''}>
                                <TableCell className="text-center">
                                  {editandoObjetivoId === obj.id ? (
                                    <Checkbox
                                      checked={objetivoEditado?.isPrincipal || false}
                                      onCheckedChange={(checked) => handleEditPrincipalChange(checked as boolean)}
                                    />
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleTogglePrincipal(obj.id, obj.isPrincipal)}
                                      title={obj.isPrincipal ? "Desmarcar como principal" : "Marcar como principal"}
                                    >
                                      <Star className={`w-4 h-4 ${obj.isPrincipal ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                                    </Button>
                                  )}
                                </TableCell>
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
                                    <div>
                                      <div>{obj.texto}</div>
                                      <OKRLinkSection 
                                        objetivoId={obj.id.toString()} 
                                        objetivoTexto={obj.texto}
                                      />
                                    </div>
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
                                      obj.status === "concluido" ? "bg-success/15 text-success" :
                                      obj.status === "em-andamento" ? "bg-primary/15 text-primary" :
                                      obj.status === "pausado" ? "bg-warning/15 text-warning" :
                                      obj.status === "a-iniciar" ? "bg-secondary/20 text-secondary" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                      {obj.status === "em-andamento" ? "Em andamento" :
                                       obj.status === "concluido" ? "Concluído" :
                                       obj.status === "pausado" ? "Pausado" :
                                       obj.status === "a-iniciar" ? "A iniciar" : "Pendente"}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {editandoObjetivoId === obj.id ? (
                                    <Textarea
                                      value={objetivoEditado?.conexaoVvd || ""}
                                      onChange={(e) =>
                                        setObjetivoEditado({ ...objetivoEditado!, conexaoVvd: e.target.value })
                                      }
                                      rows={2}
                                      className="text-xs sm:text-sm"
                                    />
                                  ) : obj.conexaoVvd ? (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="line-clamp-2 cursor-help max-w-[180px] block">
                                            {obj.conexaoVvd}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs">
                                          <p className="text-sm whitespace-pre-wrap">{obj.conexaoVvd}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ) : (
                                    <span className="text-muted-foreground italic">-</span>
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

                  {/* Formulário de cadastro em Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          <span>Objetivos</span>
                        </div>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
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

                        <div className="flex items-center space-x-3 p-3 rounded-lg border bg-accent/5">
                          <Checkbox
                            id="isPrincipal"
                            checked={objetivo.isPrincipal}
                            onCheckedChange={(checked) => handlePrincipalChange(checked as boolean)}
                          />
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-warning" />
                            <Label htmlFor="isPrincipal" className="font-medium cursor-pointer">
                              Este é meu objetivo principal
                            </Label>
                          </div>
                        </div>

                        <Button onClick={handleSaveObjetivo} className="w-full text-sm">
                          Salvar
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Texto motivacional */}
                  <p className="text-sm text-muted-foreground italic text-center pt-4 border-t">
                    "Um objetivo é norte - a conquista virá com a execução"
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/plano-vida/quem-sou")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Anterior: Quem sou Eu
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Retorne caso deseje ajustar algo
            </p>
          </div>
          <div className="text-center">
            <Button onClick={() => navigate("/plano-vida/como-chegar")} className="gap-2">
              Próximo: Como chegar lá
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Chegou a hora de dizer como você vai por a mão na massa para conquistar o que deseja
            </p>
          </div>
        </div>
      </div>

      {/* Modal para perguntar se quer cadastrar meta */}
      <Dialog open={showMetaModal} onOpenChange={setShowMetaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Objetivo cadastrado com sucesso!</DialogTitle>
            <DialogDescription>
              Deseja cadastrar uma meta agora para este objetivo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleMetaModalCancel}>
              Não, depois
            </Button>
            <Button onClick={handleMetaModalConfirm}>
              Sim, cadastrar meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDeleteDialog
        open={deleteObjetivoId !== null}
        onOpenChange={() => setDeleteObjetivoId(null)}
        onConfirm={confirmRemoveObjetivo}
        title="Excluir Objetivo"
        description="Tem certeza que deseja excluir este objetivo? Esta ação não pode ser desfeita."
      />

      {/* AlertDialog para confirmar alteração de objetivo principal */}
      <AlertDialog open={showPrincipalConfirm} onOpenChange={setShowPrincipalConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar objetivo principal?</AlertDialogTitle>
            <AlertDialogDescription>
              Você já possui um objetivo marcado como principal. Deseja alterar o objetivo principal para este?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPrincipalAction(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPrincipalChange}>
              Sim, alterar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanoVidaParaOnde;
