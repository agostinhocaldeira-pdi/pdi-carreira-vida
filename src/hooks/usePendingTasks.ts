import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PendingTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'a-fazer' | 'fazendo' | 'feito';
  position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const usePendingTasks = () => {
  const [tasks, setTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_pending_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;
      setTasks((data || []) as PendingTask[]);
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (title: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const maxPosition = tasks.filter(t => t.status === 'a-fazer').length;

      const { data, error } = await supabase
        .from('user_pending_tasks')
        .insert({
          user_id: user.id,
          title,
          description: description || null,
          status: 'a-fazer',
          position: maxPosition
        })
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [...prev, data as PendingTask]);
      toast.success('Pendência adicionada!');
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erro ao adicionar pendência');
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<PendingTask>) => {
    try {
      const updateData: any = { ...updates };
      
      // Se estiver marcando como feito, adicionar completed_at
      if (updates.status === 'feito') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_pending_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? data as PendingTask : t));
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erro ao atualizar pendência');
      throw error;
    }
  };

  const moveTask = async (id: string, newStatus: 'a-fazer' | 'fazendo' | 'feito') => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'feito') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { data, error } = await supabase
        .from('user_pending_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? data as PendingTask : t));
      
      if (newStatus === 'feito') {
        toast.success('Pendência concluída! 🎉');
      }
      
      return data;
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Erro ao mover pendência');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_pending_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Pendência removida');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao remover pendência');
      throw error;
    }
  };

  const getTasksByStatus = (status: 'a-fazer' | 'fazendo' | 'feito') => {
    return tasks.filter(t => t.status === status);
  };

  const getDoingTasks = () => {
    return tasks.filter(t => t.status === 'fazendo');
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    getTasksByStatus,
    getDoingTasks
  };
};
