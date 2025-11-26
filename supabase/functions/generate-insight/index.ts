import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vvd, valores, areasVida } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Preparar dados para análise
    const valoresPreenchidos = valores.filter((v: string) => v.trim() !== "");
    const areasPreenchidas = areasVida.filter(
      (area: any) => area.notaAtual && area.notaDesejada
    );

    // Criar o prompt para análise
    const prompt = `Você é um coach de desenvolvimento pessoal e carreira. Analise as seguintes informações do Plano de Vida de um usuário e crie um insight profundo e personalizado:

**Visão de Vida Desejada (VVD):**
${vvd || "Não preenchido"}

**Valores (${valoresPreenchidos.length} valores identificados):**
${valoresPreenchidos.length > 0 ? valoresPreenchidos.map((v: string, i: number) => `${i + 1}. ${v}`).join('\n') : "Nenhum valor identificado ainda"}

**Áreas da Vida:**
${areasPreenchidas.length > 0 
  ? areasPreenchidas.map((area: any) => 
      `- ${area.area}: Nota Atual ${area.notaAtual}/10, Nota Desejada ${area.notaDesejada}/10 (Gap: ${area.notaDesejada - area.notaAtual})`
    ).join('\n')
  : "Nenhuma área avaliada ainda"
}

Por favor, crie uma análise detalhada que:
1. Faça correlações entre os valores identificados e a visão de vida desejada
2. Identifique padrões nas áreas da vida (quais têm maior gap, quais estão mais alinhadas)
3. Conecte os gaps das áreas com os valores e a visão
4. Ofereça 2-3 insights profundos sobre quem essa pessoa é, baseado nas informações
5. Sugira pontos de atenção ou áreas prioritárias de desenvolvimento

Seja empático, motivador e específico. Use linguagem acolhedora e inspiradora. Estruture a resposta de forma clara com parágrafos curtos.`;

    console.log("Calling Lovable AI for insight generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "Você é um coach especializado em desenvolvimento pessoal e carreira. Seu papel é fornecer insights profundos e personalizados baseados no Plano de Desenvolvimento Individual das pessoas." 
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Por favor, tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content;

    if (!insight) {
      throw new Error("No insight generated");
    }

    console.log("Insight generated successfully");

    return new Response(
      JSON.stringify({ insight }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-insight function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro ao gerar insight" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});