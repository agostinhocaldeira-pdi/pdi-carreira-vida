/**
 * HomeOperational - Modo Operacional
 * Exibido quando o usuário JÁ completou a Base Pessoal (Passo 1)
 * 
 * Features:
 * - Hero Premium: Objetivo Principal em destaque (Dark/Gold)
 * - Agenda Estratégica: UI Clean com tags de objetivo
 * - Reflexão Estóica do Dia: Seção premium black
 * - Navegação hierárquica: Estratégico vs Manutenção
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { format, differenceInDays, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Target, 
  Plus, 
  Calendar, 
  Footprints,
  CalendarDays,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDILoader } from "@/components/ui/pdi-loader";
import { usePDIData } from "@/hooks/usePDIQueries";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { AgendaTaskModal } from "@/components/agenda/AgendaTaskModal";
import { AgendaLegend } from "@/components/agenda/AgendaLegend";
import { useAgenda } from "@/hooks/useAgenda";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { AgendaTask } from "@/components/agenda/AgendaTaskCard";
import StoicReflectionCard from "./StoicReflectionCard";
import HomeDiarySection from "./HomeDiarySection";

// ============================================================
// HERO SECTION - Objetivo Principal Premium
// ============================================================
const HeroPrincipal = () => {
  const { data: pdiData } = usePDIData();
  const objetivos = pdiData?.objetivos || [];
  
  // Busca o objetivo principal
  const objetivoPrincipal = objetivos.find(obj => obj.is_principal);
  
  // Calcula dias restantes
  const calculateDaysRemaining = () => {
    if (!objetivoPrincipal?.data_alvo) return null;
    const targetDate = new Date(objetivoPrincipal.data_alvo);
    const today = new Date();
    const days = differenceInDays(targetDate, today);
    return days >= 0 ? days : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();

  // Se não há objetivo principal definido
  if (!objetivoPrincipal) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/30 p-6 sm:p-8">
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <Target className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Defina seu Objetivo Principal
          </h2>
          <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
            Escolha o objetivo mais importante para você agora. 
            Ele será o centro do seu Modo Operacional.
          </p>
          <Link to="/plano-vida/para-onde">
            <Button 
              variant="outline" 
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <Target className="w-4 h-4 mr-2" />
              Definir Objetivo Principal
            </Button>
          </Link>
        </div>
        
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/30 p-6 sm:p-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
              Objetivo Principal
            </span>
          </div>
          
          {/* Status badge */}
          <Badge 
            className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#D4AF37]/30"
          >
            Em andamento
          </Badge>
        </div>

        {/* Main content */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
          {objetivoPrincipal.texto}
        </h2>

        {/* Days counter */}
        {daysRemaining !== null && (
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl sm:text-5xl font-bold text-[#D4AF37]">
              {daysRemaining}
            </span>
            <span className="text-lg text-white/60">
              {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
            </span>
          </div>
        )}

        {/* VVD connection if available */}
        {objetivoPrincipal.conexao_vvd && (
          <p className="text-sm text-white/50 mb-6 italic">
            "{objetivoPrincipal.conexao_vvd}"
          </p>
        )}

        {/* Action buttons - discrete style */}
        <div className="flex flex-wrap gap-3">
          <Link to="/plano-vida/como-chegar">
            <Button 
              size="sm"
              className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/30 hover:text-[#D4AF37]"
            >
              <Footprints className="w-4 h-4 mr-2" />
              Novo Passo
            </Button>
          </Link>
          <Link to="/plano-vida/para-onde">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/50 hover:text-white/80 hover:bg-white/10"
            >
              Ver Detalhes
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CLEAN TASK CARD - Nova UI sem fundos coloridos
// ============================================================
interface CleanTaskCardProps {
  task: AgendaTask;
  linkedGoalName?: string;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onClick?: (task: AgendaTask) => void;
}

const colorBorderClasses = {
  green: 'border-l-green-500',
  yellow: 'border-l-yellow-500',
  orange: 'border-l-orange-500',
  red: 'border-l-red-500',
  blue: 'border-l-blue-500',
  purple: 'border-l-purple-500',
  gray: 'border-l-gray-500',
  cyan: 'border-l-cyan-500',
  violet: 'border-l-violet-500',
};

const sourceDefaultColors: Record<string, keyof typeof colorBorderClasses> = {
  manual: 'purple',
  action: 'green',
  step: 'yellow',
  eisenhower: 'orange',
  goal: 'blue',
  objective: 'purple',
  pending: 'violet',
};

const quadrantColors: Record<string, keyof typeof colorBorderClasses> = {
  do: 'red',
  schedule: 'orange',
  delegate: 'cyan',
  eliminate: 'gray',
};

const CleanTaskCard = ({ task, linkedGoalName, onToggleComplete, onClick }: CleanTaskCardProps) => {
  const isMobile = useIsMobile();
  
  // Determine border color
  let borderColor: keyof typeof colorBorderClasses = task.label_color || sourceDefaultColors[task.source_type] || 'gray';
  
  if (task.source_type === 'eisenhower' && task.source_quadrant) {
    borderColor = quadrantColors[task.source_quadrant] || borderColor;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-lg border-l-4 bg-card shadow-sm border border-border/50 transition-all cursor-pointer hover:shadow-md",
        isMobile ? "p-3" : "p-4",
        colorBorderClasses[borderColor],
        task.is_completed && "opacity-60"
      )}
      onClick={() => onClick?.(task)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id, !task.is_completed);
        }}
        className={cn(
          "flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all",
          "w-5 h-5",
          task.is_completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {task.is_completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={cn(
                "font-medium text-foreground",
                isMobile ? "text-sm" : "text-base",
                task.is_completed && "line-through"
              )}>
                {task.title}
              </h4>
              
              {/* Strategy Tag - Only show if linked to a goal */}
              {linkedGoalName && (
                <Badge 
                  className="text-[10px] px-1.5 py-0 h-5 bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/30 font-medium"
                >
                  🎯 {linkedGoalName}
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className={cn(
                "text-muted-foreground mt-1 line-clamp-1",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {task.description}
              </p>
            )}
          </div>
          
          <span className={cn(
            "font-medium text-muted-foreground flex-shrink-0",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {formatTime(task.scheduled_time)}
          </span>
        </div>

        {/* Category label and recurrence */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {task.label || task.source_type}
          </span>
          {task.is_recurring && (
            <span className="text-xs text-muted-foreground">
              • {task.recurrence_type === 'daily' ? 'Diária' : 'Semanal'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AGENDA ESTRATÉGICA - Clean UI
// ============================================================
const AgendaEstrategica = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgendaTask | null>(null);
  
  const { data: pdiData } = usePDIData();
  const objetivos = pdiData?.objetivos || [];

  const {
    loading,
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

  // Helper to find linked goal name based on task type and text matching
  const getLinkedGoalName = (task: AgendaTask): string | undefined => {
    // Only show tags for objective and goal type tasks
    if (task.source_type === 'objective' || task.source_type === 'goal') {
      // Try to find matching objetivo via fuzzy text matching
      const linkedObjetivo = objetivos.find(obj => 
        task.title.toLowerCase().includes(obj.texto.toLowerCase().slice(0, 15)) ||
        obj.texto.toLowerCase().includes(task.title.toLowerCase().slice(0, 15))
      );
      if (linkedObjetivo) {
        return linkedObjetivo.texto.length > 30 
          ? linkedObjetivo.texto.slice(0, 30) + '...'
          : linkedObjetivo.texto;
      }
      
      // If no match found but it's an objective/goal type, show a generic label
      return task.source_type === 'objective' ? 'Objetivo' : 'Meta';
    }
    
    return undefined;
  };

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
      <Card className="border-border/50">
        <CardContent className="py-8">
          <PDILoader text="Carregando agenda..." size="sm" variant="target" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span>Agenda Estratégica</span>
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

          {/* Tasks list - Clean UI */}
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
                {tasks.map((task) => (
                  <CleanTaskCard
                    key={task.id}
                    task={task}
                    linkedGoalName={getLinkedGoalName(task)}
                    onToggleComplete={(id, completed) => toggleComplete(id, completed, selectedDate)}
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

          {/* Footer Links */}
          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
            <AgendaLegend variant={isMobile ? 'compact' : 'inline'} />
            <button
              onClick={handleAddClick}
              className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 hover:underline transition-colors"
            >
              + Lista de Tarefas avulsas
            </button>
          </div>
        </CardContent>
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

// ============================================================
// MAIN COMPONENT
// ============================================================
export const HomeOperational = () => {
  return (
    <div className="space-y-6">
      {/* Hero Premium - Objetivo Principal */}
      <HeroPrincipal />
      
      {/* Agenda Estratégica - Clean UI */}
      <AgendaEstrategica />
      
      {/* Reflexão Estóica do Dia - Premium Black Style */}
      <StoicReflectionCard />
      
      {/* Diário - Premium Black Style */}
      <HomeDiarySection />
    </div>
  );
};

export default HomeOperational;
