import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessingLog {
  started_at: string;
  completed_at?: string;
  users_processed: number;
  users_failed: number;
  duration_seconds?: number;
  error_details?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const log: ProcessingLog = {
    started_at: new Date().toISOString(),
    users_processed: 0,
    users_failed: 0,
  };

  try {
    const { trigger, user_id } = await req.json().catch(() => ({}));
    
    console.log(`Processing cache - trigger: ${trigger || 'manual'}, user_id: ${user_id || 'all'}`);

    // Get users to process
    let usersToProcess: string[] = [];
    
    if (user_id) {
      // Process single user
      usersToProcess = [user_id];
    } else {
      // Get all active users (logged in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentUsers, error: usersError } = await supabase
        .from('user_streaks')
        .select('user_id')
        .gte('last_activity_date', thirtyDaysAgo.toISOString().split('T')[0]);
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      usersToProcess = recentUsers?.map(u => u.user_id) || [];
    }

    console.log(`Processing ${usersToProcess.length} users`);

    const today = new Date().toISOString().split('T')[0];
    const dayOfYear = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

    // Process each user
    for (const userId of usersToProcess) {
      try {
        await processUserCache(supabase, userId, today, dayOfYear);
        log.users_processed++;
      } catch (err) {
        const error = err as Error;
        console.error(`Error processing user ${userId}:`, error);
        log.users_failed++;
        if (!log.error_details) log.error_details = [];
        log.error_details.push({ user_id: userId, error: error.message });
      }
    }

    log.completed_at = new Date().toISOString();
    log.duration_seconds = (new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000;

    // Save processing log
    await supabase.from('cache_processing_logs').insert(log);

    return new Response(
      JSON.stringify({
        success: true,
        users_processed: log.users_processed,
        users_failed: log.users_failed,
        duration_seconds: log.duration_seconds,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Error in process-home-cache:", error);
    
    log.completed_at = new Date().toISOString();
    log.duration_seconds = (new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000;
    log.error_details = { fatal_error: error.message };
    
    try {
      await supabase.from('cache_processing_logs').insert(log);
    } catch (logError) {
      console.error("Error saving log:", logError);
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function processUserCache(supabase: any, userId: string, today: string, dayOfYear: number) {
  // Fetch all data in parallel
  const [
    objectivesResult,
    goalsResult,
    actionsResult,
    stepsResult,
    vvdResult,
    valoresResult,
    areasVidaResult,
    diaryResult,
    streakResult,
    achievementsResult,
    insightResult,
    insightAudioResult,
    stoicAudioResult,
    dailyQuoteResult,
    swotResult,
    beliefsResult,
    eisenhowerResult,
    selfAssessmentResult,
    agendaResult,
    rolesResult,
    employeeResult,
    managerResult,
    integrationsResult,
    okrLinksResult,
    stoicReflectionResult,
  ] = await Promise.all([
    supabase.from('user_objectives').select('*').eq('user_id', userId),
    supabase.from('user_goals').select('*').eq('user_id', userId),
    supabase.from('user_actions').select('*').eq('user_id', userId),
    supabase.from('user_steps').select('*').eq('user_id', userId),
    supabase.from('user_vvd').select('*').eq('user_id', userId).single(),
    supabase.from('user_valores').select('*').eq('user_id', userId).single(),
    supabase.from('user_life_areas').select('*').eq('user_id', userId),
    supabase.from('diary_entries').select('*').eq('user_id', userId).order('entry_date', { ascending: false }).limit(30),
    supabase.from('user_streaks').select('*').eq('user_id', userId).single(),
    supabase.from('user_achievements').select('*, achievement_definitions(*)').eq('user_id', userId).order('unlocked_at', { ascending: false }).limit(5),
    supabase.from('user_insights').select('*').eq('user_id', userId).single(),
    supabase.from('user_insight_audio').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
    supabase.from('stoic_reflection_audio').select('*').eq('date_key', today).single(),
    supabase.from('daily_quotes').select('*').eq('day_of_year', dayOfYear).single(),
    supabase.from('user_swot').select('*').eq('user_id', userId).single(),
    supabase.from('user_beliefs').select('*').eq('user_id', userId),
    supabase.from('user_eisenhower_tasks').select('*').eq('user_id', userId),
    supabase.from('user_self_assessment').select('*').eq('user_id', userId).single(),
    supabase.from('agenda_events').select('*').eq('user_id', userId),
    supabase.from('user_roles').select('*').eq('user_id', userId),
    supabase.from('company_employees').select('*').eq('user_id', userId).single(),
    supabase.from('company_managers').select('*').eq('user_id', userId).single(),
    supabase.from('user_integrations').select('*').eq('user_id', userId),
    supabase.from('user_okr_links').select('*, company_okrs(*)').eq('user_id', userId),
    supabase.from('user_stoic_reflections').select('*').eq('user_id', userId).eq('reflection_date', today).single(),
  ]);

  const objectives = objectivesResult.data || [];
  const goals = goalsResult.data || [];
  const actions = actionsResult.data || [];
  const steps = stepsResult.data || [];
  const vvd = vvdResult.data;
  const valores = valoresResult.data;
  const areasVida = areasVidaResult.data || [];
  const diaryEntries = diaryResult.data || [];
  const streak = streakResult.data;
  const achievements = achievementsResult.data || [];
  const insight = insightResult.data;
  const insightAudio = insightAudioResult.data?.[0];
  const stoicAudio = stoicAudioResult.data;
  const dailyQuote = dailyQuoteResult.data;
  const swot = swotResult.data;
  const beliefs = beliefsResult.data || [];
  const eisenhowerTasks = eisenhowerResult.data || [];
  const selfAssessment = selfAssessmentResult.data;
  const agendaEvents = agendaResult.data || [];
  const roles = rolesResult.data || [];
  const employee = employeeResult.data;
  const manager = managerResult.data;
  const integrations = integrationsResult.data || [];
  const okrLinks = okrLinksResult.data || [];
  const stoicReflection = stoicReflectionResult.data;

  // Build objectives hierarchy
  const objectivesData = objectives.map((obj: any) => ({
    id: obj.id,
    texto: obj.texto,
    status: obj.status,
    is_principal: obj.is_principal,
    data_alvo: obj.data_alvo,
    conexao_vvd: obj.conexao_vvd,
    goals: goals
      .filter((g: any) => g.objective_id === obj.id)
      .map((goal: any) => ({
        id: goal.id,
        texto: goal.texto,
        status: goal.status,
        data_alvo: goal.data_alvo,
        actions: actions
          .filter((a: any) => a.goal_id === goal.id)
          .map((action: any) => ({
            id: action.id,
            texto: action.texto,
            status: action.status,
            periodicidade: action.periodicidade,
            steps: steps
              .filter((s: any) => s.action_id === action.id)
              .map((step: any) => ({
                id: step.id,
                texto: step.texto,
                concluido: step.concluido,
              })),
          })),
      })),
  }));

  // Calculate progress stats
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter((o: any) => o.status === 'concluido').length;
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g: any) => g.status === 'concluido').length;
  const totalActions = actions.length;
  const completedActions = actions.filter((a: any) => a.status === 'concluido').length;
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s: any) => s.concluido).length;
  
  const totalItems = totalObjectives + totalGoals + totalActions + totalSteps;
  const completedItems = completedObjectives + completedGoals + completedActions + completedSteps;
  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Plan completion status
  const hasQuemSou = areasVida.length > 0 || (valores?.valores?.length > 0);
  const hasParaOnde = !!vvd?.vvd_sentence;
  const hasComoChegar = objectives.length > 0;
  const isPlanComplete = hasQuemSou && hasParaOnde && hasComoChegar;

  // Diary data
  const lastEntry = diaryEntries[0];
  const hasEntryToday = lastEntry?.entry_date === today;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const entriesThisWeek = diaryEntries.filter((e: any) => e.entry_date >= weekAgoStr).length;
  const moodTrend = diaryEntries.slice(0, 5).map((e: any) => e.mood).filter(Boolean);

  // Gamification data
  const level = streak?.level || 1;
  const levelNames = ['Iniciante', 'Explorador', 'Estrategista', 'Visionário', 'Mestre', 'Lenda'];
  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];

  // Agenda data
  const todayEvents = agendaEvents.filter((e: any) => {
    if (e.scheduled_date === today) return true;
    if (e.is_recurring && e.recurrence_type === 'daily') return true;
    return false;
  });
  const todayTasksCount = todayEvents.length;
  const todayCompletedCount = todayEvents.filter((e: any) => e.is_completed).length;
  
  const overdueEvents = agendaEvents.filter((e: any) => 
    e.scheduled_date < today && !e.is_completed && !e.is_recurring
  );
  
  // Upcoming deadlines (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];
  
  const upcomingDeadlines = [
    ...goals.filter((g: any) => g.data_alvo && g.data_alvo >= today && g.data_alvo <= nextWeekStr && g.status !== 'concluido'),
    ...objectives.filter((o: any) => o.data_alvo && o.data_alvo >= today && o.data_alvo <= nextWeekStr && o.status !== 'concluido'),
  ].map((item: any) => ({
    id: item.id,
    title: item.texto,
    date: item.data_alvo,
    daysUntil: Math.ceil((new Date(item.data_alvo).getTime() - new Date(today).getTime()) / 86400000),
  })).sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 5);

  // Weekly completion rate
  const weeklyEvents = agendaEvents.filter((e: any) => e.scheduled_date >= weekAgoStr);
  const weeklyCompletionRate = weeklyEvents.length > 0 
    ? Math.round((weeklyEvents.filter((e: any) => e.is_completed).length / weeklyEvents.length) * 100)
    : 0;

  // Tasks by source
  const tasksBySource: Record<string, number> = {};
  agendaEvents.forEach((e: any) => {
    tasksBySource[e.source_type] = (tasksBySource[e.source_type] || 0) + 1;
  });

  // Tools status
  const toolsStatus = {
    roda_da_vida: { completed: areasVida.length > 0, count: areasVida.length },
    valores: { completed: (valores?.valores?.length || 0) > 0, count: valores?.valores?.length || 0 },
    vvd: { completed: !!vvd?.vvd_sentence, has_sentence: !!vvd?.vvd_sentence, has_paragraph: !!vvd?.vvd_paragraph },
    swot: { completed: !!(swot?.strengths?.length || swot?.weaknesses?.length) },
    crencas: { completed: beliefs.length > 0, count: beliefs.length },
    autoavaliacao: { completed: !!selfAssessment?.self_answers },
    eisenhower: { completed: eisenhowerTasks.length > 0, tasks_count: eisenhowerTasks.length },
    smart: { completed: goals.some((g: any) => g.from_smart) },
  };

  // Plano vida summary
  const planoVidaSummary = {
    quem_sou: {
      completed: hasQuemSou,
      life_areas_count: areasVida.length,
      avg_current_score: areasVida.length > 0 
        ? Number((areasVida.reduce((sum: number, a: any) => sum + (a.current_score || 0), 0) / areasVida.length).toFixed(1))
        : 0,
      avg_desired_score: areasVida.length > 0
        ? Number((areasVida.reduce((sum: number, a: any) => sum + (a.desired_score || 0), 0) / areasVida.length).toFixed(1))
        : 0,
      valores_count: valores?.valores?.length || 0,
      top_valores: (valores?.valores || []).slice(0, 3),
    },
    para_onde: {
      completed: hasParaOnde,
      vvd_sentence: vvd?.vvd_sentence || null,
      has_vvd_paragraph: !!vvd?.vvd_paragraph,
    },
    como_chegar: {
      completed: hasComoChegar,
      objectives_count: objectives.length,
      principal_objective: objectives.find((o: any) => o.is_principal)?.texto || null,
    },
  };

  // User roles
  const userRolesData = {
    is_admin: roles.some((r: any) => r.role === 'admin'),
    is_gestor: roles.some((r: any) => r.role === 'gestor'),
    is_empresa: roles.some((r: any) => r.role === 'empresa'),
    roles: roles.map((r: any) => r.role),
  };

  // Integrations status
  const integrationsStatus: Record<string, any> = {};
  integrations.forEach((i: any) => {
    integrationsStatus[i.integration_type] = {
      connected: i.is_connected,
      last_sync: i.last_sync_at,
    };
  });

  // OKR links data
  const okrLinksData = okrLinks.map((link: any) => ({
    okr_id: link.okr_id,
    okr_title: link.company_okrs?.title,
    linked_objective_id: link.objetivo_id,
    contribution_percentage: link.contribution_percentage,
  }));

  // Pending notifications
  const missedDiaryDays = hasEntryToday ? 0 : 1; // Simplified
  const pendingNotifications = {
    unread_count: upcomingDeadlines.filter(d => d.daysUntil <= 3).length + (missedDiaryDays > 0 ? 1 : 0),
    goal_deadlines_soon: upcomingDeadlines.filter(d => d.daysUntil <= 5),
    missed_diary_days: missedDiaryDays,
  };

  // Build cache object
  const cacheData = {
    user_id: userId,
    is_plan_complete: isPlanComplete,
    plan_completion_details: {
      quem_sou: hasQuemSou,
      para_onde: hasParaOnde,
      como_chegar: hasComoChegar,
      has_objective: objectives.length > 0,
      has_goal: goals.length > 0,
      has_action: actions.length > 0,
      has_step: steps.length > 0,
    },
    subscription_status: employee?.is_subscription_exempt ? 'company_exempt' : 'active', // Simplified
    subscription_plan: 'completo', // Would need subscription check
    subscription_days_remaining: 30, // Would need subscription check
    is_company_employee: !!employee,
    is_company_manager: !!manager,
    company_id: employee?.company_id || manager?.company_id || null,
    objectives_data: objectivesData,
    progress_stats: {
      total_objectives: totalObjectives,
      completed_objectives: completedObjectives,
      total_goals: totalGoals,
      completed_goals: completedGoals,
      total_actions: totalActions,
      completed_actions: completedActions,
      total_steps: totalSteps,
      completed_steps: completedSteps,
      overall_percentage: overallPercentage,
    },
    gamification_data: {
      level,
      level_name: levelName,
      total_points: streak?.total_points || 0,
      points_to_next_level: (level * 500) - (streak?.total_points || 0),
      current_streak: streak?.current_streak || 0,
      longest_streak: streak?.longest_streak || 0,
      last_activity_date: streak?.last_activity_date,
      achievements_count: achievements.length,
      recent_achievements: achievements.slice(0, 3).map((a: any) => ({
        id: a.achievement_id,
        code: a.achievement_definitions?.code,
        name: a.achievement_definitions?.name,
        unlocked_at: a.unlocked_at,
      })),
    },
    diary_data: {
      last_entry_date: lastEntry?.entry_date || null,
      entries_this_week: entriesThisWeek,
      entries_this_month: diaryEntries.length,
      mood_trend: moodTrend,
      has_entry_today: hasEntryToday,
    },
    insight_data: {
      has_insight: !!insight?.insight_text,
      insight_text: insight?.insight_text || null,
      generated_at: insight?.generated_at || null,
      has_audio: !!insightAudio,
      audio_url: insightAudio?.audio_url || null,
    },
    stoic_reflection: stoicAudio ? {
      date: today,
      title: stoicAudio.title,
      has_audio: true,
      audio_url: stoicAudio.audio_url,
      user_response: stoicReflection?.response || null,
    } : {},
    daily_quote: dailyQuote ? {
      quote: dailyQuote.quote,
      day_of_year: dayOfYear,
    } : {},
    tools_status: toolsStatus,
    plano_vida_summary: planoVidaSummary,
    agenda_data: {
      today_tasks_count: todayTasksCount,
      today_completed_count: todayCompletedCount,
      overdue_tasks_count: overdueEvents.length,
      upcoming_deadlines: upcomingDeadlines,
      tasks_by_source: tasksBySource,
      weekly_completion_rate: weeklyCompletionRate,
    },
    pending_notifications: pendingNotifications,
    user_roles: userRolesData,
    integrations_status: integrationsStatus,
    okr_links: okrLinksData,
    cache_version: 1,
    last_updated_at: new Date().toISOString(),
    update_triggered_by: 'cron',
  };

  // Upsert cache
  const { error } = await supabase
    .from('user_home_cache')
    .upsert(cacheData, { onConflict: 'user_id' });

  if (error) {
    console.error(`Error upserting cache for user ${userId}:`, error);
    throw error;
  }

  console.log(`Cache updated for user ${userId}`);
}
