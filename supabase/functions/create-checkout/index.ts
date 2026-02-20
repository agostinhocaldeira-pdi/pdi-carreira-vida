import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Support both authenticated (app) and unauthenticated (landing page) flows.
    const authHeader = req.headers.get("Authorization");
    const hasBearer = !!authHeader?.startsWith("Bearer ");

    let email: string | null = null;
    let userId: string | null = null;

    // Parse body once (stream can only be read once)
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    if (hasBearer) {
      logStep("Authorization header found");
      const token = authHeader!.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      const user = data.user;
      if (!user?.email) throw new Error("User not authenticated or email not available");
      email = user.email;
      userId = user.id;
      logStep("User authenticated", { userId: user.id, email: user.email });
    } else {
      // Public flow: accept email in request body (optional — Stripe can collect it)
      email = typeof body?.email === "string" ? body.email.trim() : null;
      logStep("Public checkout requested", { email: email || "(Stripe will collect)" });
    }

    // Check if customer already exists (only if we have an email)
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer", { customerId });
      }
    }

    // Support price_id override, default to Acesso Completo
    const defaultPriceId = "price_1Sjo293aJLvyiewRDW1gCi39";
    const priceId = typeof body?.price_id === "string" ? body.price_id : defaultPriceId;

    const origin = req.headers.get("origin") || "https://pdicarreiraevida.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : (email || undefined),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${origin}/signup?checkout=success`,
      cancel_url: `${origin}/?checkout=canceled`,
      metadata: userId ? { user_id: userId } : { source: "landing_checkout" },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
