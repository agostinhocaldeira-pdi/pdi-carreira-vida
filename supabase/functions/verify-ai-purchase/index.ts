import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-AI-PURCHASE] ${step}${detailsStr}`);
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

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { sessionId, featureType } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    logStep("Verifying session", { sessionId, featureType });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check checkout session status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    logStep("Session retrieved", { 
      paymentStatus: session.payment_status,
      metadata: session.metadata 
    });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ 
        verified: false, 
        reason: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Verify metadata matches
    if (session.metadata?.user_id !== user.id) {
      return new Response(JSON.stringify({ 
        verified: false, 
        reason: "User mismatch" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update purchase record to paid
    const { data: purchaseData, error: updateError } = await supabaseClient
      .from("user_ai_purchases")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("stripe_session_id", sessionId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating purchase", { error: updateError });
      
      // If record doesn't exist, create it
      if (updateError.code === "PGRST116") {
        const { error: insertError } = await supabaseClient
          .from("user_ai_purchases")
          .insert({
            user_id: user.id,
            feature_type: session.metadata?.feature_type || featureType,
            stripe_session_id: sessionId,
            stripe_payment_intent_id: session.payment_intent as string,
            status: "paid",
            paid_at: new Date().toISOString(),
          });

        if (insertError) {
          logStep("Error inserting purchase", { error: insertError });
        }
      }
    }

    logStep("Purchase verified and updated", { purchaseData });

    return new Response(JSON.stringify({ 
      verified: true,
      featureType: session.metadata?.feature_type || featureType,
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
