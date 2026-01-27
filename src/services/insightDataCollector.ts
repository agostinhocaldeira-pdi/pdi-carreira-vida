/**
 * Service to collect all user data for comprehensive insight generation
 * This is a standalone function that can be called from any component
 */

import { supabase } from "@/integrations/supabase/client";

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
