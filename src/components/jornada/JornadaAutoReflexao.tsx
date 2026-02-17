import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Play, ChevronRight, Heart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import JornadaAIEvaluation from "./JornadaAIEvaluation";

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const suggestedValues = [
  "Família", "Liberdade", "Saúde", "Honestidade", "Crescimento",
  "Amor", "Segurança", "Criatividade", "Respeito", "Coragem",
  "Empatia", "Justiça", "Fé", "Diversão", "Gratidão",
  "Disciplina", "Lealdade", "Generosidade",
];

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

type Phase = "valores" | "roda" | "crencas" | "evaluation";

export default function JornadaAutoReflexao({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("valores");

  // Valores
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");

  // Roda da Vida
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(areas.map((a) => [a.name, 5]))
  );
  const [activeArea, setActiveArea] = useState<string | null>(null);

  // Crenças
  const [crencas, setCrencas] = useState(["", "", ""]);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const addCustom = () => {
    if (customValue.trim() && selectedValues.length < 5) {
      setSelectedValues([...selectedValues, customValue.trim()]);
      setCustomValue("");
    }
  };

  const updateScore = (name: string, value: number) => {
    setScores((prev) => ({ ...prev, [name]: value }));
  };

  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / areas.length;
  const allCrencasAnswered = crencas.every((c) => c.trim().length > 5);

  const stepLabel = "Etapa 3 de 4";

  // ── EVALUATION ──
  if (phase === "evaluation") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPhase("crencas")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <span className="text-sm font-medium text-blue-600">{stepLabel}</span>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6">
          <JornadaAIEvaluation stepId="auto-reflexao" onContinue={onComplete} />
        </div>
      </div>
    );
  }

  // ── CRENÇAS ──
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
            <span className="text-sm font-medium text-blue-600">{stepLabel} — Crenças</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Crenças Limitantes 🔓</h2>
            <p className="text-sm text-slate-500">Identifique o que te prende para poder se libertar.</p>
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

  // ── RODA DA VIDA ──
  if (phase === "roda") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setPhase("valores")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <span className="text-sm font-medium text-blue-600">{stepLabel} — Roda da Vida</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Roda da Vida 🎯</h2>
            <p className="text-sm text-slate-500">
              Quanto você está feliz em cada área da sua vida?<br />
              Dê uma nota de 0 a 10, sendo 0 = totalmente infeliz e 10 = totalmente feliz.
            </p>
            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Média: {avgScore.toFixed(1)} ⭐
            </div>
          </motion.div>

          <div className="space-y-3">
            {areas.map((area, index) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeArea === area.name ? "border-blue-300 bg-white shadow-md" : "border-slate-100 bg-white/50"
                }`}
                onClick={() => setActiveArea(area.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{area.emoji}</span>
                    <span className="font-medium text-slate-700 text-sm">{area.name}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${area.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {scores[area.name]}
                  </div>
                </div>
                <Slider value={[scores[area.name]]} onValueChange={(v) => updateScore(area.name, v[0])} min={0} max={10} step={1} className="cursor-pointer" />
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

  // ── VALORES (phase === "valores") ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm font-medium text-pink-600">{stepLabel} — Valores</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video bg-gradient-to-br from-pink-200 to-rose-300 rounded-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-pink-600 ml-1" />
          </div>
          <span className="absolute bottom-3 left-3 text-white/80 text-xs font-medium">
            1 min • O que são valores pessoais?
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Escolha seus 5 valores 💎</h2>
          <p className="text-sm text-slate-500">Valores são a bússola da sua vida. Escolha os 5 que mais representam quem você é, ou inclua manualmente digitando no campo abaixo.</p>
          <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            {selectedValues.length}/5 selecionados
          </div>
        </motion.div>

        {selectedValues.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 justify-center">
            {selectedValues.map((v) => (
              <Badge key={v} variant="default" className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 text-sm cursor-pointer gap-1" onClick={() => toggleValue(v)}>
                {v} <X className="w-3 h-3" />
              </Badge>
            ))}
          </motion.div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Adicionar valor personalizado..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="flex-1"
            disabled={selectedValues.length >= 5}
          />
          <Button size="icon" variant="outline" onClick={addCustom} disabled={selectedValues.length >= 5 || !customValue.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedValues.filter((v) => !selectedValues.includes(v)).map((value, i) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => toggleValue(value)}
              disabled={selectedValues.length >= 5}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                selectedValues.length >= 5
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : "border-pink-200 text-slate-600 hover:border-pink-400 hover:bg-pink-50 active:scale-95"
              }`}
            >
              {value}
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: selectedValues.length >= 3 ? 1 : 0.4 }} className="pt-4">
          <Button
            className="w-full h-12 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-200"
            disabled={selectedValues.length < 3}
            onClick={() => setPhase("roda")}
          >
            Avançar para Roda da Vida <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-center text-slate-400 mt-2">Mínimo 3, máximo 5 valores</p>
        </motion.div>
      </div>
    </div>
  );
}
