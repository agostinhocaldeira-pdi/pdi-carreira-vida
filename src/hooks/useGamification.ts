import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_points: number;
  level: number;
}

// Simplified level system: Iniciante (0-50), Intermediário (51-100), Experiente (100+)
const LEVEL_NAMES = ['Iniciante', 'Intermediário', 'Experiente'] as const;
type LevelName = typeof LEVEL_NAMES[number];

export function useGamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState<UserStreak>({
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    total_points: 0,
    level: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [levelUpReward, setLevelUpReward] = useState<LevelName | null>(null);

  // Load achievements from localStorage (mock) or Supabase
  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage for now (will migrate to Supabase)
      const storedAchievements = localStorage.getItem('achievement_definitions');
      const storedUserAchievements = localStorage.getItem('user_achievements');
      const storedStreak = localStorage.getItem('user_streak');

      // Default achievements if not stored
      const defaultAchievements: Achievement[] = [
        { id: '1', code: 'first_diary', name: 'Primeiro Passo', description: 'Registrou seu primeiro dia no diário', icon: '📝', category: 'diario', points: 10, requirement_type: 'diary_entries', requirement_value: 1 },
        { id: '2', code: 'diary_week', name: 'Semana Consistente', description: 'Registrou 7 dias consecutivos no diário', icon: '🔥', category: 'diario', points: 50, requirement_type: 'diary_streak', requirement_value: 7 },
        { id: '3', code: 'diary_month', name: 'Mês de Reflexão', description: 'Registrou 30 dias consecutivos no diário', icon: '🏆', category: 'diario', points: 200, requirement_type: 'diary_streak', requirement_value: 30 },
        { id: '4', code: 'first_objective', name: 'Visionário', description: 'Criou seu primeiro objetivo', icon: '🎯', category: 'objetivos', points: 10, requirement_type: 'objectives', requirement_value: 1 },
        { id: '5', code: 'three_objectives', name: 'Foco Total', description: 'Tem 3 objetivos ativos', icon: '🎯', category: 'objetivos', points: 30, requirement_type: 'objectives', requirement_value: 3 },
        { id: '6', code: 'first_goal', name: 'Planejador', description: 'Criou sua primeira meta', icon: '📊', category: 'metas', points: 10, requirement_type: 'goals', requirement_value: 1 },
        { id: '7', code: 'ten_goals', name: 'Estrategista', description: 'Criou 10 metas', icon: '📊', category: 'metas', points: 100, requirement_type: 'goals', requirement_value: 10 },
        { id: '8', code: 'first_action', name: 'Executor', description: 'Completou sua primeira ação', icon: '⚡', category: 'acoes', points: 10, requirement_type: 'actions_completed', requirement_value: 1 },
        { id: '9', code: 'fifty_actions', name: 'Máquina de Ação', description: 'Completou 50 ações', icon: '⚡', category: 'acoes', points: 200, requirement_type: 'actions_completed', requirement_value: 50 },
        { id: '10', code: 'vvd_complete', name: 'Visão Clara', description: 'Definiu sua Visão de Vida Desejada', icon: '🌟', category: 'plano', points: 50, requirement_type: 'vvd_complete', requirement_value: 1 },
        { id: '11', code: 'valores_complete', name: 'Valores Definidos', description: 'Completou o exercício de Valores', icon: '💎', category: 'plano', points: 50, requirement_type: 'valores_complete', requirement_value: 1 },
        { id: '12', code: 'roda_complete', name: 'Autoconhecimento', description: 'Completou a Roda da Vida', icon: '🎡', category: 'ferramentas', points: 30, requirement_type: 'roda_complete', requirement_value: 1 },
        { id: '13', code: 'swot_complete', name: 'Analista', description: 'Completou a Análise SWOT', icon: '📋', category: 'ferramentas', points: 30, requirement_type: 'swot_complete', requirement_value: 1 },
        { id: '14', code: 'smart_complete', name: 'Metas SMART', description: 'Criou uma meta usando método SMART', icon: '🧠', category: 'ferramentas', points: 40, requirement_type: 'smart_goals', requirement_value: 1 },
        { id: '15', code: 'level_5', name: 'Aprendiz', description: 'Alcançou o nível 5', icon: '⭐', category: 'nivel', points: 100, requirement_type: 'level', requirement_value: 5 },
        { id: '16', code: 'level_10', name: 'Praticante', description: 'Alcançou o nível 10', icon: '⭐', category: 'nivel', points: 200, requirement_type: 'level', requirement_value: 10 },
        { id: '17', code: 'level_25', name: 'Mestre', description: 'Alcançou o nível 25', icon: '👑', category: 'nivel', points: 500, requirement_type: 'level', requirement_value: 25 },
      ];

      const achievementsData = storedAchievements ? JSON.parse(storedAchievements) : defaultAchievements;
      const userAchievementsData = storedUserAchievements ? JSON.parse(storedUserAchievements) : [];
      const streakData = storedStreak ? JSON.parse(storedStreak) : {
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        total_points: 0,
        level: 1,
      };

      if (!storedAchievements) {
        localStorage.setItem('achievement_definitions', JSON.stringify(defaultAchievements));
      }

      setAchievements(achievementsData);
      setUserAchievements(userAchievementsData);
      setStreak(streakData);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified level calculation:
  // 0-50 points = Iniciante (level 1)
  // 51-100 points = Intermediário (level 2)
  // 100+ points = Experiente (level 3)
  const calculateLevel = (points: number): number => {
    if (points > 100) return 3; // Experiente
    if (points > 50) return 2; // Intermediário
    return 1; // Iniciante
  };

  const getLevelName = (level: number): LevelName => {
    return LEVEL_NAMES[Math.min(level - 1, 2)];
  };

  const getProgressToNextLevel = (): { current: number; next: number; percentage: number; levelName: LevelName } => {
    const levelName = getLevelName(streak.level);
    
    if (streak.level === 1) {
      // Iniciante: progressing to 51 points
      return {
        current: streak.total_points,
        next: 51,
        percentage: Math.min((streak.total_points / 51) * 100, 100),
        levelName,
      };
    } else if (streak.level === 2) {
      // Intermediário: progressing to 101 points
      return {
        current: streak.total_points - 51,
        next: 50, // 51 to 101
        percentage: Math.min(((streak.total_points - 51) / 50) * 100, 100),
        levelName,
      };
    } else {
      // Experiente: max level
      return {
        current: streak.total_points,
        next: streak.total_points,
        percentage: 100,
        levelName,
      };
    }
  };

  // Add points for any action in the system
  const addActionPoint = useCallback(() => {
    const previousLevel = streak.level;
    const newPoints = streak.total_points + 1;
    const newLevel = calculateLevel(newPoints);
    
    const updatedStreak = {
      ...streak,
      total_points: newPoints,
      level: newLevel,
    };
    
    setStreak(updatedStreak);
    localStorage.setItem('user_streak', JSON.stringify(updatedStreak));
    
    // Check for level up rewards (insights)
    if (newLevel > previousLevel) {
      if (newLevel === 2) {
        setLevelUpReward('Intermediário');
      } else if (newLevel === 3) {
        setLevelUpReward('Experiente');
      }
    }
  }, [streak]);

  const dismissLevelUpReward = useCallback(() => {
    setLevelUpReward(null);
  }, []);

  const unlockAchievement = useCallback((code: string) => {
    if (userAchievements.includes(code)) return;

    const achievement = achievements.find(a => a.code === code);
    if (!achievement) return;

    const updatedUserAchievements = [...userAchievements, code];
    const newPoints = streak.total_points + achievement.points;
    const newLevel = calculateLevel(newPoints);

    const updatedStreak = {
      ...streak,
      total_points: newPoints,
      level: newLevel,
    };

    setUserAchievements(updatedUserAchievements);
    setStreak(updatedStreak);
    setNewAchievement({ ...achievement, unlocked: true, unlocked_at: new Date().toISOString() });

    localStorage.setItem('user_achievements', JSON.stringify(updatedUserAchievements));
    localStorage.setItem('user_streak', JSON.stringify(updatedStreak));

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => setNewAchievement(null), 5000);
  }, [achievements, userAchievements, streak]);

  // Update streak AND add 1 point for daily access
  const updateStreak = useCallback((activityDate: string = new Date().toISOString().split('T')[0]) => {
    const lastDate = streak.last_activity_date;
    let newCurrentStreak = streak.current_streak;
    let newLongestStreak = streak.longest_streak;
    let addDailyPoint = false;

    if (lastDate) {
      const last = new Date(lastDate);
      const current = new Date(activityDate);
      const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day - add streak point
        newCurrentStreak++;
        addDailyPoint = true;
      } else if (diffDays > 1) {
        // Streak broken
        newCurrentStreak = 1;
        addDailyPoint = true;
      }
      // If same day (diffDays === 0), don't add daily point
    } else {
      // First access ever
      newCurrentStreak = 1;
      addDailyPoint = true;
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    const previousLevel = streak.level;
    const newPoints = addDailyPoint ? streak.total_points + 1 : streak.total_points;
    const newLevel = calculateLevel(newPoints);

    const updatedStreak = {
      ...streak,
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_activity_date: activityDate,
      total_points: newPoints,
      level: newLevel,
    };

    setStreak(updatedStreak);
    localStorage.setItem('user_streak', JSON.stringify(updatedStreak));

    // Check for level up rewards (insights)
    if (newLevel > previousLevel) {
      if (newLevel === 2) {
        setLevelUpReward('Intermediário');
      } else if (newLevel === 3) {
        setLevelUpReward('Experiente');
      }
    }

    // Check streak achievements
    if (newCurrentStreak >= 7) unlockAchievement('diary_week');
    if (newCurrentStreak >= 30) unlockAchievement('diary_month');
  }, [streak, unlockAchievement]);

  const checkAndUnlockAchievements = useCallback(() => {
    // Check objectives
    const objectives = JSON.parse(localStorage.getItem('meus_objetivos') || '[]');
    if (objectives.length >= 1) unlockAchievement('first_objective');
    if (objectives.length >= 3) unlockAchievement('three_objectives');

    // Check goals
    const metas = JSON.parse(localStorage.getItem('metas') || '[]');
    if (metas.length >= 1) unlockAchievement('first_goal');
    if (metas.length >= 10) unlockAchievement('ten_goals');

    // Check completed actions
    const completedActions = metas.reduce((acc: number, meta: any) => {
      const completed = (meta.acoes || []).filter((a: any) => a.status === 'concluido').length;
      return acc + completed;
    }, 0);
    if (completedActions >= 1) unlockAchievement('first_action');
    if (completedActions >= 50) unlockAchievement('fifty_actions');

    // Check VVD
    const vvd = localStorage.getItem('visao_vida_desejada');
    if (vvd && vvd.length > 10) unlockAchievement('vvd_complete');

    // Check Valores
    const valores = JSON.parse(localStorage.getItem('meus_valores') || '[]');
    if (valores.length >= 6) unlockAchievement('valores_complete');

    // Check Roda da Vida
    const areasVida = JSON.parse(localStorage.getItem('areas_vida') || '[]');
    if (areasVida.length >= 10) unlockAchievement('roda_complete');

    // Check SWOT
    const swot = JSON.parse(localStorage.getItem('analise_swot') || '{}');
    if (swot.forcas?.length > 0 || swot.fraquezas?.length > 0) unlockAchievement('swot_complete');

    // Check SMART goals
    const smartMetas = metas.filter((m: any) => m.from_smart);
    if (smartMetas.length >= 1) unlockAchievement('smart_complete');

    // Check diary
    const diario = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    if (diario.length >= 1) unlockAchievement('first_diary');

    // Check level achievements
    if (streak.level >= 5) unlockAchievement('level_5');
    if (streak.level >= 10) unlockAchievement('level_10');
    if (streak.level >= 25) unlockAchievement('level_25');
  }, [unlockAchievement, streak.level]);

  const dismissNewAchievement = () => setNewAchievement(null);

  const getUnlockedAchievements = (): Achievement[] => {
    return achievements.filter(a => userAchievements.includes(a.code));
  };

  const getLockedAchievements = (): Achievement[] => {
    return achievements.filter(a => !userAchievements.includes(a.code));
  };

  return {
    achievements,
    userAchievements,
    streak,
    isLoading,
    newAchievement,
    levelUpReward,
    unlockAchievement,
    updateStreak,
    addActionPoint,
    checkAndUnlockAchievements,
    dismissNewAchievement,
    dismissLevelUpReward,
    getUnlockedAchievements,
    getLockedAchievements,
    getProgressToNextLevel,
    getLevelName,
  };
}
