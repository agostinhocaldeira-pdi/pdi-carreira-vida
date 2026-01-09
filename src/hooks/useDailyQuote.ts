import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Calculate day of year (1-366)
function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function useDailyQuote() {
  const [quote, setQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyQuote() {
      const dayOfYear = getDayOfYear();
      
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('quote')
        .eq('day_of_year', dayOfYear)
        .single();

      if (error) {
        console.error('Error fetching daily quote:', error);
        // Fallback to stoic reflection title if there's an error
        setQuote('');
      } else {
        setQuote(data?.quote || '');
      }
      
      setIsLoading(false);
    }

    fetchDailyQuote();
  }, []);

  return { quote, isLoading };
}
