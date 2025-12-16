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

    console.log("Checking for users with EXPIRED goals and objectives...");

    // Get ALL users from auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    const allUsers = authData?.users || [];
    console.log(`Found ${allUsers.length} total users`);

    // Check which users have opted OUT of goal deadline reminders
    const { data: optedOutPrefs, error: prefError } = await supabase
      .from("user_notification_preferences")
      .select("user_id")
      .eq("goal_deadline_reminder", false);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
    }

    const optedOutUserIds = new Set((optedOutPrefs || []).map(p => p.user_id));
    console.log(`${optedOutUserIds.size} users have opted out of deadline reminders`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const notificationsToSend: { userId: string; email: string; expiredItems: any[] }[] = [];

    for (const user of allUsers) {
      // Skip users who opted out
      if (optedOutUserIds.has(user.id)) {
        console.log(`User ${user.email} opted out of deadline reminders, skipping`);
        continue;
      }

      // Check goals (metas) with EXPIRED deadlines (past due and not completed)
      const { data: expiredGoals, error: goalsError } = await supabase
        .from("user_goals")
        .select("id, texto, data_alvo, status")
        .eq("user_id", user.id)
        .neq("status", "concluído")
        .lt("data_alvo", todayStr);

      if (goalsError) {
        console.error(`Error fetching goals for user ${user.email}:`, goalsError);
        continue;
      }

      // Also check objectives with EXPIRED deadlines
      const { data: expiredObjectives, error: objError } = await supabase
        .from("user_objectives")
        .select("id, texto, data_alvo, status")
        .eq("user_id", user.id)
        .neq("status", "concluído")
        .lt("data_alvo", todayStr);

      if (objError) {
        console.error(`Error fetching objectives for user ${user.email}:`, objError);
        continue;
      }

      const allExpired = [
        ...(expiredGoals || []).map(g => ({ ...g, type: 'meta' })),
        ...(expiredObjectives || []).map(o => ({ ...o, type: 'objetivo' }))
      ];

      if (allExpired.length > 0) {
        notificationsToSend.push({ 
          userId: user.id, 
          email: user.email || '',
          expiredItems: allExpired 
        });
        console.log(`User ${user.email} has ${allExpired.length} expired items`);
      }
    }

    console.log(`Sending expired deadline notifications to ${notificationsToSend.length} users`);

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
            email: notification.email,
            data: { 
              goals: notification.expiredItems,
              isExpired: true 
            },
          }),
        });

        const result = await response.json();
        results.push({ 
          userId: notification.userId, 
          email: notification.email,
          itemsCount: notification.expiredItems.length, 
          success: result.success 
        });
        console.log(`Expired deadline notification sent to ${notification.email}:`, result.success);
      } catch (error) {
        console.error(`Error sending notification to ${notification.email}:`, error);
        results.push({ userId: notification.userId, email: notification.email, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalUsers: allUsers.length,
        optedOut: optedOutUserIds.size,
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
