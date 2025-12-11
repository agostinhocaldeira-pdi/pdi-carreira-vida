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
    const { vvd, valores, areasVida, surveyData, onboardingData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Preparar dados para análise
    const valoresPreenchidos = valores?.filter((v: string) => v.trim() !== "") || [];
    const areasPreenchidas = areasVida?.filter(
      (area: any) => area.notaAtual && area.notaDesejada
    ) || [];

    // Mapear respostas da pesquisa para texto legível
    const mapWakeUpTime = (value: string) => {
      const map: Record<string, string> = {
        "antes-6h": "Antes das 6h",
        "6h-8h": "Entre 6h e 8h",
        "8h-10h": "Entre 8h e 10h",
        "depois-10h": "Depois das 10h"
      };
      return map[value] || value;
    };

    const mapExerciseFrequency = (value: string) => {
      const map: Record<string, string> = {
        "nunca": "Raramente/Nunca",
        "1-2x": "1-2x por semana",
        "3-4x": "3-4x por semana",
        "5+x": "5x ou mais"
      };
      return map[value] || value;
    };

    const mapMainGoal = (value: string) => {
      const map: Record<string, string> = {
        "carreira": "Crescer na carreira",
        "saude": "Melhorar a saúde",
        "financeiro": "Estabilidade financeira",
        "relacionamentos": "Melhorar relacionamentos",
        "equilibrio": "Equilíbrio vida/trabalho",
        "autoconhecimento": "Autoconhecimento"
      };
      return map[value] || value;
    };

    const mapLearningStyle = (value: string) => {
      const map: Record<string, string> = {
        "lendo": "Lendo livros/artigos",
        "videos": "Assistindo vídeos",
        "praticando": "Praticando/Fazendo",
        "conversando": "Conversando com pessoas"
      };
      return map[value] || value;
    };

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

**Perfil do Onboarding:**
- Fase atual: ${onboardingData?.currentPhase || "Não informado"}
- Expectativas: ${onboardingData?.expectations || "Não informado"}

**Pesquisa de Hábitos e Preferências:**
- Horário de acordar: ${surveyData?.wakeUpTime ? mapWakeUpTime(surveyData.wakeUpTime) : "Não informado"}
- Frequência de exercícios: ${surveyData?.exerciseFrequency ? mapExerciseFrequency(surveyData.exerciseFrequency) : "Não informado"}
- Principal objetivo: ${surveyData?.mainGoal ? mapMainGoal(surveyData.mainGoal) : "Não informado"}
- Estilo de aprendizagem: ${surveyData?.learningStyle ? mapLearningStyle(surveyData.learningStyle) : "Não informado"}
- Maior desafio: ${surveyData?.biggestChallenge || "Não informado"}
- Fonte de motivação: ${surveyData?.motivationSource || "Não informado"}

INSTRUÇÕES IMPORTANTES:
- Escreva APENAS 2 parágrafos curtos e diretos
- Cada parágrafo deve ter no máximo 4-5 linhas
- Seja objetivo e vá direto ao ponto
- Extraia apenas a ESSÊNCIA do que descobriu sobre o usuário
- Use linguagem empática e motivadora
- Foque nos insights mais importantes e correlações principais
- LEVE EM CONSIDERAÇÃO os hábitos, objetivos e desafios da pesquisa para personalizar os insights

Estruture sua resposta em exatamente 2 parágrafos:
1º parágrafo: Quem é essa pessoa (valores, visão, padrões e características comportamentais)
2º parágrafo: Áreas prioritárias e sugestão de próximos passos considerando seu estilo de aprendizagem e objetivos`;


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