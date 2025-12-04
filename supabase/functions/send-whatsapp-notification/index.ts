import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppRequest {
  type: 'diary_reminder' | 'goal_deadline' | 'weekly_summary' | 'custom';
  userId?: string;
  phone?: string;
  name?: string;
  message?: string;
  data?: Record<string, any>;
}

const generateDiaryReminderMessage = (name: string): string => {
  return `Olá ${name}! 👋

Sentimos sua falta no PDI - Carreira & Vida! 📝

Faz alguns dias que você não registra no seu diário. Lembre-se: pequenas reflexões diárias fazem grandes diferenças na sua jornada de desenvolvimento.

Que tal dedicar 5 minutinhos agora para registrar como foi seu dia?

🚀 Acesse: https://pdi-carreira-vida.lovable.app

Estamos torcendo por você! 💪`;
};

const generateGoalDeadlineMessage = (name: string, goalTitle: string, daysRemaining: number): string => {
  return `Olá ${name}! ⏰

Lembrete importante do PDI - Carreira & Vida:

Sua meta "${goalTitle}" está chegando ao prazo! Faltam apenas ${daysRemaining} dias.

📊 Acesse o app para verificar seu progresso e ajustar suas ações se necessário.

🚀 Acesse: https://pdi-carreira-vida.lovable.app

Você consegue! 💪`;
};

const generateWeeklySummaryMessage = (name: string, data: Record<string, any>): string => {
  return `Olá ${name}! 📊

Resumo semanal do seu PDI - Carreira & Vida:

✅ Ações concluídas: ${data.completedActions || 0}
📝 Dias com diário: ${data.diaryDays || 0}/7
🎯 Progresso geral: ${data.overallProgress || 0}%

${data.overallProgress >= 70 ? 'Excelente semana! Continue assim! 🌟' : 'Vamos melhorar essa semana? Você consegue! 💪'}

🚀 Acesse: https://pdi-carreira-vida.lovable.app`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, phone, name, message, data }: WhatsAppRequest = await req.json();
    
    console.log(`Processing ${type} WhatsApp notification`);

    // Get Twilio credentials
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioWhatsAppNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER");

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      throw new Error("Twilio credentials not configured");
    }

    let recipientPhone = phone;
    let recipientName = name || "Usuário";

    // If userId provided, fetch user data from Supabase
    if (userId && !phone) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Try to get phone from company_employees first
      const { data: employeeData } = await supabase
        .from("company_employees")
        .select("phone, name")
        .eq("user_id", userId)
        .single();

      if (employeeData?.phone) {
        recipientPhone = employeeData.phone;
        recipientName = employeeData.name || recipientName;
      } else {
        // Try company_managers
        const { data: managerData } = await supabase
          .from("company_managers")
          .select("phone, name")
          .eq("user_id", userId)
          .single();

        if (managerData?.phone) {
          recipientPhone = managerData.phone;
          recipientName = managerData.name || recipientName;
        }
      }
    }

    if (!recipientPhone) {
      throw new Error("No phone number available for this user");
    }

    // Format phone number (ensure it starts with country code)
    let formattedPhone = recipientPhone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }

    // Generate message based on type
    let whatsAppMessage: string;
    
    switch (type) {
      case 'diary_reminder':
        whatsAppMessage = generateDiaryReminderMessage(recipientName);
        break;
      case 'goal_deadline':
        whatsAppMessage = generateGoalDeadlineMessage(
          recipientName, 
          data?.goalTitle || 'sua meta', 
          data?.daysRemaining || 3
        );
        break;
      case 'weekly_summary':
        whatsAppMessage = generateWeeklySummaryMessage(recipientName, data || {});
        break;
      case 'custom':
        whatsAppMessage = message || 'Mensagem do PDI - Carreira & Vida';
        break;
      default:
        whatsAppMessage = message || 'Notificação do PDI - Carreira & Vida';
    }

    console.log(`Sending WhatsApp to ${formattedPhone}`);

    // Send via Twilio WhatsApp API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', `whatsapp:${twilioWhatsAppNumber}`);
    formData.append('To', `whatsapp:+${formattedPhone}`);
    formData.append('Body', whatsAppMessage);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const twilioResult = await twilioResponse.json();
    
    if (!twilioResponse.ok) {
      console.error("Twilio error:", twilioResult);
      throw new Error(twilioResult.message || 'Failed to send WhatsApp message');
    }

    console.log("WhatsApp sent successfully:", twilioResult.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioResult.sid,
        to: formattedPhone 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-whatsapp-notification:", error);
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
