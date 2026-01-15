import { useState, useRef, useEffect, useCallback } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AgendaCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  taskDates?: Date[];
}

export const AgendaCalendar = ({ selectedDate, onDateSelect, taskDates = [] }: AgendaCalendarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [displayedMonth, setDisplayedMonth] = useState<Date>(selectedDate);

  // Show 7 days on mobile, 14 on desktop
  const daysToShow = isMobile ? 7 : 14;
  const daysToNavigate = isMobile ? 7 : 14;

  // Generate days starting from weekStart
  const days = Array.from({ length: daysToShow }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -daysToNavigate));
  };

  const goToNextWeek = () => {
    setWeekStart(prev => addDays(prev, daysToNavigate));
  };

  const hasTasksOnDay = (date: Date) => {
    return taskDates.some(taskDate => isSameDay(taskDate, date));
  };

  // Update displayed month based on scroll position
  const updateDisplayedMonth = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const dayWidth = 56; // approximate width of each day button + gap
    
    // Calculate which day index is at the center of the visible area
    const containerWidth = container.offsetWidth;
    const centerScroll = scrollLeft + containerWidth / 2;
    const centerIndex = Math.floor(centerScroll / dayWidth);
    
    // Get the day at the center (clamped to valid range)
    const clampedIndex = Math.max(0, Math.min(centerIndex, days.length - 1));
    const visibleCenterDay = days[clampedIndex];
    
    if (visibleCenterDay) {
      setDisplayedMonth(visibleCenterDay);
    }
  }, [days]);

  // Handle scroll events
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateDisplayedMonth();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateDisplayedMonth]);

  // Update displayed month when weekStart changes
  useEffect(() => {
    // Use the first day of the visible range as default
    if (days.length > 0) {
      setDisplayedMonth(days[0]);
    }
  }, [weekStart]);

  // Scroll to center selected day on mount
  useEffect(() => {
    if (scrollRef.current) {
      const selectedIndex = days.findIndex(d => isSameDay(d, selectedDate));
      if (selectedIndex >= 0) {
        const dayWidth = 56; // approximate width of each day button
        const containerWidth = scrollRef.current.offsetWidth;
        const scrollPosition = (selectedIndex * dayWidth) - (containerWidth / 2) + (dayWidth / 2);
        scrollRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
      }
    }
  }, [selectedDate, weekStart]);

  return (
    <div className="space-y-3">
      {/* Date header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {format(displayedMonth, "MMMM yyyy", { locale: ptBR })}
          </p>
          <p className="text-lg font-semibold text-primary">
            {isToday(selectedDate) ? "HOJE" : format(selectedDate, "EEEE", { locale: ptBR }).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextWeek} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week days scroll */}
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasTasks = hasTasksOnDay(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[52px] h-[70px] rounded-xl transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : isTodayDate
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "bg-muted/50 text-foreground hover:bg-muted"
              )}
            >
              <span className={cn(
                "text-xs uppercase font-medium",
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {format(day, "EEE", { locale: ptBR })}
              </span>
              <span className={cn(
                "text-xl font-bold",
                isSelected ? "text-primary-foreground" : ""
              )}>
                {format(day, "d")}
              </span>
              {hasTasks && (
                <div className={cn(
                  "flex gap-0.5 mt-0.5",
                  isSelected ? "opacity-80" : ""
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
