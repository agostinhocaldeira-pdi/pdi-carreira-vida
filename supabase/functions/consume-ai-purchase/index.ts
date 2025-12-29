import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CONSUME-AI-PURCHASE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { featureType } = await req.json();
    if (!featureType) throw new Error("Feature type is required");

    logStep("Consuming purchase for feature", { featureType });

    // Find the oldest paid but unused purchase for this feature
    const { data: purchase, error: fetchError } = await supabaseClient
      .from("user_ai_purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("feature_type", featureType)
      .eq("status", "paid")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      logStep("Error fetching purchase", { error: fetchError });
      throw new Error("Failed to fetch purchase");
    }

    if (!purchase) {
      logStep("No available purchase found");
      return new Response(JSON.stringify({ 
        consumed: false, 
        reason: "No available purchase" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Mark as used
    const { error: updateError } = await supabaseClient
      .from("user_ai_purchases")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);

    if (updateError) {
      logStep("Error updating purchase", { error: updateError });
      throw new Error("Failed to consume purchase");
    }

    logStep("Purchase consumed successfully", { purchaseId: purchase.id });

    return new Response(JSON.stringify({ 
      consumed: true,
      purchaseId: purchase.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
