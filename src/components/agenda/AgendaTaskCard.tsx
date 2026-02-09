import { Check, Zap, Footprints, Target, ClipboardList, Calendar, Sparkles, ListTodo, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AgendaTask {
  id: string;
  title: string;
  description?: string;
  scheduled_time: string;
  source_type: 'manual' | 'action' | 'step' | 'eisenhower' | 'goal' | 'objective' | 'pending';
  source_quadrant?: 'do' | 'schedule' | 'delegate' | 'eliminate';
  label?: string;
  label_color?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'gray' | 'cyan' | 'violet';
  is_completed: boolean;
  is_recurring?: boolean;
  recurrence_type?: 'daily' | 'weekly';
}

interface AgendaTaskCardProps {
  task: AgendaTask;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onClick?: (task: AgendaTask) => void;
}

const sourceConfig = {
  manual: { icon: Sparkles, defaultLabel: 'Pessoal', defaultColor: 'purple' as const },
  action: { icon: Zap, defaultLabel: 'Ação', defaultColor: 'green' as const },
  step: { icon: Footprints, defaultLabel: 'Passo', defaultColor: 'yellow' as const },
  eisenhower: { icon: Target, defaultLabel: 'Prioridade', defaultColor: 'orange' as const },
  goal: { icon: ClipboardList, defaultLabel: 'Meta', defaultColor: 'blue' as const },
  objective: { icon: Calendar, defaultLabel: 'Objetivo', defaultColor: 'purple' as const },
  pending: { icon: ListTodo, defaultLabel: 'Pendência', defaultColor: 'violet' as const },
};

const quadrantLabels = {
  do: 'Urgente + Importante',
  schedule: 'Importante, não urgente',
  delegate: 'Delegar',
  eliminate: 'Eliminar',
};

const colorClasses = {
  green: 'bg-green-100 border-l-green-500 dark:bg-green-900/30',
  yellow: 'bg-yellow-100 border-l-yellow-500 dark:bg-yellow-900/30',
  orange: 'bg-orange-100 border-l-orange-500 dark:bg-orange-900/30',
  red: 'bg-red-100 border-l-red-500 dark:bg-red-900/30',
  blue: 'bg-blue-100 border-l-blue-500 dark:bg-blue-900/30',
  purple: 'bg-purple-100 border-l-purple-500 dark:bg-purple-900/30',
  gray: 'bg-gray-100 border-l-gray-500 dark:bg-gray-900/30',
  cyan: 'bg-cyan-100 border-l-cyan-500 dark:bg-cyan-900/30',
  violet: 'bg-violet-100 border-l-violet-500 dark:bg-violet-900/30',
};

const dotColorClasses = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
};

export const AgendaTaskCard = ({ task, onToggleComplete, onClick }: AgendaTaskCardProps) => {
  const isMobile = useIsMobile();
  const config = sourceConfig[task.source_type] || sourceConfig.manual;
  const Icon = config.icon;
  
  // Determine label and color
  let displayLabel = task.label || config.defaultLabel;
  let displayColor = task.label_color || config.defaultColor;

  // For Eisenhower tasks, use quadrant-specific labels
  if (task.source_type === 'eisenhower' && task.source_quadrant) {
    displayLabel = quadrantLabels[task.source_quadrant] || displayLabel;
    // Map quadrant to color
    const quadrantColors = {
      do: 'red' as const,
      schedule: 'orange' as const,
      delegate: 'cyan' as const,
      eliminate: 'gray' as const,
    };
    displayColor = quadrantColors[task.source_quadrant] || displayColor;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-2 sm:gap-3 rounded-lg border-l-4 transition-all cursor-pointer",
        isMobile ? "p-2" : "p-3",
        colorClasses[displayColor],
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
          isMobile ? "w-5 h-5" : "w-6 h-6",
          task.is_completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {task.is_completed && <Check className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <h4 className={cn(
            "font-medium text-foreground line-clamp-2",
            isMobile ? "text-xs leading-tight" : "text-sm",
            task.is_completed && "line-through"
          )}>
            {task.title}
          </h4>
          <span className={cn(
            "font-medium text-muted-foreground flex-shrink-0",
            isMobile ? "text-[10px]" : "text-sm"
          )}>
            {formatTime(task.scheduled_time)}
          </span>
        </div>

        {task.description && (
          <p className={cn(
            "text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1",
            isMobile ? "text-[10px]" : "text-sm"
          )}>
            {task.description}
          </p>
        )}

        {/* Label with Icon */}
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "mt-1" : "mt-2"
        )}>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className={cn(
              "rounded-full flex items-center justify-center",
              isMobile ? "w-3.5 h-3.5" : "w-4 h-4",
              dotColorClasses[displayColor]
            )}>
              <Icon className={cn(
                "text-white",
                isMobile ? "w-2 h-2" : "w-2.5 h-2.5"
              )} />
            </div>
            <span className={cn(
              "text-muted-foreground",
              isMobile ? "text-[9px]" : "text-xs"
            )}>{displayLabel}</span>
            {task.is_recurring && (
              <span className={cn(
                "text-muted-foreground ml-0.5 sm:ml-1",
                isMobile ? "text-[9px]" : "text-xs"
              )}>
                • {task.recurrence_type === 'daily' ? 'Diária' : 'Semanal'}
              </span>
            )}
          </div>

          {/* Edit indicator icon */}
          <PenLine className={cn(
            "text-muted-foreground/40 flex-shrink-0",
            isMobile ? "w-3 h-3" : "w-3.5 h-3.5"
          )} />
        </div>
      </div>
    </div>
  );
};
