import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  stepId: string;
  onContinue: () => void;
}

/**
 * REGRA DE AVALIAÇÃO IA — Etapa 3 (Auto Reflexão)
 * 
 * A IA deve cruzar TODAS as informações coletadas até aqui:
 * - Etapa 1: Vida dos Sonhos (VVD) — como o aluno imagina sua vida ideal
 * - Etapa 2: Vida que NÃO quero viver — o que acontece se nada mudar
 * - Valores pessoais — os 3-5 valores escolhidos pelo aluno
 * - Roda da Vida — notas de 0-10 em 8 áreas da vida
 * - Crenças Limitantes — crenças identificadas e suas origens
 * 
 * A avaliação deve buscar DUAS coisas:
 * 
 * 1. COERÊNCIA: O que é consistente entre todas as etapas.
 *    Ex: Se o aluno valoriza "Família" e na Vida dos Sonhos descreve 
 *    momentos com a família, isso é coerente. Reconheça e valide.
 * 
 * 2. PONTOS CEGOS / INCOERÊNCIAS: O que não faz sentido quando cruzado.
 *    Ex: O aluno diz que "Família" é o valor mais importante, mas sua 
 *    Vida dos Sonhos foca em viajar sozinho pelo mundo — isso é incoerente.
 *    Ex: Aluno tem nota baixa em Saúde na Roda da Vida, mas não menciona 
 *    saúde na Vida que NÃO quer viver — ponto cego.
 *    Ex: Crença limitante contradiz diretamente um valor escolhido.
 *    Aponte com empatia, sem julgamento, mostrando a contradição.
 * 
 * Tom: direto, empático, linguagem simples (nível 14 anos).
 * Formato: primeiro as coerências (validação), depois os pontos cegos (provocação construtiva).
 */

/**
 * REGRA DE AVALIAÇÃO IA — Etapa SMART (Avaliação Final)
 * 
 * Esta é a ÚLTIMA avaliação de IA da jornada. Ela aparece na tela final (JornadaFinal),
 * APÓS a seção "Sua Meta SMART + Primeira Ação".
 * 
 * A IA deve fazer DUAS coisas nesta avaliação:
 * 
 * PARTE 1 — AVALIAÇÃO DA META SMART:
 * Avaliar a construção da meta dentro da metodologia SMART:
 * - A meta é realmente Específica? Está clara e sem ambiguidade?
 * - A mensuração (M) é objetiva? Dá pra medir com números?
 * - É Alcançável dado o contexto atual do aluno?
 * - É Relevante para a vida que ele descreveu querer?
 * - O prazo Temporal é realista?
 * - A Primeira Ação está concreta o suficiente?
 * - O Dia/Hora agendado é realista?
 * Avaliar também as respostas extras da etapa SMART expandida:
 * - Aprendizado necessário, Sabotadores identificados, Estratégia anti-sabotagem
 * 
 * PARTE 2 — CRUZAMENTO COM TODAS AS AVALIAÇÕES ANTERIORES:
 * Consolidar e cruzar com TODAS as avaliações de IA feitas nas etapas anteriores:
 * - Etapa 1 (VVD): A meta SMART está conectada à Vida dos Sonhos?
 * - Etapa 2 (Vida que NÃO quero): A meta ajuda a evitar o cenário indesejado?
 * - Etapa 3 (Auto Reflexão — Valores, Roda da Vida, Crenças):
 *   - A meta respeita os valores do aluno?
 *   - A meta ataca áreas fracas da Roda da Vida ou fortalece as fortes?
 *   - Os sabotadores identificados na SMART batem com as crenças limitantes?
 * 
 * FORMATO DO FEEDBACK FINAL:
 * 1. ✅ O que foi BOM: reconhecer o esforço, validar coerências entre etapas
 * 2. 🎯 O que o aluno vai TIRAR DE PROVEITO: benefícios concretos dos exercícios feitos
 * 3. ⚠️ PONTOS DE ATENÇÃO: riscos, contradições, pontos cegos que merecem cuidado
 * 
 * Tom: direto, empático, linguagem simples (nível 14 anos).
 * Esta avaliação é o "fechamento" da jornada — deve ser inspiradora mas honesta.
 */

const mockEvaluations: Record<string, string> = {
  "auto-reflexao":
    "✅ Coerências: Seus valores de Família e Crescimento estão alinhados com sua Vida dos Sonhos — você quer evoluir sem abrir mão de quem ama. Sua nota alta em Carreira na Roda da Vida confirma que você já está investindo no seu desenvolvimento. A Vida que você NÃO quer viver reforça esse compromisso: você tem clareza do que quer evitar.\n\n⚠️ Pontos Cegos: Você escolheu 'Saúde' como valor, mas sua nota na Roda da Vida nessa área é 4 — existe uma distância entre o que você diz valorizar e como está vivendo. Além disso, sua crença limitante ('não sou bom o suficiente') pode estar sabotando justamente as áreas que você mais quer desenvolver. Perceber essa contradição já é o primeiro passo para mudar.",
  vvd:
    "Sua Vida dos Sonhos revela um desejo forte por autonomia e propósito — totalmente coerente com seus valores de Liberdade e Crescimento. Porém, note que suas respostas focam muito no 'ter' e pouco no 'ser': descrever quem você quer se tornar (não só o que quer conquistar) vai tornar sua visão mais poderosa e sustentável.",
  smart:
    "Sua meta SMART está bem estruturada e conectada com sua Vida dos Sonhos — parabéns pela coerência! O prazo é realista e a mensuração está clara. Um ponto cego: sua meta foca em uma área que já está forte na Roda da Vida. Considere se uma meta nas áreas mais fracas (Saúde ou Lazer) não traria um impacto maior na sua satisfação geral. Lembre-se: o PDI mais eficaz equilibra ambição profissional com bem-estar pessoal.",
};

export default function JornadaAIEvaluation({ stepId, onContinue }: Props) {
  const [revealed, setRevealed] = useState(false);
  const evaluation = mockEvaluations[stepId] || "Avaliação não disponível.";

  if (!revealed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button
          onClick={() => setRevealed(true)}
          className="w-full h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200 gap-2"
        >
          <Brain className="w-5 h-5" />
          Ver avaliação
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Avaliação do Mentor IA</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{evaluation}</p>
      </div>

      <Button
        onClick={onContinue}
        className="w-full h-12 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-200 gap-2"
      >
        Continuar Jornada
        <ChevronRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}
