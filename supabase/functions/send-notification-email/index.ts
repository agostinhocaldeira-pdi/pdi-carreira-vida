import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: "diary_reminder" | "goal_deadline" | "weekly_summary" | "custom";
  userId?: string;
  email?: string;
  name?: string;
  subject?: string;
  content?: string;
  data?: Record<string, any>;
}

const generateDiaryReminderHtml = (name: string, daysInactive: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; }
    .highlight { background: #f8f4ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📔 PDI - Carreira & Vida</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Percebemos que você não preenche seu diário há <strong>${daysInactive} dias</strong>.</p>
      <div class="highlight">
        <p style="margin:0;"><strong>💡 Lembre-se:</strong> O registro diário é fundamental para seu autoconhecimento e acompanhamento do progresso. Mesmo nos dias mais corridos, dedicar 5 minutos para refletir faz toda a diferença!</p>
      </div>
      <p>Que tal registrar como foi seu dia hoje? Suas reflexões, conquistas e aprendizados são valiosos para sua jornada de desenvolvimento.</p>
      <center>
        <a href="https://pdicarreiraevida.com.br/home" class="cta-button">Acessar meu Diário</a>
      </center>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
      <p>Se não deseja mais receber lembretes, acesse suas configurações de notificação no aplicativo.</p>
    </div>
  </div>
</body>
</html>
`;

const generateGoalDeadlineHtml = (name: string, goals: any[]): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; }
    .goal-item { background: #fff5f5; border-left: 4px solid #f5576c; padding: 12px 15px; margin: 10px 0; border-radius: 0 8px 8px 0; }
    .goal-item strong { color: #f5576c; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Prazos Próximos!</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Você tem metas com prazo se aproximando:</p>
      ${goals.map(g => `
        <div class="goal-item">
          <strong>${g.texto}</strong><br>
          <small>Prazo: ${new Date(g.data_alvo).toLocaleDateString('pt-BR')}</small>
        </div>
      `).join('')}
      <p>Não deixe para a última hora! Revise seu progresso e ajuste suas ações se necessário.</p>
      <center>
        <a href="https://pdicarreiraevida.com.br/home" class="cta-button">Ver minhas Metas</a>
      </center>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
    </div>
  </div>
</body>
</html>
`;

const generateWeeklySummaryHtml = (name: string, data: any): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; }
    .stat-box { display: inline-block; background: #f0fff4; border: 1px solid #38ef7d; padding: 15px 20px; margin: 5px; border-radius: 8px; text-align: center; }
    .stat-number { font-size: 28px; font-weight: bold; color: #11998e; }
    .stat-label { font-size: 12px; color: #666; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Resumo Semanal</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Aqui está seu resumo da semana:</p>
      <center>
        <div class="stat-box">
          <div class="stat-number">${data.diaryEntries || 0}</div>
          <div class="stat-label">Dias registrados</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${data.actionsCompleted || 0}</div>
          <div class="stat-label">Ações concluídas</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${data.currentStreak || 0}</div>
          <div class="stat-label">Dias de streak</div>
        </div>
      </center>
      <p style="margin-top: 25px;">Continue assim! Cada pequeno passo conta para alcançar seus objetivos.</p>
      <center>
        <a href="https://pdicarreiraevida.com.br/home" class="cta-button">Ver meu Progresso</a>
      </center>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, email, name, subject, content, data }: NotificationEmailRequest = await req.json();

    console.log(`Processing ${type} notification for ${email || userId}`);

    let finalEmail = email;
    let finalName = name || "Usuário";
    let finalSubject = subject;
    let htmlContent = content;

    // If userId is provided, fetch user details from Supabase
    if (userId && !email) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
      if (error || !userData?.user?.email) {
        console.error("Error fetching user:", error);
        throw new Error("User not found");
      }
      finalEmail = userData.user.email;
      finalName = userData.user.user_metadata?.name || "Usuário";
    }

    if (!finalEmail) {
      throw new Error("Email is required");
    }

    // Generate email content based on type
    switch (type) {
      case "diary_reminder":
        finalSubject = finalSubject || "📔 Não esqueça do seu diário!";
        htmlContent = generateDiaryReminderHtml(finalName, data?.daysInactive || 3);
        break;
      case "goal_deadline":
        finalSubject = finalSubject || "⏰ Você tem metas com prazo próximo!";
        htmlContent = generateGoalDeadlineHtml(finalName, data?.goals || []);
        break;
      case "weekly_summary":
        finalSubject = finalSubject || "📊 Seu resumo semanal do PDI";
        htmlContent = generateWeeklySummaryHtml(finalName, data || {});
        break;
      case "custom":
        if (!htmlContent) {
          htmlContent = `<p>${content}</p>`;
        }
        break;
    }

    // Send email using Resend API directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PDI - Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
        to: [finalEmail],
        subject: finalSubject || "Notificação do PDI",
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
