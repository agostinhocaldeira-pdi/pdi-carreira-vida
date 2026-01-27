import { useState, useEffect, useCallback } from "react";
import { format, isSameDay, parseISO, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHomeCache } from "@/hooks/useHomeCache";
import { AgendaTask } from "@/components/agenda/AgendaTaskCard";

interface AgendaEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  scheduled_time: string;
  source_type: string;
  source_id: string | null;
  source_quadrant: string | null;
  label: string | null;
  label_color: string | null;
  is_completed: boolean;
  is_recurring: boolean;
  recurrence_type: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DailyCompletion {
  event_id: string;
  completed_date: string;
}

export const useAgenda = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [dailyCompletions, setDailyCompletions] = useState<DailyCompletion[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Fetch all events and daily completions for the user
  const fetchEvents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch events and daily completions in parallel
      const [eventsResult, completionsResult] = await Promise.all([
        supabase
          .from('agenda_events')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_time', { ascending: true }),
        supabase
          .from('agenda_daily_completions')
          .select('event_id, completed_date')
          .eq('user_id', user.id)
      ]);

      if (eventsResult.error) throw eventsResult.error;
      setEvents(eventsResult.data || []);
      setDailyCompletions(completionsResult.data || []);
    } catch (error) {
      console.error('Error fetching agenda events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync tasks from other sources (objectives, goals, actions, steps, eisenhower)
  const syncFromSources = useCallback(async () => {
    setSyncing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');

      // Fetch objectives with target dates
      const { data: objectives } = await supabase
        .from('user_objectives')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'concluido')
        .not('data_alvo', 'is', null);

      // Fetch goals with target dates
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'concluido')
        .not('data_alvo', 'is', null);

      // Fetch all actions (not just daily)
      const { data: actions } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'concluido');

      // Fetch incomplete steps
      const { data: steps } = await supabase
        .from('user_steps')
        .select('*, user_actions!inner(texto)')
        .eq('user_id', user.id)
        .eq('concluido', false);

      // Fetch all eisenhower tasks (all quadrants)
      const { data: eisenhowerTasks } = await supabase
        .from('user_eisenhower_tasks')
        .select('*')
        .eq('user_id', user.id);

      // Fetch pending tasks that are "fazendo" (in progress)
      const { data: pendingTasks } = await supabase
        .from('user_pending_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'fazendo');

      // Check existing synced events
      const { data: existingEvents } = await supabase
        .from('agenda_events')
        .select('source_type, source_id')
        .eq('user_id', user.id)
        .not('source_id', 'is', null);

      const existingSourceIds = new Set(
        (existingEvents || []).map(e => `${e.source_type}-${e.source_id}`)
      );

      const eventsToCreate: Array<{
        user_id: string;
        title: string;
        scheduled_date: string;
        scheduled_time: string;
        source_type: string;
        source_id: string;
        source_quadrant?: string;
        label?: string;
        label_color?: string;
        is_recurring?: boolean;
        recurrence_type?: string;
        description?: string;
      }> = [];

      // Sync objectives with target dates
      objectives?.forEach(objective => {
        const key = `objective-${objective.id}`;
        if (!existingSourceIds.has(key) && objective.data_alvo) {
          eventsToCreate.push({
            user_id: user.id,
            title: objective.texto,
            description: objective.is_principal ? 'Objetivo Principal' : undefined,
            scheduled_date: objective.data_alvo,
            scheduled_time: '08:00:00',
            source_type: 'objective',
            source_id: objective.id,
            label: objective.is_principal ? 'Objetivo Principal' : 'Objetivo',
            label_color: 'purple',
            is_recurring: false,
          });
        }
      });

      // Sync goals with target dates
      goals?.forEach(goal => {
        const key = `goal-${goal.id}`;
        if (!existingSourceIds.has(key) && goal.data_alvo) {
          eventsToCreate.push({
            user_id: user.id,
            title: goal.texto,
            scheduled_date: goal.data_alvo,
            scheduled_time: '09:00:00',
            source_type: 'goal',
            source_id: goal.id,
            label: 'Meta',
            label_color: 'blue',
            is_recurring: false,
          });
        }
      });

      // Sync actions based on recurrence
      actions?.forEach(action => {
        const key = `action-${action.id}`;
        if (!existingSourceIds.has(key)) {
          const periodicidade = action.periodicidade?.toLowerCase() || '';
          let isRecurring = false;
          let recurrenceType: string | undefined = undefined;
          let label = 'Ação';
          
          if (periodicidade.includes('diária') || periodicidade.includes('diario') || periodicidade.includes('diariamente')) {
            isRecurring = true;
            recurrenceType = 'daily';
            label = 'Ação Diária';
          } else if (periodicidade.includes('semanal') || periodicidade.includes('semanalmente')) {
            isRecurring = true;
            recurrenceType = 'weekly';
            label = 'Ação Semanal';
          }

          eventsToCreate.push({
            user_id: user.id,
            title: action.texto,
            scheduled_date: today,
            scheduled_time: '06:00:00',
            source_type: 'action',
            source_id: action.id,
            label,
            label_color: 'green',
            is_recurring: isRecurring,
            recurrence_type: recurrenceType,
          });
        }
      });

      // Sync steps
      steps?.forEach(step => {
        const key = `step-${step.id}`;
        if (!existingSourceIds.has(key)) {
          const actionName = (step as any).user_actions?.texto || 'Ação';
          eventsToCreate.push({
            user_id: user.id,
            title: step.texto,
            description: `Passo da ação: ${actionName}`,
            scheduled_date: today,
            scheduled_time: '06:00:00',
            source_type: 'step',
            source_id: step.id,
            label: 'Passo',
            label_color: 'yellow',
            is_recurring: false,
          });
        }
      });

      // Sync Eisenhower tasks (apenas urgent-important e not-urgent-important)
      // Exclui "Delegar" e "Eliminar" da agenda
      eisenhowerTasks?.forEach(task => {
        // Só sincroniza quadrantes importantes (exclui delegate e eliminate)
        if (task.quadrant !== 'urgent-important' && task.quadrant !== 'not-urgent-important') {
          return;
        }
        
        const key = `eisenhower-${task.id}`;
        if (!existingSourceIds.has(key)) {
          const quadrantMap: Record<string, { label: string; shortLabel: string }> = {
            'urgent-important': { label: 'Urgente + Importante', shortLabel: 'do' },
            'not-urgent-important': { label: 'Importante, não urgente', shortLabel: 'schedule' },
          };
          const colorMap: Record<string, string> = {
            'urgent-important': 'red',
            'not-urgent-important': 'orange',
          };
          
          const quadrantInfo = quadrantMap[task.quadrant] || { label: 'Eisenhower', shortLabel: 'do' };
          
          eventsToCreate.push({
            user_id: user.id,
            title: task.task_text,
            scheduled_date: today,
            scheduled_time: task.quadrant === 'urgent-important' ? '05:00:00' : '07:00:00',
            source_type: 'eisenhower',
            source_id: task.id,
            source_quadrant: quadrantInfo.shortLabel,
            label: quadrantInfo.label,
            label_color: colorMap[task.quadrant] || 'orange',
            is_recurring: true,
            recurrence_type: task.quadrant === 'urgent-important' ? 'daily' : undefined,
          });
        }
      });

      // Sync pending tasks with status "fazendo"
      pendingTasks?.forEach(task => {
        const key = `pending-${task.id}`;
        if (!existingSourceIds.has(key)) {
          eventsToCreate.push({
            user_id: user.id,
            title: task.title,
            description: task.description || undefined,
            scheduled_date: today,
            scheduled_time: '06:30:00',
            source_type: 'pending',
            source_id: task.id,
            label: 'Pendência',
            label_color: 'purple',
            is_recurring: true,
            recurrence_type: 'daily',
          });
        }
      });

      // Insert new events
      if (eventsToCreate.length > 0) {
        const { error } = await supabase
          .from('agenda_events')
          .insert(eventsToCreate);

        if (error) throw error;
        
        // Refetch events
        await fetchEvents();
      }
    } catch (error) {
      console.error('Error syncing from sources:', error);
    } finally {
      setSyncing(false);
    }
  }, [fetchEvents]);

  // Check if a recurring task is completed for a specific date
  const isCompletedForDate = useCallback((eventId: string, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dailyCompletions.some(c => c.event_id === eventId && c.completed_date === dateStr);
  }, [dailyCompletions]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date): AgendaTask[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return events
      .filter(event => {
        // Direct match
        if (event.scheduled_date === dateStr) return true;
        
        // Recurring daily tasks
        if (event.is_recurring && event.recurrence_type === 'daily') {
          const eventDate = parseISO(event.scheduled_date);
          return date >= eventDate;
        }
        
        // Recurring weekly tasks
        if (event.is_recurring && event.recurrence_type === 'weekly') {
          const eventDate = parseISO(event.scheduled_date);
          if (date < eventDate) return false;
          return eventDate.getDay() === date.getDay();
        }
        
        return false;
      })
      .map(event => {
        // For recurring tasks, check daily completion instead of global is_completed
        const isRecurringTask = event.is_recurring && (event.recurrence_type === 'daily' || event.recurrence_type === 'weekly');
        const completed = isRecurringTask 
          ? isCompletedForDate(event.id, date)
          : event.is_completed;
        
        return {
          id: event.id,
          title: event.title,
          description: event.description || undefined,
          scheduled_time: event.scheduled_time,
          source_type: event.source_type as AgendaTask['source_type'],
          source_quadrant: event.source_quadrant as AgendaTask['source_quadrant'],
          label: event.label || undefined,
          label_color: event.label_color as AgendaTask['label_color'],
          is_completed: completed,
          is_recurring: event.is_recurring,
          recurrence_type: event.recurrence_type as AgendaTask['recurrence_type'],
        };
      })
      .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time));
  }, [events, isCompletedForDate]);

  // Get dates that have tasks
  const getTaskDates = useCallback((): Date[] => {
    const dates = new Set<string>();
    
    events.forEach(event => {
      dates.add(event.scheduled_date);
    });
    
    return Array.from(dates).map(d => parseISO(d));
  }, [events]);

  // Create a new event
  const createEvent = useCallback(async (task: Partial<AgendaTask> & { scheduled_date: Date }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('agenda_events')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          scheduled_date: format(task.scheduled_date, 'yyyy-MM-dd'),
          scheduled_time: task.scheduled_time,
          source_type: task.source_type || 'manual',
          source_quadrant: task.source_quadrant,
          label: task.label,
          label_color: task.label_color,
          is_recurring: task.is_recurring || false,
          recurrence_type: task.recurrence_type,
        });

      if (error) throw error;

      toast({
        title: "Tarefa criada!",
        description: "Sua tarefa foi adicionada à agenda.",
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar tarefa",
        description: "Não foi possível criar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [fetchEvents, toast]);

  // Update an event
  const updateEvent = useCallback(async (taskId: string, updates: Partial<AgendaTask> & { scheduled_date?: Date }) => {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.scheduled_date !== undefined) updateData.scheduled_date = format(updates.scheduled_date, 'yyyy-MM-dd');
      if (updates.scheduled_time !== undefined) updateData.scheduled_time = updates.scheduled_time;
      if (updates.label !== undefined) updateData.label = updates.label;
      if (updates.label_color !== undefined) updateData.label_color = updates.label_color;
      if (updates.is_completed !== undefined) {
        updateData.is_completed = updates.is_completed;
        updateData.completed_at = updates.is_completed ? new Date().toISOString() : null;
      }
      if (updates.is_recurring !== undefined) updateData.is_recurring = updates.is_recurring;
      if (updates.recurrence_type !== undefined) updateData.recurrence_type = updates.recurrence_type;

      const { error } = await supabase
        .from('agenda_events')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [fetchEvents, toast]);

  // Delete an event
  const deleteEvent = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida da agenda.",
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir tarefa",
        description: "Não foi possível excluir a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [fetchEvents, toast]);

  // Toggle task completion - for recurring tasks, uses daily completions
  const toggleComplete = useCallback(async (taskId: string, completed: boolean, forDate?: Date) => {
    // Find the event to check its type
    const event = events.find(e => e.id === taskId);
    if (!event) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dateStr = format(forDate || new Date(), 'yyyy-MM-dd');
    const isRecurringTask = event.is_recurring && (event.recurrence_type === 'daily' || event.recurrence_type === 'weekly');

    // OPTIMISTIC UPDATE: Update local state immediately for instant feedback
    if (isRecurringTask) {
      // For recurring tasks, update dailyCompletions optimistically
      if (completed) {
        setDailyCompletions(prev => [...prev, { event_id: taskId, completed_date: dateStr }]);
      } else {
        setDailyCompletions(prev => prev.filter(c => !(c.event_id === taskId && c.completed_date === dateStr)));
      }
    } else {
      // For non-recurring tasks, update events optimistically
      setEvents(prev => prev.map(e => 
        e.id === taskId 
          ? { ...e, is_completed: completed, completed_at: completed ? new Date().toISOString() : null }
          : e
      ));
    }
    
    // If it's a pending task being marked as completed, also update the pending task
    if (event.source_type === 'pending' && event.source_id && completed) {
      try {
        await supabase
          .from('user_pending_tasks')
          .update({ 
            status: 'feito',
            completed_at: new Date().toISOString()
          })
          .eq('id', event.source_id);
        
        // Also delete the agenda event since it's no longer in "fazendo"
        await supabase
          .from('agenda_events')
          .delete()
          .eq('id', taskId);
        
        toast({
          title: "Pendência concluída! 🎉",
          description: "A tarefa foi movida para 'Feito' na Lista de Pendências.",
        });
        
        await fetchEvents();
        return;
      } catch (error) {
        console.error('Error completing pending task:', error);
        // Revert optimistic update on error
        await fetchEvents();
      }
    }

    // For recurring tasks, use daily completions instead of global is_completed
    if (isRecurringTask) {
      try {
        if (completed) {
          // Add daily completion record
          const { error } = await supabase
            .from('agenda_daily_completions')
            .insert({
              user_id: user.id,
              event_id: taskId,
              completed_date: dateStr
            });
          
          if (error && error.code !== '23505') { // Ignore unique constraint violation
            throw error;
          }
        } else {
          // Remove daily completion record
          await supabase
            .from('agenda_daily_completions')
            .delete()
            .eq('event_id', taskId)
            .eq('completed_date', dateStr);
        }
        
        // Background refetch to sync with server (no need to wait)
        fetchEvents();
      } catch (error) {
        console.error('Error toggling daily completion:', error);
        // Revert optimistic update on error
        await fetchEvents();
        toast({
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar a tarefa. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      // For non-recurring tasks, persist to database
      try {
        const { error } = await supabase
          .from('agenda_events')
          .update({
            is_completed: completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .eq('id', taskId);

        if (error) throw error;
        
        // Background refetch
        fetchEvents();
      } catch (error) {
        console.error('Error updating event:', error);
        // Revert optimistic update on error
        await fetchEvents();
        toast({
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar a tarefa. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  }, [events, fetchEvents, toast]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Sync from sources on mount
  useEffect(() => {
    syncFromSources();
  }, []);

  return {
    loading,
    syncing,
    events,
    getTasksForDate,
    getTaskDates,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
    syncFromSources,
    refetch: fetchEvents,
  };
};
