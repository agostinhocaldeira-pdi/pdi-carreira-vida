import { useState } from "react";
import { HelpCircle, X, Zap, Footprints, Target, ClipboardList, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Cores das categorias (tarefas manuais)
const categoryColors = [
  { color: 'bg-green-500', label: 'Pessoal' },
  { color: 'bg-blue-500', label: 'Trabalho' },
  { color: 'bg-purple-500', label: 'Estudo' },
  { color: 'bg-orange-500', label: 'Saúde' },
  { color: 'bg-yellow-500', label: 'Lazer' },
  { color: 'bg-red-500', label: 'Urgente' },
];

// Origens das tarefas (círculos/ícones)
const sourceTypes = [
  { icon: Sparkles, label: 'Manual', color: 'bg-purple-500', description: 'Criada manualmente' },
  { icon: Zap, label: 'Ação', color: 'bg-green-500', description: 'Vinda do Mão na Massa' },
  { icon: Footprints, label: 'Passo', color: 'bg-yellow-500', description: 'Passo de uma ação' },
  { icon: Target, label: 'Eisenhower', color: 'bg-orange-500', description: 'Matriz de Eisenhower' },
  { icon: ClipboardList, label: 'Meta', color: 'bg-blue-500', description: 'Meta do plano' },
  { icon: Calendar, label: 'Objetivo', color: 'bg-purple-500', description: 'Objetivo principal' },
];

// Quadrantes Eisenhower
const eisenhowerQuadrants = [
  { color: 'bg-red-500', label: 'Fazer Agora', description: 'Urgente + Importante' },
  { color: 'bg-orange-500', label: 'Agendar', description: 'Importante, não urgente' },
  { color: 'bg-cyan-500', label: 'Delegar', description: 'Urgente, não importante' },
  { color: 'bg-gray-500', label: 'Eliminar', description: 'Nem urgente nem importante' },
];

interface AgendaLegendProps {
  variant?: 'inline' | 'compact';
}

export const AgendaLegend = ({ variant = 'compact' }: AgendaLegendProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Versão inline (desktop) - mostra legenda resumida
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium">Legendas:</span>
        {categoryColors.slice(0, 4).map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span>{item.label}</span>
          </div>
        ))}
        <button
          onClick={() => setModalOpen(true)}
          className="text-primary hover:underline"
        >
          Ver todas
        </button>
        
        <LegendModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    );
  }

  // Versão compacta (mobile) - apenas botão que abre modal
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="text-xs text-muted-foreground hover:text-primary gap-1.5 h-8 px-2"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Legenda das cores</span>
      </Button>
      
      <LegendModal open={modalOpen} onOpenChange={setModalOpen} />
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
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Legenda da Agenda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Categorias de tarefas manuais */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Categorias (Tarefas Manuais)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryColors.map((item) => (
                <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className={cn("w-3 h-3 rounded-full flex-shrink-0", item.color)} />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Origem das tarefas */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Origem das Tarefas
            </h3>
            <div className="space-y-2">
              {sourceTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", item.color)}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quadrantes Eisenhower */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Quadrantes Eisenhower
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {eisenhowerQuadrants.map((item) => (
                <div key={item.label} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <div className={cn("w-3 h-3 rounded-full flex-shrink-0 mt-0.5", item.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores visuais */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Indicadores
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                <span className="text-sm">Tarefa pendente</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Tarefa concluída</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
