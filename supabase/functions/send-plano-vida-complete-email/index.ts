import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlanoVidaCompleteEmailRequest {
  userId: string;
  userName: string;
  userEmail: string;
  vvd: string | null;
  valores: string[];
  areasVida: Array<{
    area: string;
    notaAtual: number;
    notaDesejada: number;
  }>;
  objetivos: Array<{
    texto: string;
    conexaoVvd: string | null;
    dataAlvo: string | null;
  }>;
  metas: Array<{
    texto: string;
    dataAlvo: string | null;
  }>;
  acoes: Array<{
    texto: string;
    periodicidade: string | null;
  }>;
  insight: string;
}

const generatePlanoVidaCompleteHtml = (data: PlanoVidaCompleteEmailRequest): string => {
  const valoresHtml = data.valores.length > 0 
    ? data.valores.map((v, i) => `<li style="margin-bottom: 8px; color: #555;">${i + 1}. <strong>${v}</strong></li>`).join('')
    : '<li style="color: #888;">Nenhum valor identificado ainda</li>';

  const areasHtml = data.areasVida.length > 0
    ? data.areasVida.map(area => `
        <div style="background-color: #f9f9f9; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
          <strong style="color: #333;">${area.area}</strong>
          <div style="display: flex; gap: 20px; margin-top: 5px;">
            <span style="font-size: 13px; color: #666;">Nota Atual: <strong style="color: #9b87f5;">${area.notaAtual}/10</strong></span>
            <span style="font-size: 13px; color: #666;">Nota Desejada: <strong style="color: #22c55e;">${area.notaDesejada}/10</strong></span>
          </div>
        </div>
      `).join('')
    : '<p style="color: #888;">Nenhuma área avaliada ainda</p>';

  const objetivosHtml = data.objetivos.length > 0
    ? data.objetivos.map(obj => `
        <div style="background-color: #fff8f0; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #e67e22;">
          <strong style="color: #333;">${obj.texto}</strong>
          ${obj.conexaoVvd ? `<p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">Conexão VVD: ${obj.conexaoVvd}</p>` : ''}
          ${obj.dataAlvo ? `<p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">Data alvo: ${new Date(obj.dataAlvo).toLocaleDateString('pt-BR')}</p>` : ''}
        </div>
      `).join('')
    : '<p style="color: #888;">Nenhum objetivo definido ainda</p>';

  const metasHtml = data.metas.length > 0
    ? data.metas.map(meta => `
        <div style="background-color: #f0f9ff; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #3b82f6;">
          <strong style="color: #333;">${meta.texto}</strong>
          ${meta.dataAlvo ? `<p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">Data alvo: ${new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}</p>` : ''}
        </div>
      `).join('')
    : '<p style="color: #888;">Nenhuma meta definida ainda</p>';

  const acoesHtml = data.acoes.length > 0
    ? data.acoes.map(acao => `
        <div style="background-color: #f0fdf4; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #22c55e;">
          <strong style="color: #333;">${acao.texto}</strong>
          ${acao.periodicidade ? `<p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">Periodicidade: ${acao.periodicidade}</p>` : ''}
        </div>
      `).join('')
    : '<p style="color: #888;">Nenhuma ação definida ainda</p>';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parabéns! Seu Plano de Vida está completo!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
        🎉 Parabéns, ${data.userName}!
      </h1>
      <p style="color: #ffffff; opacity: 0.95; margin: 15px 0 0 0; font-size: 16px;">
        Você completou seu Plano de Vida!
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
        <p style="font-size: 16px; color: #166534; margin: 0; font-weight: 600;">
          🏆 Você está entre os poucos que realmente tomam uma atitude para transformar seus sonhos em realidade!
        </p>
      </div>
      
      <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 30px;">
        Ao completar os 3 passos do seu Plano de Vida e gerar seu primeiro insight personalizado, você demonstrou um compromisso real com seu desenvolvimento pessoal e profissional. Isso é algo para se orgulhar!
      </p>
      
      <!-- VVD Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #9b87f5; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #9b87f5; padding-bottom: 8px;">
          🎯 Sua Visão de Vida Desejada (VVD)
        </h2>
        <div style="background-color: #faf5ff; padding: 15px; border-radius: 8px;">
          <p style="font-size: 14px; color: #555; margin: 0; font-style: italic; line-height: 1.6;">
            "${data.vvd || 'Não definida ainda'}"
          </p>
        </div>
      </div>
      
      <!-- Valores Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #9b87f5; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #9b87f5; padding-bottom: 8px;">
          💎 Seus Valores
        </h2>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          ${valoresHtml}
        </ul>
      </div>
      
      <!-- Áreas da Vida Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #9b87f5; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #9b87f5; padding-bottom: 8px;">
          🎡 Áreas da Vida (Roda da Vida)
        </h2>
        ${areasHtml}
      </div>
      
      <!-- Objetivos Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #e67e22; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e67e22; padding-bottom: 8px;">
          🚀 Seus Objetivos
        </h2>
        ${objetivosHtml}
      </div>
      
      <!-- Metas Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #3b82f6; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
          📊 Suas Metas
        </h2>
        ${metasHtml}
      </div>
      
      <!-- Ações Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #22c55e; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #22c55e; padding-bottom: 8px;">
          ✅ Suas Ações
        </h2>
        ${acoesHtml}
      </div>
      
      <!-- Insight Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #8b5cf6; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">
          💡 Seu Insight Personalizado
        </h2>
        <div style="background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff;">
          <p style="font-size: 14px; color: #555; margin: 0; line-height: 1.8; white-space: pre-wrap;">
${data.insight}
          </p>
        </div>
      </div>
      
      <!-- Next Steps -->
      <div style="background-color: #fff8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
        <h2 style="color: #e67e22; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
          🎯 Próximos Passos
        </h2>
        <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 2;">
          <li>Acesse seu <strong>Diário</strong> diariamente para registrar reflexões e conquistas</li>
          <li>Acompanhe seu <strong>Progresso</strong> e celebre cada vitória</li>
          <li>Utilize as <strong>Ferramentas</strong> complementares para aprofundar seu autoconhecimento</li>
          <li>Revise seu Plano de Vida regularmente para ajustes necessários</li>
        </ul>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="https://pdi.lovable.app/home" style="display: inline-block; background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); color: #ffffff; padding: 15px 40px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(155, 135, 245, 0.4);">
          Continuar Minha Jornada
        </a>
      </div>
      
      <!-- Closing -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 16px; color: #333; font-weight: 600; margin-bottom: 10px;">
          Estamos muito orgulhosos de você!
        </p>
        <p style="font-size: 14px; color: #888; margin: 0;">
          Continue firme nessa jornada de transformação.<br>
          <strong style="color: #9b87f5;">Equipe PDI - Carreira e Vida</strong>
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f5f5f5; padding: 20px 30px; text-align: center;">
      <p style="font-size: 12px; color: #999; margin: 0;">
        © 2024 PDI - Carreira e Vida. Todos os direitos reservados.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const data: PlanoVidaCompleteEmailRequest = await req.json();

    console.log(`[PLANO-VIDA-COMPLETE-EMAIL] Sending email to ${data.userEmail} for user ${data.userName}`);

    // Check if email was already sent by looking at user_insights
    const { data: existingInsights, error: checkError } = await supabaseClient
      .from('user_insights')
      .select('plano_vida_email_sent')
      .eq('user_id', data.userId)
      .eq('plano_vida_email_sent', true)
      .limit(1);

    if (checkError) {
      console.error("[PLANO-VIDA-COMPLETE-EMAIL] Error checking if email was sent:", checkError);
    }

    if (existingInsights && existingInsights.length > 0) {
      console.log("[PLANO-VIDA-COMPLETE-EMAIL] Email was already sent to this user, skipping");
      return new Response(
        JSON.stringify({ success: true, message: "Email already sent previously" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "PDI - Carreira e Vida <contato@pdicarreiraevida.com.br>",
      to: [data.userEmail],
      subject: "🎉 Parabéns! Você completou seu Plano de Vida!",
      html: generatePlanoVidaCompleteHtml(data),
    });

    console.log("[PLANO-VIDA-COMPLETE-EMAIL] Email sent successfully:", emailResponse);

    // Mark that the email was sent
    const { error: updateError } = await supabaseClient
      .from('user_insights')
      .update({ plano_vida_email_sent: true })
      .eq('user_id', data.userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) {
      console.error("[PLANO-VIDA-COMPLETE-EMAIL] Error updating plano_vida_email_sent:", updateError);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[PLANO-VIDA-COMPLETE-EMAIL] Error:", error);
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
