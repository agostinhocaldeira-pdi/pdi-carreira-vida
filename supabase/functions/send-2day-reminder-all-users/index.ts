import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting bulk 2-day reminder email send to all users...");

    // Get all users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    console.log(`Found ${authUsers.users.length} total users`);

    let emailsSent = 0;
    let usersSkipped = 0;
    const errors: string[] = [];

    const baseUrl = "https://pdicarreiraevida.lovable.app";

    for (const user of authUsers.users) {
      const userId = user.id;
      const userEmail = user.email;
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || "usuário";

      if (!userEmail) {
        console.log(`User ${userId} has no email, skipping`);
        usersSkipped++;
        continue;
      }

      console.log(`Processing user: ${userEmail}`);

      // Check if we already sent this bulk email (use a different type to differentiate)
      const { data: existingEmail } = await supabase
        .from("email_logs")
        .select("id")
        .eq("user_id", userId)
        .eq("email_type", "2day_reminder_bulk_jan27")
        .maybeSingle();

      if (existingEmail) {
        console.log(`Already sent bulk reminder to ${userEmail}, skipping`);
        usersSkipped++;
        continue;
      }

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ative o Modo Operacional</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #222222; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #333;">
              <img src="${baseUrl}/logo_pdi.png" alt="PDI" width="60" style="display: block; margin: 0 auto 16px auto;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">PDI – Carreira & Vida</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Olá, <strong style="color: #d4a853;">${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Se você acessou o PDI recentemente, talvez tenha notado algo diferente:<br>
                <strong style="color: #ffffff;">a Agenda Estratégica e algumas ferramentas ainda não estão ativas.</strong>
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Isso não é um erro.<br>
                <strong style="color: #d4a853;">É uma decisão de arquitetura do sistema.</strong>
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                A maioria dos aplicativos permite que você comece direto pela execução: criar tarefas, preencher a agenda, correr o dia inteiro.
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                O problema é que <strong style="color: #ffffff;">execução sem direção só acelera o caminho errado.</strong>
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Por isso, o PDI funciona de forma inversa.
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Antes de liberar o <strong style="color: #d4a853;">Modo Operacional</strong>, o sistema precisa calibrar sua <strong style="color: #ffffff;">Base Pessoal</strong> — o conjunto de informações que garante que tudo o que você fizer daqui pra frente esteja alinhado com quem você é e com o que realmente importa.
              </p>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Esse passo inicial leva cerca de <strong style="color: #ffffff;">30 minutos</strong> e define:
              </p>
              
              <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #e0e0e0; font-size: 16px; line-height: 1.8;">
                <li>sua <strong style="color: #d4a853;">identidade</strong> (quem está no comando das decisões)</li>
                <li>seus <strong style="color: #d4a853;">valores</strong> (o que é inegociável)</li>
                <li>o <strong style="color: #d4a853;">equilíbrio atual</strong> da sua vida</li>
              </ul>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Assim que essa base estiver concluída, o sistema libera automaticamente:
              </p>
              
              <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #e0e0e0; font-size: 16px; line-height: 1.8; list-style: none;">
                <li>✓ Agenda Estratégica</li>
                <li>✓ Ferramentas de Execução</li>
                <li>✓ Análises do Mentor IA</li>
                <li>✓ Relatórios de Progresso</li>
              </ul>
              
              <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #ffffff; font-weight: 600;">
                Nada de atalhos.<br>
                Nada de produtividade vazia.
              </p>
              
              <p style="margin: 24px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                👉 Quando estiver pronto, inicie a Base Pessoal aqui:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0 24px 0;">
                    <a href="${baseUrl}/news" style="display: inline-block; padding: 16px 32px; background-color: #d4a853; color: #1a1a1a; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                      Iniciar Base Pessoal
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                Nos vemos no Modo Operacional.
              </p>
              
              <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #d4a853; font-weight: 600;">
                PDI – Carreira & Vida
              </p>
              
              <!-- PS -->
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #999;">
                  <strong style="color: #e0e0e0;">P.S.:</strong> O Mentor IA já está configurado. Ele só precisa da sua base definida para começar a analisar sua rotina e apontar ajustes reais.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #1a1a1a; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                © ${new Date().getFullYear()} PDI – Carreira & Vida. Todos os direitos reservados.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">
                <a href="${baseUrl}" style="color: #d4a853; text-decoration: none;">www.pdicarreiraevida.com.br</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      try {
        const { error: emailError } = await resend.emails.send({
          from: "PDI Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
          to: [userEmail],
          subject: "Sua Agenda Estratégica está esperando por você",
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Error sending email to ${userEmail}:`, emailError);
          errors.push(`${userEmail}: ${emailError.message}`);
          continue;
        }

        // Log the email sent
        await supabase.from("email_logs").insert({
          user_id: userId,
          email_type: "2day_reminder_bulk_jan27",
          email_to: userEmail,
          metadata: { sent_at: new Date().toISOString() },
        });

        emailsSent++;
        console.log(`Successfully sent bulk reminder to ${userEmail}`);
        
        // Larger delay to avoid rate limiting (Resend allows 2 req/sec)
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (emailErr: any) {
        console.error(`Failed to send email to ${userEmail}:`, emailErr);
        errors.push(`${userEmail}: ${emailErr.message}`);
      }
    }

    console.log(`Completed: ${emailsSent} emails sent, ${usersSkipped} users skipped, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        usersSkipped,
        totalProcessed: authUsers.users.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-2day-reminder-all-users:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
