import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Rocket, Plus, Trash2, Pencil, Check, X, ChevronDown, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { usePDIStorage } from "@/hooks/usePDIStorage";

const MaoNaMassa = () => {
  const storage = usePDIStorage();
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState("");
  const [objetivosDisponiveis, setObjetivosDisponiveis] = useState<Array<{
    id: number;
    texto: string;
  }>>([]);

  const [meta, setMeta] = useState({
    objetivoId: "",
    texto: "",
    dataAlvo: "",
    medicao: "",
    inicio: "",
    passos: "",
  });

  const [acoes, setAcoes] = useState<Array<{
    id: number;
    acao: string;
    periodicidade: string;
    status: string;
  }>>([]);

  const [novaAcao, setNovaAcao] = useState({
    acao: "",
    periodicidade: "",
    status: "a-fazer",
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [acaoEditada, setAcaoEditada] = useState<{
    acao: string;
    periodicidade: string;
    status: string;
  } | null>(null);

  const [passos, setPassos] = useState<Array<{
    id: number;
    passo: string;
  }>>([]);

  const [novoPasso, setNovoPasso] = useState("");
  const [editandoPassoId, setEditandoPassoId] = useState<number | null>(null);
  const [passoEditado, setPassoEditado] = useState("");

  const [metasCadastradas, setMetasCadastradas] = useState<Array<any>>([]);
  const [editandoMetaId, setEditandoMetaId] = useState<number | null>(null);

  // Estados para confirmação de exclusão
  const [deleteAcaoId, setDeleteAcaoId] = useState<number | null>(null);
  const [deletePassoId, setDeletePassoId] = useState<number | null>(null);
  const [deleteMetaId, setDeleteMetaId] = useState<number | null>(null);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Objetivos
        const savedObjetivos = await storage.getObjetivos();
        if (savedObjetivos && savedObjetivos.length > 0) {
          setObjetivosDisponiveis(savedObjetivos.map((obj: any) => ({
            id: obj.id,
            texto: obj.texto,
          })));
        } else {
          const localObjetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
          setObjetivosDisponiveis(localObjetivos);
        }

        // Metas
        const savedMetas = await storage.getMetas();
        if (savedMetas && savedMetas.length > 0) {
          setMetasCadastradas(savedMetas.map((meta: any) => ({
            id: meta.id,
            objetivoId: meta.objetivo_id || meta.objetivoId,
            texto: meta.texto,
            dataAlvo: meta.data_alvo || meta.dataAlvo,
            medicao: meta.medicao,
            inicio: meta.inicio,
            concluida: meta.concluida,
            acoes: meta.acoes || [],
            passos: meta.passos || [],
            from_smart: meta.from_smart,
          })));
        } else {
          const localMetas = JSON.parse(localStorage.getItem("metas") || "[]");
          setMetasCadastradas(localMetas);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to localStorage
        const localObjetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
        setObjetivosDisponiveis(localObjetivos);
        const localMetas = JSON.parse(localStorage.getItem("metas") || "[]");
        setMetasCadastradas(localMetas);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  // Escutar evento para abrir formulário de meta com objetivo pré-selecionado
  useEffect(() => {
    const handleOpenMetaForm = (event: CustomEvent<{ objetivoId: string }>) => {
      // Recarregar objetivos para incluir o recém criado
      const objetivosSalvos = JSON.parse(localStorage.getItem("objetivos") || "[]");
      setObjetivosDisponiveis(objetivosSalvos);
      
      const objetivoId = event.detail.objetivoId;
      
      // Selecionar o objetivo e preencher o formulário
      setObjetivoSelecionado(objetivoId);
      setMeta(prev => ({
        ...prev,
        objetivoId: objetivoId,
      }));
      setIsFormOpen(true);
      
      // Rolar para o formulário
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    window.addEventListener('openMetaForm', handleOpenMetaForm as EventListener);
    return () => {
      window.removeEventListener('openMetaForm', handleOpenMetaForm as EventListener);
    };
  }, []);

  const handleAddAcao = () => {
    if (!novaAcao.acao) {
      toast.error("Preencha a ação");
      return;
    }

    setAcoes([...acoes, { ...novaAcao, id: Date.now() }]);
    setNovaAcao({ acao: "", periodicidade: "", status: "a-fazer" });
    toast.success("Ação adicionada!");
  };

  const handleRemoveAcao = (id: number) => {
    setDeleteAcaoId(id);
  };

  const confirmRemoveAcao = () => {
    if (deleteAcaoId) {
      setAcoes(acoes.filter((acao) => acao.id !== deleteAcaoId));
      toast.success("Ação removida!");
      setDeleteAcaoId(null);
    }
  };

  const handleStartEdit = (acao: any) => {
    setEditandoId(acao.id);
    setAcaoEditada({
      acao: acao.acao,
      periodicidade: acao.periodicidade,
      status: acao.status,
    });
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setAcaoEditada(null);
  };

  const handleSaveEdit = (id: number) => {
    if (!acaoEditada) return;

    setAcoes(acoes.map((acao) => 
      acao.id === id ? { ...acao, ...acaoEditada } : acao
    ));
    setEditandoId(null);
    setAcaoEditada(null);
    toast.success("Ação atualizada!");
  };

  const handleAddPasso = () => {
    if (!novoPasso.trim()) {
      toast.error("Preencha o passo");
      return;
    }

    setPassos([...passos, { id: Date.now(), passo: novoPasso }]);
    setNovoPasso("");
    toast.success("Passo adicionado!");
  };

  const handleRemovePasso = (id: number) => {
    setDeletePassoId(id);
  };

  const confirmRemovePasso = () => {
    if (deletePassoId) {
      setPassos(passos.filter((passo) => passo.id !== deletePassoId));
      toast.success("Passo removido!");
      setDeletePassoId(null);
    }
  };

  const handleStartEditPasso = (passo: any) => {
    setEditandoPassoId(passo.id);
    setPassoEditado(passo.passo);
  };

  const handleCancelEditPasso = () => {
    setEditandoPassoId(null);
    setPassoEditado("");
  };

  const handleSaveEditPasso = (id: number) => {
    if (!passoEditado.trim()) return;

    setPassos(passos.map((passo) => 
      passo.id === id ? { ...passo, passo: passoEditado } : passo
    ));
    setEditandoPassoId(null);
    setPassoEditado("");
    toast.success("Passo atualizado!");
  };

  const handleSaveMeta = async () => {
    if (!objetivoSelecionado) {
      toast.error("Selecione um objetivo primeiro");
      return;
    }
    
    if (!meta.texto || !meta.dataAlvo) {
      toast.error("Preencha pelo menos a meta e a data alvo");
      return;
    }

    setIsSaving(true);
    try {
      const metas = [...metasCadastradas];
      
      if (editandoMetaId) {
        const metasAtualizadas = metas.map((m: any) => 
          m.id === editandoMetaId 
            ? { ...meta, objetivoId: objetivoSelecionado, acoes, passos, id: editandoMetaId, concluida: false }
            : m
        );
        await storage.saveMetas(metasAtualizadas);
        localStorage.setItem("metas", JSON.stringify(metasAtualizadas));
        setMetasCadastradas(metasAtualizadas);
        toast.success("Meta atualizada com sucesso!");
        setEditandoMetaId(null);
        setIsFormOpen(false);
      } else {
        const novaMeta = { ...meta, objetivoId: objetivoSelecionado, acoes, passos, id: Date.now(), concluida: false };
        metas.push(novaMeta);
        await storage.saveMetas(metas);
        localStorage.setItem("metas", JSON.stringify(metas));
        setMetasCadastradas(metas);
        setShowSuggestionModal(true);
        setIsFormOpen(false);
        
        if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
          (window as any).markSectionCompleted("Mão na Massa (Metas)");
        }
      }
    } catch (error) {
      console.error("Error saving meta:", error);
      toast.error("Erro ao salvar meta");
    } finally {
      setIsSaving(false);
    }
    
    // Reset form
    setObjetivoSelecionado("");
    setMeta({
      objetivoId: "",
      texto: "",
      dataAlvo: "",
      medicao: "",
      inicio: "",
      passos: "",
    });
    setAcoes([]);
    setPassos([]);
  };

  const handleEditMeta = (metaId: number) => {
    const metaParaEditar = metasCadastradas.find((m) => m.id === metaId);
    if (!metaParaEditar) return;

    setEditandoMetaId(metaId);
    setObjetivoSelecionado(metaParaEditar.objetivoId);
    setMeta({
      objetivoId: metaParaEditar.objetivoId,
      texto: metaParaEditar.texto,
      dataAlvo: metaParaEditar.dataAlvo,
      medicao: metaParaEditar.medicao || "",
      inicio: metaParaEditar.inicio || "",
      passos: metaParaEditar.passos || "",
    });
    setAcoes(metaParaEditar.acoes || []);
    setPassos(metaParaEditar.passos || []);
    
    // Expandir formulário e manter no formulário
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    toast.info("Meta carregada para edição");
  };

  const handleDeleteMeta = (metaId: number) => {
    setDeleteMetaId(metaId);
  };

  const confirmDeleteMeta = () => {
    if (deleteMetaId) {
      const metasAtualizadas = metasCadastradas.filter((m) => m.id !== deleteMetaId);
      localStorage.setItem("metas", JSON.stringify(metasAtualizadas));
      setMetasCadastradas(metasAtualizadas);
      toast.success("Meta removida!");
      setDeleteMetaId(null);
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Rocket className="w-6 h-6 text-accent" />
          Mão na Massa
        </CardTitle>
        <CardDescription>Transforme seus objetivos em metas executáveis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tabela de Metas Cadastradas - SEMPRE VISÍVEL */}
          {metasCadastradas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Metas Cadastradas</h3>
              
              {/* Versão Desktop - Tabela */}
              <div className="hidden md:block rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Objetivo</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Data Alvo</TableHead>
                      <TableHead>Ações</TableHead>
                      <TableHead>Passos</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metasCadastradas.map((metaCadastrada) => {
                      const objetivo = objetivosDisponiveis.find(
                        (obj) => obj.id?.toString() === metaCadastrada.objetivoId
                      );
                      
                      return (
                        <TableRow key={metaCadastrada.id}>
                          <TableCell className="font-medium">
                            {objetivo?.texto || "Objetivo não encontrado"}
                          </TableCell>
                          <TableCell>{metaCadastrada.texto}</TableCell>
                          <TableCell>
                            {(() => {
                              const dataValor = metaCadastrada.dataAlvo || metaCadastrada.data_alvo;
                              if (!dataValor) return "-";
                              const data = new Date(dataValor);
                              return isNaN(data.getTime()) ? "-" : data.toLocaleDateString('pt-BR');
                            })()}
                          </TableCell>
                           <TableCell>
                            <div className="space-y-1">
                              {metaCadastrada.acoes && Array.isArray(metaCadastrada.acoes) && metaCadastrada.acoes.length > 0 ? (
                                metaCadastrada.acoes.map((acao: any, idx: number) => (
                                  <div key={`acao-${metaCadastrada.id}-${idx}`} className="text-sm">
                                    • {acao?.acao || "Ação sem nome"}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">Nenhuma ação</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {metaCadastrada.passos && Array.isArray(metaCadastrada.passos) && metaCadastrada.passos.length > 0 ? (
                                metaCadastrada.passos.map((passo: any, idx: number) => (
                                  <div key={`passo-${metaCadastrada.id}-${idx}`} className="text-sm">
                                    {idx + 1}. {passo?.passo || "Passo sem descrição"}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">Nenhum passo</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMeta(metaCadastrada.id)}
                                title="Editar meta"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMeta(metaCadastrada.id)}
                                title="Excluir meta"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Versão Mobile - Cards */}
              <div className="md:hidden space-y-4">
                {metasCadastradas.map((metaCadastrada) => {
                  const objetivo = objetivosDisponiveis.find(
                    (obj) => obj.id?.toString() === metaCadastrada.objetivoId
                  );
                  
                  return (
                    <Card key={metaCadastrada.id} className="shadow-sm">
                      <CardContent className="pt-6 space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Objetivo</Label>
                          <p className="font-medium">{objetivo?.texto || "Objetivo não encontrado"}</p>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Meta</Label>
                          <p className="text-sm">{metaCadastrada.texto}</p>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Data Alvo</Label>
                          <p className="text-sm">
                            {(() => {
                              const dataValor = metaCadastrada.dataAlvo || metaCadastrada.data_alvo;
                              if (!dataValor) return "-";
                              const data = new Date(dataValor);
                              return isNaN(data.getTime()) ? "-" : data.toLocaleDateString('pt-BR');
                            })()}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Ações</Label>
                          {metaCadastrada.acoes && Array.isArray(metaCadastrada.acoes) && metaCadastrada.acoes.length > 0 ? (
                            <div className="space-y-1 mt-1">
                              {metaCadastrada.acoes.map((acao: any, idx: number) => (
                                <div key={`acao-mobile-${metaCadastrada.id}-${idx}`} className="text-sm">
                                  • {acao?.acao || "Ação sem nome"}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">Nenhuma ação</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground">Passos</Label>
                          {metaCadastrada.passos && Array.isArray(metaCadastrada.passos) && metaCadastrada.passos.length > 0 ? (
                            <div className="space-y-1 mt-1">
                              {metaCadastrada.passos.map((passo: any, idx: number) => (
                                <div key={`passo-mobile-${metaCadastrada.id}-${idx}`} className="text-sm">
                                  {idx + 1}. {passo?.passo || "Passo sem descrição"}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">Nenhum passo</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMeta(metaCadastrada.id)}
                            className="flex-1"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMeta(metaCadastrada.id)}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão Cadastrar Nova Meta */}
          <div ref={formRef}>
            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div className="flex justify-center">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-primary/10 hover:border-primary transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  {isFormOpen ? "Ocultar Formulário" : "Cadastrar Nova Meta"}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFormOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-6">
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  {editandoMetaId ? "Editar Meta" : "Nova Meta"}
                </h3>
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select
                value={objetivoSelecionado}
                onValueChange={(value) => {
                  setObjetivoSelecionado(value);
                  setMeta({ ...meta, objetivoId: value });
                }}
              >
                <SelectTrigger id="objetivo">
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {objetivosDisponiveis.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhum objetivo cadastrado</SelectItem>
                  ) : (
                    objetivosDisponiveis.filter(obj => obj.id != null).map((obj) => (
                      <SelectItem key={obj.id} value={obj.id!.toString()}>
                        {obj.texto}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta">Meta</Label>
              <Input
                id="meta"
                placeholder="Ex: Conquistar promoção para cargo de liderança"
                value={meta.texto}
                onChange={(e) => setMeta({ ...meta, texto: e.target.value })}
                disabled={!objetivoSelecionado}
                spellCheck="true"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAlvo">Data Alvo</Label>
                <Input
                  id="dataAlvo"
                  type="date"
                  value={meta.dataAlvo}
                  onChange={(e) => setMeta({ ...meta, dataAlvo: e.target.value })}
                  disabled={!objetivoSelecionado}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inicio">Quando Começo</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={meta.inicio}
                  onChange={(e) => setMeta({ ...meta, inicio: e.target.value })}
                  disabled={!objetivoSelecionado}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicao">Como vou medir</Label>
              <Input
                id="medicao"
                placeholder="Ex: Receber feedback positivo do gestor, assumir projeto importante"
                value={meta.medicao}
                onChange={(e) => setMeta({ ...meta, medicao: e.target.value })}
                disabled={!objetivoSelecionado}
                spellCheck="true"
              />
            </div>


            <div className="space-y-3">
              <Label>Ações</Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="nova-acao" className="text-xs">Nova Ação</Label>
                  <Input
                    id="nova-acao"
                    placeholder="Descreva a ação"
                    value={novaAcao.acao}
                    onChange={(e) => setNovaAcao({ ...novaAcao, acao: e.target.value })}
                    className="text-sm"
                    disabled={!objetivoSelecionado}
                    spellCheck="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nova-periodicidade" className="text-xs">Periodicidade</Label>
                  <Select
                    value={novaAcao.periodicidade}
                    onValueChange={(value) => setNovaAcao({ ...novaAcao, periodicidade: value })}
                    disabled={!objetivoSelecionado}
                  >
                    <SelectTrigger id="nova-periodicidade" className="text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diariamente">Diariamente</SelectItem>
                      <SelectItem value="semanalmente">Semanalmente</SelectItem>
                      <SelectItem value="mensalmente">Mensalmente</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="novo-status" className="text-xs">Status</Label>
                  <Select
                    value={novaAcao.status}
                    onValueChange={(value) => setNovaAcao({ ...novaAcao, status: value })}
                    disabled={!objetivoSelecionado}
                  >
                    <SelectTrigger id="novo-status" className="text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a-fazer">A fazer</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {acoes.length > 0 && (
                <div className="rounded-lg border overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Ação</TableHead>
                        <TableHead className="text-xs sm:text-sm">Periodicidade</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {acoes.map((acao) => {
                        const isEditing = editandoId === acao.id;
                        
                        return (
                          <TableRow key={acao.id}>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={acaoEditada?.acao || ""}
                                  onChange={(e) => setAcaoEditada({ ...acaoEditada!, acao: e.target.value })}
                                />
                              ) : (
                                acao.acao
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select
                                  value={acaoEditada?.periodicidade || ""}
                                  onValueChange={(value) => setAcaoEditada({ ...acaoEditada!, periodicidade: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="diariamente">Diariamente</SelectItem>
                                    <SelectItem value="semanalmente">Semanalmente</SelectItem>
                                    <SelectItem value="mensalmente">Mensalmente</SelectItem>
                                    <SelectItem value="trimestral">Trimestral</SelectItem>
                                    <SelectItem value="semestral">Semestral</SelectItem>
                                    <SelectItem value="anual">Anual</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="capitalize">{acao.periodicidade}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select
                                  value={acaoEditada?.status || ""}
                                  onValueChange={(value) => setAcaoEditada({ ...acaoEditada!, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="a-fazer">A fazer</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                                    <SelectItem value="concluido">Concluído</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  acao.status === "concluido" 
                                    ? "bg-green-100 text-green-800" 
                                    : acao.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : acao.status === "em-andamento"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {acao.status === "concluido" ? "Concluído" 
                                    : acao.status === "pendente" ? "Pendente" 
                                    : acao.status === "em-andamento" ? "Em andamento"
                                    : "A fazer"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSaveEdit(acao.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartEdit(acao)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveAcao(acao.id)}
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

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddAcao}
                disabled={!objetivoSelecionado}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ação
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Passos</Label>

              <div className="flex gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <Input
                  placeholder="Descreva o passo"
                  value={novoPasso}
                  onChange={(e) => setNovoPasso(e.target.value)}
                  disabled={!objetivoSelecionado}
                  spellCheck="true"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPasso();
                    }
                  }}
                />
              </div>

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddPasso}
                disabled={!objetivoSelecionado}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Mais Passos
              </Button>

              {passos.length > 0 && (
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Passo</TableHead>
                        <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passos.map((passo) => {
                        const isEditing = editandoPassoId === passo.id;
                        
                        return (
                          <TableRow key={passo.id}>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={passoEditado}
                                  onChange={(e) => setPassoEditado(e.target.value)}
                                />
                              ) : (
                                passo.passo
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSaveEditPasso(passo.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEditPasso}
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartEditPasso(passo)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemovePasso(passo.id)}
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
            </div>

                <Button onClick={handleSaveMeta} className="w-full" size="lg" disabled={!objetivoSelecionado}>
                  {editandoMetaId ? "Atualizar Meta" : "Cadastrar Meta"}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          </div>
        </div>
      </CardContent>

      <Dialog open={showSuggestionModal} onOpenChange={setShowSuggestionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-6 h-6 text-accent" />
              Meta Cadastrada com Sucesso! 🎉
            </DialogTitle>
            <DialogDescription className="text-base space-y-3 pt-3">
              <p className="font-semibold text-foreground">
                Sua meta foi registrada no Plano de Vida.
              </p>
              <p className="bg-accent/10 p-3 rounded-md border border-accent/20">
                <span className="font-semibold text-accent">💡 Sugestão:</span> Para garantir que você dedique tempo para trabalhar nesta meta, cadastre uma ação relacionada na <span className="font-semibold">Matriz de Eisenhower</span> como <span className="font-semibold text-accent">"Importante não urgente"</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Isso ajudará você a priorizar o que realmente importa sem deixar para depois!
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSuggestionModal(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setShowSuggestionModal(false);
                navigate('/ferramentas/eisenhower');
              }}
              className="w-full sm:w-auto"
            >
              Ir para Matriz de Eisenhower
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs de Confirmação de Exclusão */}
      <ConfirmDeleteDialog
        open={deleteAcaoId !== null}
        onOpenChange={() => setDeleteAcaoId(null)}
        onConfirm={confirmRemoveAcao}
        title="Excluir Ação"
        description="Tem certeza que deseja excluir esta ação?"
      />

      <ConfirmDeleteDialog
        open={deletePassoId !== null}
        onOpenChange={() => setDeletePassoId(null)}
        onConfirm={confirmRemovePasso}
        title="Excluir Passo"
        description="Tem certeza que deseja excluir este passo?"
      />

      <ConfirmDeleteDialog
        open={deleteMetaId !== null}
        onOpenChange={() => setDeleteMetaId(null)}
        onConfirm={confirmDeleteMeta}
        title="Excluir Meta"
        description="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
      />
    </Card>
  );
};

export default MaoNaMassa;
