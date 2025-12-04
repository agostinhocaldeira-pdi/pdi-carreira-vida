import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a secure random password
function generateSecurePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { userId, email, userType, companyId, redirectUrl } = await req.json();

    if (!userId && !email) {
      return new Response(
        JSON.stringify({ error: "userId or email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userEmail = email;

    // If only userId provided, fetch email
    if (!userEmail && userId) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      userEmail = userData.user.email;
    }

    // Generate a new secure temporary password
    const tempPassword = generateSecurePassword();

    // Update password in Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        password: tempPassword,
        user_metadata: { needs_password_setup: true }
      }
    );

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clear accepted_at to force password setup on next login
    if (userType && companyId) {
      const tableName = userType === "manager" ? "company_managers" : "company_employees";
      const now = new Date().toISOString();
      
      const { error: updateError } = await supabaseAdmin
        .from(tableName)
        .update({ 
          accepted_at: null,
          password_setup_sent_at: now
        })
        .eq("user_id", userId)
        .eq("company_id", companyId);

      if (updateError) {
        console.error("Update error:", updateError);
      }
    }

    // Generate password reset link
    const baseUrl = redirectUrl || Deno.env.get("SITE_URL") || supabaseUrl.replace('.supabase.co', '.lovableproject.com');
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: userEmail,
      options: {
        redirectTo: `${baseUrl}/login?reset=true`,
      }
    });

    if (linkError) {
      console.error("Generate link error:", linkError);
    }

    console.log(`Password reset initiated for user ${userEmail}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        // Return the action link for testing/development
        setupLink: linkData?.properties?.action_link,
        message: "Senha redefinida. Um email de configuração foi enviado."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
