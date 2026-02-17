import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Play, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import JornadaAIEvaluation from "./JornadaAIEvaluation";

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const areas = [
  { name: "Saúde", emoji: "💪", color: "from-green-400 to-emerald-500" },
  { name: "Carreira", emoji: "💼", color: "from-blue-400 to-blue-600" },
  { name: "Finanças", emoji: "💰", color: "from-yellow-400 to-amber-500" },
  { name: "Relacionamentos", emoji: "❤️", color: "from-pink-400 to-rose-500" },
  { name: "Família", emoji: "🏠", color: "from-orange-400 to-orange-500" },
  { name: "Desenvolvimento", emoji: "📚", color: "from-purple-400 to-violet-500" },
  { name: "Lazer", emoji: "🎮", color: "from-cyan-400 to-teal-500" },
  { name: "Espiritualidade", emoji: "🙏", color: "from-indigo-400 to-indigo-600" },
];

type Phase = "roda" | "crencas" | "evaluation";

export default function JornadaAutoReflexao({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("roda");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(areas.map((a) => [a.name, 5]))
  );
  const [activeArea, setActiveArea] = useState<string | null>(null);

  // Crenças
  const [crencas, setCrencas] = useState(["", "", ""]);

  const updateScore = (name: string, value: number) => {
    setScores((prev) => ({ ...prev, [name]: value }));
  };

  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / areas.length;
  const allCrencasAnswered = crencas.every((c) => c.trim().length > 5);

  if (phase === "evaluation") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPhase("crencas")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <span className="text-sm font-medium text-blue-600">Etapa 4 de 5</span>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6">
          <JornadaAIEvaluation stepId="auto-reflexao" onContinue={onComplete} />
        </div>
      </div>
    );
  }

  if (phase === "crencas") {
    const crencasPrompts = [
      { question: "Qual crença sobre você mesmo mais te limita hoje?", emoji: "🔒", hint: "Ex: 'Eu não sou bom o suficiente', 'Eu não mereço sucesso'..." },
      { question: "De onde essa crença veio? Quem ou o que te fez acreditar nisso?", emoji: "🧩", hint: "Família, escola, experiência passada, comparação..." },
      { question: "Se essa crença NÃO existisse, o que você faria de diferente na sua vida?", emoji: "🦋", hint: "Imagine-se livre dessa limitação. O que muda?" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPhase("roda")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <span className="text-sm font-medium text-blue-600">Etapa 4 de 5 — Crenças</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              Crenças Limitantes 🔓
            </h2>
            <p className="text-sm text-slate-500">
              Identifique o que te prende para poder se libertar.
            </p>
          </motion.div>

          <div className="space-y-4">
            {crencasPrompts.map((prompt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{prompt.emoji}</span>
                  <p className="text-sm font-semibold text-slate-800">{prompt.question}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-xs text-slate-500 border border-blue-100">
                  💡 {prompt.hint}
                </div>
                <Textarea
                  placeholder="Escreva aqui..."
                  value={crencas[i]}
                  onChange={(e) => {
                    const updated = [...crencas];
                    updated[i] = e.target.value;
                    setCrencas(updated);
                  }}
                  className="min-h-[80px] resize-none border-blue-200 focus:border-blue-400"
                />
              </motion.div>
            ))}
          </div>

          <motion.div animate={{ opacity: allCrencasAnswered ? 1 : 0.4 }}>
            <Button
              className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-200"
              disabled={!allCrencasAnswered}
              onClick={() => setPhase("evaluation")}
            >
              <Check className="w-5 h-5 mr-2" />
              Concluir Auto Reflexão
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Phase: roda
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm font-medium text-blue-600">Etapa 4 de 5 — Roda da Vida</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video bg-gradient-to-br from-blue-200 to-cyan-300 rounded-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-blue-600 ml-1" />
          </div>
          <span className="absolute bottom-3 left-3 text-white/80 text-xs font-medium">
            1 min • Como avaliar sua vida
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Roda da Vida 🎯
          </h2>
          <p className="text-sm text-slate-500">
            Quanto você está feliz em cada área da sua vida?
            <br />
            Dê uma nota de 0 a 10, sendo 0 = totalmente infeliz e 10 = totalmente feliz.
          </p>
          <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Média: {avgScore.toFixed(1)} ⭐
          </div>
        </motion.div>

        {/* Areas */}
        <div className="space-y-3">
          {areas.map((area, index) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                activeArea === area.name
                  ? "border-blue-300 bg-white shadow-md"
                  : "border-slate-100 bg-white/50"
              }`}
              onClick={() => setActiveArea(area.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{area.emoji}</span>
                  <span className="font-medium text-slate-700 text-sm">{area.name}</span>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${area.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {scores[area.name]}
                </div>
              </div>
              <Slider
                value={[scores[area.name]]}
                onValueChange={(v) => updateScore(area.name, v[0])}
                min={0}
                max={10}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Péssimo</span>
                <span>Excelente</span>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-200"
          onClick={() => setPhase("crencas")}
        >
          Avançar para Crenças <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
