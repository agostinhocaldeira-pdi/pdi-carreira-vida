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
import { Rocket, Plus, Trash2, Pencil, Check, X, ChevronDown, Lightbulb, Loader2, Target, LayoutGrid, ArrowRight, MousePointerClick, Volume2, VolumeX, Zap, Footprints } from "lucide-react";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { usePDIData, useDeleteMeta, useSaveMeta, PDI_QUERY_KEYS } from "@/hooks/usePDIQueries";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";
import { supabase } from "@/integrations/supabase/client";
import { useExplanationAudio } from "@/hooks/useExplanationAudio";

interface MaoNaMassaProps {
  embedded?: boolean;
  fullscreenMode?: boolean;
  onOpenFullscreen?: () => void;
  onCloseFullscreen?: () => void;
}

// Reusable audio button component
const EntendaMelhorButton = ({ type, text }: { type: string; text: string }) => {
  const { isPlaying, isLoading, toggleAudio } = useExplanationAudio(type);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setShowModal(true)}
        className="text-xs sm:text-sm bg-[#D4AF37] hover:bg-[#C9A431] text-[#0D0D0D] font-semibold"
      >
        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        Entenda Melhor
      </Button>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Entenda Melhor</span>
              <button
                onClick={toggleAudio}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[10px]">
                  {isLoading ? "..." : isPlaying ? "Parar" : "Ouvir"}
                </span>
              </button>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MaoNaMassa = ({ embedded = false, fullscreenMode = false, onOpenFullscreen, onCloseFullscreen }: MaoNaMassaProps) => {
  const storage = usePDIStorage();
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { celebrateAction } = useActionCelebration();
  
  const { data: pdiData, isLoading: isQueryLoading } = usePDIData();
  const deleteMetaMutation = useDeleteMeta();
  
  // Form modes
  const [activeForm, setActiveForm] = useState<'none' | 'meta' | 'acao' | 'passo'>('none');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal states
  const [showMetaSavedModal, setShowMetaSavedModal] = useState(false);
  const [showAcaoSavedModal, setShowAcaoSavedModal] = useState(false);
  const [showPassoSavedModal, setShowPassoSavedModal] = useState(false);
  
  // Derive objetivos from React Query cache
  const objetivosDisponiveis = (pdiData?.objetivos || JSON.parse(localStorage.getItem("objetivos") || "[]")).map((obj: any) => ({
    id: obj.id,
    texto: obj.texto,
  }));
  
  // Derive metas from React Query cache
  const [metasCadastradas, setMetasCadastradas] = useState<Array<any>>([]);

  // Meta form state
  const [objetivoSelecionado, setObjetivoSelecionado] = useState("");
  const [meta, setMeta] = useState({
    objetivoId: "",
    texto: "",
    dataAlvo: "",
    medicao: "",
    inicio: "",
  });
  const [editandoMetaId, setEditandoMetaId] = useState<number | null>(null);

  // Ação form state
  const [acaoMetaSelecionada, setAcaoMetaSelecionada] = useState("");
  const [novaAcao, setNovaAcao] = useState({
    acao: "",
    periodicidade: "",
    status: "a-fazer",
    dataPontual: "",
  });

  // Passo form state
  const [passoAcaoSelecionada, setPassoAcaoSelecionada] = useState("");
  const [passoMetaSelecionada, setPassoMetaSelecionada] = useState("");
  const [novoPasso, setNovoPasso] = useState("");

  // Delete confirmation states
  const [deleteMetaId, setDeleteMetaId] = useState<number | null>(null);
  const [deletingMetaId, setDeletingMetaId] = useState<number | null>(null);

  // Sync metas from React Query cache to local state
  useEffect(() => {
    const metas = pdiData?.metas || JSON.parse(localStorage.getItem("metas") || "[]");
    const mappedMetas = metas.map((meta: any) => ({
      id: meta.id,
      objetivoId: meta.objetivo_id || meta.objetivoId,
      objetivo_id: meta.objetivo_id || meta.objetivoId,
      texto: meta.texto,
      dataAlvo: meta.data_alvo || meta.dataAlvo,
      data_alvo: meta.data_alvo || meta.dataAlvo,
      medicao: meta.medicao,
      inicio: meta.inicio,
      concluida: meta.concluida,
      acoes: meta.acoes || [],
      passos: meta.passos || [],
      from_smart: meta.from_smart,
    }));
    setMetasCadastradas(mappedMetas);
  }, [pdiData?.metas]);

  // Listen for openMetaForm event
  useEffect(() => {
    const handleOpenMetaForm = (event: CustomEvent<{ objetivoId: string }>) => {
      const objetivoId = event.detail.objetivoId;
      setObjetivoSelecionado(objetivoId);
      setMeta(prev => ({ ...prev, objetivoId }));
      setActiveForm('meta');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
    window.addEventListener('openMetaForm', handleOpenMetaForm as EventListener);
    return () => window.removeEventListener('openMetaForm', handleOpenMetaForm as EventListener);
  }, []);

  // ========== META HANDLERS ==========
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
            ? { ...m, ...meta, objetivoId: objetivoSelecionado, concluida: false }
            : m
        );
        localStorage.setItem("metas", JSON.stringify(metasAtualizadas));
        setMetasCadastradas(metasAtualizadas);
        celebrateAction('goal', 'Meta');
        setEditandoMetaId(null);
        setActiveForm('none');
        toast.success("Meta atualizada!");
        storage.saveMetas(metasAtualizadas).catch(err => console.error("Sync error:", err));
      } else {
        const novaMeta = { ...meta, id: `temp-${Date.now()}`, objetivoId: objetivoSelecionado, acoes: [], passos: [], concluida: false };
        const optimisticMetas = [...metas, novaMeta];
        localStorage.setItem("metas", JSON.stringify(optimisticMetas));
        setMetasCadastradas(optimisticMetas);
        celebrateAction('goal', 'Meta');
        setActiveForm('none');
        setShowMetaSavedModal(true);
        
        if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
          (window as any).markSectionCompleted("Mão na Massa (Metas)");
        }
        
        storage.saveMetas(optimisticMetas).then(async () => {
          const updatedMetas = await storage.getMetas();
          if (updatedMetas && updatedMetas.length > 0) {
            localStorage.setItem("metas", JSON.stringify(updatedMetas));
            setMetasCadastradas(updatedMetas);
          }
        }).catch(err => console.error("Sync error:", err));
      }
    } catch (error) {
      console.error("Error saving meta:", error);
      toast.error("Erro ao salvar meta");
    } finally {
      setIsSaving(false);
    }
    
    resetMetaForm();
  };

  const resetMetaForm = () => {
    setObjetivoSelecionado("");
    setMeta({ objetivoId: "", texto: "", dataAlvo: "", medicao: "", inicio: "" });
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
    });
    setActiveForm('meta');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    toast.info("Meta carregada para edição");
  };

  const handleDeleteMeta = (metaId: number) => setDeleteMetaId(metaId);

  const confirmDeleteMeta = async () => {
    if (deleteMetaId) {
      setDeletingMetaId(deleteMetaId);
      try {
        await deleteMetaMutation.mutateAsync(deleteMetaId);
        const metasAtualizadas = metasCadastradas.filter((m) => m.id !== deleteMetaId);
        setMetasCadastradas(metasAtualizadas);
        toast.success("Meta removida!");
      } catch (error) {
        console.error("Error deleting meta:", error);
        toast.error("Erro ao remover meta. Tente novamente.");
      } finally {
        setDeleteMetaId(null);
        setDeletingMetaId(null);
      }
    }
  };

  // ========== AÇÃO HANDLERS ==========
  const handleSaveAcao = async () => {
    if (!acaoMetaSelecionada) {
      toast.error("Selecione uma meta primeiro");
      return;
    }
    if (!novaAcao.acao) {
      toast.error("Preencha a ação");
      return;
    }

    setIsSaving(true);
    try {
      const metasAtualizadas = metasCadastradas.map(m => {
        if (String(m.id) === String(acaoMetaSelecionada)) {
          const acoes = [...(m.acoes || []), { id: Date.now(), ...novaAcao }];
          return { ...m, acoes };
        }
        return m;
      });
      
      localStorage.setItem("metas", JSON.stringify(metasAtualizadas));
      setMetasCadastradas(metasAtualizadas);
      celebrateAction('action', novaAcao.acao);
      setActiveForm('none');
      setShowAcaoSavedModal(true);
      setNovaAcao({ acao: "", periodicidade: "", status: "a-fazer", dataPontual: "" });
      setAcaoMetaSelecionada("");
      
      storage.saveMetas(metasAtualizadas).catch(err => console.error("Sync error:", err));
    } catch (error) {
      toast.error("Erro ao salvar ação");
    } finally {
      setIsSaving(false);
    }
  };

  // ========== PASSO HANDLERS ==========
  const handleSavePasso = async () => {
    if (!passoMetaSelecionada || !passoAcaoSelecionada) {
      toast.error("Selecione uma meta e uma ação primeiro");
      return;
    }
    if (!novoPasso.trim()) {
      toast.error("Preencha o passo");
      return;
    }

    setIsSaving(true);
    try {
      const metasAtualizadas = metasCadastradas.map(m => {
        if (String(m.id) === String(passoMetaSelecionada)) {
          // Add passo to the meta's passos array (associated with the selected ação)
          const passos = [...(m.passos || []), { id: Date.now(), passo: novoPasso, acaoId: passoAcaoSelecionada }];
          return { ...m, passos };
        }
        return m;
      });
      
      localStorage.setItem("metas", JSON.stringify(metasAtualizadas));
      setMetasCadastradas(metasAtualizadas);
      toast.success("Passo cadastrado!");
      setActiveForm('none');
      setShowPassoSavedModal(true);
      setNovoPasso("");
      setPassoAcaoSelecionada("");
      setPassoMetaSelecionada("");
      
      storage.saveMetas(metasAtualizadas).catch(err => console.error("Sync error:", err));
    } catch (error) {
      toast.error("Erro ao salvar passo");
    } finally {
      setIsSaving(false);
    }
  };

  // Get ações for selected meta (used in passo form)
  const acoesForSelectedMeta = passoMetaSelecionada
    ? (metasCadastradas.find(m => String(m.id) === String(passoMetaSelecionada))?.acoes || [])
    : [];

  const content = (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Loading */}
      {isQueryLoading && metasCadastradas.length === 0 && (
        <div className="py-8">
          <PDILoader text="Carregando suas metas..." size="md" variant="rocket" />
        </div>
      )}

      {/* Metas Cadastradas Table */}
      {metasCadastradas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Metas Cadastradas</h3>
          
          {/* Desktop Table */}
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
                  const objetivoIdMeta = String(metaCadastrada.objetivoId || metaCadastrada.objetivo_id || '');
                  const objetivo = objetivosDisponiveis.find((obj: any) => String(obj.id) === objetivoIdMeta);
                  return (
                    <TableRow key={metaCadastrada.id}>
                      <TableCell className="font-medium">{objetivo?.texto || "Objetivo não encontrado"}</TableCell>
                      <TableCell>{metaCadastrada.texto}</TableCell>
                      <TableCell>
                        {(() => {
                          const dv = metaCadastrada.dataAlvo || metaCadastrada.data_alvo;
                          if (!dv) return "-";
                          const d = new Date(dv);
                          return isNaN(d.getTime()) ? "-" : d.toLocaleDateString('pt-BR');
                        })()}
                      </TableCell>
                      <TableCell>
                        {metaCadastrada.acoes?.length > 0 ? metaCadastrada.acoes.map((a: any, i: number) => (
                          <div key={i} className="text-sm">• {a?.acao || "Ação sem nome"}</div>
                        )) : <span className="text-muted-foreground text-sm">Nenhuma</span>}
                      </TableCell>
                      <TableCell>
                        {metaCadastrada.passos?.length > 0 ? metaCadastrada.passos.map((p: any, i: number) => (
                          <div key={i} className="text-sm">{i + 1}. {p?.passo || "-"}</div>
                        )) : <span className="text-muted-foreground text-sm">Nenhum</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditMeta(metaCadastrada.id)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMeta(metaCadastrada.id)} disabled={deletingMetaId === metaCadastrada.id}>
                            {deletingMetaId === metaCadastrada.id ? <Loader2 className="w-4 h-4 animate-spin text-destructive" /> : <Trash2 className="w-4 h-4 text-destructive" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 max-w-full overflow-hidden">
            {metasCadastradas.map((metaCadastrada) => {
              const objetivoIdMeta = String(metaCadastrada.objetivoId || metaCadastrada.objetivo_id || '');
              const objetivo = objetivosDisponiveis.find((obj: any) => String(obj.id) === objetivoIdMeta);
              const dataValor = metaCadastrada.dataAlvo || metaCadastrada.data_alvo;
              const dataFormatada = dataValor ? (() => { const d = new Date(dataValor); return isNaN(d.getTime()) ? "-" : d.toLocaleDateString('pt-BR'); })() : "-";
              const acoesCount = metaCadastrada.acoes?.length || 0;
              const passosCount = metaCadastrada.passos?.length || 0;
              
              return (
                <Collapsible key={metaCadastrada.id}>
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-4 flex items-start justify-between text-left hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Target className="w-4 h-4 text-primary" />
                            </div>
                            <p className="font-medium text-sm break-words [overflow-wrap:anywhere]">{metaCadastrada.texto}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground ml-10">
                            <span>📅 {dataFormatada}</span>
                            <span>✅ {acoesCount} ações</span>
                            <span>📋 {passosCount} passos</span>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-2 space-y-4 border-t border-border/50">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Objetivo</Label>
                          <p className="text-sm font-medium mt-1 break-words">{objetivo?.texto || "Objetivo não encontrado"}</p>
                        </div>
                        {acoesCount > 0 && (
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Ações ({acoesCount})</Label>
                            <div className="mt-2 space-y-2">
                              {metaCadastrada.acoes.map((a: any, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                                  <span className="text-green-600 dark:text-green-400 flex-shrink-0">•</span>
                                  <span className="break-words">{a?.acao || "-"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {passosCount > 0 && (
                          <div>
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Passos ({passosCount})</Label>
                            <div className="mt-2 space-y-2">
                              {metaCadastrada.passos.map((p: any, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md">
                                  <span className="text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">{i + 1}.</span>
                                  <span className="break-words">{p?.passo || "-"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 pt-3 border-t">
                          <Button variant="outline" size="sm" onClick={() => handleEditMeta(metaCadastrada.id)} className="flex-1 h-11">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteMeta(metaCadastrada.id)} disabled={deletingMetaId === metaCadastrada.id} className="flex-1 h-11 text-destructive hover:text-destructive hover:bg-destructive/10">
                            {deletingMetaId === metaCadastrada.id ? "Excluindo..." : "Excluir"}
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center" ref={formRef}>
        {/* Mobile: triggers fullscreen for meta */}
        {onOpenFullscreen && !fullscreenMode ? (
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs md:hidden" onClick={onOpenFullscreen}>
            <Plus className="w-3 h-3" /> Cadastrar Meta
          </Button>
        ) : null}
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm hidden md:inline-flex" onClick={() => setActiveForm(activeForm === 'meta' ? 'none' : 'meta')}>
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Cadastrar Meta
          <ChevronDown className={`w-3 h-3 transition-transform ${activeForm === 'meta' ? 'rotate-180' : ''}`} />
        </Button>
        
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm" onClick={() => setActiveForm(activeForm === 'acao' ? 'none' : 'acao')} disabled={metasCadastradas.length === 0}>
          <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> Cadastrar Ação
          <ChevronDown className={`w-3 h-3 transition-transform ${activeForm === 'acao' ? 'rotate-180' : ''}`} />
        </Button>
        
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm" onClick={() => setActiveForm(activeForm === 'passo' ? 'none' : 'passo')} disabled={metasCadastradas.filter(m => m.acoes?.length > 0).length === 0}>
          <Footprints className="w-3 h-3 sm:w-4 sm:h-4" /> Cadastrar Passos
          <ChevronDown className={`w-3 h-3 transition-transform ${activeForm === 'passo' ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* ========== META FORM ========== */}
      {(activeForm === 'meta' || fullscreenMode) && (
        <div className={`space-y-4 w-full max-w-full overflow-hidden ${fullscreenMode ? "" : "p-3 sm:p-4 bg-muted/30 rounded-lg border-2 border-dashed"}`}>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            {editandoMetaId ? "Editar Meta" : "Nova Meta"}
          </h3>

          {/* Buttons below title */}
          {!editandoMetaId && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/ferramentas/smart")}
                className="text-xs sm:text-sm"
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Criar com SMART
              </Button>
              <EntendaMelhorButton
                type="meta"
                text="Uma Meta deve estar conectada ao objetivo e ao VVD. Se a meta não tiver nada a ver com o objetivo e o VVD, não é uma meta forte. A meta é o desdobramento prático do seu objetivo. Ela transforma algo amplo em algo específico e mensurável."
              />
            </div>
          )}

          <div className="space-y-2 min-w-0">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Select value={objetivoSelecionado} onValueChange={(value) => { setObjetivoSelecionado(value); setMeta({ ...meta, objetivoId: value }); }}>
              <SelectTrigger id="objetivo" className="w-full min-w-0">
                <SelectValue placeholder="Selecione um objetivo" />
              </SelectTrigger>
              <SelectContent>
                {objetivosDisponiveis.length === 0 ? (
                  <SelectItem value="none" disabled>Nenhum objetivo cadastrado</SelectItem>
                ) : (
                  objetivosDisponiveis.filter((obj: any) => obj.id != null).map((obj: any) => (
                    <SelectItem key={obj.id} value={obj.id!.toString()}>{obj.texto}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-0">
            <Label htmlFor="meta">Meta</Label>
            <Input id="meta" placeholder="Ex: Conquistar promoção para cargo de liderança" value={meta.texto} onChange={(e) => setMeta({ ...meta, texto: e.target.value })} disabled={!objetivoSelecionado} spellCheck="true" className="w-full min-w-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataAlvo">Data Alvo</Label>
              <Input id="dataAlvo" type="date" value={meta.dataAlvo} onChange={(e) => setMeta({ ...meta, dataAlvo: e.target.value })} disabled={!objetivoSelecionado} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inicio">Quando Começo</Label>
              <Input id="inicio" type="date" value={meta.inicio} onChange={(e) => setMeta({ ...meta, inicio: e.target.value })} disabled={!objetivoSelecionado} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicao">Como vou medir</Label>
            <Input id="medicao" placeholder="Ex: Receber feedback positivo do gestor" value={meta.medicao} onChange={(e) => setMeta({ ...meta, medicao: e.target.value })} disabled={!objetivoSelecionado} spellCheck="true" />
          </div>

          <Button onClick={handleSaveMeta} className="w-full text-sm" size="lg" disabled={!objetivoSelecionado || isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editandoMetaId ? "Atualizar Meta" : "Cadastrar Meta"}
          </Button>
        </div>
      )}

      {/* ========== AÇÃO FORM ========== */}
      {activeForm === 'acao' && (
        <div className="space-y-4 w-full max-w-full overflow-hidden p-3 sm:p-4 bg-muted/30 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Nova Ação
          </h3>

          <div className="flex flex-wrap gap-2">
            <EntendaMelhorButton
              type="acao"
              text="Uma ação é um degrau para alcançar a meta. Cada ação deve ser algo que você consegue executar na prática, com periodicidade definida e diretamente conectada à meta que você quer alcançar. Grandes conquistas são resultado de pequenas ações executadas com consistência."
            />
          </div>

          <div className="space-y-2">
            <Label>Selecione a Meta</Label>
            <Select value={acaoMetaSelecionada} onValueChange={setAcaoMetaSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma meta" />
              </SelectTrigger>
              <SelectContent>
                {metasCadastradas.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>{m.texto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ação</Label>
            <Input placeholder="Descreva a ação" value={novaAcao.acao} onChange={(e) => setNovaAcao({ ...novaAcao, acao: e.target.value })} disabled={!acaoMetaSelecionada} spellCheck="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Periodicidade</Label>
              <Select value={novaAcao.periodicidade} onValueChange={(v) => setNovaAcao({ ...novaAcao, periodicidade: v, dataPontual: v !== "pontual" ? "" : novaAcao.dataPontual })} disabled={!acaoMetaSelecionada}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pontual">Pontual (única vez)</SelectItem>
                  <SelectItem value="diariamente">Diariamente</SelectItem>
                  <SelectItem value="semanalmente">Semanalmente</SelectItem>
                  <SelectItem value="mensalmente">Mensalmente</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {novaAcao.periodicidade === "pontual" && (
              <div className="space-y-2">
                <Label>Data de execução</Label>
                <Input type="date" value={novaAcao.dataPontual} onChange={(e) => setNovaAcao({ ...novaAcao, dataPontual: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={novaAcao.status} onValueChange={(v) => setNovaAcao({ ...novaAcao, status: v })} disabled={!acaoMetaSelecionada}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-fazer">A fazer</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em-andamento">Em andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveAcao} className="w-full text-sm" size="lg" disabled={!acaoMetaSelecionada || isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cadastrar Ação
          </Button>
        </div>
      )}

      {/* ========== PASSO FORM ========== */}
      {activeForm === 'passo' && (
        <div className="space-y-4 w-full max-w-full overflow-hidden p-3 sm:p-4 bg-muted/30 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Footprints className="w-5 h-5 text-primary" />
            Novo Passo
          </h3>

          <div className="flex flex-wrap gap-2">
            <EntendaMelhorButton
              type="passo"
              text="O passo é uma pequena atividade diária que, se executada de forma consistente, gera a ação e, por consequência, a conquista da meta. O segredo está na consistência, não na intensidade. Um passo pequeno feito todos os dias vale mais do que um grande esforço feito de vez em quando."
            />
          </div>

          <div className="space-y-2">
            <Label>Selecione a Meta</Label>
            <Select value={passoMetaSelecionada} onValueChange={(v) => { setPassoMetaSelecionada(v); setPassoAcaoSelecionada(""); }}>
              <SelectTrigger><SelectValue placeholder="Selecione uma meta" /></SelectTrigger>
              <SelectContent>
                {metasCadastradas.filter(m => m.acoes?.length > 0).map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>{m.texto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Selecione a Ação</Label>
            <Select value={passoAcaoSelecionada} onValueChange={setPassoAcaoSelecionada} disabled={!passoMetaSelecionada}>
              <SelectTrigger><SelectValue placeholder="Selecione uma ação" /></SelectTrigger>
              <SelectContent>
                {acoesForSelectedMeta.map((a: any) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.acao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Passo</Label>
            <Input placeholder="Descreva o passo diário" value={novoPasso} onChange={(e) => setNovoPasso(e.target.value)} disabled={!passoAcaoSelecionada} spellCheck="true" />
          </div>

          <Button onClick={handleSavePasso} className="w-full text-sm" size="lg" disabled={!passoAcaoSelecionada || isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cadastrar Passo
          </Button>
        </div>
      )}
    </div>
  );

  const modals = (
    <>
      {/* Meta Saved Modal - tells user to register an action */}
      <Dialog open={showMetaSavedModal} onOpenChange={setShowMetaSavedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Target className="w-6 h-6 text-success" />
              Meta Salva com Sucesso! 🎉
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Parabéns! Agora cadastre uma <strong>ação</strong> para essa meta. A ação é o degrau que vai te levar à conquista.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={async () => {
                setShowMetaSavedModal(false);
                if (onCloseFullscreen) onCloseFullscreen();
                queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
                queryClient.invalidateQueries({ queryKey: ['home-cache'] });
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase.functions.invoke('process-home-cache', {
                      body: { user_id: user.id, trigger: 'goal_created' },
                    });
                    queryClient.invalidateQueries({ queryKey: ['home-cache'] });
                  }
                } catch (err) { console.error('Cache error:', err); }
              }}
              className="w-full sm:w-auto"
            >
              Depois
            </Button>
            <Button 
              onClick={() => {
                setShowMetaSavedModal(false);
                setActiveForm('acao');
                setTimeout(() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className="w-full sm:w-auto gap-2"
            >
              <Zap className="w-4 h-4" />
              Cadastrar Ação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ação Saved Modal - tells user to register a step */}
      <Dialog open={showAcaoSavedModal} onOpenChange={setShowAcaoSavedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-6 h-6 text-accent" />
              Ação Criada! 🚀
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Excelente! Agora cadastre um <strong>passo</strong> para essa ação. O passo é a atividade diária que garante a execução da ação.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowAcaoSavedModal(false)} className="w-full sm:w-auto">
              Depois
            </Button>
            <Button 
              onClick={() => {
                setShowAcaoSavedModal(false);
                setActiveForm('passo');
                setTimeout(() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className="w-full sm:w-auto gap-2"
            >
              <Footprints className="w-4 h-4" />
              Cadastrar Passo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Passo Saved Modal */}
      <Dialog open={showPassoSavedModal} onOpenChange={setShowPassoSavedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Footprints className="w-6 h-6 text-primary" />
              Passo Cadastrado! 🎯
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Muito bem! Lembre-se: a consistência nos passos diários é o que transforma metas em conquistas reais.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPassoSavedModal(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
            <Button onClick={() => { setShowPassoSavedModal(false); setActiveForm('passo'); }} className="w-full sm:w-auto gap-2">
              <Plus className="w-4 h-4" />
              Cadastrar outro passo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteMetaId !== null}
        onOpenChange={() => setDeleteMetaId(null)}
        onConfirm={confirmDeleteMeta}
        title="Excluir Meta"
        description="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
      />
    </>
  );

  if (embedded) {
    return (
      <div className="w-full max-w-full overflow-hidden min-w-0">
        {content}
        {modals}
      </div>
    );
  }

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
        {content}
      </CardContent>
      {modals}
    </Card>
  );
};

export default MaoNaMassa;
