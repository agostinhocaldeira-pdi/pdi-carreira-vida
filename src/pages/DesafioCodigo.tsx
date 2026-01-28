import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, TrendingDown, Zap, Sprout, Clapperboard, HelpCircle, ChevronLeft, ChevronRight, Rocket, Lock, Check, Home } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { desafioData } from "@/data/desafioCodigoData";
import { useChallengeProgress } from "@/hooks/useChallengeProgress";
import { toast } from "sonner";
import codigoEssencialCover from "@/assets/codigo-essencial-cover.png";

const DesafioCodigo = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { 
    isLoading, 
    completeDay, 
    isDayCompleted, 
    isDayAccessible, 
    getDayStatus,
    getNextAvailableDay 
  } = useChallengeProgress();

  const handleInputChange = (key: string, value: string) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const currentExercise = currentDay !== null ? desafioData[currentDay - 1] : null;

  const handleDaySelect = (day: number) => {
    const status = getDayStatus(day);
    if (status === 'locked') {
      toast.error("Este dia ainda está bloqueado. Complete o dia anterior primeiro.");
      return;
    }
    setCurrentDay(day);
  };

  const handleCompleteDay = async () => {
    if (currentDay === null) return;
    
    if (isDayCompleted(currentDay)) {
      // Already completed, just move to next
      const nextDay = Math.min(30, currentDay + 1);
      if (isDayAccessible(nextDay)) {
        setCurrentDay(nextDay);
      } else {
        toast.info("Volte amanhã para fazer o próximo dia!");
      }
      return;
    }

    setIsCompleting(true);
    const success = await completeDay(currentDay);
    setIsCompleting(false);

    if (success) {
      toast.success(`Dia ${currentDay} concluído! 🎉`);
      
      if (currentDay < 30) {
        toast.info("Volte amanhã para fazer o próximo dia!");
      } else {
        toast.success("Parabéns! Você completou o desafio de 30 dias! 🏆");
      }
    }
  };

  const handleStartChallenge = () => {
    const nextDay = getNextAvailableDay();
    setCurrentDay(nextDay);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Intro Screen
  if (currentDay === null) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
        <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />

        <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="flex justify-center">
              <img src={codigoEssencialCover} alt="O Código do Essencial" className="w-full max-w-md rounded-lg shadow-2xl shadow-[#d4a853]/20" />
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#d4a853]">ADVERTÊNCIA</h1>
              <p className="text-xl md:text-2xl font-semibold text-white">NÃO COMECE A USAR O SISTEMA PDI COM A SUA "MENTE ANTIGA"</p>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>Pare por um segundo.</p>
              <p>Você acaba de dar um passo que 95% das pessoas nunca dão. Você decidiu colocar ordem no caos. Você entrou no PDI – Carreira & Vida.</p>
              <p>Mas eu preciso te contar uma verdade dura, que a maioria dos softwares não tem coragem de dizer:</p>
              <p className="text-white font-semibold text-lg">A melhor ferramenta do mundo não salva uma mente que está viciada em se distrair.</p>
              <p>Imagine que eu te entregue agora as chaves de um carro de Fórmula 1. Uma máquina perfeita, motor ajustado, capaz de te levar do ponto A ao ponto B numa velocidade insana. Isso é a Plataforma PDI.</p>
              <p>Mas se você sentar nesse cockpit com a mentalidade de quem dirige um carro popular no engarrafamento... você não vai sair do lugar. Ou pior: vai bater na primeira curva.</p>
              <p className="text-[#d4a853] font-semibold">É aqui que o jogo muda.</p>
              <p>Você tem em mãos agora algo perigoso para a sua zona de conforto.</p>
              <p>Isto não é um "livrinho de dicas".</p>
              <p>Isto não é "mais conteúdo" para você ler e esquecer.</p>
              <p className="text-white font-semibold">Este DESAFIO é um Protocolo de Reinicialização Mental de 30 Dias.</p>
              <p>Nós condensamos a sabedoria das mentes mais brilhantes do mundo — de Hábitos Atômicos a Essencialismo, de Mindset a Deep Work — e transformamos em 30 pílulas de pura execução.</p>
              <p>Sem teoria chata. Sem enrolação.</p>
              <p className="text-[#d4a853]">É um tapa na cara da procrastinação por dia, durante um mês.</p>

              <div className="bg-[#252525] p-6 rounded-xl border border-[#d4a853]/20 space-y-4">
                <h3 className="text-[#d4a853] font-bold">Nos próximos 30 dias, você vai:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="text-[#d4a853]">•</span> Descobrir por que você trabalha tanto e produz tão pouco (Dia 1).</li>
                  <li className="flex items-start gap-2"><span className="text-[#d4a853]">•</span> Aprender a dizer "NÃO" sem culpa e ganhar horas livres (Dia 2).</li>
                  <li className="flex items-start gap-2"><span className="text-[#d4a853]">•</span> Matar a procrastinação antes do café da manhã (Dia 8).</li>
                  <li className="flex items-start gap-2"><span className="text-[#d4a853]">•</span> Instalar o sistema operacional de quem realiza o impossível.</li>
                </ul>
              </div>

              <p className="text-white font-semibold">O PDI organiza a sua vida. Este caderno organiza VOCÊ.</p>
              <p>A ferramenta está pronta. O mapa está na sua mão.</p>
              <p className="text-[#d4a853] text-lg font-semibold">A pergunta é: você vai pilotar ou vai passear?</p>
              <p className="text-xl font-bold text-white">Vire a página. O Dia 1 começa agora.</p>
              <p className="text-[#d4a853]">Bem-vindo à sua nova vida.</p>
            </div>

            <div className="flex justify-center pt-8">
              <Button onClick={handleStartChallenge} size="lg" className="bg-gradient-to-r from-[#d4a853] to-[#b8912f] hover:from-[#e5b964] hover:to-[#c9a240] text-[#1a1a1a] font-bold text-lg px-12 py-6 rounded-xl shadow-lg shadow-[#d4a853]/30">
                <Rocket className="w-5 h-5 mr-2" /> {isLoading ? "Carregando..." : "Iniciar o Desafio"}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#d4a853]/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/home')} 
                className="text-gray-400 hover:text-white hover:bg-[#252525]"
              >
                <Home className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#b8912f] flex items-center justify-center">
                <span className="font-bold text-[#1a1a1a] text-sm">30</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#d4a853]">O Código do Essencial</h1>
                <p className="text-xs text-gray-400">Desafio de 30 Dias</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => {
                   const prevDay = currentDay - 1;
                   if (prevDay >= 1 && getDayStatus(prevDay) !== 'locked') {
                     setCurrentDay(prevDay);
                   }
                 }}
                 disabled={
                   currentDay === 1 ||
                   (currentDay > 1 && getDayStatus(currentDay - 1) === 'locked')
                 }
                 className="text-gray-400 hover:text-white disabled:opacity-30"
               >
                <ChevronLeft className="w-5 h-5" />
              </Button>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => {
                   const nextDay = currentDay + 1;
                   if (nextDay <= 30 && getDayStatus(nextDay) !== 'locked') {
                     setCurrentDay(nextDay);
                   }
                 }}
                 disabled={
                   currentDay === 30 ||
                   (currentDay < 30 && getDayStatus(currentDay + 1) === 'locked')
                 }
                 className="text-gray-400 hover:text-white disabled:opacity-30"
               >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Day Navigation with lock states */}
          <div className="w-full overflow-hidden">
            <div className="flex gap-2 pb-2">
              <TooltipProvider>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const status = getDayStatus(day);
                  const isLocked = status === 'locked';
                  const isCompleted = status === 'completed';
                  
                  return (
                    <Tooltip key={day}>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => handleDaySelect(day)} 
                          disabled={isLocked}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                            currentDay === day 
                              ? 'bg-gradient-to-r from-[#d4a853] to-[#b8912f] text-[#1a1a1a] shadow-lg' 
                              : isLocked
                                ? 'bg-[#1f1f1f] text-gray-600 cursor-not-allowed border border-[#2a2a2a]'
                                : isCompleted
                                  ? 'bg-[#2a2a2a] text-green-400 border border-green-500/30 hover:bg-[#333]'
                                  : 'bg-[#252525] text-gray-400 hover:bg-[#333] hover:text-white border border-[#333]'
                          }`}
                        >
                          {isLocked && <Lock className="w-3 h-3" />}
                          {isCompleted && <Check className="w-3 h-3" />}
                          DIA {day}
                        </button>
                      </TooltipTrigger>
                      {isLocked && (
                        <TooltipContent>
                          <p>Complete o dia {day - 1} primeiro</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl relative z-10">
        <AnimatePresence mode="wait">
          {currentExercise && (
            <motion.article key={currentDay} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
              <header className="text-center space-y-4 pb-8 border-b border-[#d4a853]/20">
                <span className="inline-block px-4 py-1 rounded-full bg-[#d4a853]/10 text-[#d4a853] text-sm font-medium">Semana {currentExercise.week} · {currentExercise.weekTitle}</span>
                <h1 className="text-2xl md:text-4xl font-bold">
                  <span className="text-white">DIA {currentExercise.day}</span>
                  <span className="text-[#d4a853]"> — </span>
                  <span className="text-[#d4a853]">{currentExercise.title}</span>
                </h1>
              </header>

              <section className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-[#d4a853]" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-[#d4a853]">🤔 O que está pegando aqui?</h2>
                    <p className="text-gray-300 leading-relaxed">{currentExercise.problem}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                    <Clapperboard className="w-6 h-6 text-[#d4a853]" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-[#d4a853]">🎬 Um filme que você talvez já tenha visto</h2>
                    <p className="text-gray-300 leading-relaxed">{currentExercise.movie}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-[#d4a853]" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-[#d4a853]">📉 A conta invisível</h2>
                    <ul className="space-y-2">
                      {currentExercise.cost.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-[#d4a853]"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-[#d4a853]" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-[#d4a853]">💡 A virada de chave</h2>
                    <p className="text-gray-300 leading-relaxed">{currentExercise.insight}</p>
                    <p className="text-gray-500 text-sm">📖 {currentExercise.insightSource}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-6 bg-gradient-to-br from-[#d4a853]/10 to-transparent p-6 md:p-8 rounded-2xl border border-[#d4a853]/20">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853] to-[#b8912f] flex items-center justify-center shadow-lg shadow-[#d4a853]/20">
                    <Zap className="w-6 h-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#d4a853]">⚡ Hora da verdade</h2>
                    <p className="text-gray-400 text-sm mt-1">Exercício prático do dia</p>
                  </div>
                </div>

                {currentExercise.exercises.map((exercise, idx) => (
                  <div key={idx} className="space-y-4 pl-0 md:pl-16">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4a853]/20 border border-[#d4a853]/40 flex items-center justify-center text-[#d4a853] font-bold text-sm">{idx + 1}</span>
                      <h3 className="text-lg font-semibold text-white">{exercise.title}</h3>
                    </div>
                    <div className="ml-11 space-y-3">
                      {exercise.description && <p className="text-gray-400">{exercise.description}</p>}
                      {exercise.inputs?.map((input, inputIdx) => (
                        <div key={inputIdx} className="space-y-2">
                          <label className="block text-gray-300 text-sm">{input.label}</label>
                          {input.type === 'textarea' ? (
                            <Textarea value={responses[`${currentDay}-${idx}-${inputIdx}`] || ''} onChange={(e) => handleInputChange(`${currentDay}-${idx}-${inputIdx}`, e.target.value)} placeholder={input.placeholder} className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] min-h-[80px] resize-none" />
                          ) : (
                            <Input value={responses[`${currentDay}-${idx}-${inputIdx}`] || ''} onChange={(e) => handleInputChange(`${currentDay}-${idx}-${inputIdx}`, e.target.value)} placeholder={input.placeholder} className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] h-12" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-green-400">🌱 Para fechar</h2>
                    <p className="text-gray-300 leading-relaxed italic">{currentExercise.closing}</p>
                  </div>
                </div>
              </section>

              {/* Footer navigation with completion button */}
              <div className="flex flex-col gap-4 pt-8 border-t border-[#333]">
                {/* Complete Day Button */}
                {!isDayCompleted(currentDay) && (
                  <Button 
                    onClick={handleCompleteDay} 
                    disabled={isCompleting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-bold text-lg py-6"
                  >
                    {isCompleting ? "Salvando..." : `✅ Concluir Dia ${currentDay}`}
                  </Button>
                )}
                
                {isDayCompleted(currentDay) && (
                  <div className="w-full bg-green-500/10 border border-green-500/30 rounded-lg py-4 text-center">
                    <span className="text-green-400 font-medium flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" /> Dia {currentDay} concluído!
                    </span>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const prevDay = currentDay - 1;
                      if (prevDay >= 1 && getDayStatus(prevDay) !== 'locked') {
                        setCurrentDay(prevDay);
                      }
                    }} 
                    disabled={currentDay === 1} 
                    className="border-[#333] text-gray-400 hover:text-white hover:bg-[#252525] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Dia Anterior
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const nextDay = currentDay + 1;
                      if (nextDay <= 30 && getDayStatus(nextDay) !== 'locked') {
                        setCurrentDay(nextDay);
                      } else if (getDayStatus(nextDay) === 'locked') {
                        toast.info("Volte amanhã para fazer o próximo dia!");
                      }
                    }} 
                    disabled={currentDay === 30 || (currentDay < 30 && getDayStatus(currentDay + 1) === 'locked' && !isDayCompleted(currentDay))} 
                    className="bg-gradient-to-r from-[#d4a853] to-[#b8912f] text-[#1a1a1a] hover:from-[#e5b964] hover:to-[#c9a240] disabled:opacity-30"
                  >
                    Próximo Dia <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DesafioCodigo;
