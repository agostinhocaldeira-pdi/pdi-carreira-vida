import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import JornadaUpgradeModal from "@/components/jornada/JornadaUpgradeModal";

interface Props {
  stepId: string;
  onContinue: (evaluationText?: string) => void;
  hasEvaluated?: boolean;
}

/**
 * Avaliação de IA na Jornada.
 * Ao clicar "Ver avaliação", abre modal com 3 opções de pagamento
 * (PDI Básico R$67, PDI Smart R$47, Avulso R$10).
 * Não há uso gratuito — sempre exige pagamento.
 */

const mockEvaluations: Record<string, string> = {
  vvd: "Você mostrou clareza ao descrever o que quer mudar — isso é ótimo! Suas respostas mostram que você sabe onde dói, e isso é o primeiro passo pra mudar de verdade. Tente ser ainda mais específico: ao invés de 'quero melhorar', pense 'quero fazer X até tal data'. Quanto mais detalhado, mais fácil fica transformar sonho em plano.",
  "vida-nao-quero": "Parabéns por ter coragem de olhar pro futuro que você NÃO quer! A maioria das pessoas evita isso. Perceba: os hábitos que te levam pra essa vida ruim são os mesmos que você faz TODO DIA. A mudança começa quando você troca UM hábito pequeno por dia. Comece pelo mais fácil.",
  "auto-reflexao": "Seus valores e sua Roda da Vida contam uma história. Perceba se suas notas baixas estão nas áreas que mais importam pra você — se sim, é ali que está o maior potencial de melhoria. Sua crença limitante pode estar te travando justamente nas áreas que você mais valoriza. Reconhecer isso já é metade do caminho.",
  smart: "Sua meta está conectada com tudo que você descreveu nas etapas anteriores — isso mostra consistência. Você não criou uma meta solta, mas sim uma que nasce da sua reflexão profunda. Cuide para que seus sabotadores não virem desculpas. A estratégia anti-sabotagem que você criou é sua armadura — use todos os dias. A distância entre quem você é e quem quer ser se chama AÇÃO.",
};

export default function JornadaAIEvaluation({ stepId, onContinue, hasEvaluated }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const evaluation = mockEvaluations[stepId] || "Avaliação não disponível.";

  const handleReveal = () => {
    // Always show upgrade modal — AI evaluation requires payment
    setShowUpgradeModal(true);
  };

  if (!revealed) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button
            onClick={handleReveal}
            className="w-full h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200 gap-2"
          >
            <Brain className="w-5 h-5" />
            Ver avaliação da IA
          </Button>
          <Button
            onClick={() => onContinue()}
            variant="outline"
            className="w-full h-10 text-sm gap-2"
          >
            Continuar sem avaliação
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <JornadaUpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          title="Avaliação de IA"
          description="A avaliação personalizada da IA está disponível para assinantes ou mediante pagamento avulso."
        />
      </>
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
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{evaluation}</p>
      </div>

      <Button
        onClick={() => onContinue(evaluation)}
        className="w-full h-12 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-200 gap-2"
      >
        Continuar Jornada
        <ChevronRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
}
