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

    // Support both authenticated (app) and unauthenticated (email deep link) flows.
    const authHeader = req.headers.get("Authorization");
    const hasBearer = !!authHeader?.startsWith("Bearer ");

    let email: string | null = null;
    let userId: string | null = null;

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
      // Public flow: accept email in request body
      let body: any = {};
      try {
        body = await req.json();
      } catch {
        body = {};
      }
      email = typeof body?.email === "string" ? body.email.trim() : null;
      if (!email) throw new Error("No authorization header provided and no email in body");
      logStep("Public checkout requested", { email });
    }

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: email!, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Price ID for Plano Anual (R$67/ano)
    const priceId = "price_1Sjo293aJLvyiewRDW1gCi39";

    const origin = req.headers.get("origin") || "https://pdicarreiraevida.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
      success_url: `${origin}/onboarding?checkout=success`,
      cancel_url: `${origin}/?checkout=canceled`,
      metadata: userId ? { user_id: userId } : { source: "email_direct" },
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
