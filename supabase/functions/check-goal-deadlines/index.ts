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

    console.log("Checking for users with upcoming goal deadlines...");

    // Get all users with goal deadline notifications enabled
    const { data: preferences, error: prefError } = await supabase
      .from("user_notification_preferences")
      .select("user_id, goal_deadline_reminder, goal_deadline_days_before, email_enabled")
      .eq("goal_deadline_reminder", true)
      .eq("email_enabled", true);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      throw prefError;
    }

    console.log(`Found ${preferences?.length || 0} users with goal deadline reminders enabled`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notificationsToSend: { userId: string; goals: any[] }[] = [];

    for (const pref of preferences || []) {
      const daysBefore = pref.goal_deadline_days_before || 3;
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysBefore);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      // Check goals (metas) with upcoming deadlines
      const { data: upcomingGoals, error: goalsError } = await supabase
        .from("user_goals")
        .select("id, texto, data_alvo, status")
        .eq("user_id", pref.user_id)
        .neq("status", "concluído")
        .lte("data_alvo", targetDateStr)
        .gte("data_alvo", today.toISOString().split('T')[0]);

      if (goalsError) {
        console.error(`Error fetching goals for user ${pref.user_id}:`, goalsError);
        continue;
      }

      // Also check objectives with upcoming deadlines
      const { data: upcomingObjectives, error: objError } = await supabase
        .from("user_objectives")
        .select("id, texto, data_alvo, status")
        .eq("user_id", pref.user_id)
        .neq("status", "concluído")
        .lte("data_alvo", targetDateStr)
        .gte("data_alvo", today.toISOString().split('T')[0]);

      if (objError) {
        console.error(`Error fetching objectives for user ${pref.user_id}:`, objError);
        continue;
      }

      const allUpcoming = [
        ...(upcomingGoals || []).map(g => ({ ...g, type: 'meta' })),
        ...(upcomingObjectives || []).map(o => ({ ...o, type: 'objetivo' }))
      ];

      if (allUpcoming.length > 0) {
        notificationsToSend.push({ userId: pref.user_id, goals: allUpcoming });
      }
    }

    console.log(`Sending deadline notifications to ${notificationsToSend.length} users`);

    // Send notifications
    const results = [];
    for (const notification of notificationsToSend) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-notification-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "goal_deadline",
            userId: notification.userId,
            data: { goals: notification.goals },
          }),
        });

        const result = await response.json();
        results.push({ userId: notification.userId, goalsCount: notification.goals.length, success: result.success });
        console.log(`Deadline notification sent to ${notification.userId}:`, result.success);
      } catch (error) {
        console.error(`Error sending notification to ${notification.userId}:`, error);
        results.push({ userId: notification.userId, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: preferences?.length || 0,
        notificationsSent: notificationsToSend.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-goal-deadlines function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
