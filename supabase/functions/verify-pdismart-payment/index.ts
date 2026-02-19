import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PDISMART_PRODUCT_ID = "prod_U0YETu8CH7a9br";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PDISMART] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ verified: false, reason: "no_customer" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check for completed checkout sessions with PDISMART product
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "complete",
      limit: 10,
    });

    let hasPdismartPayment = false;
    for (const session of sessions.data) {
      if (session.payment_status === "paid") {
        // Check line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
          const productId = typeof item.price?.product === "string" 
            ? item.price.product 
            : (item.price?.product as any)?.id;
          if (productId === PDISMART_PRODUCT_ID) {
            hasPdismartPayment = true;
            break;
          }
        }
      }
      if (hasPdismartPayment) break;
    }

    // Also check payment intents directly (in case checkout sessions were cleaned up)
    if (!hasPdismartPayment) {
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 20,
      });
      for (const pi of paymentIntents.data) {
        if (pi.status === "succeeded" && pi.amount === 4700 && pi.currency === "brl") {
          hasPdismartPayment = true;
          break;
        }
      }
    }

    logStep("Payment verification result", { hasPdismartPayment });

    if (hasPdismartPayment) {
      // Assign pdismart role if not already assigned
      const { data: existingRole } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "pdismart")
        .maybeSingle();

      if (!existingRole) {
        // Check if user already has a higher role (user, admin, etc.)
        const { data: currentRoles } = await supabaseClient
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        const hasHigherRole = currentRoles?.some(
          (r: any) => r.role === "admin" || r.role === "empresa" || r.role === "gestor"
        );

        if (!hasHigherRole) {
          // Update existing 'user' role to 'pdismart' if they only have 'user'
          const hasUserRole = currentRoles?.some((r: any) => r.role === "user");
          if (hasUserRole) {
            await supabaseClient
              .from("user_roles")
              .update({ role: "pdismart" })
              .eq("user_id", user.id)
              .eq("role", "user");
            logStep("Updated role from user to pdismart");
          } else {
            await supabaseClient
              .from("user_roles")
              .insert({ user_id: user.id, role: "pdismart" });
            logStep("Inserted pdismart role");
          }
        }
      }
    }

    return new Response(JSON.stringify({ verified: hasPdismartPayment }), {
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
