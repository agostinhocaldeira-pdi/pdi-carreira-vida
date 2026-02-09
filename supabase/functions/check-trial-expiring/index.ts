import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRIAL_DAYS_NEW_USERS = 30;
const TRIAL_DAYS_LEGACY_USERS = 365;
const LEGACY_CUTOFF_DATE = new Date("2026-01-27T00:00:00Z");
const DAYS_BEFORE_EXPIRY = 3;

const generateTrialExpiringHtml = (name: string, daysLeft: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; margin: 0; padding: 20px; color: #e5e5e5; }
    .container { max-width: 650px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #333; }
    .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d4a853; }
    .header h1 { margin: 0; font-size: 22px; color: #d4a853; }
    .header p { margin: 10px 0 0 0; color: #888; font-size: 14px; }
    .content { padding: 30px; }
    .content p { color: #e5e5e5; line-height: 1.8; margin-bottom: 16px; font-size: 15px; }
    .countdown { text-align: center; margin: 25px 0; }
    .countdown .number { font-size: 48px; font-weight: bold; color: #d4a853; display: block; }
    .countdown .label { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
    .highlight { background: #1a1a1a; border-left: 4px solid #d4a853; padding: 18px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .highlight p { margin: 0; color: #d4a853; font-style: italic; }
    .feature-item { background: #111; border-radius: 8px; padding: 12px 16px; margin: 8px 0; border-left: 3px solid #d4a853; }
    .feature-item span { color: #e5e5e5; font-size: 14px; }
    .feature-item .emoji { margin-right: 10px; }
    .cta-section { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8943f 100%); color: #000 !important; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3); }
    .footer { padding: 20px 30px; text-align: center; border-top: 1px solid #333; }
    .footer p { color: #666; font-size: 12px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏳ Seu acesso gratuito está acabando</h1>
      <p>PDI Carreira & Vida</p>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      
      <div class="countdown">
        <span class="number">${daysLeft}</span>
        <span class="label">dias restantes do seu teste gratuito</span>
      </div>

      <p>Nos últimos dias você teve acesso a todo o sistema. Mas em breve, algumas funcionalidades serão bloqueadas.</p>

      <div class="highlight">
        <p>"Quem não decide sobre o próprio desenvolvimento, delega essa decisão ao acaso."</p>
      </div>

      <p style="font-weight: bold; color: #d4a853; font-size: 16px; margin-top: 25px;">Com o Plano Black você mantém acesso a 100% do sistema:</p>

      <div class="feature-item">
        <span class="emoji">🏆</span>
        <span><strong>Desafio</strong> de Gestão de Tempo, Foco e Produtividade</span>
      </div>
      <div class="feature-item">
        <span class="emoji">📊</span>
        <span>Relatórios e acompanhamento de <strong>Progresso</strong></span>
      </div>
      <div class="feature-item">
        <span class="emoji">📲</span>
        <span>Lembrete diário no <strong>WhatsApp</strong> com suas tarefas do dia</span>
      </div>
      <div class="feature-item">
        <span class="emoji">🤖</span>
        <span>Análise Estratégica personalizada (<strong>Mentor IA</strong>)</span>
      </div>
      <div class="feature-item">
        <span class="emoji">🔗</span>
        <span><strong>Integrações</strong> e módulos avançados da Construção Guiada</span>
      </div>

      <p style="text-align: center; margin-top: 25px; color: #888;">Tudo isso por apenas <strong style="color: #d4a853; font-size: 18px;">R$ 67/ano</strong></p>
    </div>
    <div class="cta-section">
      <a href="https://pdicarreiraevida.lovable.app/perfil" class="cta-button">Assinar o Plano Black</a>
      <p style="color: #666; font-size: 12px; margin-top: 15px;">Acesso imediato após a assinatura</p>
    </div>
    <div class="footer">
      <p>PDI Carreira & Vida — www.pdicarreiraevida.com.br</p>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    console.log("[CHECK-TRIAL-EXPIRING] Starting...");

    // Get all users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const allUsers = authData?.users || [];
    console.log(`[CHECK-TRIAL-EXPIRING] Found ${allUsers.length} total users`);

    // Get users who already received this email
    const { data: sentEmails } = await supabase
      .from("email_logs")
      .select("user_id")
      .eq("email_type", "trial_expiring");

    const alreadySent = new Set((sentEmails || []).map((e: any) => e.user_id));

    // Get users with active Stripe subscriptions (skip them)
    // We check user_roles for admin/empresa/gestor (they're exempt)
    const { data: exemptRoles } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "empresa", "gestor"]);

    const exemptUserIds = new Set((exemptRoles || []).map((r: any) => r.user_id));

    // Get exempt company employees
    const { data: exemptEmployees } = await supabase
      .from("company_employees")
      .select("user_id")
      .eq("is_subscription_exempt", true)
      .eq("is_active", true);

    (exemptEmployees || []).forEach((e: any) => {
      if (e.user_id) exemptUserIds.add(e.user_id);
    });

    const now = new Date();
    let emailsSent = 0;

    for (const user of allUsers) {
      if (!user.email || !user.created_at) continue;
      if (alreadySent.has(user.id)) continue;
      if (exemptUserIds.has(user.id)) continue;

      const createdAt = new Date(user.created_at);
      const trialDays = createdAt < LEGACY_CUTOFF_DATE ? TRIAL_DAYS_LEGACY_USERS : TRIAL_DAYS_NEW_USERS;
      
      const diffTime = now.getTime() - createdAt.getTime();
      const daysSinceSignup = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysRemaining = trialDays - daysSinceSignup;

      // Send email when exactly DAYS_BEFORE_EXPIRY days remain (with 1 day tolerance)
      if (daysRemaining <= DAYS_BEFORE_EXPIRY && daysRemaining >= 1) {
        // Get profile name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        const userName = profile?.full_name?.split(" ")[0] || "Usuário";

        try {
          await resend.emails.send({
            from: "PDI Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
            to: [user.email],
            subject: `⏳ Faltam ${daysRemaining} dias para seu teste gratuito expirar`,
            html: generateTrialExpiringHtml(userName, daysRemaining),
          });

          // Log to prevent duplicates
          await supabase.from("email_logs").insert({
            user_id: user.id,
            email_type: "trial_expiring",
            email_to: user.email,
            sent_at: new Date().toISOString(),
          });

          emailsSent++;
          console.log(`[CHECK-TRIAL-EXPIRING] Email sent to ${user.email} (${daysRemaining} days left)`);
        } catch (emailError) {
          console.error(`[CHECK-TRIAL-EXPIRING] Failed to send to ${user.email}:`, emailError);
        }
      }
    }

    console.log(`[CHECK-TRIAL-EXPIRING] Done. Sent ${emailsSent} emails.`);

    return new Response(JSON.stringify({ success: true, emailsSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[CHECK-TRIAL-EXPIRING] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
