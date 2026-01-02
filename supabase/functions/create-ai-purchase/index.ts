import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-AI-PURCHASE] ${step}${detailsStr}`);
};

// Price ID for IA - Uso Avulso (R$10.00)
const AI_USAGE_PRICE_ID = "price_1Sjocq3aJLvyiewR9a35YpM8";

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

    // Get feature type from request body
    const { featureType, returnPath } = await req.json();
    if (!featureType) throw new Error("Feature type is required");

    logStep("Feature type", { featureType, returnPath });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    const origin = req.headers.get("origin") || "https://pdi.app";

    const rawReturnPath = typeof returnPath === "string" ? returnPath.trim() : "";

    // Normalize returnPath to always start with "/" to avoid malformed domains like ".com.brinsight"
    let normalizedReturnPath = rawReturnPath;
    try {
      if (normalizedReturnPath.startsWith("http://") || normalizedReturnPath.startsWith("https://")) {
        const parsed = new URL(normalizedReturnPath);
        normalizedReturnPath = `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // ignore invalid URLs
    }

    if (!normalizedReturnPath) normalizedReturnPath = "/home";
    if (!normalizedReturnPath.startsWith("/")) normalizedReturnPath = `/${normalizedReturnPath}`;

    const qpSeparator = normalizedReturnPath.includes("?") ? "&" : "?";
    const successUrl = `${origin}${normalizedReturnPath}${qpSeparator}ai_purchase=success&feature=${featureType}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}${normalizedReturnPath}${qpSeparator}ai_purchase=cancelled`;

    logStep("Return path normalized", { rawReturnPath, normalizedReturnPath });

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: AI_USAGE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        type: "ai_usage",
        feature_type: featureType,
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Create pending purchase record
    const { error: insertError } = await supabaseClient
      .from("user_ai_purchases")
      .insert({
        user_id: user.id,
        feature_type: featureType,
        stripe_session_id: session.id,
        status: "pending",
      });

    if (insertError) {
      logStep("Error inserting purchase record", { error: insertError });
    }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
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
