import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Play, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

export default function JornadaValores({ onComplete, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else if (selected.length < 5) {
      setSelected([...selected, value]);
    }
  };

  const addCustom = () => {
    if (customValue.trim() && selected.length < 5) {
      setSelected([...selected, customValue.trim()]);
      setCustomValue("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm font-medium text-pink-600">Etapa 1 de 4</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Video placeholder */}
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

        {/* Instruction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Escolha seus 5 valores 💎
          </h2>
          <p className="text-sm text-slate-500">
            Valores são a bússola da sua vida. Escolha os 5 que mais representam quem você é.
          </p>
          <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            {selected.length}/5 selecionados
          </div>
        </motion.div>

        {/* Selected */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {selected.map((v) => (
              <Badge
                key={v}
                variant="default"
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 text-sm cursor-pointer gap-1"
                onClick={() => toggleValue(v)}
              >
                {v} <X className="w-3 h-3" />
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Value grid */}
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestedValues
            .filter((v) => !selected.includes(v))
            .map((value, i) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => toggleValue(value)}
                disabled={selected.length >= 5}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                  selected.length >= 5
                    ? "border-slate-200 text-slate-300 cursor-not-allowed"
                    : "border-pink-200 text-slate-600 hover:border-pink-400 hover:bg-pink-50 active:scale-95"
                }`}
              >
                {value}
              </motion.button>
            ))}
        </div>

        {/* Custom value */}
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar valor personalizado..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="flex-1"
            disabled={selected.length >= 5}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={addCustom}
            disabled={selected.length >= 5 || !customValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Complete button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selected.length >= 3 ? 1 : 0.4 }}
          className="pt-4"
        >
          <Button
            className="w-full h-12 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-200"
            disabled={selected.length < 3}
            onClick={onComplete}
          >
            <Check className="w-5 h-5 mr-2" />
            Concluir Valores
          </Button>
          <p className="text-xs text-center text-slate-400 mt-2">
            Mínimo 3, máximo 5 valores
          </p>
        </motion.div>
      </div>
    </div>
  );
}
