import { useState } from "react";
import { Link } from "react-router-dom";
import { usePendingTasks, PendingTask } from "@/hooks/usePendingTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PendingTasksKanbanProps {
  compact?: boolean;
  showLink?: boolean;
}

const statusConfig = {
  'a-fazer': {
    label: 'A Fazer',
    icon: Circle,
    iconColor: 'text-muted-foreground'
  },
  'fazendo': {
    label: 'Em Andamento',
    icon: Clock,
    iconColor: 'text-amber-500'
  },
  'feito': {
    label: 'Concluído',
    icon: CheckCircle2,
    iconColor: 'text-green-500'
  }
};

export const PendingTasksKanban = ({ compact = false, showLink = false }: PendingTasksKanbanProps) => {
  const isMobile = useIsMobile();
  const { tasks, loading, createTask, moveTask, deleteTask, getTasksByStatus } = usePendingTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      await createTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAdding(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle("");
    }
  };

  const columns: Array<'a-fazer' | 'fazendo' | 'feito'> = ['a-fazer', 'fazendo', 'feito'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // No modal compact, usa layout vertical em mobile
  const useVerticalLayout = compact && isMobile;

  return (
    <div className="space-y-4">
      <div className={cn(
        "grid gap-3", 
        useVerticalLayout 
          ? "grid-cols-1" 
          : compact 
            ? "grid-cols-3" 
            : "md:grid-cols-3 grid-cols-1"
      )}>
        {columns.map((status) => {
          const config = statusConfig[status];
          const columnTasks = getTasksByStatus(status);
          const Icon = config.icon;

          return (
            <div 
              key={status} 
              className="rounded-lg border border-border bg-muted/30"
            >
              {/* Header - Clean style */}
              <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                  <span className="font-semibold text-sm text-foreground">{config.label}</span>
                  <span className="text-xs text-muted-foreground">
                    ({columnTasks.length})
                  </span>
                </div>
                {status === 'a-fazer' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Tasks */}
              <ScrollArea className={cn(
                useVerticalLayout ? "h-[150px]" : compact ? "h-[250px]" : "h-[350px]"
              )}>
                <div className="p-2 space-y-2">
                  {/* Add task input */}
                  {status === 'a-fazer' && isAdding && (
                    <div className="p-2 border border-dashed border-primary/50 rounded-lg bg-background">
                      <Input
                        placeholder="Nova pendência..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="text-sm h-8"
                      />
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" onClick={handleAddTask} className="flex-1 h-7 text-xs">
                          Adicionar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setIsAdding(false);
                            setNewTaskTitle("");
                          }}
                          className="h-7 text-xs"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {columnTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      status={status}
                      onMove={moveTask}
                      onDelete={deleteTask}
                      compact={compact}
                    />
                  ))}

                  {columnTasks.length === 0 && !isAdding && (
                    <div className="text-center py-6 text-muted-foreground text-xs">
                      {status === 'a-fazer' && 'Nenhuma pendência'}
                      {status === 'fazendo' && 'Nada em andamento'}
                      {status === 'feito' && 'Nada concluído'}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      {/* Link para página da ferramenta */}
      {showLink && (
        <div className="pt-3 border-t border-border">
          <Link 
            to="/ferramentas/lista-pendencias"
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir ferramenta completa
          </Link>
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: PendingTask;
  status: 'a-fazer' | 'fazendo' | 'feito';
  onMove: (id: string, newStatus: 'a-fazer' | 'fazendo' | 'feito') => Promise<any>;
  onDelete: (id: string) => Promise<void>;
  compact?: boolean;
}

const TaskCard = ({ task, status, onMove, onDelete, compact }: TaskCardProps) => {
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = async (newStatus: 'a-fazer' | 'fazendo' | 'feito') => {
    setIsMoving(true);
    try {
      await onMove(task.id, newStatus);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Card className={cn(
      "p-3 bg-background border-border shadow-sm hover:shadow transition-shadow",
      isMoving && "opacity-50"
    )}>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium",
          status === 'feito' && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        {task.description && !compact && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex gap-1">
          {status === 'a-fazer' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs hover:bg-primary/10"
              onClick={() => handleMove('fazendo')}
              disabled={isMoving}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Iniciar
            </Button>
          )}
          {status === 'fazendo' && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1.5 text-xs"
                onClick={() => handleMove('a-fazer')}
                disabled={isMoving}
              >
                <ArrowLeft className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleMove('feito')}
                disabled={isMoving}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Concluir
              </Button>
            </>
          )}
          {status === 'feito' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => handleMove('fazendo')}
              disabled={isMoving}
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Reabrir
            </Button>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

export default PendingTasksKanban;
