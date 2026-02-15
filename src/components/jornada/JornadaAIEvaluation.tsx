import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  stepId: string;
  onContinue: () => void;
}

const mockEvaluations: Record<string, string> = {
  valores:
    "Seus valores mostram uma forte orientação para conexões humanas e crescimento pessoal — isso é uma base sólida. Um ponto de atenção: valores como 'Liberdade' e 'Segurança' podem parecer opostos na prática, e reconhecer essa tensão será importante para tomar decisões alinhadas no futuro. No geral, você tem clareza sobre o que importa, o que já te coloca à frente da maioria.",
  "roda-da-vida":
    "Cruzando seus valores com a Roda da Vida, percebo que áreas como Saúde e Lazer estão abaixo da média, apesar de 'Família' e 'Liberdade' serem valores centrais para você — isso pode indicar que você está negligenciando o autocuidado em nome de outras prioridades. Sua nota alta em Carreira mostra foco, mas cuidado: sem equilíbrio, o burnout pode comprometer tudo. Ação sugerida: eleve pelo menos uma área pessoal antes de avançar.",
  vvd:
    "Sua Vida dos Sonhos revela um desejo forte por autonomia e propósito — totalmente coerente com seus valores de Liberdade e Crescimento. Porém, note que suas respostas focam muito no 'ter' e pouco no 'ser': descrever quem você quer se tornar (não só o que quer conquistar) vai tornar sua visão mais poderosa e sustentável. As áreas mais fracas da sua Roda da Vida também não aparecem na sua visão — integrar saúde e lazer no seu sonho é essencial.",
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
          Ver Avaliação da IA
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
