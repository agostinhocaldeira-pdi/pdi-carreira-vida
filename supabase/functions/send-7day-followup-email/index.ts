import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[7DAY-FOLLOWUP] ${step}${detailsStr}`);
};

const generateFollowupEmailHtml = (name: string, checkoutUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; margin: 0; padding: 20px; color: #e5e5e5; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #333; }
    .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d4a853; }
    .header h1 { margin: 0; font-size: 24px; color: #d4a853; }
    .header p { margin: 10px 0 0 0; color: #888; font-size: 12px; }
    .book-image { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); }
    .book-image img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 30px rgba(212, 168, 83, 0.2); }
    .content { padding: 30px; }
    .content p { color: #e5e5e5; line-height: 1.8; margin-bottom: 18px; font-size: 15px; }
    .content strong { color: #ffffff; }
    .highlight { background: #1a1a1a; border-left: 4px solid #d4a853; padding: 18px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .highlight p { margin: 0; color: #d4a853; font-style: italic; }
    .benefits-list { background: #111; border-radius: 8px; padding: 20px 25px; margin: 25px 0; }
    .benefits-list li { color: #e5e5e5; margin: 12px 0; line-height: 1.6; }
    .benefits-list strong { color: #d4a853; }
    .cta-section { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8943f 100%); color: #000 !important; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3); }
    .cta-button:hover { background: linear-gradient(135deg, #e5b95c 0%, #d4a853 100%); }
    .cta-note { color: #888; font-size: 13px; margin-top: 15px; }
    .footer { background: #0a0a0a; padding: 25px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333; }
    .footer a { color: #d4a853; text-decoration: none; }
    .gold-text { color: #d4a853; }
    .strike { text-decoration: line-through; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>♠️ PDI - Carreira & Vida</h1>
      <p>Um convite exclusivo para você</p>
    </div>
    
    <div class="book-image">
      <img src="https://pdicarreiraevida.lovable.app/images/codigo-essencial-email.png" alt="O Código do Essencial - 30 Dias" />
    </div>
    
    <div class="content">
      <p>Olá, <strong>${name}</strong>.</p>
      
      <p>Se você está usando o PDI há alguns dias, já percebeu como o sistema coloca ordem na casa.</p>
      
      <p>Hoje, eu quero te contar um <strong>segredo de bastidores</strong>.</p>
      
      <p>Nós estamos desenvolvendo um nível superior de assinatura, que será lançado em breve: o <strong class="gold-text">PDI Black</strong>. O preço de lançamento desse plano será de <strong>R$ 297,00</strong>.</p>
      
      <p>Mas por que criar um plano mais caro? Porque descobrimos uma verdade dura:</p>
      
      <div class="highlight">
        <p>A melhor ferramenta do mundo não salva uma mente que está viciada em se distrair.</p>
      </div>
      
      <p>Imagine que o PDI é um <strong>carro de Fórmula 1</strong> que te entreguei. Uma máquina perfeita, capaz de te levar ao seu objetivo numa velocidade insana. Mas se você sentar nesse cockpit com a "mente antiga" de quem dirige um carro popular no engarrafamento... <strong>você vai bater na primeira curva.</strong></p>
      
      <p>É por isso que o coração do Plano Black será o <strong class="gold-text">DESAFIO CÓDIGO DO ESSENCIAL</strong>.</p>
      
      <p>E é aqui que entra minha proposta para você hoje:</p>
      
      <div class="highlight">
        <p>Se você confirmar sua assinatura anual do plano Padrão (<strong>R$ 67/ano</strong>) HOJE, eu vou incluir o acesso vitalício a esse Desafio (que custará <span class="strike">R$ 297</span>) na sua conta, <strong>de graça</strong>.</p>
      </div>
      
      <p><strong>Você paga o preço do Básico, mas leva a "alma" do Black.</strong></p>
      
      <p><strong>O que é esse Desafio?</strong></p>
      
      <p>Não é um "livrinho de dicas". Não é "mais conteúdo" para você ler e esquecer.</p>
      
      <p>É um <strong class="gold-text">Protocolo de Reinicialização Mental de 30 Dias</strong>. Condensamos a sabedoria de Hábitos Atômicos, Essencialismo e Deep Work em 30 pílulas de pura execução.</p>
      
      <p><strong>Nos próximos 30 dias, dentro da plataforma, você vai:</strong></p>
      
      <ul class="benefits-list">
        <li><strong>Dia 1:</strong> Descobrir por que você trabalha tanto e produz tão pouco.</li>
        <li><strong>Dia 2:</strong> Aprender a dizer "NÃO" sem culpa e ganhar horas livres.</li>
        <li><strong>Dia 8:</strong> Matar a procrastinação antes do café da manhã.</li>
        <li><strong>+27 dias:</strong> Instalar o sistema operacional de quem realiza o impossível.</li>
      </ul>
      
      <p><strong>O PDI organiza a sua vida. Este desafio organiza VOCÊ.</strong></p>
      
      <p>A ferramenta está pronta. O mapa está na sua mão.<br>A pergunta é: <strong class="gold-text">você vai pilotar ou vai passear?</strong></p>
    </div>
    
    <div class="cta-section">
      <a href="${checkoutUrl}" class="cta-button">GARANTIR ANUAL (R$ 67) + ACESSO BLACK (GRÁTIS)</a>
      <p class="cta-note">Ao confirmar, o módulo "Código do Essencial" será destravado no seu menu imediatamente.</p>
    </div>
    
    <div class="footer">
      <p>Te vejo na área de membros,</p>
      <p><strong class="gold-text">Equipe PDI - Carreira & Vida</strong></p>
      <br>
      <p>Este email foi enviado para ${name} porque você se cadastrou no PDI - Carreira & Vida.</p>
      <p><a href="https://www.pdicarreiraevida.com.br">Acessar plataforma</a></p>
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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Check for test email mode
    let testEmail: string | null = null;
    try {
      const body = await req.json();
      testEmail = body?.test_email || null;
    } catch {
      // No body or invalid JSON - normal mode
    }

    if (testEmail) {
      logStep("TEST MODE: Sending test email", { to: testEmail });
      
      const checkoutUrl = `https://pdicarreiraevida.lovable.app/login?redirect=checkout`;
      
      const emailResponse = await resend.emails.send({
        from: "PDI - Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
        to: [testEmail],
        subject: "Um convite para o futuro PDI Black (R$ 297 por R$ 0) ♠️",
        html: generateFollowupEmailHtml("Usuário Teste", checkoutUrl),
      });

      logStep("Test email sent", { response: JSON.stringify(emailResponse) });

      return new Response(
        JSON.stringify({ success: true, testMode: true, emailsSent: 1 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Starting 7-day followup email check");

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStart = new Date(sevenDaysAgo);
    sevenDaysAgoStart.setHours(0, 0, 0, 0);
    const sevenDaysAgoEnd = new Date(sevenDaysAgo);
    sevenDaysAgoEnd.setHours(23, 59, 59, 999);

    logStep("Looking for users registered 7 days ago", { 
      start: sevenDaysAgoStart.toISOString(), 
      end: sevenDaysAgoEnd.toISOString() 
    });

    // Get users created 7 days ago from auth.users
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }

    // Filter users created 7 days ago
    const eligibleUsers = usersData.users.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt >= sevenDaysAgoStart && createdAt <= sevenDaysAgoEnd;
    });

    logStep(`Found ${eligibleUsers.length} users registered 7 days ago`);

    let emailsSent = 0;
    let errors: string[] = [];

    for (const user of eligibleUsers) {
      try {
        // Check if user already has an active subscription
        const hasSubscription = await checkUserSubscription(user.email!, stripeKey);
        
        if (hasSubscription) {
          logStep(`User ${user.email} already has active subscription, skipping`);
          continue;
        }

        // Check if we already sent this email to this user
        const { data: existingEmail } = await supabase
          .from('email_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', '7day_followup')
          .single();

        if (existingEmail) {
          logStep(`Already sent 7-day followup to ${user.email}, skipping`);
          continue;
        }

        // Get user profile for name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        const userName = profile?.full_name || user.email?.split('@')[0] || 'Usuário';

        // Generate checkout URL - user will be redirected to checkout after login
        const checkoutUrl = `https://pdicarreiraevida.lovable.app/login?redirect=checkout`;

        // Send email
        const emailResponse = await resend.emails.send({
          from: "PDI - Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
          to: [user.email!],
          subject: "Um convite para o futuro PDI Black (R$ 297 por R$ 0) ♠️",
          html: generateFollowupEmailHtml(userName, checkoutUrl),
        });

        logStep(`Email sent to ${user.email}`, { response: JSON.stringify(emailResponse) });

        // Log the email sent
        await supabase.from('email_logs').insert({
          user_id: user.id,
          email_type: '7day_followup',
          sent_at: new Date().toISOString(),
          email_to: user.email,
        });

        emailsSent++;
      } catch (userError) {
        const errorMsg = `Error processing user ${user.email}: ${userError instanceof Error ? userError.message : String(userError)}`;
        logStep(errorMsg);
        errors.push(errorMsg);
      }
    }

    logStep(`Completed: ${emailsSent} emails sent, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent, 
        eligibleUsers: eligibleUsers.length,
        errors: errors.length > 0 ? errors : undefined 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

// Helper function to check if user has active Stripe subscription
async function checkUserSubscription(email: string, stripeKey: string): Promise<boolean> {
  try {
    const Stripe = (await import("https://esm.sh/stripe@18.5.0")).default;
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });
    
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return false;
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });

    return subscriptions.data.length > 0;
  } catch {
    return false;
  }
}

serve(handler);
