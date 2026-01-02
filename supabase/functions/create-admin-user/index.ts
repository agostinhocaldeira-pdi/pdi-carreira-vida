import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { email, password, name, createAdmin } = await req.json();

    if (!email || !password || !name) {
      throw new Error("Email, password and name are required");
    }

    // Create the user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        email,
        email_verified: true,
      },
    });

    if (createError) {
      throw new Error(`Error creating user: ${createError.message}`);
    }

    console.log("User created:", userData.user?.id);

    // If createAdmin flag is set, add admin role
    if (createAdmin && userData.user) {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({
          user_id: userData.user.id,
          role: "admin",
        });

      if (roleError) {
        console.log("Error adding admin role:", roleError);
      } else {
        console.log("Admin role added");
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: userData.user?.id,
        email: userData.user?.email,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
