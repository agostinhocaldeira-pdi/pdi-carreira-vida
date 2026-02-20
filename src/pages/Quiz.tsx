import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Target, Calendar, Flame, Heart, ArrowRight, Sparkles, Volume2, VolumeX, Loader2 } from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";
import { useQuizResultAudio } from "@/hooks/useQuizResultAudio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// New quiz structure - will receive more questions
type Trava = "EXAUSTAO" | "INERCIA" | "DISPERSAO" | "LENTIDAO";

interface Question {
  headline: string;
  options: {
    label: string;
    text: string;
    trava: Trava;
  }[];
}

const questions: Question[] = [
  {
    headline: "Ao final de uma semana típica de trabalho, qual é a sensação predominante?",
    options: [
      { 
        label: "Exaustão Improdutiva", 
        text: "Trabalhei muitas horas, apaguei incêndios, mas sinto que não construí nada de valor real.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "Frustração por Inércia", 
        text: "Tinha planos claros na segunda-feira, mas cheguei na sexta sem ter começado o principal.", 
        trava: "INERCIA" 
      },
      { 
        label: "Ansiedade de Dispersão", 
        text: "Comecei três projetos diferentes, me empolguei, mas não terminei nenhum.", 
        trava: "DISPERSAO" 
      },
      { 
        label: "Progresso Lento", 
        text: "Sinto que estou avançando, mas numa velocidade muito menor do que minha capacidade permitiria.", 
        trava: "LENTIDAO" 
      },
    ],
  },
  {
    headline: "O quão claro está o seu futuro para você hoje?",
    options: [
      { 
        label: "Ideia Vaga", 
        text: "Tenho uma ideia vaga na cabeça, mas nada escrito ou estruturado.", 
        trava: "INERCIA" 
      },
      { 
        label: "Metas Desconectadas", 
        text: "Tenho metas financeiras/profissionais, mas elas parecem desconectadas da vida que eu quero ter.", 
        trava: "DISPERSAO" 
      },
      { 
        label: "Plano vs Rotina", 
        text: "Tenho um plano perfeito no papel, mas ele raramente sobrevive ao contato com a minha rotina real.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "Clareza Total", 
        text: "Tenho clareza total, meu problema é apenas técnico/operacional no dia a dia.", 
        trava: "LENTIDAO" 
      },
    ],
  },
  {
    headline: "Quando surgem três demandas urgentes ao mesmo tempo, como você decide?",
    options: [
      { 
        label: "Fazer Tudo", 
        text: "Tento fazer as três, sacrificando meu tempo pessoal ou sono.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "Análise Paralisante", 
        text: "Travo tentando analisar qual é a melhor e acabo procrastinando a decisão.", 
        trava: "INERCIA" 
      },
      { 
        label: "Quick Win", 
        text: "Resolvo a mais rápida/fácil primeiro para sentir que estou produzindo (\"check\" rápido).", 
        trava: "DISPERSAO" 
      },
      { 
        label: "Foco Estratégico", 
        text: "Paro, analiso qual delas move o ponteiro da minha meta principal e ignoro/delego o resto.", 
        trava: "LENTIDAO" 
      },
    ],
  },
  {
    headline: "O que geralmente mata os seus projetos de longo prazo?",
    options: [
      { 
        label: "O Cansaço", 
        text: "Eu começo com gás total, mas a rotina me engole e eu perco a energia.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "O Perfeccionismo", 
        text: "Eu demoro tanto planejando os detalhes que o timing passa.", 
        trava: "INERCIA" 
      },
      { 
        label: "A Novidade", 
        text: "Eu perco o interesse assim que surge uma nova ideia mais brilhante.", 
        trava: "DISPERSAO" 
      },
      { 
        label: "A Falta de Método", 
        text: "Eu tenho vontade, mas me perco na organização das tarefas.", 
        trava: "LENTIDAO" 
      },
    ],
  },
  {
    headline: "Se você mantiver exatamente o mesmo ritmo e estratégia de hoje pelos próximos 5 anos, onde você estará?",
    options: [
      { 
        label: "Burnout ou Estagnação", 
        text: "Provavelmente com Burnout ou estagnado no mesmo nível financeiro.", 
        trava: "EXAUSTAO" 
      },
      { 
        label: "Arrependimentos", 
        text: "Cheio de arrependimentos pelo que \"poderia ter feito\".", 
        trava: "INERCIA" 
      },
      { 
        label: "Projetos Incompletos", 
        text: "Com vários projetos iniciados e nenhuma construção sólida finalizada.", 
        trava: "DISPERSAO" 
      },
      { 
        label: "Crescimento Limitado", 
        text: "Terei crescido, mas sinto que poderia ter ido muito mais longe se tivesse o sistema certo.", 
        trava: "LENTIDAO" 
      },
    ],
  },
];

// Result content based on predominant answer
const resultados: Record<Trava, {
  padraoOperacional: string;
  subtitulo: string;
  oQueSignifica: string;
  travaInvisivel: string;
  custoLongoPrazo: string;
  correcaoNecessaria: string;
  botaoTexto: string;
  microcopy: string;
  icon: React.ElementType;
  landingRoute: string;
}> = {
  EXAUSTAO: {
    padraoOperacional: "O ESFORÇO REATIVO",
    subtitulo: "(A vida respondendo ao mundo)",
    oQueSignifica: "Você não está parado. Pelo contrário, sua capacidade de entrega é alta. O problema é que você se esforça quase sempre respondendo ao que aparece, e não construindo o que importa.",
    travaInvisivel: "Seu dia é governado pelas urgências dos outros, não pelas suas prioridades. Você se tornou excelente em \"apagar incêndios\", o que gera muito movimento, mas pouca tração na direção da sua Visão de Vida Desejada (VVD).",
    custoLongoPrazo: "Desgaste emocional alto e crescimento real baixo. É a famosa sensação de \"correr o dia inteiro na esteira\": muito suor, mas você termina o ano no mesmo lugar.",
    correcaoNecessaria: "Antes de organizar sua agenda, você precisa definir critérios de decisão. Quando tudo parece importante, nada realmente é. Você precisa de um sistema que filtre o ruído antes dele virar tarefa.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Flame,
    landingRoute: "/",
  },
  INERCIA: {
    padraoOperacional: "A DIREÇÃO NÃO SUSTENTADA",
    subtitulo: "(Clareza que não desce para a rotina)",
    oQueSignifica: "Você sabe o que quer — pelo menos na teoria. Você tem visão e bons planos. O problema é que essa clareza não sobrevive ao contato com a realidade da sua segunda-feira.",
    travaInvisivel: "Existe um \"muro\" entre o seu planejamento (o eu que sonha) e a sua execução (o eu que faz). Você planeja num cenário ideal, mas opera num ambiente que não protege esse plano. O caos engole a estratégia.",
    custoLongoPrazo: "Frustração recorrente e a exaustiva sensação de estar sempre \"recomeçando\". Você acumula planos perfeitos na gaveta enquanto a vida acontece no improviso.",
    correcaoNecessaria: "Você não precisa de metas melhores. Você precisa de uma ponte operacional. Transformar sua visão em decisões práticas e inegociáveis do dia a dia.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Calendar,
    landingRoute: "/",
  },
  DISPERSAO: {
    padraoOperacional: "A ENERGIA FRAGMENTADA",
    subtitulo: "(Atenção sem eixo central)",
    oQueSignifica: "Você tem iniciativa, criatividade e vontade de fazer. Mas falta um eixo central que diga o que merece continuidade e o que é apenas distração.",
    travaInvisivel: "Você confunde novidade com progresso. O entusiasmo inicial te move, mas quando a rotina exige consistência chata, você busca o próximo projeto brilhante. Sua energia se dissipa em várias direções, sem furar o bloqueio em nenhuma.",
    custoLongoPrazo: "Muito começo, pouca construção. Você corre o risco de olhar para trás daqui a 5 anos e ver uma coleção de projetos inacabados, sem nenhum legado sólido.",
    correcaoNecessaria: "Essencialismo Estratégico. Você precisa definir uma \"Prioridade-Mãe\" que organize todas as outras escolhas e aprender a dizer não para boas oportunidades que desviam seu foco.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Target,
    landingRoute: "/",
  },
  LENTIDAO: {
    padraoOperacional: "O POTENCIAL SUBUTILIZADO",
    subtitulo: "(Clareza existe, falta sistema)",
    oQueSignifica: "Você está acima da média em consciência e intenção. Você sabe onde quer chegar e tem disciplina. O que te trava não é falta de vontade, é a ineficiência do processo.",
    travaInvisivel: "Você depende demais da sua \"memória RAM\" (sua cabeça) para organizar tudo. Isso consome uma energia mental absurda apenas para manter as coisas funcionando, sobrando pouco para a expansão e inovação.",
    custoLongoPrazo: "Crescimento linear, quando poderia ser exponencial. Você está jogando abaixo do seu nível real porque gasta energia gerenciando o caos mental em vez de executar estratégia.",
    correcaoNecessaria: "Externalização. Você precisa tirar o peso da decisão da sua cabeça e passá-lo para um método confiável. Um sistema externo que sustente sua execução sem depender da sua motivação diária.",
    botaoTexto: "Quero conhecer o PDI",
    microcopy: "Acesso imediato • Sem cartão de crédito",
    icon: Brain,
    landingRoute: "/",
  },
};

// Ordem de desempate (alfabética: A, B, C, D)
const ordemDesempate: Trava[] = ["EXAUSTAO", "INERCIA", "DISPERSAO", "LENTIDAO"];

const Diagnostico = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Trava, number>>({
    EXAUSTAO: 0,
    INERCIA: 0,
    DISPERSAO: 0,
    LENTIDAO: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultTrava, setResultTrava] = useState<Trava | null>(null);

  const handleAnswer = (trava: Trava) => {
    const newScores = { ...scores, [trava]: scores[trava] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular resultado
      setIsLoading(true);
      setTimeout(() => {
        const winnerTrava = calculateWinner(newScores);
        setResultTrava(winnerTrava);
        setIsLoading(false);
        setShowResult(true);
      }, 2500);
    }
  };

  const calculateWinner = (finalScores: Record<Trava, number>): Trava => {
    const maxScore = Math.max(...Object.values(finalScores));
    const winners = (Object.keys(finalScores) as Trava[]).filter(
      (trava) => finalScores[trava] === maxScore
    );

    if (winners.length === 1) {
      return winners[0];
    }

    // Desempate pela ordem de prioridade
    for (const trava of ordemDesempate) {
      if (winners.includes(trava)) {
        return trava;
      }
    }

    return winners[0];
  };

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCTA = async () => {
    setIsCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Build narration text for current result
  const narrationText = useMemo(() => {
    if (!resultTrava) return "";
    const r = resultados[resultTrava];
    return `Seu Padrão Operacional: ${r.padraoOperacional}. ${r.subtitulo}. O Que Isso Significa: ${r.oQueSignifica} A Trava Invisível: ${r.travaInvisivel} O Custo a Longo Prazo: ${r.custoLongoPrazo} A Correção Necessária: ${r.correcaoNecessaria}`;
  }, [resultTrava]);

  const { isPlaying: isAudioPlaying, isGenerating: isAudioGenerating, toggleAudio, audioUrl: cachedAudioUrl } = useQuizResultAudio(resultTrava);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Header */}
      <header className="py-3 sm:py-4 px-4 sm:px-6 flex justify-center relative z-10">
        <img src={logoPdi} alt="PDI" className="h-8 sm:h-10" />
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 relative z-10">
        <AnimatePresence mode="wait">

          {/* Quiz Questions - Start directly with Question 1 */}
          {!showResult && !isLoading && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: currentQuestion === 0 ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl"
            >
              {/* Special header for Question 1 */}
              {currentQuestion === 0 && (
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#d4a853] mb-3 sm:mb-4 leading-tight">
                    Esforço sem direção vira cansaço.
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 mb-2 leading-relaxed">
                    Por que seu esforço não está te levando aonde você quer chegar?
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    Responda 5 perguntas rápidas e veja onde seu esforço está se perdendo.
                  </p>
                </div>
              )}

              {/* Progress */}
              <div className={`${currentQuestion === 0 ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8'}`}>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2 bg-gray-700" />
              </div>

              {/* Question Card */}
              <div className="bg-[#252525] rounded-xl sm:rounded-2xl border border-[#d4a853]/20 p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {questions[currentQuestion].headline}
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.trava)}
                      className="w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-600 hover:border-[#d4a853] hover:bg-[#d4a853]/10 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 group-hover:bg-[#d4a853] group-hover:text-[#1a1a1a] text-gray-300 flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="flex-1">
                          <span className="block text-sm sm:text-base font-semibold text-[#d4a853] mb-1">
                            {option.label}:
                          </span>
                          <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white leading-snug">
                            {option.text}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#d4a853] border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#d4a853] animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Processando Análise...
              </h3>
              <p className="text-gray-400">
                Identificando onde seu esforço está se perdendo
              </p>
            </motion.div>
          )}

          {showResult && resultTrava && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl"
            >
              <div className="bg-[#252525] rounded-2xl border border-[#d4a853]/20 overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-[#d4a853] to-[#b8912f] p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    {(() => {
                      const IconComponent = resultados[resultTrava].icon;
                      return <IconComponent className="w-8 h-8 text-[#1a1a1a]" />;
                    })()}
                  </div>
                  <p className="text-[#1a1a1a]/80 text-sm mb-1">
                    Seu Padrão Operacional:
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                    {resultados[resultTrava].padraoOperacional}
                  </h2>
                  <p className="text-[#1a1a1a]/70 text-sm mt-1">
                    {resultados[resultTrava].subtitulo}
                  </p>
                  {/* Audio narration button */}
                  <button
                    onClick={() => toggleAudio(narrationText)}
                    disabled={isAudioGenerating}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/20 hover:bg-[#1a1a1a]/30 text-[#1a1a1a] text-sm font-medium transition-all"
                  >
                    {isAudioGenerating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Gerando áudio...</>
                    ) : isAudioPlaying ? (
                      <><VolumeX className="w-4 h-4" /> Parar áudio</>
                    ) : (
                      <><Volume2 className="w-4 h-4" /> {cachedAudioUrl ? 'Ouvir resultado' : 'Clique para ouvir'}</>
                    )}
                  </button>
                </div>

                {/* Result Content */}
                <div className="p-6 md:p-8 space-y-5">
                  {/* O Que Isso Significa */}
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></span>
                      O Que Isso Significa
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].oQueSignifica}
                    </p>
                  </div>

                  {/* A Trava Invisível */}
                  <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      A Trava Invisível
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].travaInvisivel}
                    </p>
                  </div>

                  {/* O Custo a Longo Prazo */}
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      O Custo a Longo Prazo
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].custoLongoPrazo}
                    </p>
                  </div>

                  {/* A Correção Necessária */}
                  <div className="bg-[#d4a853]/10 rounded-xl p-4 border border-[#d4a853]/20">
                    <h3 className="font-semibold text-[#d4a853] mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      A Correção Necessária
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resultados[resultTrava].correcaoNecessaria}
                    </p>
                  </div>

                  {/* Seção Final - Comum a todos os resultados */}
                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-[#d4a853] mb-4 text-center">
                      O Próximo Passo Inteligente
                    </h3>
                    <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                      <p>
                        Este diagnóstico não aponta falta de capacidade. Ele revela como sua energia está sendo direcionada hoje.
                      </p>
                      <p>
                        Pessoas maduras não travam por preguiça. Elas travam por viverem sem um sistema de navegação confiável. Quando a direção fica clara, o esforço deixa de ser cansativo e passa a ser construtivo.
                      </p>
                      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
                        <p className="text-white font-medium mb-2">Lembre-se:</p>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></span>
                            Clareza vem antes da produtividade.
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></span>
                            Direção vem antes da disciplina.
                          </li>
                        </ul>
                      </div>
                      <p className="text-center text-white/90 text-lg sm:text-xl font-semibold leading-relaxed">
                        Você já entendeu o padrão que está operando sua vida hoje.<br />
                        O próximo passo é substituir esse padrão por método.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button
                      onClick={handleCTA}
                      size="lg"
                      disabled={isCheckoutLoading}
                      className="w-full bg-gradient-to-r from-[#d4a853] to-[#b8912f] hover:from-[#e5b964] hover:to-[#c9a240] text-[#1a1a1a] font-bold text-sm sm:text-base py-4 sm:py-6 min-h-[72px] sm:min-h-[56px] rounded-xl shadow-lg shadow-[#d4a853]/30 whitespace-normal leading-snug disabled:opacity-60"
                    >
                      <span className="flex items-center justify-center gap-2 text-center">
                        <span>{isCheckoutLoading ? "Processando..." : "Começar"}</span>
                        {!isCheckoutLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </span>
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      R$ 67/ano • Acesso completo
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Diagnostico;
