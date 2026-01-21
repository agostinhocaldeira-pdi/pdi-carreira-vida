import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface AdminPendingTask {
  id: string;
  title: string;
  description: string | null;
  status: 'a-fazer' | 'fazendo' | 'feito';
  position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'admin_pending_tasks';

const generateId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useAdminPendingTasks = () => {
  const [tasks, setTasks] = useState<AdminPendingTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error fetching admin pending tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTasks = (newTasks: AdminPendingTask[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks([...newTasks]); // Force state update with new array reference
    } catch (error) {
      console.error('Error saving admin pending tasks:', error);
    }
  };

  const createTask = async (title: string, description?: string) => {
    try {
      const maxPosition = tasks.filter(t => t.status === 'a-fazer').length;
      const now = new Date().toISOString();

      const newTask: AdminPendingTask = {
        id: generateId(),
        title,
        description: description || null,
        status: 'a-fazer',
        position: maxPosition,
        completed_at: null,
        created_at: now,
        updated_at: now
      };

      const newTasks = [...tasks, newTask];
      saveTasks(newTasks);
      toast.success('Pendência adicionada!');
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erro ao adicionar pendência');
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<AdminPendingTask>) => {
    try {
      const now = new Date().toISOString();
      const updateData = { 
        ...updates, 
        updated_at: now,
        completed_at: updates.status === 'feito' ? now : updates.completed_at
      };

      const newTasks = tasks.map(t => 
        t.id === id ? { ...t, ...updateData } : t
      );
      saveTasks(newTasks);
      return newTasks.find(t => t.id === id);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erro ao atualizar pendência');
      throw error;
    }
  };

  const moveTask = async (id: string, newStatus: 'a-fazer' | 'fazendo' | 'feito') => {
    try {
      const now = new Date().toISOString();
      const updateData: Partial<AdminPendingTask> = { 
        status: newStatus,
        updated_at: now,
        completed_at: newStatus === 'feito' ? now : null
      };

      const newTasks = tasks.map(t => 
        t.id === id ? { ...t, ...updateData } : t
      );
      saveTasks(newTasks);
      
      if (newStatus === 'feito') {
        toast.success('Pendência concluída! 🎉');
      }
      
      return newTasks.find(t => t.id === id);
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Erro ao mover pendência');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const newTasks = tasks.filter(t => t.id !== id);
      saveTasks(newTasks);
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
    getTasksByStatus
  };
};
