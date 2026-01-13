import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-AI-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      logStep("Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "No stripe-signature header found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    logStep("Verifying webhook signature");

    let event: Stripe.Event;
    try {
      // NOTE: In Deno/Edge runtime, Stripe webhook verification must be async
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logStep("Webhook signature verification failed", { error: errorMessage });
      return new Response(JSON.stringify({ error: `Webhook Error: ${errorMessage}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Event received", { type: event.type, id: event.id });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing checkout.session.completed", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });

      // Only process AI purchase payments
      if (session.metadata?.type === "ai_usage") {
        const userId = session.metadata.user_id;
        const featureType = session.metadata.feature_type;
        
        if (!userId || !featureType) {
          logStep("Missing metadata", { userId, featureType });
          return new Response(JSON.stringify({ error: "Missing user_id or feature_type in metadata" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        logStep("AI purchase details", { userId, featureType, sessionId: session.id });

        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Update existing purchase record or create new one
        const { data: existingPurchase, error: fetchError } = await supabaseClient
          .from("user_ai_purchases")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (fetchError) {
          logStep("Error fetching purchase record", { error: fetchError });
        }

        if (existingPurchase) {
          // Update existing record
          const { error: updateError } = await supabaseClient
            .from("user_ai_purchases")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent as string,
              amount_paid: session.amount_total || 1000,
            })
            .eq("id", existingPurchase.id);

          if (updateError) {
            logStep("Error updating purchase record", { error: updateError });
            throw updateError;
          }
          logStep("Purchase record updated", { id: existingPurchase.id });
        } else {
          // Create new record (fallback if pending record wasn't created)
          const { error: insertError } = await supabaseClient
            .from("user_ai_purchases")
            .insert({
              user_id: userId,
              feature_type: featureType,
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              status: "paid",
              paid_at: new Date().toISOString(),
              amount_paid: session.amount_total || 1000,
            });

          if (insertError) {
            logStep("Error inserting purchase record", { error: insertError });
            throw insertError;
          }
          logStep("New purchase record created");
        }

        logStep("AI purchase confirmed successfully", { userId, featureType });
      } else {
        logStep("Not an AI usage purchase, skipping", { metadata: session.metadata });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
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
