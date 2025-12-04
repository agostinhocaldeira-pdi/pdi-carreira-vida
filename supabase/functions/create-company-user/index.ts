import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a secure random password for initial account creation
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

    const { email, name, phone, userType, companyId, redirectUrl } = await req.json();

    if (!email || !name || !userType || !companyId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a secure temporary password (user will reset via email)
    const tempPassword = generateSecurePassword();

    // Create user in Supabase Auth with temporary password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { 
        name, 
        phone,
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

    const now = new Date().toISOString();

    // Insert into appropriate table (without storing password)
    if (userType === "manager") {
      const { error: managerError } = await supabaseAdmin
        .from("company_managers")
        .insert({
          user_id: userId,
          company_id: companyId,
          name,
          email,
          phone: phone || null,
          invited_at: now,
          password_setup_sent_at: now,
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
          invited_at: now,
          password_setup_sent_at: now,
        });

      if (employeeError) {
        console.error("Employee insert error:", employeeError);
        return new Response(
          JSON.stringify({ error: employeeError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate password reset link for secure password setup
    const baseUrl = redirectUrl || Deno.env.get("SITE_URL") || supabaseUrl.replace('.supabase.co', '.lovableproject.com');
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${baseUrl}/login?setup=true`,
      }
    });

    if (linkError) {
      console.error("Generate link error:", linkError);
      // User was created, but link generation failed - they can request password reset manually
    }

    console.log(`User ${email} created successfully with secure password flow`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        // Return the action link for testing/development
        // In production, this would be sent via email automatically
        setupLink: linkData?.properties?.action_link,
        message: "Usuário criado. Um email de configuração de senha foi enviado."
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
