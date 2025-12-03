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

    const { email, password, name, phone, userType, companyId } = await req.json();

    if (!email || !password || !name || !userType || !companyId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone },
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

    // Insert into appropriate table
    if (userType === "manager") {
      const { error: managerError } = await supabaseAdmin
        .from("company_managers")
        .insert({
          user_id: userId,
          company_id: companyId,
          name,
          email,
          phone: phone || null,
          provisional_password: password,
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
          provisional_password: password,
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

    return new Response(
      JSON.stringify({ success: true, userId }),
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
