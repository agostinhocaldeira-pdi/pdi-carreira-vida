import { useState } from "react";
import { Info, Zap, Footprints, Target, ClipboardList, Calendar, Sparkles, ListTodo, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PendingTasksModal } from "./PendingTasksModal";

// Origens das tarefas (círculos/ícones)
const sourceTypes = [
  { icon: Sparkles, label: 'Manual', color: 'bg-purple-500', description: 'Criada manualmente' },
  { icon: Zap, label: 'Ação', color: 'bg-green-500', description: 'Vinda do Mão na Massa' },
  { icon: Footprints, label: 'Passo', color: 'bg-yellow-500', description: 'Passo de uma ação' },
  { icon: Target, label: 'Eisenhower', color: 'bg-orange-500', description: 'Matriz de Eisenhower' },
  { icon: ClipboardList, label: 'Meta', color: 'bg-blue-500', description: 'Meta do plano' },
  { icon: Calendar, label: 'Objetivo', color: 'bg-purple-500', description: 'Objetivo principal' },
  { icon: ListTodo, label: 'Pendência', color: 'bg-violet-500', description: 'Lista de Pendências' },
];

// Categorias de tarefas manuais
const categoryColors = [
  { color: 'bg-green-500', label: 'Pessoal' },
  { color: 'bg-blue-500', label: 'Trabalho' },
  { color: 'bg-purple-500', label: 'Estudo' },
  { color: 'bg-orange-500', label: 'Saúde' },
  { color: 'bg-yellow-500', label: 'Lazer' },
  { color: 'bg-red-500', label: 'Urgente' },
];

// Quadrantes Eisenhower
const eisenhowerQuadrants = [
  { color: 'bg-red-500', label: 'Fazer Agora', description: 'Urgente + Importante' },
  { color: 'bg-orange-500', label: 'Agendar', description: 'Importante, não urgente' },
];

interface AgendaLegendProps {
  variant?: 'inline' | 'compact';
  onAddTask?: () => void;
}

export const AgendaLegend = ({ variant = 'compact', onAddTask }: AgendaLegendProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingTasksModalOpen, setPendingTasksModalOpen] = useState(false);

  // Versão inline (desktop) - mostra legenda resumida
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <button
          onClick={() => setModalOpen(true)}
          className="text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-1"
        >
          <Info className="w-3 h-3" />
          + Ícones
        </button>
        <span className="text-border">|</span>
        <button
          onClick={() => setPendingTasksModalOpen(true)}
          className="text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-1"
        >
          <ListTodo className="w-3 h-3" />
          + Ações
        </button>
        {onAddTask && (
          <>
            <span className="text-border">|</span>
            <button
              onClick={onAddTask}
              className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
            >
              + Micro Pendências
            </button>
          </>
        )}
        
        <LegendModal open={modalOpen} onOpenChange={setModalOpen} />
        <PendingTasksModal open={pendingTasksModalOpen} onOpenChange={setPendingTasksModalOpen} />
      </div>
    );
  }

  // Versão compacta (mobile) - apenas botões que abrem modais
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
        <button
          onClick={() => setModalOpen(true)}
          className="text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-1"
        >
          <Info className="w-3 h-3" />
          <span>+ Ícones</span>
        </button>
        <span className="text-border">|</span>
        <button
          onClick={() => setPendingTasksModalOpen(true)}
          className="text-muted-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-1"
        >
          <ListTodo className="w-3 h-3" />
          <span>+ Ações</span>
        </button>
        {onAddTask && (
          <>
            <span className="text-border">|</span>
            <button
              onClick={onAddTask}
              className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
            >
              + Micro Pendências
            </button>
          </>
        )}
      </div>
      
      <LegendModal open={modalOpen} onOpenChange={setModalOpen} />
      <PendingTasksModal open={pendingTasksModalOpen} onOpenChange={setPendingTasksModalOpen} />
    </>
  );
};

interface LegendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LegendModal = ({ open, onOpenChange }: LegendModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="text-base font-semibold">Guia de Ícones</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Origem das tarefas */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Origem das Tarefas
            </h3>
            <div className="space-y-1">
              {sourceTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 py-1.5">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", item.color)}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground">— {item.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Categorias
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {categoryColors.map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", item.color)} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrantes Eisenhower */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Eisenhower
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {eisenhowerQuadrants.map((item) => (
                <div key={item.label} className="flex items-center gap-2 py-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", item.color)} />
                  <div className="min-w-0">
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Status
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />
                <span className="text-sm text-foreground">Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-foreground">Concluída</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
