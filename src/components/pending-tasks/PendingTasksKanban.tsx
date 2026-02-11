import { useState } from "react";
import { Link } from "react-router-dom";
import { usePendingTasks, PendingTask } from "@/hooks/usePendingTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ExternalLink, Circle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingTasksKanbanProps {
  compact?: boolean;
  showLink?: boolean;
}

const statusOptions = [
  { value: 'a-fazer', label: 'A Fazer', icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  { value: 'fazendo', label: 'Em Andamento', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 text-amber-800' },
  { value: 'feito', label: 'Concluído', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 text-green-800' },
] as const;

export const PendingTasksKanban = ({ compact = false, showLink = false }: PendingTasksKanbanProps) => {
  const { tasks, loading, createTask, moveTask, deleteTask } = usePendingTasks();
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
    if (e.key === 'Enter') handleAddTask();
    else if (e.key === 'Escape') { setIsAdding(false); setNewTaskTitle(""); }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'a-fazer' | 'fazendo' | 'feito') => {
    await moveTask(taskId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sort: a-fazer first, then fazendo, then feito
  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { 'a-fazer': 0, 'fazendo': 1, 'feito': 2 };
    return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3);
  });

  return (
    <div className="space-y-3">
      {/* Add task button / input */}
      <div className="flex items-center gap-2">
        {isAdding ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              placeholder="Nova pendência..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              className="text-sm h-8 flex-1"
            />
            <Button size="sm" onClick={handleAddTask} className="h-8 text-xs">
              Adicionar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewTaskTitle(""); }} className="h-8 text-xs">
              Cancelar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Nova pendência
          </Button>
        )}
      </div>

      {/* Table */}
      {sortedTasks.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhuma pendência registrada
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Pendência</TableHead>
                <TableHead className="text-xs font-semibold w-[160px]">Status</TableHead>
                <TableHead className="text-xs font-semibold w-[50px] text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => {
                const statusInfo = statusOptions.find(s => s.value === task.status) || statusOptions[0];
                const StatusIcon = statusInfo.icon;

                return (
                  <TableRow key={task.id} className="group">
                    <TableCell className="py-2.5">
                      <span className={cn(
                        "text-sm",
                        task.status === 'feito' && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Select
                        value={task.status}
                        onValueChange={(val) => handleStatusChange(task.id, val as any)}
                      >
                        <SelectTrigger className="h-7 text-xs w-[140px] border-none bg-transparent hover:bg-muted/50 focus:ring-0">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon className={cn("w-3.5 h-3.5", statusInfo.color)} />
                            <span>{statusInfo.label}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => {
                            const OptIcon = opt.icon;
                            return (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                <div className="flex items-center gap-1.5">
                                  <OptIcon className={cn("w-3.5 h-3.5", opt.color)} />
                                  <span>{opt.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Link to full tool */}
      {showLink && (
        <div className="pt-2 border-t border-border">
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

export default PendingTasksKanban;
