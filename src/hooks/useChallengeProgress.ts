import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';

interface ChallengeProgress {
  day_number: number;
  completed_at: string;
}

export const useChallengeProgress = () => {
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highestCompletedDay, setHighestCompletedDay] = useState(0);

  const fetchProgress = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select('day_number, completed_at')
        .eq('user_id', session.user.id)
        .order('day_number', { ascending: true });

      if (error) throw error;

      setProgress(data || []);
      
      // Find the highest completed day
      const maxDay = data?.reduce((max, p) => Math.max(max, p.day_number), 0) || 0;
      setHighestCompletedDay(maxDay);
    } catch (error) {
      console.error('Error fetching challenge progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const completeDay = async (dayNumber: number): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;

      const { error } = await supabase
        .from('user_challenge_progress')
        .insert({
          user_id: session.user.id,
          day_number: dayNumber
        });

      if (error) {
        // If unique constraint error, day already completed
        if (error.code === '23505') {
          console.log('Day already completed');
          return true;
        }
        throw error;
      }

      await fetchProgress();
      return true;
    } catch (error) {
      console.error('Error completing day:', error);
      return false;
    }
  };

  const isDayCompleted = (dayNumber: number): boolean => {
    return progress.some(p => p.day_number === dayNumber);
  };

  const isDayAccessible = (dayNumber: number): boolean => {
    // Day 1 is always accessible
    if (dayNumber === 1) return true;

    // Check if previous day was completed
    const previousDayProgress = progress.find(p => p.day_number === dayNumber - 1);
    if (!previousDayProgress) return false;

    // Check if enough time has passed (next calendar day)
    const completedDate = startOfDay(parseISO(previousDayProgress.completed_at));
    const today = startOfDay(new Date());
    const daysDiff = differenceInCalendarDays(today, completedDate);

    // The next day is accessible if at least 1 calendar day has passed
    return daysDiff >= 1;
  };

  const getNextAvailableDay = (): number => {
    if (progress.length === 0) return 1;

    // Find the last completed day
    const lastCompleted = progress.reduce((max, p) => 
      p.day_number > max.day_number ? p : max, 
      progress[0]
    );

    // Check if next day is accessible
    const nextDay = lastCompleted.day_number + 1;
    if (nextDay > 30) return 30; // Max is day 30

    if (isDayAccessible(nextDay)) {
      return nextDay;
    }

    // If next day is not accessible yet, return the last completed day
    return lastCompleted.day_number;
  };

  const getDayStatus = (dayNumber: number): 'completed' | 'available' | 'locked' => {
    if (isDayCompleted(dayNumber)) return 'completed';
    if (isDayAccessible(dayNumber)) return 'available';
    return 'locked';
  };

  return {
    progress,
    isLoading,
    highestCompletedDay,
    completeDay,
    isDayCompleted,
    isDayAccessible,
    getNextAvailableDay,
    getDayStatus,
    refetch: fetchProgress
  };
};
