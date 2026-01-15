import { Check, Zap, Footprints, Target, ClipboardList, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AgendaTask {
  id: string;
  title: string;
  description?: string;
  scheduled_time: string;
  source_type: 'manual' | 'action' | 'step' | 'eisenhower' | 'goal' | 'objective';
  source_quadrant?: 'do' | 'schedule' | 'delegate' | 'eliminate';
  label?: string;
  label_color?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'gray' | 'cyan';
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
};

export const AgendaTaskCard = ({ task, onToggleComplete, onClick }: AgendaTaskCardProps) => {
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
        "relative flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all cursor-pointer",
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
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          task.is_completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {task.is_completed && <Check className="w-4 h-4" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            "font-medium text-foreground line-clamp-2",
            task.is_completed && "line-through"
          )}>
            {task.title}
          </h4>
          <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
            {formatTime(task.scheduled_time)}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {task.description}
          </p>
        )}

        {/* Label */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className={cn("w-2 h-2 rounded-full", dotColorClasses[displayColor])} />
          <span className="text-xs text-muted-foreground">{displayLabel}</span>
          {task.is_recurring && (
            <span className="text-xs text-muted-foreground ml-1">
              • {task.recurrence_type === 'daily' ? 'Diária' : 'Semanal'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
