import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Play, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const smartSteps = [
  {
    letter: "S",
    title: "Específica",
    question: "O que exatamente você quer alcançar?",
    placeholder: "Ex: Ler 12 livros de desenvolvimento pessoal este ano",
    emoji: "🎯",
    color: "from-red-400 to-red-600",
    hint: "Seja claro e detalhado. Evite metas vagas como 'melhorar'.",
  },
  {
    letter: "M",
    title: "Mensurável",
    question: "Como vai medir seu progresso?",
    placeholder: "Ex: 1 livro por mês, anotando os aprendizados",
    emoji: "📏",
    color: "from-orange-400 to-orange-600",
    hint: "Defina números, frequências ou indicadores concretos.",
  },
  {
    letter: "A",
    title: "Alcançável",
    question: "Por que essa meta é realista pra você?",
    placeholder: "Ex: Já tenho hábito de leitura, vou dedicar 30min/dia",
    emoji: "💪",
    color: "from-yellow-400 to-amber-600",
    hint: "Considere seu tempo, recursos e capacidade atuais.",
  },
  {
    letter: "R",
    title: "Relevante",
    question: "Por que essa meta importa pra sua vida?",
    placeholder: "Ex: Quero crescer profissionalmente e tomar decisões melhores",
    emoji: "❤️",
    color: "from-green-400 to-emerald-600",
    hint: "Conecte com seus valores e sua vida dos sonhos.",
  },
  {
    letter: "T",
    title: "Temporal",
    question: "Qual é o prazo?",
    placeholder: "Ex: Até 31 de dezembro de 2026",
    emoji: "⏰",
    color: "from-blue-400 to-blue-600",
    hint: "Defina uma data concreta. Prazos criam urgência.",
  },
];

export default function JornadaSmart({ onComplete, onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(smartSteps.map(() => ""));

  const step = smartSteps[currentIdx];
  const allAnswered = answers.every((a) => a.trim().length > 5);

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm font-medium text-orange-600">Etapa 4 de 4</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video bg-gradient-to-br from-orange-200 to-amber-300 rounded-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-orange-600 ml-1" />
          </div>
          <span className="absolute bottom-3 left-3 text-white/80 text-xs font-medium">
            1 min • Como criar metas que funcionam
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Meta SMART 🚀
          </h2>
          <p className="text-sm text-slate-500">
            Construa uma meta real, passo a passo, letra por letra.
          </p>
        </motion.div>

        {/* SMART letters nav */}
        <div className="flex gap-2 justify-center">
          {smartSteps.map((s, i) => (
            <button
              key={s.letter}
              onClick={() => setCurrentIdx(i)}
              className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
                currentIdx === i
                  ? `bg-gradient-to-br ${s.color} text-white scale-110 shadow-lg`
                  : answers[i].trim().length > 5
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {s.letter}
            </button>
          ))}
        </div>

        {/* Current SMART step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-4"
          >
            {/* Video for this letter */}
            <div className="bg-white/60 rounded-xl p-3 flex items-center gap-3 border border-orange-100 cursor-pointer hover:bg-white/80 transition-colors">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">Vídeo: {step.letter} — {step.title}</p>
                <p className="text-[10px] text-slate-400">30 seg</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-black`}>
                  {step.letter}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.emoji} {step.question}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 border border-slate-100">
                💡 {step.hint}
              </div>

              <Textarea
                placeholder={step.placeholder}
                value={answers[currentIdx]}
                onChange={(e) => updateAnswer(e.target.value)}
                className="min-h-[100px] resize-none border-orange-200 focus:border-orange-400"
              />
            </div>

            {/* Next button */}
            {currentIdx < 4 ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setCurrentIdx(currentIdx + 1)}
                disabled={answers[currentIdx].trim().length < 5}
              >
                Próxima letra <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Complete */}
        <motion.div animate={{ opacity: allAnswered ? 1 : 0.4 }} className="pt-2">
          <Button
            className="w-full h-12 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200"
            disabled={!allAnswered}
            onClick={onComplete}
          >
            <Target className="w-5 h-5 mr-2" />
            Concluir Meta SMART
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
