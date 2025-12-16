import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    console.log(`Checking for users who should receive weekly summary (today is day ${currentDayOfWeek})...`);

    // Get all users with weekly summary enabled for today
    const { data: preferences, error: prefError } = await supabase
      .from("user_notification_preferences")
      .select("user_id, weekly_summary_enabled, weekly_summary_day, email_enabled")
      .eq("weekly_summary_enabled", true)
      .eq("email_enabled", true)
      .eq("weekly_summary_day", currentDayOfWeek);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      throw prefError;
    }

    console.log(`Found ${preferences?.length || 0} users to receive weekly summary today`);

    const summariesToSend: { userId: string; data: any }[] = [];

    // Calculate date range for the past week
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    for (const pref of preferences || []) {
      // Get diary entries from the past week with mood data
      const { data: diaryEntries, error: diaryError } = await supabase
        .from("diary_entries")
        .select("id, mood, entry_date")
        .eq("user_id", pref.user_id)
        .gte("entry_date", weekAgoStr)
        .lte("entry_date", todayStr);

      if (diaryError) {
        console.error(`Error fetching diary for user ${pref.user_id}:`, diaryError);
      }

      // Calculate mood summary
      const moodCounts: Record<string, number> = { feliz: 0, neutro: 0, triste: 0 };
      for (const entry of diaryEntries || []) {
        if (entry.mood && moodCounts.hasOwnProperty(entry.mood)) {
          moodCounts[entry.mood]++;
        }
      }

      // Get ALL objectives for progress section
      const { data: allObjectives, error: objError } = await supabase
        .from("user_objectives")
        .select("id, texto, status, data_alvo, created_at")
        .eq("user_id", pref.user_id);

      if (objError) {
        console.error(`Error fetching objectives for user ${pref.user_id}:`, objError);
      }

      // Get ALL goals (metas) for progress section
      const { data: allGoals, error: goalsError } = await supabase
        .from("user_goals")
        .select("id, texto, status, data_alvo, created_at")
        .eq("user_id", pref.user_id);

      if (goalsError) {
        console.error(`Error fetching goals for user ${pref.user_id}:`, goalsError);
      }

      // Get ALL actions for progress section
      const { data: allActions, error: actionsError } = await supabase
        .from("user_actions")
        .select("id, texto, status, created_at, updated_at")
        .eq("user_id", pref.user_id);

      if (actionsError) {
        console.error(`Error fetching actions for user ${pref.user_id}:`, actionsError);
      }

      // Calculate progress stats
      const objectivesTotal = allObjectives?.length || 0;
      const objectivesCompleted = allObjectives?.filter(o => o.status === 'concluído').length || 0;
      const goalsTotal = allGoals?.length || 0;
      const goalsCompleted = allGoals?.filter(g => g.status === 'concluído').length || 0;
      const actionsTotal = allActions?.length || 0;
      const actionsCompleted = allActions?.filter(a => a.status === 'concluído').length || 0;

      // New items this week
      const newObjectivesThisWeek = allObjectives?.filter(o => 
        new Date(o.created_at) >= weekAgo
      ) || [];
      const newGoalsThisWeek = allGoals?.filter(g => 
        new Date(g.created_at) >= weekAgo
      ) || [];
      const actionsCompletedThisWeek = allActions?.filter(a => 
        a.status === 'concluído' && new Date(a.updated_at) >= weekAgo
      ) || [];

      // Get user streak
      const { data: streakData, error: streakError } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak, total_points, level")
        .eq("user_id", pref.user_id)
        .single();

      if (streakError && streakError.code !== "PGRST116") {
        console.error(`Error fetching streak for user ${pref.user_id}:`, streakError);
      }

      summariesToSend.push({
        userId: pref.user_id,
        data: {
          // Diary stats
          diaryEntries: diaryEntries?.length || 0,
          // Mood summary
          moodSummary: moodCounts,
          totalMoodEntries: (moodCounts.feliz + moodCounts.neutro + moodCounts.triste),
          // Progress section data
          progress: {
            objectives: { total: objectivesTotal, completed: objectivesCompleted },
            goals: { total: goalsTotal, completed: goalsCompleted },
            actions: { total: actionsTotal, completed: actionsCompleted },
          },
          // New items this week
          newObjectivesThisWeek: newObjectivesThisWeek.map(o => ({ texto: o.texto, data_alvo: o.data_alvo })),
          newGoalsThisWeek: newGoalsThisWeek.map(g => ({ texto: g.texto, data_alvo: g.data_alvo })),
          actionsCompletedThisWeek: actionsCompletedThisWeek.length,
          // Streak data
          currentStreak: streakData?.current_streak || 0,
          longestStreak: streakData?.longest_streak || 0,
          totalPoints: streakData?.total_points || 0,
          level: streakData?.level || 1,
        },
      });
    }

    console.log(`Sending weekly summaries to ${summariesToSend.length} users`);

    // Helper function to add delay between requests
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Send summaries with delay to avoid rate limiting
    const results = [];
    for (let i = 0; i < summariesToSend.length; i++) {
      const summary = summariesToSend[i];
      
      // Add 600ms delay between requests (Resend allows 2/sec)
      if (i > 0) {
        await delay(600);
      }
      
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-notification-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "weekly_summary",
            userId: summary.userId,
            data: summary.data,
          }),
        });

        const result = await response.json();
        results.push({ userId: summary.userId, success: result.success });
        console.log(`Weekly summary sent to ${summary.userId}:`, result.success);
      } catch (error) {
        console.error(`Error sending summary to ${summary.userId}:`, error);
        results.push({ userId: summary.userId, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dayOfWeek: currentDayOfWeek,
        checked: preferences?.length || 0,
        summariesSent: summariesToSend.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-weekly-summary function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
