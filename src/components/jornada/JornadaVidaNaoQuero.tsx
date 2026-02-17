import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import JornadaAIEvaluation from "./JornadaAIEvaluation";

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const prompts = [
  {
    question: "Se você continuar fazendo tudo exatamente igual ao que faz hoje, como será sua vida daqui a 10 anos?",
    emoji: "⏳",
    hint: "Pense em saúde, carreira, dinheiro, relacionamentos... Seja honesto.",
  },
  {
    question: "O que mais te assusta nessa projeção? O que você não quer de jeito nenhum?",
    emoji: "😰",
    hint: "Identifique o que te causa desconforto ao imaginar esse futuro.",
  },
  {
    question: "Que hábitos ou comportamentos de hoje estão te levando para essa vida que você NÃO quer?",
    emoji: "🔗",
    hint: "Quais padrões você repete que te afastam da vida que deseja?",
  },
];

export default function JornadaVidaNaoQuero({ onComplete, onBack }: Props) {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentPrompt] = value;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((a) => a.trim().length > 10);
  const prompt = prompts[currentPrompt];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm font-medium text-red-600">Etapa 2 de 4</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video bg-gradient-to-br from-red-200 to-orange-300 rounded-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-red-600 ml-1" />
          </div>
          <span className="absolute bottom-3 left-3 text-white/80 text-xs font-medium">
            1 min • A vida que você NÃO quer
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Vida que eu NÃO quero 🚫
          </h2>
          <p className="text-sm text-slate-500">
            Às vezes, saber o que NÃO queremos é o primeiro passo para mudar de verdade.
          </p>
        </motion.div>

        {/* Prompt navigation */}
        <div className="flex gap-2 justify-center">
          {prompts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPrompt(i)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                currentPrompt === i
                  ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-200"
                  : answers[i].trim().length > 10
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {answers[i].trim().length > 10 ? "✓" : i + 1}
            </button>
          ))}
        </div>

        {/* Current prompt */}
        <motion.div
          key={currentPrompt}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-5 border-2 border-red-100 shadow-sm">
            <div className="text-center mb-4">
              <span className="text-4xl">{prompt.emoji}</span>
              <p className="text-lg font-semibold text-slate-800 mt-2">
                {prompt.question}
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-3 text-xs text-slate-500 border border-red-100 mb-3">
              💡 {prompt.hint}
            </div>

            <Textarea
              placeholder="Escreva sem filtros... essa reflexão é só sua 🔒"
              value={answers[currentPrompt]}
              onChange={(e) => updateAnswer(e.target.value)}
              className="min-h-[120px] resize-none border-red-200 focus:border-red-400"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {answers[currentPrompt].length} caracteres
            </p>
          </div>

          {currentPrompt < 2 ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setCurrentPrompt(currentPrompt + 1)}
              disabled={answers[currentPrompt].trim().length < 10}
            >
              Próxima pergunta →
            </Button>
          ) : null}
        </motion.div>

        {/* Complete */}
        {showEvaluation ? (
          <JornadaAIEvaluation stepId="vida-nao-quero" onContinue={onComplete} />
        ) : (
          <motion.div animate={{ opacity: allAnswered ? 1 : 0.4 }}>
            <Button
              className="w-full h-12 text-base bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-200"
              disabled={!allAnswered}
              onClick={() => setShowEvaluation(true)}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Concluir Reflexão
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
