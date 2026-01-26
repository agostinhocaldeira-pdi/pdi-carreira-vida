import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDILoader } from "@/components/ui/pdi-loader";
import { AgendaCalendar } from "./AgendaCalendar";
import { AgendaTaskCard, AgendaTask } from "./AgendaTaskCard";
import { AgendaTaskModal } from "./AgendaTaskModal";
import { AgendaLegend } from "./AgendaLegend";
import { useAgenda } from "@/hooks/useAgenda";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Agenda = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgendaTask | null>(null);
  const [prefilledTitle, setPrefilledTitle] = useState("");
  const [prefilledDescription, setPrefilledDescription] = useState("");

  // Listen for custom event to open modal with pre-filled data
  useEffect(() => {
    const handleOpenWithData = (event: CustomEvent<{ title: string; description: string }>) => {
      setPrefilledTitle(event.detail.title);
      setPrefilledDescription(event.detail.description);
      setSelectedTask(null);
      setModalOpen(true);
    };

    window.addEventListener('openTaskModalWithData', handleOpenWithData as EventListener);
    return () => {
      window.removeEventListener('openTaskModalWithData', handleOpenWithData as EventListener);
    };
  }, []);

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
    setPrefilledTitle("");
    setPrefilledDescription("");
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
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {isToday(selectedDate)
                  ? "Sem tarefas para hoje"
                  : format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[280px] sm:h-[320px] -mx-4 px-4">
              <div className="space-y-2 pb-16">
                {/* Desktop: agrupa tarefas com mesmo horário na mesma linha */}
                {!isMobile ? (
                  (() => {
                    // Agrupa tarefas por horário
                    const tasksByTime = tasks.reduce((acc, task) => {
                      const time = task.scheduled_time;
                      if (!acc[time]) acc[time] = [];
                      acc[time].push(task);
                      return acc;
                    }, {} as Record<string, typeof tasks>);

                    // Ordena os horários
                    const sortedTimes = Object.keys(tasksByTime).sort();

                    return sortedTimes.map((time) => {
                      const timeTasks = tasksByTime[time];
                      if (timeTasks.length === 1) {
                        // Apenas uma tarefa nesse horário - renderiza normalmente
                        return (
                          <AgendaTaskCard
                            key={timeTasks[0].id}
                            task={timeTasks[0]}
                            onToggleComplete={(id, completed) => toggleComplete(id, completed, selectedDate)}
                            onClick={handleTaskClick}
                          />
                        );
                      }
                      // Múltiplas tarefas no mesmo horário - renderiza em flex row
                        return (
                          <div key={time} className="flex gap-2">
                            {timeTasks.map((task) => (
                              <div key={task.id} className="flex-1 min-w-0">
                                <AgendaTaskCard
                                  task={task}
                                  onToggleComplete={(id, completed) => toggleComplete(id, completed, selectedDate)}
                                  onClick={handleTaskClick}
                                />
                              </div>
                            ))}
                          </div>
                        );
                    });
                  })()
                ) : (
                  // Mobile: renderiza tarefas individualmente
                  tasks.map((task) => (
                    <AgendaTaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={(id, completed) => toggleComplete(id, completed, selectedDate)}
                      onClick={handleTaskClick}
                    />
                  ))
                )}

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

          {/* Legend */}
          <div className="pt-2 border-t border-border/50">
            <AgendaLegend variant={isMobile ? 'compact' : 'inline'} />
          </div>

          {/* Add Task Link */}
          <button
            onClick={handleAddClick}
            className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors pt-2"
          >
            + Lista de Tarefas avulsas
          </button>
        </CardContent>
      </Card>

      {/* Task Modal */}
      <AgendaTaskModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            // Clear prefilled values when modal closes
            setPrefilledTitle("");
            setPrefilledDescription("");
          }
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        selectedDate={selectedDate}
        initialTitle={prefilledTitle}
        initialDescription={prefilledDescription}
      />
    </>
  );
};
