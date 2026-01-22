import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { decode as base64Decode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECKOUT-DIRETO] ${step}${detailsStr}`);
};

// HMAC-SHA256 using Web Crypto API
async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Get token from query string or body
    const url = new URL(req.url);
    let token = url.searchParams.get("token");

    if (!token) {
      try {
        const body = await req.json();
        token = body?.token;
      } catch {
        // ignore
      }
    }

    if (!token) {
      throw new Error("Token não fornecido");
    }

    logStep("Token received", { tokenLength: token.length });

    // Decode and verify token
    let decoded: string;
    try {
      const decodedBytes = base64Decode(token);
      decoded = new TextDecoder().decode(decodedBytes);
    } catch {
      throw new Error("Token inválido");
    }

    const parts = decoded.split("|");
    if (parts.length !== 3) {
      throw new Error("Token mal formatado");
    }

    const [email, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    // Verify signature
    const payload = `${email}|${expiresAtStr}`;
    const expectedSignature = await hmacSha256(stripeKey, payload);

    if (signature !== expectedSignature) {
      logStep("Invalid signature", { email });
      throw new Error("Assinatura inválida");
    }

    // Check expiration
    if (Date.now() > expiresAt) {
      logStep("Token expired", { email, expiresAt: new Date(expiresAt).toISOString() });
      throw new Error("Link expirado. Solicite um novo e-mail.");
    }

    logStep("Token verified", { email, expiresAt: new Date(expiresAt).toISOString() });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Price ID for Plano Anual (R$67/ano)
    const priceId = "price_1Sjo293aJLvyiewRDW1gCi39";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
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
      success_url: `https://pdicarreiraevida.lovable.app/onboarding?checkout=success`,
      cancel_url: `https://pdicarreiraevida.lovable.app/?checkout=canceled`,
      metadata: {
        source: "email_7day_followup",
        email,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Return redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": session.url!,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    // Redirect to landing page with error message
    const errorUrl = `https://pdicarreiraevida.lovable.app/?checkout_error=${encodeURIComponent(errorMessage)}`;
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": errorUrl,
      },
    });
  }
});
