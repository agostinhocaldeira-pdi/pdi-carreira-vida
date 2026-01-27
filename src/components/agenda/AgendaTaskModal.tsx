import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AgendaTask } from "./AgendaTaskCard";
import { TaskExternalizationModal } from "./TaskExternalizationModal";

interface AgendaTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<AgendaTask> & { scheduled_date: Date }) => void;
  onDelete?: (taskId: string) => void;
  task?: AgendaTask | null;
  selectedDate: Date;
  initialTitle?: string;
  initialDescription?: string;
}

const labelOptions = [
  { value: 'green', label: 'Pessoal', color: 'bg-green-500' },
  { value: 'blue', label: 'Trabalho', color: 'bg-blue-500' },
  { value: 'purple', label: 'Estudo', color: 'bg-purple-500' },
  { value: 'orange', label: 'Saúde', color: 'bg-orange-500' },
  { value: 'yellow', label: 'Lazer', color: 'bg-yellow-500' },
  { value: 'red', label: 'Urgente', color: 'bg-red-500' },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
});

export const AgendaTaskModal = ({
  open,
  onOpenChange,
  onSave,
  onDelete,
  task,
  selectedDate,
  initialTitle = "",
  initialDescription = "",
}: AgendaTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(selectedDate);
  const [time, setTime] = useState("06:00");
  const [labelColor, setLabelColor] = useState<string>("green");
  const [label, setLabel] = useState("Pessoal");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly'>('daily');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [externalizationModalOpen, setExternalizationModalOpen] = useState(false);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setTime(task.scheduled_time?.slice(0, 5) || "06:00");
        setLabelColor(task.label_color || "green");
        setLabel(task.label || "Pessoal");
        setIsRecurring(task.is_recurring || false);
        setRecurrenceType(task.recurrence_type || 'daily');
      } else {
        // Use initial values if provided, otherwise empty
        setTitle(initialTitle);
        setDescription(initialDescription);
        setDate(selectedDate);
        setTime("06:00");
        setLabelColor("green");
        setLabel("Pessoal");
        setIsRecurring(false);
        setRecurrenceType('daily');
      }
    }
  }, [open, task, selectedDate, initialTitle, initialDescription]);

  const handleLabelChange = (colorValue: string) => {
    setLabelColor(colorValue);
    const option = labelOptions.find(o => o.value === colorValue);
    if (option) {
      setLabel(option.label);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      scheduled_date: date,
      scheduled_time: time + ':00',
      source_type: task?.source_type || 'manual',
      source_quadrant: task?.source_quadrant,
      label,
      label_color: labelColor as AgendaTask['label_color'],
      is_completed: task?.is_completed || false,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? recurrenceType : undefined,
    });

    onOpenChange(false);
  };

  const isEditMode = !!task;
  const isReadOnly = task && task.source_type !== 'manual';

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isEditMode ? (isReadOnly ? 'Detalhes da Tarefa' : 'Editar Tarefa') : 'Nova tarefa avulsa'}
          </DialogTitle>
          {!isEditMode && (
            <button
              type="button"
              onClick={() => setExternalizationModalOpen(true)}
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
            >
              <HelpCircle className="w-3 h-3" />
              Entenda o que cadastrar aqui
            </button>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase text-muted-foreground">
              Nome da Tarefa
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o nome da tarefa..."
              disabled={isReadOnly}
              className="border-0 border-b rounded-none focus-visible:ring-0 px-0"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Data</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isReadOnly}
                    className={cn(
                      "w-full justify-start text-left font-normal border-0 border-b rounded-none px-0",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "d 'de' MMM", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      if (d) {
                        setDate(d);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Hora</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="border-0 border-b rounded-none px-0">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description - always editable */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Notas</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicionar notas..."
              className="border-0 border-b rounded-none focus-visible:ring-0 px-0 min-h-[60px] resize-none"
            />
          </div>

          {/* Label */}
          {!isReadOnly && (
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Categoria</Label>
              <Select value={labelColor} onValueChange={handleLabelChange}>
                <SelectTrigger className="border-0 border-b rounded-none px-0">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", labelOptions.find(o => o.value === labelColor)?.color)} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {labelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", option.color)} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Recurrence */}
          {!isReadOnly && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase text-muted-foreground">Repetir</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={cn(
                    "h-6 px-2 text-xs",
                    isRecurring && "bg-primary/10 text-primary"
                  )}
                >
                  {isRecurring ? 'Sim' : 'Não'}
                </Button>
              </div>
              {isRecurring && (
                <Select value={recurrenceType} onValueChange={(v) => setRecurrenceType(v as 'daily' | 'weekly')}>
                  <SelectTrigger className="border-0 border-b rounded-none px-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Read-only info for non-manual tasks */}
          {isReadOnly && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p>Esta tarefa foi criada automaticamente. Apenas o horário e as notas podem ser alterados.</p>
              <p className="mt-1">
                Origem: {
                  task.source_type === 'action' ? 'Ação (Mão na Massa)' :
                  task.source_type === 'step' ? 'Passo de Ação' :
                  task.source_type === 'eisenhower' ? 'Matriz de Eisenhower' :
                  task.source_type === 'goal' ? 'Meta' :
                  task.source_type === 'objective' ? 'Objetivo' : 'Manual'
                }
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isEditMode && onDelete && task.source_type === 'manual' && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Excluir
            </Button>
          )}
          {isReadOnly ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Salvar
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isEditMode ? 'Salvar' : 'Criar Tarefa'}
          </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
    
    <TaskExternalizationModal
      open={externalizationModalOpen}
      onOpenChange={setExternalizationModalOpen}
    />
    </>
  );
};
