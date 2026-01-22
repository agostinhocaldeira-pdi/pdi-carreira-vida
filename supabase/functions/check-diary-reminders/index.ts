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

    console.log("Checking for users who need diary reminders (15 days inactive)...");

    // Get ALL users from auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    const allUsers = authData?.users || [];
    console.log(`Found ${allUsers.length} total users`);

    // Check which users have opted OUT of diary reminders
    const { data: optedOutPrefs, error: prefError } = await supabase
      .from("user_notification_preferences")
      .select("user_id")
      .eq("diary_reminder_enabled", false);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
    }

    const optedOutUserIds = new Set((optedOutPrefs || []).map(p => p.user_id));
    console.log(`${optedOutUserIds.size} users have opted out of diary reminders`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fifteenDaysAgo = new Date(today);
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const remindersToSend: { userId: string; email: string; daysInactive: number }[] = [];

    for (const user of allUsers) {
      // Skip users who opted out
      if (optedOutUserIds.has(user.id)) {
        console.log(`User ${user.email} opted out of diary reminders, skipping`);
        continue;
      }

      // Check last diary entry for this user
      const { data: lastEntry, error: entryError } = await supabase
        .from("diary_entries")
        .select("entry_date")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(1)
        .single();

      if (entryError && entryError.code !== "PGRST116") {
        console.error(`Error fetching diary for user ${user.email}:`, entryError);
        continue;
      }

      let daysInactive = 0;

      if (!lastEntry) {
        // User never wrote a diary entry - check account creation date
        const createdAt = new Date(user.created_at);
        createdAt.setHours(0, 0, 0, 0);
        daysInactive = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only remind if account is at least 15 days old
        if (daysInactive < 15) {
          console.log(`User ${user.email} is new (${daysInactive} days), skipping`);
          continue;
        }
      } else {
        const lastEntryDate = new Date(lastEntry.entry_date);
        lastEntryDate.setHours(0, 0, 0, 0);
        daysInactive = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Send reminder only if inactive for exactly 15 days (or multiples of 15)
      // This ensures the email is sent once every 15 days of inactivity
      if (daysInactive >= 15 && daysInactive % 15 === 0) {
        remindersToSend.push({ 
          userId: user.id, 
          email: user.email || '',
          daysInactive 
        });
        console.log(`User ${user.email} inactive for ${daysInactive} days, will send reminder`);
      } else if (daysInactive < 15) {
        console.log(`User ${user.email} inactive for only ${daysInactive} days, skipping (need 15)`);
      }
    }

    console.log(`Sending reminders to ${remindersToSend.length} users`);

    // Helper function to add delay between requests
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Send reminders with delay to avoid rate limiting
    const results = [];
    for (let i = 0; i < remindersToSend.length; i++) {
      const reminder = remindersToSend[i];
      
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
            type: "diary_reminder",
            userId: reminder.userId,
            email: reminder.email,
            data: { daysInactive: reminder.daysInactive },
          }),
        });

        const result = await response.json();
        results.push({ userId: reminder.userId, email: reminder.email, success: result.success });
        console.log(`Reminder sent to ${reminder.email}:`, result.success);
      } catch (error) {
        console.error(`Error sending reminder to ${reminder.email}:`, error);
        results.push({ userId: reminder.userId, email: reminder.email, success: false, error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalUsers: allUsers.length,
        optedOut: optedOutUserIds.size,
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
