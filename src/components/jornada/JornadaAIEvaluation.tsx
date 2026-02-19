import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Sparkles, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  stepId: string;
  onContinue: (evaluationText?: string) => void;
  hasEvaluated?: boolean;
}

/**
 * REGRAS DE AVALIAÇÃO IA
 * 
 * Cada avaliação deve ser concisa, simples, como se explicasse para uma criança de 14 anos.
 * 
 * Etapa VVD: Avaliar clareza da visão e especificidade das mudanças desejadas.
 * Etapa Vida Não Quero: Avaliar consciência dos padrões negativos e motivação para mudar.
 * Etapa Auto Reflexão: Cruzar valores + roda da vida + crenças, identificar coerências e pontos cegos.
 * Etapa SMART (última): Usar TODAS as respostas de TODAS as etapas anteriores + avaliações anteriores
 *   para fazer uma análise robusta e profunda da meta SMART criada.
 * 
 * LIMITE: Cada botão permite UMA ÚNICA avaliação gratuita.
 * Segunda tentativa → popup de compra avulsa R$ 10,00.
 */

const mockEvaluations: Record<string, string> = {
  vvd: "Você mostrou clareza ao descrever o que quer mudar — isso é ótimo! Suas respostas mostram que você sabe onde dói, e isso é o primeiro passo pra mudar de verdade. Tente ser ainda mais específico: ao invés de 'quero melhorar', pense 'quero fazer X até tal data'. Quanto mais detalhado, mais fácil fica transformar sonho em plano.",
  "vida-nao-quero": "Parabéns por ter coragem de olhar pro futuro que você NÃO quer! A maioria das pessoas evita isso. Perceba: os hábitos que te levam pra essa vida ruim são os mesmos que você faz TODO DIA. A mudança começa quando você troca UM hábito pequeno por dia. Comece pelo mais fácil.",
  "auto-reflexao": "Seus valores e sua Roda da Vida contam uma história. Perceba se suas notas baixas estão nas áreas que mais importam pra você — se sim, é ali que está o maior potencial de melhoria. Sua crença limitante pode estar te travando justamente nas áreas que você mais valoriza. Reconhecer isso já é metade do caminho.",
  smart: "Sua meta está conectada com tudo que você descreveu nas etapas anteriores — isso mostra consistência. Você não criou uma meta solta, mas sim uma que nasce da sua reflexão profunda. Cuide para que seus sabotadores não virem desculpas. A estratégia anti-sabotagem que você criou é sua armadura — use todos os dias. A distância entre quem você é e quem quer ser se chama AÇÃO.",
};

export default function JornadaAIEvaluation({ stepId, onContinue, hasEvaluated }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const evaluation = mockEvaluations[stepId] || "Avaliação não disponível.";

  const handleReveal = () => {
    if (hasEvaluated) {
      setShowPurchaseModal(true);
    } else {
      setRevealed(true);
    }
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
            Ver avaliação
          </Button>
        </motion.div>

        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <DialogTitle className="text-center text-xl">
                Avaliação já realizada
              </DialogTitle>
              <DialogDescription className="text-center space-y-3 pt-2">
                <p>Você já utilizou sua avaliação gratuita nesta etapa.</p>
                <p>Para gerar uma nova avaliação com a IA, adquira um uso adicional.</p>
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 rounded-lg bg-muted/50 p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">R$ 10,00</div>
              <div className="text-sm text-muted-foreground mt-1">Pagamento único • Uso imediato</div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                <CreditCard className="h-4 w-4" />
                Comprar Avaliação Adicional
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="w-full gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
