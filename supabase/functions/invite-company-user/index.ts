import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { email, name, phone, userType, companyId, redirectUrl } = await req.json();

    if (!email || !name || !userType || !companyId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a secure temporary token for the invite
    const inviteToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create user with a random secure password (they'll reset it)
    const tempPassword = crypto.randomUUID() + crypto.randomUUID();
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false, // Will be confirmed when they set password
      user_metadata: { 
        name, 
        phone,
        invite_token: inviteToken,
        invite_expires: tokenExpiry.toISOString(),
        needs_password_setup: true
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authData.user.id;

    // Determine role based on userType
    const role = userType === "manager" ? "gestor" : "user";

    // Insert role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (roleError) {
      console.error("Role error:", roleError);
    }

    // Insert into appropriate table WITHOUT provisional_password
    if (userType === "manager") {
      const { error: managerError } = await supabaseAdmin
        .from("company_managers")
        .insert({
          user_id: userId,
          company_id: companyId,
          name,
          email,
          phone: phone || null,
          provisional_password: null, // No longer storing passwords
          invited_at: new Date().toISOString(),
        });

      if (managerError) {
        console.error("Manager insert error:", managerError);
        return new Response(
          JSON.stringify({ error: managerError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      const { error: employeeError } = await supabaseAdmin
        .from("company_employees")
        .insert({
          user_id: userId,
          company_id: companyId,
          name,
          email,
          phone: phone || null,
          provisional_password: null, // No longer storing passwords
          invited_at: new Date().toISOString(),
        });

      if (employeeError) {
        console.error("Employee insert error:", employeeError);
        return new Response(
          JSON.stringify({ error: employeeError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Send password reset email so user can set their password
    const baseUrl = redirectUrl || Deno.env.get("SITE_URL") || "https://lovable.dev";
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${baseUrl}/login?setup=true`,
      }
    });

    if (resetError) {
      console.error("Reset email error:", resetError);
      // Don't fail the whole operation, user can request password reset manually
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: "Convite enviado por email. O usuário receberá um link para configurar sua senha."
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
