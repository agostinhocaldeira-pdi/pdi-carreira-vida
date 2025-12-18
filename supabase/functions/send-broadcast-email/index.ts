import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Recipient {
  email: string;
  name: string;
}

interface BroadcastRequest {
  subject: string;
  message: string;
  recipients: Recipient[];
  sendViaEmail: boolean;
  sendViaWhatsapp: boolean;
}

const generateBroadcastHtml = (message: string, recipientName: string): string => `
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
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; white-space: pre-wrap; }
    .greeting { font-size: 16px; margin-bottom: 20px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; }
    .signature img { max-width: 150px; height: auto; margin-bottom: 10px; }
    .signature-domain { color: #667eea; font-weight: 600; font-size: 14px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📢 PDI - Carreira & Vida</h1>
    </div>
    <div class="content">
      <p class="greeting">Olá, <strong>${recipientName}</strong>!</p>
      <p>${message}</p>
      <center>
        <a href="https://www.pdicarreiraevida.com.br/home" class="cta-button">Acessar o PDI</a>
      </center>
      <div class="signature">
        <img src="https://www.pdicarreiraevida.com.br/logo_pdi.png" alt="PDI - Carreira & Vida" />
        <br />
        <a href="https://www.pdicarreiraevida.com.br" class="signature-domain">www.pdicarreiraevida.com.br</a>
      </div>
    </div>
    <div class="footer">
      <p>Este email foi enviado pelo PDI - Carreira & Vida.</p>
      <p>Se não deseja mais receber comunicados, acesse suas configurações no aplicativo.</p>
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
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const { subject, message, recipients, sendViaEmail, sendViaWhatsapp }: BroadcastRequest = await req.json();

    console.log(`Processing broadcast to ${recipients.length} recipients`);

    if (!subject || !message) {
      throw new Error("Subject and message are required");
    }

    if (!recipients || recipients.length === 0) {
      throw new Error("At least one recipient is required");
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    let sentCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      // Send emails in parallel within each batch
      const emailPromises = batch.map(async (recipient) => {
        try {
          if (sendViaEmail && recipient.email) {
            const htmlContent = generateBroadcastHtml(message, recipient.name);

            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "PDI - Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
                to: [recipient.email],
                subject: subject,
                html: htmlContent,
              }),
            });

            const emailResult = await emailResponse.json();

            if (!emailResponse.ok) {
              console.error(`Failed to send to ${recipient.email}:`, emailResult);
              errors.push(`${recipient.email}: ${emailResult.message || 'Unknown error'}`);
              errorCount++;
            } else {
              console.log(`Email sent to ${recipient.email}`);
              sentCount++;
            }
          }

          // WhatsApp sending - placeholder for future implementation
          if (sendViaWhatsapp) {
            console.log(`WhatsApp sending not yet implemented for ${recipient.email}`);
          }
        } catch (err: any) {
          console.error(`Error sending to ${recipient.email}:`, err);
          errors.push(`${recipient.email}: ${err.message}`);
          errorCount++;
        }
      });

      await Promise.all(emailPromises);

      // Add a small delay between batches to avoid rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Broadcast completed: ${sentCount} sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errorCount,
        errorDetails: errors.length > 0 ? errors.slice(0, 5) : undefined
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-broadcast-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: error.message === "Unauthorized" || error.message === "Admin access required" ? 403 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
