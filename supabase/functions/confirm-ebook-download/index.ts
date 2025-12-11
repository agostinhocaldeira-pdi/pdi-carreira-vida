import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: ConfirmRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Confirming ebook download for token: ${token}`);

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find lead by confirmation token
    const { data: lead, error: selectError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("confirmation_token", token)
      .single();

    if (selectError || !lead) {
      console.error("Lead not found:", selectError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const alreadyDownloaded = lead.ebook_downloaded;

    // Update lead to mark email as confirmed and ebook as downloaded
    const { error: updateError } = await supabaseAdmin
      .from("leads")
      .update({
        email_confirmed: true,
        ebook_downloaded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Error updating lead:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update lead" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Lead ${lead.id} confirmed successfully. Already downloaded: ${alreadyDownloaded}`);

    return new Response(
      JSON.stringify({
        success: true,
        name: lead.name,
        alreadyDownloaded,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in confirm-ebook-download function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
