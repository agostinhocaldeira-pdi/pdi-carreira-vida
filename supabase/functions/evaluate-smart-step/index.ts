import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EVALUATE-SMART-STEP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    const body = await req.json();
    const { 
      step, // 'S', 'M', 'A', 'R', 'T', 'FINAL'
      currentText, 
      objetivo, 
      vvd,
      previousSteps // { especifico, mensuravel, atingivel, relevante, temporal, dataAlvo }
    } = body;

    logStep("Received request", { step, objetivo: objetivo?.substring(0, 50), hasVvd: !!vvd });

    // Build the context for the AI
    let systemPrompt = `Você é um Mentor em Desenvolvimento Humano, facilitador de clareza e avaliador construtivo para a criação de metas SMART.

Seu papel:
- Avaliar o texto escrito pelo usuário oferecendo feedback qualitativo
- Ajudar o usuário a ajustar, aprofundar e alinhar sua meta
- NÃO escrever a meta pelo usuário
- NÃO reescrever o texto do usuário
- NÃO ser excessivamente técnico ou acadêmico
- NÃO julgar ou invalidar emocionalmente

Você DEVE:
- Fazer perguntas provocativas quando necessário
- Sugerir ajustes de clareza
- Apontar inconsistências de forma respeitosa
- Reforçar quando o usuário estiver no caminho certo

Tom de voz: Calmo, profissional, humano e orientador.

Exemplo de abertura: "O que você escreveu está bem alinhado com o objetivo escolhido. Se quiser tornar essa meta ainda mais clara, vale refletir sobre..."

Responda em português brasileiro. Seja conciso (máximo 3 parágrafos curtos).`;

    let userPrompt = "";

    if (step === "S") {
      userPrompt = `PASSO S - ESPECÍFICO

Objetivo selecionado: "${objetivo}"
${vvd ? `Visão de Vida Desejada (VVD): "${vvd}"` : ""}

Texto do usuário para o critério ESPECÍFICO:
"${currentText}"

Avalie:
1. Se o texto é concreto ou genérico
2. Se descreve claramente o que será diferente na prática
3. Se está alinhado ao Objetivo e à VVD

Forneça feedback construtivo sobre a especificidade da meta.`;
    } else if (step === "M") {
      userPrompt = `PASSO M - MENSURÁVEL

Objetivo: "${objetivo}"
Específico (S): "${previousSteps?.especifico}"

Texto do usuário para o critério MENSURÁVEL:
"${currentText}"

Avalie:
1. Existência de critérios observáveis e mensuráveis
2. Se a métrica comprova a meta
3. Coerência entre métrica e especificidade definida

Indique se a métrica mede progresso real ou apenas intenção. Sugira maior objetividade se necessário.`;
    } else if (step === "A") {
      userPrompt = `PASSO A - ATINGÍVEL

Objetivo: "${objetivo}"
Específico (S): "${previousSteps?.especifico}"
Mensurável (M): "${previousSteps?.mensuravel}"

Texto do usuário para o critério ATINGÍVEL:
"${currentText}"

Avalie:
1. Realismo da meta no contexto atual
2. Clareza sobre recursos, ações ou capacidades necessárias
3. Coerência entre ambição e viabilidade

Reforce o equilíbrio entre desafio e realidade. Sugira ajustes em caso de idealização excessiva ou limitação exagerada.`;
    } else if (step === "R") {
      userPrompt = `PASSO R - RELEVANTE

Objetivo: "${objetivo}"
${vvd ? `Visão de Vida Desejada (VVD): "${vvd}"` : ""}
Específico (S): "${previousSteps?.especifico}"
Mensurável (M): "${previousSteps?.mensuravel}"
Atingível (A): "${previousSteps?.atingivel}"

Texto do usuário para o critério RELEVANTE:
"${currentText}"

Avalie:
1. Conexão da meta com algo maior
2. Existência de significado pessoal explícito
3. Contribuição direta para a Visão de Vida Desejada

Reforce alinhamento quando existir. Provoque reflexão quando o significado estiver raso ou desconectado.`;
    } else if (step === "T") {
      userPrompt = `PASSO T - TEMPORAL

Objetivo: "${objetivo}"
Específico (S): "${previousSteps?.especifico}"
Mensurável (M): "${previousSteps?.mensuravel}"
Atingível (A): "${previousSteps?.atingivel}"
Relevante (R): "${previousSteps?.relevante}"
Data alvo definida: ${previousSteps?.dataAlvo || "não definida"}

Texto do usuário para o critério TEMPORAL:
"${currentText}"

Avalie:
1. Coerência do prazo com o escopo da meta
2. Clareza e verificabilidade do prazo
3. Capacidade do prazo gerar compromisso real

Confirme coerência ou sugira ajuste. Alerte quando o prazo for irrealista ou genérico.`;
    } else if (step === "FINAL") {
      userPrompt = `AVALIAÇÃO FINAL DA META SMART

Objetivo: "${objetivo}"
${vvd ? `Visão de Vida Desejada (VVD): "${vvd}"` : ""}

Meta SMART construída:
- S (Específico): "${previousSteps?.especifico}"
- M (Mensurável): "${previousSteps?.mensuravel}"
- A (Atingível): "${previousSteps?.atingivel}"
- R (Relevante): "${previousSteps?.relevante}"
- T (Temporal): "${previousSteps?.temporal}" (Data: ${previousSteps?.dataAlvo})

Apresente:
1. Grau de clareza da meta (alto/médio/baixo)
2. Grau de alinhamento com a VVD (alto/médio/baixo)
3. Grau de consistência interna (alto/médio/baixo)

Feedback consolidado:
- Pontos fortes da meta
- Pontos que podem ser refinados

Mantenha tom claro, encorajador, adulto, sem motivação vazia.`;
    } else {
      throw new Error(`Invalid step: ${step}`);
    }

    logStep("Calling AI gateway");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        logStep("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        logStep("Payment required");
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      logStep("AI gateway error", { status: response.status, error: errorText });
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const feedback = aiResponse.choices?.[0]?.message?.content;

    if (!feedback) {
      throw new Error("No feedback generated from AI");
    }

    logStep("AI feedback generated successfully");

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
