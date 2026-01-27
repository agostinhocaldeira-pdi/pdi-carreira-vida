/**
 * Service to collect all user data for comprehensive insight generation
 * OPTIMIZED: Uses pre-computed home cache data from overnight processing
 * Falls back to direct queries only when cache is unavailable
 */

import { supabase } from "@/integrations/supabase/client";
import type { HomeCache } from "@/hooks/useHomeCache";

export interface InsightDataPayload {
  vvd: string;
  vvdParagraph: string;
  vvdSentence: string;
  valores: string[];
  areasVida: Array<any>;
  surveyData: Record<string, any>;
  onboardingData: Record<string, any>;
  objetivos: Array<any>;
  metas: Array<any>;
  acoes: Array<any>;
  swot: { forcas: string[]; fraquezas: string[]; oportunidades: string[]; ameacas: string[] } | null;
  crencas: Array<any>;
  autoavaliacao: { ai_analysis: string; feedback_360: string } | null;
  habilidades: Array<any>;
  diarioRecente: Array<any>;
  eisenhower: { 
    urgente_importante: string[]; 
    nao_urgente_importante: string[]; 
    urgente_nao_importante: string[]; 
    nao_urgente_nao_importante: string[] 
  } | null;
  stoicResponses: Array<any>;
}

/**
 * Collect insight data using pre-computed cache from overnight processing
 * This avoids multiple real-time queries and reduces latency
 */
export async function collectInsightDataFromCache(cache: HomeCache): Promise<InsightDataPayload> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Read minimal data from localStorage (these are user-side only)
  const surveyData = JSON.parse(localStorage.getItem("userSurvey") || "{}");
  const onboardingData = JSON.parse(localStorage.getItem("onboarding") || "{}");

  // Extract VVD from cache plano vida summary
  const vvdSentence = cache.planoVidaSummary?.para_onde?.vvd_sentence || "";
  
  // Extract valores from cache
  const valores = cache.planoVidaSummary?.quem_sou?.top_valores || [];

  // Extract areas vida count from cache (need to fetch details if needed)
  const areasVida = cache.planoVidaSummary?.quem_sou?.life_areas_count > 0 
    ? [{ avg_current: cache.planoVidaSummary.quem_sou.avg_current_score, avg_desired: cache.planoVidaSummary.quem_sou.avg_desired_score }]
    : [];

  // Extract objectives from cache hierarchy
  const objetivos = cache.objectives || [];

  // Extract goals from objectives hierarchy  
  const metas: Array<any> = [];
  const acoes: Array<any> = [];
  
  objetivos.forEach((obj: any) => {
    if (obj.goals) {
      obj.goals.forEach((goal: any) => {
        metas.push({
          id: goal.id,
          texto: goal.texto,
          status: goal.status,
          data_alvo: goal.data_alvo,
          objective_id: obj.id,
        });
        
        if (goal.actions) {
          goal.actions.forEach((action: any) => {
            acoes.push({
              id: action.id,
              texto: action.texto,
              status: action.status,
              periodicidade: action.periodicidade,
              goal_id: goal.id,
              steps: action.steps || [],
            });
          });
        }
      });
    }
  });

  // Diary data from cache
  const diarioRecente = cache.diary?.mood_trend?.map((mood, i) => ({
    mood,
    index: i,
  })) || [];

  // Tools status from cache tells us what's completed
  const toolsStatus = cache.toolsStatus;

  // For detailed data not in cache, fetch only what's needed
  let swot = null;
  let crencas: Array<any> = [];
  let autoavaliacao = null;
  let habilidades: Array<any> = [];
  let eisenhower = null;
  let vvdParagraph = "";
  let fullVvd = "";
  let fullValores: string[] = valores;
  let fullAreasVida: Array<any> = [];

  if (userId) {
    // Fetch detailed data in parallel (only the fields not in cache)
    const [
      vvdResult,
      valoresResult,
      areasResult,
      swotResult,
      crencasResult,
      autoResult,
      habResult,
      swResult,
      eisenResult,
    ] = await Promise.all([
      supabase.from('user_vvd').select('vvd_paragraph, vvd_sentence').eq('user_id', userId).maybeSingle(),
      supabase.from('user_valores').select('valores').eq('user_id', userId).maybeSingle(),
      supabase.from('user_life_areas').select('*').eq('user_id', userId),
      toolsStatus.swot?.completed 
        ? supabase.from('user_swot').select('strengths, weaknesses, opportunities, threats').eq('user_id', userId).maybeSingle()
        : Promise.resolve({ data: null }),
      toolsStatus.crencas?.completed
        ? supabase.from('user_beliefs').select('limiting_belief, new_belief, transformation_answers').eq('user_id', userId)
        : Promise.resolve({ data: [] }),
      toolsStatus.autoavaliacao?.completed
        ? supabase.from('user_self_assessment').select('ai_analysis, feedback_360').eq('user_id', userId).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from('user_skills').select('skill_name, category').eq('user_id', userId),
      supabase.from('user_strengths_weaknesses').select('type, texto').eq('user_id', userId),
      toolsStatus.eisenhower?.completed
        ? supabase.from('user_eisenhower_tasks').select('quadrant, task_text').eq('user_id', userId)
        : Promise.resolve({ data: [] }),
    ]);

    // VVD details
    if (vvdResult.data) {
      vvdParagraph = vvdResult.data.vvd_paragraph || "";
      fullVvd = vvdResult.data.vvd_sentence || "";
    }

    // Full valores list
    if (valoresResult.data?.valores) {
      fullValores = valoresResult.data.valores;
    }

    // Full areas vida
    if (areasResult.data) {
      fullAreasVida = areasResult.data;
    }

    // SWOT
    if (swotResult.data) {
      swot = {
        forcas: swotResult.data.strengths || [],
        fraquezas: swotResult.data.weaknesses || [],
        oportunidades: swotResult.data.opportunities || [],
        ameacas: swotResult.data.threats || [],
      };
    }

    // Beliefs
    if (crencasResult.data) {
      crencas = crencasResult.data;
    }

    // Self assessment
    if (autoResult.data) {
      autoavaliacao = autoResult.data;
    }

    // Skills + Strengths/Weaknesses
    habilidades = habResult.data || [];
    if (swResult.data) {
      habilidades = [
        ...habilidades,
        ...swResult.data.map((h: any) => ({
          skill_name: h.texto,
          category: h.type === 'forte' ? 'strength' : 'weakness',
        })),
      ];
    }

    // Eisenhower
    if (eisenResult.data && eisenResult.data.length > 0) {
      eisenhower = {
        urgente_importante: eisenResult.data.filter((e: any) => e.quadrant === 'urgente_importante').map((e: any) => e.task_text),
        nao_urgente_importante: eisenResult.data.filter((e: any) => e.quadrant === 'nao_urgente_importante').map((e: any) => e.task_text),
        urgente_nao_importante: eisenResult.data.filter((e: any) => e.quadrant === 'urgente_nao_importante').map((e: any) => e.task_text),
        nao_urgente_nao_importante: eisenResult.data.filter((e: any) => e.quadrant === 'nao_urgente_nao_importante').map((e: any) => e.task_text),
      };
    }
  }

  // Stoic responses from localStorage
  let stoicResponses: Array<any> = [];
  try {
    const stoicData = JSON.parse(localStorage.getItem("stoicResponses") || "{}");
    stoicResponses = Object.entries(stoicData)
      .map(([date, response]) => ({ date, response }))
      .slice(-5);
  } catch (e) {
    console.error("Error parsing stoic responses:", e);
  }

  return {
    vvd: fullVvd || vvdSentence,
    vvdParagraph,
    vvdSentence: fullVvd || vvdSentence,
    valores: fullValores,
    areasVida: fullAreasVida.length > 0 ? fullAreasVida : areasVida,
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
    stoicResponses,
  };
}

/**
 * Legacy function - collect data with direct queries
 * Used as fallback when cache is not available
 */
export async function collectInsightData(storage: {
  getVvd: () => Promise<string>;
  getValores: () => Promise<string[]>;
  getAreasVida: () => Promise<any[]>;
  getObjetivos: () => Promise<any[]>;
  getMetas: () => Promise<any[]>;
}): Promise<InsightDataPayload> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Collect from localStorage
  const surveyData = JSON.parse(localStorage.getItem("userSurvey") || "{}");
  const onboardingData = JSON.parse(localStorage.getItem("onboarding") || "{}");

  // Collect from storage service
  const vvd = await storage.getVvd() || "";
  const valores = await storage.getValores() || [];
  const areasVida = await storage.getAreasVida() || [];
  const objetivos = await storage.getObjetivos() || [];
  const metas = await storage.getMetas() || [];

  // Collect VVD paragraph and sentence from Supabase
  let vvdParagraph = "";
  let vvdSentence = "";
  if (userId) {
    const { data: vvdData } = await supabase
      .from('user_vvd')
      .select('vvd_paragraph, vvd_sentence')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (vvdData) {
      vvdParagraph = vvdData.vvd_paragraph || "";
      vvdSentence = vvdData.vvd_sentence || "";
    }
  }

  // Extract all actions from metas
  const acoes: Array<any> = [];
  metas.forEach((meta: any) => {
    if (meta.acoes && Array.isArray(meta.acoes)) {
      acoes.push(...meta.acoes);
    }
  });

  // Collect SWOT from Supabase
  let swot = null;
  if (userId) {
    const { data: swotData } = await supabase
      .from('user_swot')
      .select('strengths, weaknesses, opportunities, threats')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (swotData) {
      swot = {
        forcas: swotData.strengths || [],
        fraquezas: swotData.weaknesses || [],
        oportunidades: swotData.opportunities || [],
        ameacas: swotData.threats || []
      };
    }
  }

  // Collect Crenças from Supabase
  let crencas: Array<any> = [];
  if (userId) {
    const { data: crencasData } = await supabase
      .from('user_beliefs')
      .select('limiting_belief, new_belief, transformation_answers')
      .eq('user_id', userId);
    
    if (crencasData) {
      crencas = crencasData;
    }
  }

  // Collect Autoavaliação from Supabase
  let autoavaliacao = null;
  if (userId) {
    const { data: autoData } = await supabase
      .from('user_self_assessment')
      .select('ai_analysis, feedback_360')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (autoData) {
      autoavaliacao = autoData;
    }
  }

  // Collect Habilidades from Supabase
  let habilidades: Array<any> = [];
  if (userId) {
    const { data: habData } = await supabase
      .from('user_skills')
      .select('skill_name, category')
      .eq('user_id', userId);
    
    if (habData) {
      habilidades = habData;
    }

    // Also get strengths/weaknesses
    const { data: swData } = await supabase
      .from('user_strengths_weaknesses')
      .select('type, texto')
      .eq('user_id', userId);
    
    if (swData) {
      habilidades = [...habilidades, ...swData.map(h => ({
        skill_name: h.texto,
        category: h.type === 'forte' ? 'strength' : 'weakness'
      }))];
    }
  }

  // Collect Diário Recente from Supabase (last 7 entries)
  let diarioRecente: Array<any> = [];
  if (userId) {
    const { data: diarioData } = await supabase
      .from('diary_entries')
      .select('entry_date, mood, conquests, reflections, gratitude')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(7);
    
    if (diarioData) {
      diarioRecente = diarioData;
    }
  }

  // Collect Eisenhower from Supabase
  let eisenhower = null;
  if (userId) {
    const { data: eisenData } = await supabase
      .from('user_eisenhower_tasks')
      .select('quadrant, task_text')
      .eq('user_id', userId);
    
    if (eisenData && eisenData.length > 0) {
      eisenhower = {
        urgente_importante: eisenData.filter(e => e.quadrant === 'urgente_importante').map(e => e.task_text),
        nao_urgente_importante: eisenData.filter(e => e.quadrant === 'nao_urgente_importante').map(e => e.task_text),
        urgente_nao_importante: eisenData.filter(e => e.quadrant === 'urgente_nao_importante').map(e => e.task_text),
        nao_urgente_nao_importante: eisenData.filter(e => e.quadrant === 'nao_urgente_nao_importante').map(e => e.task_text)
      };
    }
  }

  // Collect Stoic Responses from localStorage (recent ones)
  let stoicResponses: Array<any> = [];
  try {
    const stoicData = JSON.parse(localStorage.getItem("stoicResponses") || "{}");
    stoicResponses = Object.entries(stoicData)
      .map(([date, response]) => ({ date, response }))
      .slice(-5);
  } catch (e) {
    console.error("Error parsing stoic responses:", e);
  }

  return {
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
  };
}
