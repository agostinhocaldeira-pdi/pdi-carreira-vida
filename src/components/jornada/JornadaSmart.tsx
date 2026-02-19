import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Play, Target, CalendarIcon, Clock } from "lucide-react";
import smartVideo from "@/assets/jornada-smart-video.mp4";
import especificaVideo from "@/assets/jornada-smart-especifica-video.mp4";
import mensuravelVideo from "@/assets/jornada-smart-mensuravel-video.mp4";
import alcancavelVideo from "@/assets/jornada-smart-alcancavel-video.mp4";
import relevanteVideo from "@/assets/jornada-smart-relevante-video.mp4";
import temporalVideo from "@/assets/jornada-smart-temporal-video.mp4";
import aprendizadoVideo from "@/assets/jornada-smart-aprendizado-video.mp4";
import sabotadoresVideo from "@/assets/jornada-smart-sabotadores-video.mp4";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import JornadaAIEvaluation from "./JornadaAIEvaluation";

interface Props {
  onComplete: (answers?: { especifica: string; mensuravel: string; alcancavel: string; relevante: string; temporal: string; aprender: string; sabotador: string; antiSabotagem: string; primeiraAcao: string; diaHora: string; smartEvaluation?: string }) => void;
  onBack: () => void;
  hasEvaluated?: boolean;
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
  {
    letter: "📚",
    title: "Aprendizado",
    question: "O que você precisa aprender para conseguir conquistar sua meta?",
    placeholder: "Ex: Preciso aprender gestão de tempo e técnicas de leitura rápida",
    emoji: "📚",
    color: "from-violet-400 to-violet-600",
    hint: "Identifique conhecimentos, habilidades ou competências que você ainda não tem.",
  },
  {
    letter: "🚧",
    title: "Sabotadores",
    question: "O que pode te sabotar? O que na sua rotina pode impedir ou dificultar que você execute seus planos?",
    placeholder: "Ex: Redes sociais, procrastinação, excesso de compromissos",
    emoji: "🚧",
    color: "from-rose-400 to-rose-600",
    hint: "Seja honesto. Reconhecer os obstáculos é o primeiro passo para superá-los.",
  },
  {
    letter: "🛡️",
    title: "Anti-Sabotagem",
    question: "Como você vai impedir ou minimizar o que pode te sabotar no seu dia-a-dia?",
    placeholder: "Ex: Desativar notificações no horário de estudo, bloquear apps por 1h",
    emoji: "🛡️",
    color: "from-emerald-400 to-emerald-600",
    hint: "Crie estratégias práticas e específicas para cada sabotador identificado.",
  },
  {
    letter: "🔥",
    title: "Primeira Ação",
    question: "Agora que você já tem a sua meta definida, qual vai ser sua primeira ação nos próximos 7 dias?",
    placeholder: "Ex: Comprar o primeiro livro e ler o capítulo 1 neste fim de semana",
    emoji: "🔥",
    color: "from-purple-400 to-purple-600",
    hint: "Uma ação concreta e pequena que você pode fazer esta semana.",
  },
  {
    letter: "📅",
    title: "Dia e Hora",
    question: "Você já tem o dia e hora que vai executar essa ação?",
    placeholder: "Ex: Sábado às 9h da manhã, na livraria do centro",
    emoji: "📅",
    color: "from-teal-400 to-teal-600",
    hint: "Agendar cria compromisso. Escolha um momento específico.",
  },
];

export default function JornadaSmart({ onComplete, onBack, hasEvaluated }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(smartSteps.map(() => ""));
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalSrc, setVideoModalSrc] = useState("");

  const diaHoraStepIdx = smartSteps.length - 1; // last step = "Dia e Hora"

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateStr = date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "";
    const combined = `${dateStr}${selectedTime ? " às " + selectedTime : ""}`;
    const newAnswers = [...answers];
    newAnswers[diaHoraStepIdx] = combined;
    setAnswers(newAnswers);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    const dateStr = selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "";
    const combined = `${dateStr}${time ? " às " + time : ""}`;
    const newAnswers = [...answers];
    newAnswers[diaHoraStepIdx] = combined;
    setAnswers(newAnswers);
  };

  const step = smartSteps[currentIdx];
  const allAnswered = answers.length === smartSteps.length && answers.every((a) => (a ?? "").trim().length > 5);

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
          className="aspect-video rounded-2xl overflow-hidden shadow-lg"
        >
          <video
            src={smartVideo}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
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
        <div className="space-y-2">
          {/* SMART letters row */}
          <div className="flex gap-2 justify-center">
            {smartSteps.slice(0, 5).map((s, i) => (
              <button
                key={s.letter}
                onClick={() => setCurrentIdx(i)}
                className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
                  currentIdx === i
                    ? `bg-gradient-to-br ${s.color} text-white scale-110 shadow-lg`
                    : (answers[i] ?? "").trim().length > 5
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {s.letter}
              </button>
            ))}
          </div>
          {/* Extra steps row */}
          <div className="flex gap-2 justify-center">
            {smartSteps.slice(5).map((s, i) => (
              <button
                key={s.letter}
                onClick={() => setCurrentIdx(i + 5)}
                className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
                  currentIdx === i + 5
                    ? `bg-gradient-to-br ${s.color} text-white scale-110 shadow-lg`
                    : (answers[i + 5] ?? "").trim().length > 5
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {s.letter}
              </button>
            ))}
          </div>
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
            {currentIdx <= 6 ? (
              <div
                onClick={() => {
                  const videos = [especificaVideo, mensuravelVideo, alcancavelVideo, relevanteVideo, temporalVideo, aprendizadoVideo, sabotadoresVideo];
                  setVideoModalSrc(videos[currentIdx]);
                  setVideoModalOpen(true);
                }}
                className="bg-white/60 rounded-xl p-3 flex items-center gap-3 border border-orange-100 cursor-pointer hover:bg-white/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">Vídeo: {step.letter} — {step.title}</p>
                  <p className="text-[10px] text-slate-400">{currentIdx === 0 ? "15 seg" : "30 seg"}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 rounded-xl p-3 flex items-center gap-3 border border-orange-100 cursor-pointer hover:bg-white/80 transition-colors">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">Vídeo: {step.letter} — {step.title}</p>
                  <p className="text-[10px] text-slate-400">30 seg</p>
                </div>
              </div>
            )}

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

              {currentIdx === diaHoraStepIdx ? (
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1.5 min-w-0">
                     <label className="text-xs font-medium text-slate-600 truncate block">📅 Data</label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant="outline"
                           className={cn(
                             "w-full justify-start text-left font-normal h-11",
                             !selectedDate && "text-muted-foreground"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                           <span className="truncate">{selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Escolha a data"}</span>
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0" align="start">
                         <Calendar
                           mode="single"
                           selected={selectedDate}
                           onSelect={handleDateChange}
                           locale={ptBR}
                           initialFocus
                           className={cn("p-3 pointer-events-auto")}
                         />
                       </PopoverContent>
                     </Popover>
                   </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">🕐 Horário</label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="h-11 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>
              ) : (
                <Textarea
                  placeholder={step.placeholder}
                  value={answers[currentIdx]}
                  onChange={(e) => updateAnswer(e.target.value)}
                  className="min-h-[100px] resize-none border-orange-200 focus:border-orange-400"
                />
              )}
            </div>

            {/* Next button */}
            {currentIdx < smartSteps.length - 1 ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setCurrentIdx(currentIdx + 1)}
                disabled={answers[currentIdx].trim().length < 5}
              >
                {currentIdx < 4 ? "Próxima letra" : "Próxima pergunta"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Complete */}
        {showEvaluation ? (
          <JornadaAIEvaluation stepId="smart" onContinue={(evalText) => onComplete({ especifica: answers[0], mensuravel: answers[1], alcancavel: answers[2], relevante: answers[3], temporal: answers[4], aprender: answers[5], sabotador: answers[6], antiSabotagem: answers[7], primeiraAcao: answers[8], diaHora: answers[9], smartEvaluation: evalText })} hasEvaluated={hasEvaluated} />
        ) : (
          <motion.div animate={{ opacity: allAnswered ? 1 : 0.4 }} className="pt-2">
            <Button
              className="w-full h-12 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200"
              disabled={!allAnswered}
              onClick={() => setShowEvaluation(true)}
            >
              <Target className="w-5 h-5 mr-2" />
              Concluir Meta SMART
            </Button>
          </motion.div>
        )}
      </div>

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
          <div className="aspect-video">
            <video
              src={videoModalSrc}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
