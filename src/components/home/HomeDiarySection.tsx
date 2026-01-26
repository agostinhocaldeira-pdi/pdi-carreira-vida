/**
 * HomeDiarySection - Seção de Diário para a Home
 * Layout inspirado na página Desafio (premium dark/gold)
 */

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Book, Smile, Meh, Frown, Send, Loader2, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";
import { cn } from "@/lib/utils";

const HomeDiarySection = () => {
  const { getDiario, saveDiarioEntry } = usePDIStorage();
  const { celebrateAction } = useActionCelebration();
  const [isSaving, setIsSaving] = useState(false);
  const [entradas, setEntradas] = useState<any[]>([]);
  
  // Get today's date in local timezone
  const getTodayDateStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  
  const [entrada, setEntrada] = useState({
    humor: "",
    reflexoes: "",
    avancos: "",
    habitos: "",
    gratidao: "",
    data: getTodayDateStr(),
  });

  // Check if form has any content
  const hasContent = useMemo(() => {
    return !!(
      entrada.humor ||
      entrada.reflexoes.trim() ||
      entrada.avancos.trim() ||
      entrada.habitos.trim() ||
      entrada.gratidao.trim()
    );
  }, [entrada]);

  // Load existing entries
  useEffect(() => {
    const loadEntradas = async () => {
      try {
        const data = await getDiario();
        const normalized = data.map((entry: any) => ({
          id: entry.id,
          data: entry.data,
          humor: entry.humor,
          reflexoes: entry.reflexao || entry.reflexoes || '',
          avancos: entry.conquistas || entry.avancos || '',
          habitos: Array.isArray(entry.habitos) ? entry.habitos.join(', ') : entry.habitos || '',
          gratidao: entry.gratidao || '',
        }));
        setEntradas(normalized);
        
        // Load today's entry if exists
        const todayStr = getTodayDateStr();
        const todayEntry = normalized.find((e: any) => e.data === todayStr);
        if (todayEntry) {
          setEntrada({
            humor: todayEntry.humor || "",
            reflexoes: todayEntry.reflexoes || "",
            avancos: todayEntry.avancos || "",
            habitos: todayEntry.habitos || "",
            gratidao: todayEntry.gratidao || "",
            data: todayStr,
          });
        }
      } catch (error) {
        console.error('Error loading diary:', error);
      }
    };
    loadEntradas();
  }, [getDiario]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const entryToSave = {
        id: entrada.data,
        data: entrada.data,
        humor: entrada.humor,
        reflexao: entrada.reflexoes,
        conquistas: entrada.avancos,
        habitos: entrada.habitos.split(',').map(h => h.trim()).filter(Boolean),
        gratidao: entrada.gratidao,
      };
      
      await saveDiarioEntry(entryToSave as any);
      celebrateAction('diary', 'Registro no Diário');
      toast.success("Diário salvo com sucesso!");
    } catch (error) {
      console.error('Error saving diary:', error);
      toast.error("Erro ao salvar entrada");
    } finally {
      setIsSaving(false);
    }
  };

  const humorOptions = [
    { value: "feliz", icon: Smile, label: "Feliz", color: "text-green-400" },
    { value: "neutro", icon: Meh, label: "Neutro", color: "text-yellow-400" },
    { value: "triste", icon: Frown, label: "Triste", color: "text-red-400" },
  ];

  return (
    <div className="rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/20 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center">
            <Book className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Diário</h3>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </div>
        <Link to="/diario">
          <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 gap-1">
            Histórico
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Humor Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Como você está se sentindo hoje?</label>
          <RadioGroup
            value={entrada.humor}
            onValueChange={(value) => setEntrada(prev => ({ ...prev, humor: value }))}
            className="flex gap-4"
          >
            {humorOptions.map((option) => (
              <Label
                key={option.value}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all border",
                  entrada.humor === option.value
                    ? "bg-[#D4AF37]/20 border-[#D4AF37]/50"
                    : "bg-[#252525] border-[#333] hover:border-[#D4AF37]/30"
                )}
              >
                <RadioGroupItem value={option.value} className="sr-only" />
                <option.icon className={cn("w-6 h-6", option.color)} />
                <span className="text-xs text-gray-400">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Reflexões */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Pensamentos do dia
          </label>
          <Textarea
            value={entrada.reflexoes}
            onChange={(e) => setEntrada(prev => ({ ...prev, reflexoes: e.target.value }))}
            placeholder="O que passou pela sua mente hoje? Insights, preocupações, ideias..."
            className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#D4AF37] min-h-[80px] resize-none"
          />
        </div>

        {/* Avanços e Conquistas */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">🏆 Conquistas e avanços</label>
          <Textarea
            value={entrada.avancos}
            onChange={(e) => setEntrada(prev => ({ ...prev, avancos: e.target.value }))}
            placeholder="O que você conquistou ou avançou hoje?"
            className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#D4AF37] min-h-[60px] resize-none"
          />
        </div>

        {/* Hábitos */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">🔄 Hábitos realizados</label>
          <Textarea
            value={entrada.habitos}
            onChange={(e) => setEntrada(prev => ({ ...prev, habitos: e.target.value }))}
            placeholder="Quais hábitos você praticou hoje? (separe por vírgula)"
            className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#D4AF37] min-h-[60px] resize-none"
          />
        </div>

        {/* Gratidão */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">🙏 Gratidão</label>
          <Textarea
            value={entrada.gratidao}
            onChange={(e) => setEntrada(prev => ({ ...prev, gratidao: e.target.value }))}
            placeholder="Pelo que você é grato hoje?"
            className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#D4AF37] min-h-[60px] resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasContent || isSaving}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#b8912f] hover:from-[#e5b964] hover:to-[#c9a240] text-[#1a1a1a] font-semibold gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Salvar Diário
        </Button>
      </div>
    </div>
  );
};

export default HomeDiarySection;
