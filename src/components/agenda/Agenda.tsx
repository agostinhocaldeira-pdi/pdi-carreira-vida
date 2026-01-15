import { useState } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, CalendarDays, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDILoader } from "@/components/ui/pdi-loader";
import { AgendaCalendar } from "./AgendaCalendar";
import { AgendaTaskCard, AgendaTask } from "./AgendaTaskCard";
import { AgendaTaskModal } from "./AgendaTaskModal";
import { useAgenda } from "@/hooks/useAgenda";
import { cn } from "@/lib/utils";

export const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgendaTask | null>(null);

  const {
    loading,
    syncing,
    getTasksForDate,
    getTaskDates,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
  } = useAgenda();

  const tasks = getTasksForDate(selectedDate);
  const taskDates = getTaskDates();
  const completedCount = tasks.filter(t => t.is_completed).length;

  const handleTaskClick = (task: AgendaTask) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleSaveTask = async (task: Partial<AgendaTask> & { scheduled_date: Date }) => {
    if (task.id) {
      await updateEvent(task.id, task);
    } else {
      await createEvent(task);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteEvent(taskId);
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="py-8">
          <PDILoader text="Carregando agenda..." size="sm" variant="target" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span>Minha Agenda</span>
            </div>
            {tasks.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {completedCount}/{tasks.length} concluídas
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Calendar */}
          <AgendaCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            taskDates={taskDates}
          />

          {/* Tasks list */}
          {tasks.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {isToday(selectedDate)
                    ? "Nenhuma tarefa para hoje!"
                    : `Nenhuma tarefa para ${format(selectedDate, "d 'de' MMMM", { locale: ptBR })}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Que tal adicionar uma atividade?
                </p>
              </div>
              <Button onClick={handleAddClick} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar tarefa
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[280px] sm:h-[320px] -mx-4 px-4">
              <div className="space-y-2 pb-16">
                {tasks.map((task) => (
                  <AgendaTaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onClick={handleTaskClick}
                  />
                ))}

                {completedCount === tasks.length && tasks.length > 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-primary font-medium">
                      🎉 Parabéns! Todas as tarefas concluídas!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>

        {/* Floating Add Button */}
        <Button
          onClick={handleAddClick}
          size="icon"
          className={cn(
            "absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "transition-transform hover:scale-105"
          )}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </Card>

      {/* Task Modal */}
      <AgendaTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        selectedDate={selectedDate}
      />
    </>
  );
};
