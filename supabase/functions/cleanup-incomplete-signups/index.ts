import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CLEANUP-INCOMPLETE-SIGNUPS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get all users created more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    logStep("Looking for users created before", { cutoffDate: twentyFourHoursAgo });

    // List all users from Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    if (authError) {
      throw new Error(`Error listing users: ${authError.message}`);
    }

    logStep("Found users in auth", { count: authData.users.length });

    let deletedCount = 0;
    const usersToCheck = authData.users.filter(user => {
      const createdAt = new Date(user.created_at);
      const cutoff = new Date(twentyFourHoursAgo);
      return createdAt < cutoff;
    });

    logStep("Users older than 24h to check", { count: usersToCheck.length });

    for (const user of usersToCheck) {
      if (!user.email) continue;

      try {
        // Check if user has active Stripe subscription
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        
        if (customers.data.length === 0) {
          // No Stripe customer = no payment made, delete user
          logStep("User has no Stripe customer, deleting", { userId: user.id, email: user.email });
          
          // Delete user data from all tables first
          const tables = [
            'user_consents',
            'user_vvd',
            'user_valores',
            'user_life_areas',
            'user_objectives',
            'user_goals',
            'user_actions',
            'user_steps',
            'diary_entries',
            'user_swot',
            'user_beliefs',
            'user_skills',
            'user_addresses',
            'user_surveys',
            'user_onboarding',
            'user_streaks',
            'user_achievements',
            'user_roles',
            'user_notification_preferences',
            'user_integrations',
            'user_insights',
            'user_eisenhower_tasks',
            'user_self_assessment',
            'user_stoic_reflections',
          ];

          for (const table of tables) {
            await supabaseAdmin.from(table).delete().eq('user_id', user.id);
          }

          // Delete the auth user
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            logStep("Error deleting user", { userId: user.id, error: deleteError.message });
          } else {
            deletedCount++;
            logStep("User deleted successfully", { userId: user.id });
          }
          continue;
        }

        // Check if customer has any active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          // Has customer but no active subscription = checkout not completed
          logStep("User has no active subscription, deleting", { userId: user.id, email: user.email });
          
          // Delete user data from all tables
          const tables = [
            'user_consents',
            'user_vvd',
            'user_valores',
            'user_life_areas',
            'user_objectives',
            'user_goals',
            'user_actions',
            'user_steps',
            'diary_entries',
            'user_swot',
            'user_beliefs',
            'user_skills',
            'user_addresses',
            'user_surveys',
            'user_onboarding',
            'user_streaks',
            'user_achievements',
            'user_roles',
            'user_notification_preferences',
            'user_integrations',
            'user_insights',
            'user_eisenhower_tasks',
            'user_self_assessment',
            'user_stoic_reflections',
          ];

          for (const table of tables) {
            await supabaseAdmin.from(table).delete().eq('user_id', user.id);
          }

          // Delete the auth user
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            logStep("Error deleting user", { userId: user.id, error: deleteError.message });
          } else {
            deletedCount++;
            logStep("User deleted successfully", { userId: user.id });
          }
        } else {
          logStep("User has active subscription, keeping", { userId: user.id });
        }
      } catch (userError) {
        logStep("Error processing user", { userId: user.id, error: String(userError) });
      }
    }

    logStep("Cleanup completed", { deletedCount });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Cleanup completed. Deleted ${deletedCount} incomplete signups.`,
      deletedCount 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in cleanup-incomplete-signups", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
