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

    console.log("Checking for users who need diary reminders...");

    // Get all users with notification preferences enabled
    const { data: preferences, error: prefError } = await supabase
      .from("user_notification_preferences")
      .select("user_id, diary_reminder_enabled, email_enabled")
      .eq("diary_reminder_enabled", true)
      .eq("email_enabled", true);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      throw prefError;
    }

    console.log(`Found ${preferences?.length || 0} users with diary reminders enabled`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const remindersToSend: { userId: string; daysInactive: number }[] = [];

    for (const pref of preferences || []) {
      // Check last diary entry for this user
      const { data: lastEntry, error: entryError } = await supabase
        .from("diary_entries")
        .select("entry_date")
        .eq("user_id", pref.user_id)
        .order("entry_date", { ascending: false })
        .limit(1)
        .single();

      if (entryError && entryError.code !== "PGRST116") {
        console.error(`Error fetching diary for user ${pref.user_id}:`, entryError);
        continue;
      }

      let daysInactive = 0;

      if (!lastEntry) {
        // User never wrote a diary entry
        daysInactive = 999;
      } else {
        const lastEntryDate = new Date(lastEntry.entry_date);
        lastEntryDate.setHours(0, 0, 0, 0);
        daysInactive = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      if (daysInactive >= 3) {
        remindersToSend.push({ userId: pref.user_id, daysInactive });
      }
    }

    console.log(`Sending reminders to ${remindersToSend.length} users`);

    // Send reminders
    const results = [];
    for (const reminder of remindersToSend) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-notification-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "diary_reminder",
            userId: reminder.userId,
            data: { daysInactive: reminder.daysInactive },
          }),
        });

        const result = await response.json();
        results.push({ userId: reminder.userId, success: result.success });
        console.log(`Reminder sent to ${reminder.userId}:`, result.success);
      } catch (error) {
        console.error(`Error sending reminder to ${reminder.userId}:`, error);
        results.push({ userId: reminder.userId, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: preferences?.length || 0,
        remindersSent: remindersToSend.length,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-diary-reminders function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
