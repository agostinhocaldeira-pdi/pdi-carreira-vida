/**
 * Hook central para gerenciar o estado do sistema PDI
 * Determina se o usuário está em modo "Iniciação" ou "Operacional"
 */

import { useMemo } from 'react';
import { usePDIData } from './usePDIQueries';

interface SystemState {
  // Estado principal: usuário completou a Base Pessoal?
  hasCompletedBase: boolean;
  
  // Estados detalhados de cada passo
  step1Done: boolean; // Base Pessoal (VVD + Valores + Roda da Vida)
  step2Done: boolean; // Direção & Objetivos
  step3Done: boolean; // Plano de Execução
  
  // Progresso do passo 1 (0-100)
  baseProgress: number;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Calcula o progresso da Base Pessoal (Passo 1)
 * Critérios: VVD preenchido + Valores definidos + Roda da Vida completa
 */
function calculateBaseProgress(
  vvd: string,
  valores: string[],
  areasVida: any[]
): number {
  let count = 0;
  
  // VVD preenchido
  if (vvd && vvd.trim()) count++;
  
  // Valores definidos (pelo menos um valor não vazio)
  const isValoresComplete = valores.some((v: string) => String(v).trim() !== "");
  if (isValoresComplete) count++;
  
  // Roda da Vida completa (todas as áreas com notas)
  const isAreasComplete =
    areasVida.length > 0 &&
    areasVida.every((area: any) => {
      const notaAtual = area?.notaAtual ?? area?.nota_atual;
      const notaDesejada = area?.notaDesejada ?? area?.nota_desejada;
      return (
        String(notaAtual ?? "").trim() !== "" &&
        String(notaDesejada ?? "").trim() !== ""
      );
    });
  if (isAreasComplete) count++;
  
  return Math.round((count / 3) * 100);
}

/**
 * Hook principal para estado do sistema
 * Usado para determinar qual versão da Home renderizar
 */
export function useSystemState(): SystemState {
  const { data: pdiData, isLoading } = usePDIData();
  
  const state = useMemo(() => {
    const vvd = pdiData?.vvd || "";
    const valores = pdiData?.valores || [];
    const areasVida = pdiData?.areasVida || [];
    const objetivos = pdiData?.objetivos || [];
    const metas = pdiData?.metas || [];
    
    // Calcular progresso da Base Pessoal
    const baseProgress = calculateBaseProgress(vvd, valores, areasVida);
    
    // Step 1: Base Pessoal completa (100%)
    const step1Done = baseProgress === 100;
    
    // Step 2: Direção & Objetivos (pelo menos um objetivo)
    const step2Done = objetivos.length > 0;
    
    // Step 3: Plano de Execução (pelo menos uma meta)
    const step3Done = metas.length > 0;
    
    return {
      hasCompletedBase: step1Done,
      step1Done,
      step2Done,
      step3Done,
      baseProgress,
      isLoading,
    };
  }, [pdiData, isLoading]);
  
  return state;
}
