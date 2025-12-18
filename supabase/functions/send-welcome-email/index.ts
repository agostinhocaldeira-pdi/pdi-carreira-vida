import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

const generateWelcomeHtml = (name: string): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao PDI - Carreira e Vida</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
        🎯 Bem-vindo ao PDI - Carreira e Vida!
      </h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
        Olá, <strong>${name}</strong>!
      </p>
      
      <div style="background-color: #f0f9ff; border-left: 4px solid #9b87f5; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
        <p style="font-size: 16px; color: #333; margin: 0; font-weight: 600;">
          Parabéns pela decisão de investir no seu desenvolvimento pessoal e profissional!
        </p>
      </div>
      
      <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 20px;">
        Ao escolher o PDI - Carreira e Vida, você deu um passo importante rumo a uma vida mais equilibrada, com propósito e direção clara.
      </p>
      
      <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 30px;">
        Saiba que você não está sozinho nessa jornada. <strong>Conte com todo nosso apoio e mentoria</strong> para alcançar seus objetivos. Estamos aqui para ajudá-lo em cada etapa do caminho.
      </p>
      
      <!-- Steps Section -->
      <div style="background-color: #fafafa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
        <h2 style="color: #9b87f5; font-size: 18px; margin-top: 0; margin-bottom: 20px;">
          📋 Por onde começar?
        </h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
          Para tirar o melhor proveito do sistema, siga esta ordem:
        </p>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</span>
            <div>
              <strong style="color: #333;">Construção Guiada</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Comece pelo módulo "Quem sou eu" para descobrir seus valores, definir sua Visão de Vida Desejada (VVD) e entender sua situação atual através da Roda da Vida.</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</span>
            <div>
              <strong style="color: #333;">Plano de Vida</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Após se conhecer melhor, defina seus objetivos de longo prazo conectados à sua VVD.</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</span>
            <div>
              <strong style="color: #333;">Mão na Massa</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Transforme seus objetivos em metas SMART, ações concretas e passos diários.</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">4</span>
            <div>
              <strong style="color: #333;">Diário</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Registre diariamente sua evolução, humor e conquistas para manter o foco e a motivação.</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">5</span>
            <div>
              <strong style="color: #333;">Ferramentas</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Utilize as ferramentas complementares (SWOT, Matriz de Eisenhower, Crenças) para aprofundar seu autoconhecimento.</p>
            </div>
          </div>
        </div>
        
        <div>
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #9b87f5; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">6</span>
            <div>
              <strong style="color: #333;">Progresso</strong>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Acompanhe sua evolução e celebre cada conquista!</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resources Section -->
      <div style="background-color: #fff8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
        <h2 style="color: #e67e22; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
          🔧 Recursos disponíveis
        </h2>
        <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 2;">
          <li><strong>Perfil</strong> - Gerencie suas informações pessoais e preferências</li>
          <li><strong>Recursos</strong> - Acesse materiais complementares e integrações</li>
          <li><strong>Suporte</strong> - Entre em contato conosco através do formulário de suporte sempre que precisar de ajuda</li>
        </ul>
      </div>
      
      <!-- Instagram CTA -->
      <div style="background: linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
        <h2 style="color: #ffffff; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
          📸 Compartilhe sua jornada!
        </h2>
        <p style="color: #ffffff; font-size: 14px; margin-bottom: 20px; opacity: 0.95;">
          Que tal registrar esse momento especial? Use o PDI e compartilhe no Instagram marcando nosso perfil. Adoramos acompanhar a evolução dos nossos amigos!
        </p>
        <a href="https://www.instagram.com/pdi_carreiraevida" style="display: inline-block; background-color: #ffffff; color: #E1306C; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px;">
          @pdi_carreiraevida
        </a>
      </div>
      
      <!-- Closing -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 16px; color: #333; font-weight: 600; margin-bottom: 10px;">
          Estamos juntos nessa jornada de transformação.
        </p>
        <p style="font-size: 14px; color: #888; margin: 0;">
          Com carinho,<br>
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} for user ${name}`);

    const emailResponse = await resend.emails.send({
      from: "PDI - Carreira e Vida <contato@pdicarreiraevida.com.br>",
      to: [email],
      subject: "🎯 Bem-vindo ao PDI - Carreira e Vida!",
      html: generateWelcomeHtml(name),
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
