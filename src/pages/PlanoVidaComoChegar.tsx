import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Lightbulb, ArrowLeft, Home, Plus, Trash2, Pencil, Check, X, ExternalLink, Volume2, VolumeX, Loader2, Rocket } from "lucide-react";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";

import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import MaoNaMassa from "@/components/home/MaoNaMassa";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import LogoutButton from "@/components/LogoutButton";
import { useHabilidadesExplanationAudio } from "@/hooks/useHabilidadesExplanationAudio";
import { useIsMobile } from "@/hooks/use-mobile";

const PlanoVidaComoChegar = () => {
  const { isLoading: roleLoading, userRole } = useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const storage = usePDIStorage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Audio hook for habilidades explanation
  const { isPlaying: audioPlaying, isLoading: audioLoading, toggleAudio } = useHabilidadesExplanationAudio();
  
  const [isLoading, setIsLoading] = useState(true);
  const [maoNaMassaFullscreen, setMaoNaMassaFullscreen] = useState(false);
  
  // Estados para Habilidades
  const [novaHabilidade, setNovaHabilidade] = useState("");
  const [habilidades, setHabilidades] = useState<Array<{ id: number; tipo: 'forte' | 'fraco'; texto: string }>>([]);
  const [editandoHabilidadeId, setEditandoHabilidadeId] = useState<number | null>(null);
  const [habilidadeEditada, setHabilidadeEditada] = useState("");
  const [deleteHabilidadeId, setDeleteHabilidadeId] = useState<number | null>(null);
  const [showHabilidadesModal, setShowHabilidadesModal] = useState(false);

  // Trigger open meta form if coming from para-onde page
  useEffect(() => {
    if (location.state?.openMetaFor) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openMetaForm', { 
          detail: { objetivoId: location.state.openMetaFor } 
        }));
      }, 300);
    }
  }, [location.state]);

  // Sincronizar habilidades com a ferramenta SWOT e carregar do Supabase
  useEffect(() => {
    const loadHabilidades = async () => {
      setIsLoading(true);
      try {
        const savedHabilidades = await storage.getHabilidades();
        if (savedHabilidades && savedHabilidades.length > 0) {
          setHabilidades(savedHabilidades.map((h: any) => ({
            id: h.id || Date.now(),
            tipo: h.tipo || 'fraco' as const,
            texto: h.texto
          })));
        } else {
          const localHabilidades = localStorage.getItem("habilidades");
          if (localHabilidades) {
            const parsed = JSON.parse(localHabilidades);
            setHabilidades(parsed.map((h: any) => ({
              id: h.id || Date.now(),
              tipo: h.tipo || 'fraco' as const,
              texto: h.texto
            })));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar habilidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabilidades();
    
    const syncHabilidades = () => {
      loadHabilidades();
    };
    
    window.addEventListener("habilidadesUpdated", syncHabilidades);

    return () => {
      window.removeEventListener("habilidadesUpdated", syncHabilidades);
    };
  }, [storage.isAuthenticated]);

  // Funções para gerenciar habilidades
  const handleAddHabilidade = () => {
    if (!novaHabilidade.trim()) {
      toast.error("Digite uma habilidade para adicionar");
      return;
    }

    const novaHab = { id: Date.now(), tipo: 'fraco' as const, texto: novaHabilidade };
    const novasHabilidades = [...habilidades, novaHab];
    setHabilidades(novasHabilidades);
    setNovaHabilidade("");
    toast.success("Habilidade adicionada!");
    
    storage.saveHabilidades(novasHabilidades).catch(error => {
      console.error("Background habilidades sync error:", error);
    });
  };

  const handleRemoveHabilidade = (id: number) => {
    setDeleteHabilidadeId(id);
  };

  const confirmRemoveHabilidade = () => {
    if (deleteHabilidadeId) {
      const novasHabilidades = habilidades.filter((hab) => hab.id !== deleteHabilidadeId);
      setHabilidades(novasHabilidades);
      toast.success("Habilidade removida!");
      setDeleteHabilidadeId(null);
      
      storage.saveHabilidades(novasHabilidades).catch(error => {
        console.error("Background habilidades sync error:", error);
      });
    }
  };

  const handleStartEditHabilidade = (habilidade: { id: number; tipo: 'forte' | 'fraco'; texto: string }) => {
    setEditandoHabilidadeId(habilidade.id);
    setHabilidadeEditada(habilidade.texto);
  };

  const handleCancelEditHabilidade = () => {
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
  };

  const handleSaveEditHabilidade = async (id: number) => {
    if (!habilidadeEditada.trim()) {
      toast.error("A habilidade não pode estar vazia");
      return;
    }

    const novasHabilidades = habilidades.map((hab) =>
      hab.id === id ? { ...hab, texto: habilidadeEditada } : hab
    );
    setHabilidades(novasHabilidades);
    
    try {
      await storage.saveHabilidades(novasHabilidades);
    } catch (error) {
      console.error("Erro ao atualizar habilidade:", error);
    }
    
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
    toast.success("Habilidade atualizada!");
  };

  // Calcular progresso
  const calculateProgress = () => {
    return habilidades.length > 0 ? 100 : 0;
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PDILoader text="Carregando..." size="lg" variant="rocket" />
      </div>
    );
  }

  // Mobile fullscreen for Mão na Massa
  if (isMobile && maoNaMassaFullscreen) {
    return (
      <div className="min-h-screen bg-background">
        {/* Fullscreen header */}
        <div className="sticky top-0 z-50 bg-background border-b px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setMaoNaMassaFullscreen(false)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <span className="font-semibold text-sm">Nova Meta</span>
        </div>
        {/* Fullscreen content */}
        <div className="p-4">
          <MaoNaMassa embedded fullscreenMode onCloseFullscreen={() => setMaoNaMassaFullscreen(false)} />
        </div>
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

        {/* Mobile: Simplified title with progress */}
        {isMobile ? (
          <div className="space-y-3">
            <h1 className="text-lg font-bold text-foreground">
              Passo 3 - Como chegar lá - Habilidades e desenvolvimento
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{calculateProgress()}%</span>
            </div>
          </div>
        ) : (
          <Card className="shadow-medium overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Passo 3</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">Como chegar lá</CardTitle>
                  <CardDescription>Habilidades e desenvolvimento</CardDescription>
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
          </Card>
        )}

        {/* Content */}
        <div className={isMobile ? "space-y-6" : ""}>
          {!isMobile && (
            <Card className="shadow-medium overflow-hidden">
              <CardContent className="space-y-6 pt-6">
            {isLoading ? (
              <div className="py-8">
                <PDILoader text="Carregando dados..." size="md" variant="rocket" />
              </div>
            ) : (
              <>
                {/* Seção: Habilidades a Desenvolver */}
                <div className="p-4 sm:p-6 rounded-xl border bg-card space-y-4 w-full overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Habilidades a Desenvolver</h3>
                    {habilidades.length > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {habilidades.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Adicione suas habilidades a desenvolver</Label>

                    <div className="flex gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg min-w-0 max-w-full overflow-hidden">
                      <Input
                        placeholder="Digite uma habilidade"
                        value={novaHabilidade}
                        onChange={(e) => setNovaHabilidade(e.target.value)}
                        spellCheck="true"
                        className="min-w-0"
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
                      className="text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="sm:hidden">Adicionar</span>
                      <span className="hidden sm:inline">Adicionar Habilidade</span>
                    </Button>

                    {/* Link explicativo sobre habilidades */}
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => setShowHabilidadesModal(true)}
                      className="text-xs sm:text-sm"
                    >
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Entenda melhor
                    </Button>

                    {habilidades.length > 0 && (
                      <div className="rounded-lg border overflow-x-auto max-w-full mt-4">
                        <Table className="w-full table-fixed">
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
                                       <span className="block max-w-full break-words whitespace-normal [overflow-wrap:anywhere]">{habilidade.texto}</span>
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
                  </div>
                </div>

                {/* Desktop: Seção Mão na Massa */}
                <div className="p-4 sm:p-6 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                  <MaoNaMassa embedded />
                </div>

                {/* Link para voltar a Para onde vou */}
                <div className="pt-4 flex flex-col items-center gap-2">
                  <Button variant="outline" onClick={() => navigate("/plano-vida/para-onde")} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Retorne, caso precise fazer algum ajuste em seus objetivos
                  </p>
                </div>
              </>
            )}
              </CardContent>
            </Card>
          )}

          {/* Mobile Sections */}
          {isMobile && !isLoading && (
            <>
              {/* Seção 1: Habilidades a desenvolver */}
              <div className="space-y-4 p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Habilidades a Desenvolver</h2>
                  {habilidades.length > 0 && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {habilidades.length}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite uma habilidade"
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      spellCheck="true"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddHabilidade();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={handleAddHabilidade}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button 
                    type="button" 
                    size="sm"
                    onClick={() => setShowHabilidadesModal(true)}
                    className="text-xs"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Entenda melhor
                  </Button>

                  {habilidades.length > 0 && (
                    <div className="space-y-2">
                      {habilidades.map((habilidade) => {
                        const isEditing = editandoHabilidadeId === habilidade.id;
                        
                        return (
                          <div key={habilidade.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            {isEditing ? (
                              <>
                                <Input
                                  value={habilidadeEditada}
                                  onChange={(e) => setHabilidadeEditada(e.target.value)}
                                  className="flex-1 text-sm"
                                  spellCheck="true"
                                />
                                <Button variant="ghost" size="sm" onClick={() => handleSaveEditHabilidade(habilidade.id)}>
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleCancelEditHabilidade}>
                                  <X className="w-4 h-4 text-destructive" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="flex-1 text-sm break-words">{habilidade.texto}</span>
                                <Button variant="ghost" size="sm" onClick={() => handleStartEditHabilidade(habilidade)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveHabilidade(habilidade.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 2: Mão na Massa */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Rocket className="w-5 h-5 text-accent" />
                  <h2 className="font-semibold">Mão na Massa</h2>
                </div>

                <MaoNaMassa 
                  embedded 
                  onOpenFullscreen={() => setMaoNaMassaFullscreen(true)}
                />
              </div>

              {/* Botões de navegação mobile */}
              <div className="pt-4 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/home")} className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate("/plano-vida/para-onde")} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Navigation Desktop */}
        <div className="hidden sm:flex justify-center">
          <Button variant="outline" onClick={() => navigate("/home")} className="gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDeleteDialog
        open={deleteHabilidadeId !== null}
        onOpenChange={() => setDeleteHabilidadeId(null)}
        onConfirm={confirmRemoveHabilidade}
        title="Excluir Habilidade"
        description="Tem certeza que deseja excluir esta habilidade?"
      />

      {/* Modal explicativo sobre como descobrir habilidades */}
      <Dialog open={showHabilidadesModal} onOpenChange={setShowHabilidadesModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-lg sm:text-xl">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Como descobrir habilidades a desenvolver
              </div>
              {/* Audio button */}
              <button
                onClick={toggleAudio}
                disabled={audioLoading}
                className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {audioLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : audioPlaying ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[10px]">
                  {audioLoading ? "..." : audioPlaying ? "Parar" : "Ouvir"}
                </span>
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              Um objetivo normalmente dependerá de <strong>novas habilidades</strong>. Para identificar quais são as habilidades necessárias para alcançar seus objetivos, sugerimos utilizar:
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-foreground/90">
                  • <strong>Autoavaliação + 360º</strong> — receba feedbacks estruturados sobre suas competências
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowHabilidadesModal(false);
                    navigate("/ferramentas/autoavaliacao-360");
                  }}
                  className="text-xs sm:text-sm ml-4"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Autoavaliação + 360º
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-foreground/90">
                  • <strong>Ferramentas (FF)</strong> — explore outras ferramentas de desenvolvimento pessoal
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowHabilidadesModal(false);
                    navigate("/ferramentas");
                  }}
                  className="text-xs sm:text-sm ml-4"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Ferramentas (FF)
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHabilidadesModal(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanoVidaComoChegar;
