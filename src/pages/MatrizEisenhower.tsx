import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Flame, 
  Target, 
  Users, 
  Trash2,
  Calendar,
  Zap,
  X,
  GripVertical,
  Loader2,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LogoutButton from "@/components/LogoutButton";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import type { EisenhowerTasks } from "@/types/pdi";
import EisenhowerScientificModal from "@/components/EisenhowerScientificModal";

type Quadrante = "urgente-importante" | "importante" | "urgente" | "eliminar";

interface Tarefa {
  id: string;
  texto: string;
  quadrante: Quadrante;
  criadaEm: string;
}

// Mapear quadrantes para keys do EisenhowerTasks
const quadranteToKey: Record<Quadrante, keyof EisenhowerTasks> = {
  "urgente-importante": "urgente_importante",
  "importante": "nao_urgente_importante",
  "urgente": "urgente_nao_importante",
  "eliminar": "nao_urgente_nao_importante"
};

const MatrizEisenhower = () => {
  const { getEisenhowerTasks, saveEisenhowerTasks } = usePDIStorage();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [quadranteSelecionado, setQuadranteSelecionado] = useState<Quadrante | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [tarefaParaDeletar, setTarefaParaDeletar] = useState<string | null>(null);
  const [tarefaParaMover, setTarefaParaMover] = useState<Tarefa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEisenhowerModalOpen, setIsEisenhowerModalOpen] = useState(false);

  useEffect(() => {
    // Scroll para o topo ao montar o componente
    window.scrollTo(0, 0);
    
    const loadTarefas = async () => {
      try {
        const savedTasks = await getEisenhowerTasks();
        if (savedTasks) {
          // Converter do formato EisenhowerTasks para Tarefa[]
          const tarefasArray: Tarefa[] = [];
          
          savedTasks.urgente_importante?.forEach((texto, idx) => {
            tarefasArray.push({
              id: `ui-${idx}-${Date.now()}`,
              texto,
              quadrante: "urgente-importante",
              criadaEm: new Date().toISOString()
            });
          });
          
          savedTasks.nao_urgente_importante?.forEach((texto, idx) => {
            tarefasArray.push({
              id: `nui-${idx}-${Date.now()}`,
              texto,
              quadrante: "importante",
              criadaEm: new Date().toISOString()
            });
          });
          
          savedTasks.urgente_nao_importante?.forEach((texto, idx) => {
            tarefasArray.push({
              id: `uni-${idx}-${Date.now()}`,
              texto,
              quadrante: "urgente",
              criadaEm: new Date().toISOString()
            });
          });
          
          savedTasks.nao_urgente_nao_importante?.forEach((texto, idx) => {
            tarefasArray.push({
              id: `nuni-${idx}-${Date.now()}`,
              texto,
              quadrante: "eliminar",
              criadaEm: new Date().toISOString()
            });
          });
          
          setTarefas(tarefasArray);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTarefas();
  }, [getEisenhowerTasks]);

  const salvarTarefas = useCallback(async (novasTarefas: Tarefa[]) => {
    setTarefas(novasTarefas);
    
    // Converter para formato EisenhowerTasks e salvar no Supabase
    const eisenhowerTasks: EisenhowerTasks = {
      urgente_importante: novasTarefas.filter(t => t.quadrante === "urgente-importante").map(t => t.texto),
      nao_urgente_importante: novasTarefas.filter(t => t.quadrante === "importante").map(t => t.texto),
      urgente_nao_importante: novasTarefas.filter(t => t.quadrante === "urgente").map(t => t.texto),
      nao_urgente_nao_importante: novasTarefas.filter(t => t.quadrante === "eliminar").map(t => t.texto),
    };
    
    await saveEisenhowerTasks(eisenhowerTasks);
    
    // Disparar evento para sincronizar com o ProgressSection
    window.dispatchEvent(new Event("eisenhowerUpdated"));
  }, [saveEisenhowerTasks]);

  const handleAdicionarTarefa = () => {
    if (!novaTarefa.trim() || !quadranteSelecionado) return;

    const tarefa: Tarefa = {
      id: Date.now().toString(),
      texto: novaTarefa,
      quadrante: quadranteSelecionado,
      criadaEm: new Date().toISOString(),
    };

    salvarTarefas([...tarefas, tarefa]);
    setNovaTarefa("");
    setShowAddDialog(false);
    setQuadranteSelecionado(null);
    toast.success("Tarefa adicionada!");
  };

  const handleDeletarTarefa = (id: string) => {
    const novasTarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas(novasTarefas);
    setTarefaParaDeletar(null);
    toast.success("Tarefa removida!");
  };

  const handleMoverTarefa = (tarefa: Tarefa, novoQuadrante: Quadrante) => {
    const novasTarefas = tarefas.map(t =>
      t.id === tarefa.id ? { ...t, quadrante: novoQuadrante } : t
    );
    salvarTarefas(novasTarefas);
    setTarefaParaMover(null);
    toast.success("Tarefa movida!");
  };

  const abrirDialogAdicionar = (quadrante: Quadrante) => {
    setQuadranteSelecionado(quadrante);
    setShowAddDialog(true);
  };

  const getTarefasPorQuadrante = (quadrante: Quadrante) => {
    return tarefas.filter(t => t.quadrante === quadrante);
  };

  const getQuadranteConfig = (quadrante: Quadrante) => {
    const configs = {
      "urgente-importante": {
        titulo: "Urgente e Importante",
        subtitulo: "Fazer Agora",
        icon: Flame,
        cor: "from-red-500 to-orange-500",
        corBorda: "border-red-500/30",
        corBg: "bg-red-500/10",
        corTexto: "text-red-600",
        corBadge: "bg-red-500 text-white",
      },
      "importante": {
        titulo: "Importante, Não Urgente",
        subtitulo: "Agendar",
        icon: Target,
        cor: "from-blue-500 to-cyan-500",
        corBorda: "border-blue-500/30",
        corBg: "bg-blue-500/10",
        corTexto: "text-blue-600",
        corBadge: "bg-blue-500 text-white",
      },
      "urgente": {
        titulo: "Urgente, Não Importante",
        subtitulo: "Delegar",
        icon: Users,
        cor: "from-yellow-500 to-amber-500",
        corBorda: "border-yellow-500/30",
        corBg: "bg-yellow-500/10",
        corTexto: "text-yellow-600",
        corBadge: "bg-yellow-500 text-white",
      },
      "eliminar": {
        titulo: "Nem Urgente, Nem Importante",
        subtitulo: "Eliminar",
        icon: Trash2,
        cor: "from-gray-500 to-slate-500",
        corBorda: "border-gray-500/30",
        corBg: "bg-gray-500/10",
        corTexto: "text-gray-600",
        corBadge: "bg-gray-500 text-white",
      },
    };
    return configs[quadrante];
  };

  const renderQuadrante = (quadrante: Quadrante) => {
    const config = getQuadranteConfig(quadrante);
    const Icon = config.icon;
    const tarefasQuadrante = getTarefasPorQuadrante(quadrante);

    return (
      <Card className={`relative overflow-hidden border-2 ${config.corBorda} hover:shadow-elegant transition-all duration-300 group`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${config.cor} opacity-5`} />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.cor} flex items-center justify-center shadow-soft`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <Badge className={`${config.corBadge} shadow-sm`}>
                  {tarefasQuadrante.length}
                </Badge>
              </div>
              <CardTitle className={`text-base font-bold ${config.corTexto}`}>
                {config.titulo}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{config.subtitulo}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => abrirDialogAdicionar(quadrante)}
              className={`${config.corTexto} hover:${config.corBg} opacity-60 group-hover:opacity-100 transition-opacity`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
          {tarefasQuadrante.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
              <Icon className="w-12 h-12 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
            </div>
          ) : (
            tarefasQuadrante.map((tarefa) => (
              <div
                key={tarefa.id}
                className={`group/item p-3 rounded-lg border ${config.corBorda} ${config.corBg} hover:shadow-md transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                  <p className="flex-1 text-sm leading-relaxed">{tarefa.texto}</p>
                  <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTarefaParaMover(tarefa)}
                      className="h-6 w-6 p-0"
                    >
                      <Zap className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setTarefaParaDeletar(tarefa.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold truncate">Matriz de Eisenhower</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/ferramentas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Link para modal científico */}
        <div className="mb-4">
          <button
            onClick={() => setIsEisenhowerModalOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Entenda a importância de priorizar suas tarefas com critério
          </button>
        </div>

        {/* Introdução */}
        <Card className="mb-8 shadow-large border-primary/20 animate-fade-in">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Priorize com Clareza</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Matriz de Eisenhower ajuda você a distinguir entre o que é urgente e o que é importante, 
                  permitindo que você foque no que realmente importa e delegue ou elimine o resto.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
              <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-sm text-red-600">Fazer Agora</h3>
                </div>
                <p className="text-xs text-muted-foreground">Crises e prazos urgentes</p>
              </div>
              <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm text-blue-600">Agendar</h3>
                </div>
                <p className="text-xs text-muted-foreground">Planejamento e crescimento</p>
              </div>
              <div className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-semibold text-sm text-yellow-600">Delegar</h3>
                </div>
                <p className="text-xs text-muted-foreground">Interrupções e distrações</p>
              </div>
              <div className="p-3 bg-gray-500/5 rounded-lg border border-gray-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-sm text-gray-600">Eliminar</h3>
                </div>
                <p className="text-xs text-muted-foreground">Desperdícios de tempo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eixos da Matriz */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center mb-2">
            <Badge variant="secondary" className="text-xs">IMPORTÂNCIA →</Badge>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 rotate-180 hidden lg:block">
            <Badge variant="secondary" className="text-xs" style={{ writingMode: 'vertical-rl' }}>
              URGÊNCIA →
            </Badge>
          </div>
        </div>

        {/* Matriz 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {renderQuadrante("urgente-importante")}
          {renderQuadrante("importante")}
          {renderQuadrante("urgente")}
          {renderQuadrante("eliminar")}
        </div>

        {/* Botões de Navegação */}
        <Card className="shadow-medium">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/home">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              <Link to="/ferramentas">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar às Ferramentas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog Adicionar Tarefa */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>
              {quadranteSelecionado && (
                <>Adicione uma tarefa para: <strong>{getQuadranteConfig(quadranteSelecionado).subtitulo}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Digite a tarefa..."
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdicionarTarefa()}
              autoFocus
              spellCheck="true"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdicionarTarefa} disabled={!novaTarefa.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Mover Tarefa */}
      <Dialog open={!!tarefaParaMover} onOpenChange={() => setTarefaParaMover(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover Tarefa</DialogTitle>
            <DialogDescription>
              Para qual quadrante você deseja mover esta tarefa?
            </DialogDescription>
          </DialogHeader>
          {tarefaParaMover && (
            <>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-sm">{tarefaParaMover.texto}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["urgente-importante", "importante", "urgente", "eliminar"] as Quadrante[])
                  .filter(q => q !== tarefaParaMover.quadrante)
                  .map((quadrante) => {
                    const config = getQuadranteConfig(quadrante);
                    const Icon = config.icon;
                    return (
                      <Button
                        key={quadrante}
                        variant="outline"
                        onClick={() => handleMoverTarefa(tarefaParaMover, quadrante)}
                        className={`h-auto p-4 flex flex-col items-center gap-2 ${config.corBorda} hover:${config.corBg}`}
                      >
                        <Icon className={`w-6 h-6 ${config.corTexto}`} />
                        <span className="text-xs font-medium text-center">{config.subtitulo}</span>
                      </Button>
                    );
                  })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Deletar */}
      <AlertDialog open={!!tarefaParaDeletar} onOpenChange={() => setTarefaParaDeletar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={() => tarefaParaDeletar && handleDeletarTarefa(tarefaParaDeletar)} className="bg-destructive hover:bg-destructive/90">
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Científico */}
      <EisenhowerScientificModal 
        open={isEisenhowerModalOpen} 
        onOpenChange={setIsEisenhowerModalOpen} 
      />
    </div>
  );
};

export default MatrizEisenhower;