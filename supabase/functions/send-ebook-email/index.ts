import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EbookEmailRequest {
  name: string;
  email: string;
  confirmationToken: string;
  ebookType?: string;
}

interface EbookConfig {
  title: string;
  subject: string;
  downloadPath: string;
  color: string;
  colorLight: string;
}

const ebookConfigs: Record<string, EbookConfig> = {
  default: {
    title: "Pequeno Manual para Grandes Conquistas",
    subject: "📚 Seu E-book: Pequeno Manual para Grandes Conquistas",
    downloadPath: "/ebook-download",
    color: "#8B5CF6",
    colorLight: "#faf5ff",
  },
  bancario: {
    title: "Manual do Bancário",
    subject: "🏦 Seu E-book: Manual do Bancário",
    downloadPath: "/ebook-bancario-download",
    color: "#2563eb",
    colorLight: "#eff6ff",
  },
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, confirmationToken, ebookType }: EbookEmailRequest = await req.json();

    console.log(`Sending ebook email to ${email} for ${name}, type: ${ebookType || 'default'}`);

    const config = ebookConfigs[ebookType || 'default'] || ebookConfigs.default;

    const baseUrl = Deno.env.get("BASE_URL") || "https://pdicarreiraevida.com.br";
    const downloadLink = `${baseUrl}${config.downloadPath}?token=${confirmationToken}`;

    const emailResponse = await resend.emails.send({
      from: "PDI Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
      to: [email],
      subject: config.subject,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${config.color}, ${config.color}dd); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Seu E-book está pronto! 📚
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Olá, <strong>${name.split(" ")[0]}</strong>!
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Muito obrigado por baixar o e-book <strong>"${config.title}"</strong>. 
                Este é o primeiro passo para uma jornada de sucesso na sua carreira.
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                Clique no botão abaixo para confirmar seu e-mail e acessar o download:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${downloadLink}" style="display: inline-block; background: linear-gradient(135deg, ${config.color}, ${config.color}dd); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      📥 Baixar meu E-book
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Se o botão não funcionar, copie e cole este link no seu navegador:
                <br>
                <a href="${downloadLink}" style="color: ${config.color}; word-break: break-all;">${downloadLink}</a>
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer CTA -->
          <tr>
            <td style="padding: 30px; background-color: ${config.colorLight};">
              <p style="margin: 0 0 15px; color: #374151; font-size: 16px; font-weight: 600; text-align: center;">
                🚀 Quer ir além do e-book?
              </p>
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                Conheça o PDI - Carreira & Vida, a plataforma completa de desenvolvimento pessoal 
                com ferramentas, diagnósticos e acompanhamento para transformar sua vida.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}/signup" style="display: inline-block; background-color: #ffffff; color: ${config.color}; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid ${config.color};">
                      Conhecer o PDI
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #f9fafb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} PDI - Carreira & Vida. Todos os direitos reservados.
              </p>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                Este e-mail foi enviado porque você solicitou o download do e-book.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-ebook-email function:", error);
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
