import { useState } from "react";
import { usePendingTasks, PendingTask } from "@/hooks/usePendingTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Circle,
  Clock,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingTasksKanbanProps {
  compact?: boolean;
}

const statusConfig = {
  'a-fazer': {
    label: 'A Fazer',
    color: 'bg-slate-100 border-slate-300',
    headerColor: 'bg-slate-200',
    icon: Circle,
    iconColor: 'text-slate-500'
  },
  'fazendo': {
    label: 'Fazendo',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100',
    icon: Clock,
    iconColor: 'text-blue-500'
  },
  'feito': {
    label: 'Feito',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100',
    icon: CheckCircle2,
    iconColor: 'text-green-500'
  }
};

export const PendingTasksKanban = ({ compact = false }: PendingTasksKanbanProps) => {
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

  return (
    <div className={cn("grid gap-4", compact ? "grid-cols-3" : "md:grid-cols-3 grid-cols-1")}>
      {columns.map((status) => {
        const config = statusConfig[status];
        const columnTasks = getTasksByStatus(status);
        const Icon = config.icon;

        return (
          <div 
            key={status} 
            className={cn(
              "rounded-lg border-2 overflow-hidden",
              config.color
            )}
          >
            {/* Header */}
            <div className={cn("px-3 py-2 flex items-center justify-between", config.headerColor)}>
              <div className="flex items-center gap-2">
                <Icon className={cn("w-4 h-4", config.iconColor)} />
                <span className="font-medium text-sm">{config.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              {status === 'a-fazer' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Tasks */}
            <ScrollArea className={compact ? "h-[250px]" : "h-[350px]"}>
              <div className="p-2 space-y-2">
                {/* Add task input */}
                {status === 'a-fazer' && isAdding && (
                  <Card className="p-2 border-dashed border-2 border-primary/50">
                    <Input
                      placeholder="Digite a pendência..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="text-sm"
                    />
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" onClick={handleAddTask} className="flex-1 h-7 text-xs">
                        Adicionar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsAdding(false);
                          setNewTaskTitle("");
                        }}
                        className="h-7 text-xs"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </Card>
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
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {status === 'a-fazer' && 'Nenhuma pendência'}
                    {status === 'fazendo' && 'Nada em andamento'}
                    {status === 'feito' && 'Nada concluído ainda'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
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
      "p-2 bg-white shadow-sm hover:shadow-md transition-shadow",
      isMoving && "opacity-50"
    )}>
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0 cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
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
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <div className="flex gap-1">
          {status === 'a-fazer' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
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
                className="h-6 px-2 text-xs"
                onClick={() => handleMove('a-fazer')}
                disabled={isMoving}
              >
                <ArrowLeft className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
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
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

export default PendingTasksKanban;
