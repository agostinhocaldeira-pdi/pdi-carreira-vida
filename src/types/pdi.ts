// Types for PDI data structures - ready for Supabase migration

export interface DiarioEntry {
  id: string;
  user_id?: string;
  data: string;
  humor: string;
  reflexao: string;
  conquistas: string;
  habitos: string[];
  gratidao: string;
  created_at?: string;
  updated_at?: string;
}

export interface Objetivo {
  id: number;
  user_id?: string;
  texto: string;
  data_alvo?: string;
  conexao_vvd?: string;
  status: 'a-fazer' | 'pendente' | 'em-andamento' | 'concluido';
  created_at?: string;
  updated_at?: string;
}

export interface Acao {
  id: number;
  acao: string;
  periodicidade: string;
  status: 'a-fazer' | 'pendente' | 'em-andamento' | 'concluido';
}

export interface Passo {
  id: number;
  passo: string;
}

export interface Meta {
  id: number;
  user_id?: string;
  objetivo_id: string;
  objetivoId?: string; // camelCase alias for compatibility
  texto: string;
  data_alvo: string;
  dataAlvo?: string; // camelCase alias for compatibility
  medicao?: string;
  inicio?: string;
  concluida: boolean;
  acoes: Acao[];
  passos: Passo[];
  from_smart?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AreaVida {
  id: number;
  area: string;
  nota_atual: number;
  nota_desejada: number;
}

export interface Valor {
  id: number;
  valor: string;
}

export interface Habilidade {
  id: number;
  tipo: 'forte' | 'fraco';
  texto: string;
}

export interface UserInsight {
  user_id?: string;
  insight: string;
  last_generated: string;
}

// Tool data types
export interface SwotAnalysis {
  user_id?: string;
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Autoavaliacao360 {
  user_id?: string;
  answers: Record<string, string>;
  responses_360: string;
  ai_analysis: string;
  last_used: string;
  history: Array<{
    date: string;
    responses: string;
  }>;
}

export interface CrencaTrabalho {
  id: number;
  user_id?: string;
  crenca_limitante: string;
  nova_crenca: string;
  reflexoes: Record<string, string>;
  created_at?: string;
}

export interface EisenhowerTasks {
  user_id?: string;
  urgente_importante: string[];
  nao_urgente_importante: string[];
  urgente_nao_importante: string[];
  nao_urgente_nao_importante: string[];
}

export interface SatisfactionSurvey {
  id: string;
  user_id?: string;
  user_email: string;
  section: string;
  type: 'csat' | 'ces';
  score: number;
  feedback?: string;
  created_at: string;
}

export interface Administrator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_primary?: boolean;
  created_at?: string;
}
