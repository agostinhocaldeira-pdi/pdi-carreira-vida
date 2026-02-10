import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User authenticated:", user.id);

    const { 
      vvd, 
      vvdParagraph,
      vvdSentence,
      valores, 
      areasVida, 
      surveyData, 
      onboardingData,
      objetivos,
      metas,
      acoes,
      swot,
      crencas,
      autoavaliacao,
      habilidades,
      diarioRecente,
      eisenhower,
      stoicResponses
    } = await req.json();
    
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

    // Formatar objetivos
    const objetivosFormatados = objetivos?.map((obj: any, i: number) => 
      `${i + 1}. ${obj.texto} (Status: ${obj.status}${obj.is_principal ? ' - PRINCIPAL' : ''}${obj.data_alvo ? `, Prazo: ${obj.data_alvo}` : ''})`
    ).join('\n') || "Nenhum objetivo cadastrado";

    // Formatar metas
    const metasFormatadas = metas?.map((meta: any, i: number) => 
      `${i + 1}. ${meta.texto} (${meta.concluida ? 'Concluída' : 'Em andamento'}${meta.data_alvo ? `, Prazo: ${meta.data_alvo}` : ''})`
    ).join('\n') || "Nenhuma meta cadastrada";

    // Formatar ações
    const acoesFormatadas = acoes?.map((acao: any, i: number) => 
      `${i + 1}. ${acao.acao || acao.texto} (Status: ${acao.status}, Periodicidade: ${acao.periodicidade || 'não definida'})`
    ).join('\n') || "Nenhuma ação cadastrada";

    // Formatar SWOT
    const swotFormatado = swot ? `
- Forças: ${swot.forcas?.join(', ') || 'não preenchido'}
- Fraquezas: ${swot.fraquezas?.join(', ') || 'não preenchido'}
- Oportunidades: ${swot.oportunidades?.join(', ') || 'não preenchido'}
- Ameaças: ${swot.ameacas?.join(', ') || 'não preenchido'}` : "SWOT não preenchido";

    // Formatar crenças
    const crencasFormatadas = crencas?.map((c: any, i: number) => 
      `${i + 1}. Crença limitante: "${c.crenca_limitante || c.limiting_belief}" → Nova crença: "${c.nova_crenca || c.new_belief || 'não definida'}"`
    ).join('\n') || "Nenhuma crença trabalhada";

    // Formatar habilidades
    const habilidadesFortes = habilidades?.filter((h: any) => h.tipo === 'forte' || h.category === 'strength').map((h: any) => h.texto || h.skill_name).join(', ') || 'não informado';
    const habilidadesFracas = habilidades?.filter((h: any) => h.tipo === 'fraco' || h.category === 'weakness').map((h: any) => h.texto || h.skill_name).join(', ') || 'não informado';

    // Formatar diário recente
    const diarioFormatado = diarioRecente?.slice(0, 5).map((entry: any) => 
      `- ${entry.data || entry.entry_date}: Humor ${entry.humor || entry.mood || 'não informado'}${entry.conquistas || entry.conquests ? `, Conquistas: ${entry.conquistas || entry.conquests}` : ''}`
    ).join('\n') || "Sem entradas recentes no diário";

    // Formatar Eisenhower
    const eisenhowerFormatado = eisenhower ? `
- Urgente e Importante: ${eisenhower.urgente_importante?.join(', ') || 'vazio'}
- Não Urgente e Importante: ${eisenhower.nao_urgente_importante?.join(', ') || 'vazio'}
- Urgente e Não Importante: ${eisenhower.urgente_nao_importante?.join(', ') || 'vazio'}
- Não Urgente e Não Importante: ${eisenhower.nao_urgente_nao_importante?.join(', ') || 'vazio'}` : "Matriz Eisenhower não preenchida";

    // Formatar autoavaliação
    const autoavaliacaoFormatada = autoavaliacao?.ai_analysis || autoavaliacao?.feedback_360 || "Autoavaliação não realizada";

    // Formatar respostas estoicas recentes
    const stoicFormatado = stoicResponses?.slice(0, 3).map((r: any) => 
      `- Reflexão: "${r.response?.substring(0, 100)}..."`
    ).join('\n') || "";

    // Criar o prompt para análise profunda em 3 níveis
    const prompt = `Você é um coach de desenvolvimento pessoal experiente. Analise TODAS as informações abaixo e crie uma análise estratégica em 3 NÍVEIS.

REGRAS IMPORTANTES:
- Use linguagem SIMPLES, como se estivesse falando com uma pessoa de 14 anos
- Seja DIRETO e OBJETIVO
- Não use palavras difíceis ou termos técnicos
- Cada nível deve ter no máximo 4-5 linhas

=== DADOS COMPLETOS DO USUÁRIO ===

**1. VISÃO DE VIDA DESEJADA (VVD):**
Texto livre: ${vvd || "Não preenchido"}
Resumo em parágrafo: ${vvdParagraph || "Não gerado"}
Frase síntese: ${vvdSentence || "Não gerada"}

**2. VALORES PESSOAIS (${valoresPreenchidos.length} valores):**
${valoresPreenchidos.length > 0 ? valoresPreenchidos.map((v: string, i: number) => `${i + 1}. ${v}`).join('\n') : "Nenhum valor identificado"}

**3. RODA DA VIDA (Áreas avaliadas):**
${areasPreenchidas.length > 0 
  ? areasPreenchidas.map((area: any) => 
      `- ${area.area}: Atual ${area.notaAtual}/10 → Desejado ${area.notaDesejada}/10 (Gap: ${area.notaDesejada - area.notaAtual})`
    ).join('\n')
  : "Nenhuma área avaliada"
}

**4. OBJETIVOS:**
${objetivosFormatados}

**5. METAS:**
${metasFormatadas}

**6. AÇÕES:**
${acoesFormatadas}

**7. ANÁLISE SWOT:**
${swotFormatado}

**8. CRENÇAS TRABALHADAS:**
${crencasFormatadas}

**9. HABILIDADES:**
- Pontos fortes: ${habilidadesFortes}
- Pontos a desenvolver: ${habilidadesFracas}

**10. AUTOAVALIAÇÃO 360°:**
${autoavaliacaoFormatada}

**11. MATRIZ EISENHOWER (Prioridades):**
${eisenhowerFormatado}

**12. DIÁRIO RECENTE:**
${diarioFormatado}

**13. REFLEXÕES ESTOICAS:**
${stoicFormatado}

**14. PERFIL DE HÁBITOS:**
- Horário de acordar: ${surveyData?.wakeUpTime ? mapWakeUpTime(surveyData.wakeUpTime) : "Não informado"}
- Frequência de exercícios: ${surveyData?.exerciseFrequency ? mapExerciseFrequency(surveyData.exerciseFrequency) : "Não informado"}
- Principal objetivo declarado: ${surveyData?.mainGoal ? mapMainGoal(surveyData.mainGoal) : "Não informado"}
- Estilo de aprendizagem: ${surveyData?.learningStyle ? mapLearningStyle(surveyData.learningStyle) : "Não informado"}
- Maior desafio: ${surveyData?.biggestChallenge || "Não informado"}
- Fonte de motivação: ${surveyData?.motivationSource || "Não informado"}

**15. FASE E EXPECTATIVAS:**
- Fase atual: ${onboardingData?.currentPhase || "Não informado"}
- Expectativas: ${onboardingData?.expectations || "Não informado"}

=== INSTRUÇÕES PARA A ANÁLISE ===

Gere a análise em EXATAMENTE 3 NÍVEIS, separados por títulos:

**NÍVEL 1 - QUEM VOCÊ É:**
Analise a personalidade, comportamento, forças e fraquezas da pessoa. Use os dados do VVD, valores, SWOT, crenças e habilidades. Seja específico sobre o que você descobriu sobre essa pessoa.

**NÍVEL 2 - O QUE ESTÁ FAZENDO BEM E PONTOS CEGOS:**
Identifique o que a pessoa está fazendo corretamente (celebre as conquistas!) e aponte possíveis pontos cegos - coisas que ela pode não estar vendo. Use os dados do diário, Eisenhower, autoavaliação e ações.

**NÍVEL 3 - COERÊNCIA DO CAMINHO:**
Compare os OBJETIVOS, METAS e AÇÕES com o VVD, VALORES e RODA DA VIDA. Responda claramente:
- Se existe INCOERÊNCIA (o que quer alcançar não combina com quem ela é ou o que valoriza)
- OU se está no CAMINHO CERTO (tudo faz sentido junto)
Seja honesto e direto. Se algo não bate, explique de forma simples.

IMPORTANTE: Mantenha cada nível curto (4-5 linhas no máximo). Use palavras simples. Seja direto.`;

    console.log("Calling Lovable AI for comprehensive insight generation...");

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
            content: "Você é um coach especializado em desenvolvimento pessoal. Seu papel é analisar dados de forma profunda e gerar insights práticos e acionáveis. Use linguagem simples e direta, como se estivesse falando com um adolescente inteligente." 
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

    console.log("Comprehensive insight generated successfully");

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
