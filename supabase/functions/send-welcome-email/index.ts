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
  const loginUrl = "https://pdicarreiraevida.lovable.app/login";
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu acesso ao PDI (Login Liberado)</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); border: 1px solid #333;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #d4a853;">
      <h1 style="color: #d4a853; margin: 0; font-size: 24px; font-weight: 700;">
        🔓 Seu acesso ao PDI
      </h1>
      <p style="color: #888; margin: 10px 0 0 0; font-size: 14px;">Login Liberado</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px; color: #e5e5e5;">
      
      <p style="font-size: 18px; margin-bottom: 25px;">
        Olá, <strong style="color: #ffffff;">${name}</strong>!
      </p>
      
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
        <strong style="color: #d4a853;">Parabéns pela decisão.</strong> Você acaba de dar um passo importante para sair do caos e entrar na organização.
      </p>
      
      <p style="font-size: 15px; line-height: 1.7; margin-bottom: 30px; color: #ccc;">
        Ao escolher o PDI, você não ganhou apenas um software, <strong style="color: #ffffff;">ganhou um sistema para sua vida.</strong>
      </p>
      
      <!-- Steps Section -->
      <div style="background-color: #111; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #d4a853;">
        <h2 style="color: #d4a853; font-size: 18px; margin-top: 0; margin-bottom: 20px;">
          ⚡ Por onde começar? (O Caminho Rápido)
        </h2>
        <p style="font-size: 14px; color: #aaa; margin-bottom: 25px; line-height: 1.6;">
          Sei que a vontade é querer arrumar a vida inteira de uma vez, mas o segredo é a <strong style="color: #fff;">constância</strong>. Para ter seu primeiro resultado em 5 minutos, siga esta ordem exata:
        </p>
        
        <!-- Step 1 -->
        <div style="margin-bottom: 25px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #d4a853; color: #000; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</span>
            <div>
              <strong style="color: #ffffff; font-size: 15px;">Acesse a Plataforma</strong>
              <p style="font-size: 14px; color: #aaa; margin: 8px 0 0 0; line-height: 1.5;">Clique no botão abaixo e faça seu login.</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8943f 100%); color: #000 !important; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3);">
            ACESSAR MEU PAINEL AGORA
          </a>
        </div>
        
        <!-- Step 2 -->
        <div style="margin-bottom: 25px;">
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #d4a853; color: #000; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</span>
            <div>
              <strong style="color: #ffffff; font-size: 15px;">Vá direto para "Como Chegar Lá"</strong>
              <p style="font-size: 14px; color: #aaa; margin: 8px 0 0 0; line-height: 1.5;">Primeiro, crie um <strong style="color: #fff;">Objetivo simples</strong>. Na sequência, cadastre apenas sua <strong style="color: #fff;">Meta nº 1</strong> para este mês. O sistema vai te ajudar a quebrá-la em passos.</p>
              <p style="font-size: 13px; color: #888; margin: 12px 0 0 0; font-style: italic; background: #1a1a1a; padding: 10px 12px; border-radius: 6px;">
                💡 <strong>Nota:</strong> Esse é apenas o pontapé inicial para você destravar. Depois que você fizer o passo de autoconhecimento, estará preparado para criar objetivos bem maiores.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Step 3 -->
        <div>
          <div style="display: flex; align-items: flex-start;">
            <span style="background-color: #d4a853; color: #000; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</span>
            <div>
              <strong style="color: #ffffff; font-size: 15px;">Use a Agenda</strong>
              <p style="font-size: 14px; color: #aaa; margin: 8px 0 0 0; line-height: 1.5;">Arraste essa primeira ação para o dia de hoje. <strong style="color: #d4a853;">Pronto!</strong> Você já está executando.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Deep Dive Section -->
      <div style="background-color: #111; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
        <h2 style="color: #d4a853; font-size: 18px; margin-top: 0; margin-bottom: 15px;">
          🧭 Quer ir mais fundo?
        </h2>
        <p style="font-size: 14px; color: #ccc; line-height: 1.7; margin-bottom: 15px;">
          Quando tiver um tempo mais tranquilo, inicie o passo <strong style="color: #ffffff;">"QUEM SOU EU"</strong>.
        </p>
        <div style="background: linear-gradient(135deg, #2a2000 0%, #1a1500 100%); border: 1px solid #d4a853; border-radius: 8px; padding: 15px;">
          <p style="font-size: 14px; color: #d4a853; margin: 0; line-height: 1.6;">
            ⚠️ <strong>Dica de Ouro:</strong> Para esta etapa, você vai precisar de uns 30 minutos de foco, em um lugar calmo e sem interrupções, ok? É ali que definimos a base do seu sucesso a longo prazo.
          </p>
        </div>
        <p style="font-size: 14px; color: #aaa; margin: 20px 0 0 0; line-height: 1.6;">
          Mas lembre-se: <strong style="color: #ffffff;">a execução vence a perfeição.</strong> Comece pela meta simples hoje.
        </p>
      </div>
      
      <!-- Support Note -->
      <p style="font-size: 14px; color: #888; line-height: 1.6; margin-bottom: 30px; text-align: center;">
        Qualquer dúvida, clique em <strong style="color: #d4a853;">Suporte</strong> no menu.
      </p>
      
      <!-- Closing -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333;">
        <p style="font-size: 16px; color: #ffffff; font-weight: 600; margin-bottom: 10px;">
          Estamos juntos nessa jornada.
        </p>
        <p style="font-size: 14px; color: #888; margin: 0;">
          Com carinho,<br>
          <strong style="color: #d4a853;">Equipe PDI - Carreira e Vida</strong>
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #333;">
      <p style="font-size: 12px; color: #666; margin: 0;">
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
      from: "PDI - Carreira e Vida <notificacoes@pdicarreiraevida.com.br>",
      to: [email],
      subject: "Seu acesso ao PDI (Login Liberado) 🔓",
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
