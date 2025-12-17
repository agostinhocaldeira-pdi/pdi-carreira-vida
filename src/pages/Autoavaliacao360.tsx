import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Copy, CheckCircle, Clock, Sparkles, History, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LogoutButton from "@/components/LogoutButton";

interface HistoryEntry {
  id: string;
  date: string;
  responses360: string;
}

const Autoavaliacao360 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [canUse, setCanUse] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [responses360, setResponses360] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const lastUsed = localStorage.getItem("autoavaliacao360_last_used");
    if (lastUsed) {
      const lastUsedDate = new Date(lastUsed);
      const today = new Date();
      const diffTime = today.getTime() - lastUsedDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysUntilNextUse = 90 - diffDays;
      
      if (daysUntilNextUse > 0) {
        setCanUse(false);
        setDaysRemaining(daysUntilNextUse);
      }
    }

    // Load saved answers
    const savedAnswers = localStorage.getItem("autoavaliacao360_answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    // Load saved 360 responses
    const saved360 = localStorage.getItem("autoavaliacao360_current_responses");
    if (saved360) {
      setResponses360(saved360);
    }

    // Load saved AI analysis
    const savedAnalysis = localStorage.getItem("autoavaliacao360_ai_analysis");
    if (savedAnalysis) {
      setAiAnalysis(savedAnalysis);
    }

    // Load history
    const savedHistory = localStorage.getItem("autoavaliacao360_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    localStorage.setItem("autoavaliacao360_answers", JSON.stringify(newAnswers));
  };

  const questionsStep1 = [
    {
      category: "1. Relacionamentos",
      questions: [
        { id: "rel1", text: "Quando surge um conflito, você costuma priorizar manter a paz mesmo engolindo algo que te incomoda, ou expressar sua verdade mesmo correndo o risco de desagradar?" },
        { id: "rel2", text: "Você tende a assumir que o outro entende o que você sente, ou acha que precisa sempre explicar com clareza?" },
        { id: "rel3", text: "Quando alguém te decepciona, você perdoa rápido demais, ou mantém distância mesmo quando a relação poderia ser consertada?" }
      ]
    },
    {
      category: "2. Saúde (física e emocional)",
      questions: [
        { id: "sau1", text: "Quando está cansado, você se obriga a continuar para cumprir o que prometeu, ou escuta seu corpo e pausa mesmo atrapalhando o plano?" },
        { id: "sau2", text: "Ao lidar com estresse, você enfrenta a causa diretamente, ou tende a buscar distrações para evitar pensar no problema?" },
        { id: "sau3", text: "Você cuida da saúde só quando algo incomoda, ou mantém disciplina preventiva mesmo quando nada dói?" }
      ]
    },
    {
      category: "3. Carreira e Propósito Profissional",
      questions: [
        { id: "car1", text: "Você prefere garantir segurança mesmo abrindo mão de liberdade, ou prefere liberdade mesmo tendo mais riscos?" },
        { id: "car2", text: "Quando precisa aprender algo novo, você espera se sentir totalmente pronto, ou aprende fazendo, com erros no caminho?" },
        { id: "car3", text: "Diante de um desafio grande, você tende a superplanejar, ou agir rápido e ajustar depois?" }
      ]
    },
    {
      category: "4. Espiritualidade",
      questions: [
        { id: "esp1", text: "Quando algo ruim acontece, você busca significado e evolução no acontecimento, ou vê apenas como um problema a ser eliminado?" },
        { id: "esp2", text: "Você se conecta melhor com o silêncio interno, ou com ensinamentos externos (livros, líderes, conteúdos)?" },
        { id: "esp3", text: "É mais comum você agradecer pelo que tem, ou pedir pelo que falta?" }
      ]
    },
    {
      category: "5. Vida Financeira",
      questions: [
        { id: "fin1", text: "Quando entra dinheiro extra, você tende a guardar primeiro, ou investir em algo que melhore sua vida no presente?" },
        { id: "fin2", text: "Ao tomar decisões financeiras, você se baseia mais em lógica e números, ou em sensações e intuição?" },
        { id: "fin3", text: "Prefere evitar riscos financeiros para não perder, ou assume riscos calculados para potencializar ganhos?" }
      ]
    },
    {
      category: "6. Autorrealização (sensação de propósito)",
      questions: [
        { id: "aut1", text: "Você se sente mais realizado ao cumprir metas, ou ao sentir progresso mesmo sem resultados imediatos?" },
        { id: "aut2", text: "Quando faz algo bem feito, você reconhece internamente sua conquista, ou só percebe valor quando alguém valida?" },
        { id: "aut3", text: "Prefere fazer muitas coisas com bom desempenho, ou poucas coisas com excelência absoluta?" }
      ]
    },
    {
      category: "7. Vida Social",
      questions: [
        { id: "soc1", text: "Ao conhecer novas pessoas, você se abre com naturalidade, ou analisa primeiro e se abre só quando confia?" },
        { id: "soc2", text: "Em encontros sociais, você se sente mais confortável ouvindo, ou falando?" },
        { id: "soc3", text: "Você costuma se aproximar das pessoas que compartilham seus valores, ou das que estimulam novos desafios?" }
      ]
    },
    {
      category: "8. Família",
      questions: [
        { id: "fam1", text: "Quando há problema familiar, você tenta resolver imediatamente, ou espera o clima esfriar para agir?" },
        { id: "fam2", text: "Você gosta de proteger demais quem ama, ou prefere deixar que cresçam enfrentando dificuldades sozinhos?" },
        { id: "fam3", text: "Quando precisa escolher, você prioriza sua necessidade, ou abre mão pelo bem-estar da família?" }
      ]
    }
  ];

  const questions360 = `1. Quando surge um conflito, você acha que eu priorizaria manter a paz ou expressar minha verdade?
2. Você me vê como alguém que supõe que o outro entende o que sinto, ou alguém que explica com clareza?
3. Quando alguém me decepciona, você acredita que eu perdôo rápido ou que me afasto para me proteger?
4. Quando estou cansado, você acha que eu continuo mesmo assim ou escuto meu corpo e pauso?
5. Ao lidar com estresse, você diria que enfrento a causa ou busco distrações?
6. Você me vê cuidando da saúde de forma preventiva ou só quando algo incomoda?
7. Na sua percepção, eu priorizo mais segurança ou liberdade profissional?
8. Você acha que eu espero estar totalmente pronto para aprender algo novo ou aprendo fazendo?
9. Quando surge um desafio, você acredita que eu superplanejo ou ajo rápido e ajusto depois?
10. Quando algo ruim acontece, você acha que eu busco significado ou vejo apenas como um problema?
11. Você me vê mais conectado ao silêncio interno ou a ensinamentos externos?
12. Acha que eu agradeço mais pelo que tenho ou peço mais pelo que falta?
13. Quando entra dinheiro extra, você acha que eu guardo primeiro ou invisto em algo que melhora o presente?
14. Você acredita que minhas decisões financeiras são mais lógicas ou intuitivas?
15. Na sua visão, eu evito riscos ou assumo riscos calculados?
16. Você me vê mais realizado ao cumprir metas ou ao sentir progresso?
17. Acha que eu reconheço minhas próprias conquistas ou só percebo valor quando alguém valida?
18. Você acredita que eu prefiro fazer muitas coisas bem ou poucas com excelência total?
19. Ao conhecer pessoas novas, você acha que eu me abro com facilidade ou só depois de confiar?
20. Em encontros sociais, você me vê mais ouvindo ou falando?
21. Você acha que eu me aproximo mais de pessoas que compartilham meus valores ou das que me desafiam?
22. Quando há problema familiar, você acredita que eu tento resolver rápido ou espero o clima esfriar?
23. Você me vê protegendo demais quem amo ou deixando que cresçam enfrentando dificuldades?
24. Quando preciso escolher, você acha que priorizo minhas necessidades ou abro mão pelo bem-estar da família?
25. Quais são, na sua opinião, os meus maiores pontos fortes no convívio pessoal e/ou profissional? Em quais situações você me viu demonstrar essas qualidades?
26. Que tipo de desafio você acredita que eu lido muito bem?
27. Você acha que eu costumo colaborar bem com os outros? Pode dar um exemplo?
28. Você me considera confiável e responsável com prazos e compromissos? Por quê?
29. O que você acredita que eu poderia desenvolver ou melhorar para crescer na carreira?
30. Você já percebeu momentos em que eu tive dificuldade para me comunicar com clareza?
31. Quais situações eu pareço procrastinar ou evitar decisões?
32. Você percebe em mim, clareza sobre os meus objetivos profissionais? Comente.`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const generateCompletePrompt = () => {
    // Formatar respostas da Etapa 1 (Autoavaliação)
    let step1Formatted = "=== MINHAS RESPOSTAS (AUTOAVALIAÇÃO) ===\n\n";
    
    questionsStep1.forEach((category) => {
      step1Formatted += `${category.category}\n`;
      category.questions.forEach((q) => {
        step1Formatted += `\nPergunta: ${q.text}\n`;
        step1Formatted += `Resposta: ${answers[q.id] || "Não respondida"}\n`;
      });
      step1Formatted += "\n";
    });

    // Adicionar respostas da Etapa 2 (360º)
    let step2Formatted = "\n=== RESPOSTAS DE OUTRAS PESSOAS (AVALIAÇÃO 360º) ===\n\n";
    if (responses360.trim()) {
      step2Formatted += responses360;
    } else {
      step2Formatted += "Nenhuma resposta 360º foi coletada ainda.";
    }

    // Montar prompt completo
    const completePrompt = `A seguir, vou te enviar um conjunto de respostas — primeiro as minhas próprias respostas e depois as respostas de outras pessoas (avaliação 360º) — referentes às perguntas listadas abaixo.

Com base exclusivamente nessas respostas, quero que você produza uma análise profunda sobre mim, respondendo claramente:

1. O que eu faço bem, identificando:
• meus comportamentos consistentes
• decisões equilibradas
• ações alinhadas aos meus valores
• capacidade de agir mesmo com medo
• tendências de evolução diante de dilemas

2. O que eu preciso melhorar, identificando:
• dilemas repetidos
• escolhas movidas por medo ou insegurança
• atitudes que me afastam do que realmente quero
• arrependimentos ou padrões recorrentes

Depois, com base em tudo isso, quero que você me devolva uma síntese clara com:
• meus principais pontos fortes
• meus principais pontos de melhoria
• meus padrões de comportamento
• o que tudo isso indica sobre meu momento atual
• quais são meus maiores potenciais a desenvolver a partir dessa análise

${step1Formatted}
${step2Formatted}

Agora, com base em todas essas respostas acima, faça a análise profunda solicitada.`;

    return completePrompt;
  };

  const handleFinishStep1 = () => {
    const allAnswered = questionsStep1.every(category => 
      category.questions.every(q => answers[q.id]?.trim())
    );
    
    if (!allAnswered) {
      toast({
        title: "⚠️ Atenção",
        description: "Por favor, responda todas as perguntas antes de avançar",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep(2);
  };

  const handleSave360Responses = () => {
    if (!responses360.trim()) {
      toast({
        title: "⚠️ Atenção",
        description: "Por favor, adicione as respostas 360º antes de salvar",
        variant: "destructive"
      });
      return;
    }

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      responses360: responses360
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("autoavaliacao360_history", JSON.stringify(updatedHistory));
    localStorage.setItem("autoavaliacao360_current_responses", responses360);

    toast({
      title: "✅ Respostas salvas!",
      description: "As respostas 360º foram adicionadas ao histórico",
    });
  };

  const handleSaveAnalysis = () => {
    if (!aiAnalysis.trim()) {
      toast({
        title: "⚠️ Atenção",
        description: "Por favor, adicione a análise da IA antes de salvar",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem("autoavaliacao360_ai_analysis", aiAnalysis);
    toast({
      title: "✅ Análise salva!",
      description: "A análise da IA foi salva com sucesso",
    });
  };

  const handleComplete = () => {
    if (aiAnalysis.trim()) {
      localStorage.setItem("autoavaliacao360_ai_analysis", aiAnalysis);
    }
    localStorage.setItem("autoavaliacao360_last_used", new Date().toISOString());
    toast({
      title: "✅ Ferramenta concluída!",
      description: "Use as análises da IA para alimentar suas Habilidades a Desenvolver no Plano de Vida",
    });
  };

  if (!canUse) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="bg-card border-b shadow-soft sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Autoavaliação + 360º</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/ferramentas">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="shadow-large border-primary/20">
            <CardContent className="py-12 text-center space-y-6">
              <Clock className="w-16 h-16 text-primary mx-auto" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Ferramenta já utilizada</h2>
                <p className="text-muted-foreground">
                  Você poderá utilizar esta ferramenta novamente em <strong>{daysRemaining} dias</strong>.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Esta ferramenta pode ser utilizada uma vez a cada 3 meses para garantir uma reflexão profunda e evolutiva.
                </p>
              </div>
              <div className="flex justify-center">
                <Link to="/home">
                  <Button className="w-full sm:w-auto">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Autoavaliação + 360º</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/ferramentas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Progress Indicator */}
        <Card className="shadow-medium">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  1
                </div>
                <span className="text-sm font-medium hidden sm:inline">Autoavaliação</span>
              </div>
              <div className="flex-1 h-1 bg-muted">
                <div className={`h-full bg-primary transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  2
                </div>
                <span className="text-sm font-medium hidden sm:inline">Avaliação 360º</span>
              </div>
              <div className="flex-1 h-1 bg-muted">
                <div className={`h-full bg-primary transition-all ${currentStep >= 3 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  3
                </div>
                <span className="text-sm font-medium hidden sm:inline">Análise com IA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Deep Questions */}
        {currentStep === 1 && (
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Etapa 1: Perguntas de Autoavaliação
              </CardTitle>
              <CardDescription>
                Responda com sinceridade sobre como você age diante desses dilemas. Não há respostas certas ou erradas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {questionsStep1.map((category, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="font-semibold text-lg text-primary">{category.category}</h3>
                  {category.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <label className="text-sm font-medium">{q.text}</label>
                      <Textarea
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Sua resposta..."
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleFinishStep1} className="gap-2">
                  Avançar para Etapa 2
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 360º Evaluation */}
        {currentStep === 2 && (
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Etapa 2: Avaliação 360º
              </CardTitle>
              <CardDescription>
                Copie as perguntas abaixo e envie para amigos, colegas de trabalho, familiares e outras pessoas próximas. Peça que respondam com sinceridade sobre como eles te veem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-3">
                <p className="font-semibold text-primary">📋 Instruções importantes:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Clique no botão abaixo para copiar todas as 32 perguntas</li>
                  <li>Cole as perguntas em um documento Word, Google Docs ou ferramenta de sua preferência</li>
                  <li>Envie para o máximo de pessoas possível (quanto mais feedback, melhor será sua análise)</li>
                  <li>Colete todas as respostas e cole no campo abaixo para salvar no histórico</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">32 Perguntas para Avaliação 360º</h4>
                  <Button
                    onClick={() => copyToClipboard(questions360, "Perguntas 360º")}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Perguntas
                  </Button>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto p-4 bg-muted/30 rounded-lg border text-sm whitespace-pre-wrap">
                  {questions360}
                </div>
              </div>

              {/* Campo para colar respostas coletadas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Respostas Coletadas (360º)</h4>
                  <Button
                    onClick={handleSave360Responses}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar no Histórico
                  </Button>
                </div>
                <Textarea
                  value={responses360}
                  onChange={(e) => setResponses360(e.target.value)}
                  placeholder="Cole aqui todas as respostas coletadas das pessoas que responderam a avaliação 360º..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  💾 As respostas serão salvas no histórico para consulta futura
                </p>
              </div>

              {/* Histórico de respostas */}
              {history.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Histórico de Respostas 360º
                    </h4>
                    <Button
                      onClick={() => setShowHistory(!showHistory)}
                      variant="ghost"
                      size="sm"
                    >
                      {showHistory ? "Ocultar" : "Mostrar"} ({history.length})
                    </Button>
                  </div>
                  
                  {showHistory && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {history.map((entry) => (
                        <Card key={entry.id} className="bg-muted/20">
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                📅 {new Date(entry.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <Button
                                onClick={() => copyToClipboard(entry.responses360, "Respostas 360º do histórico")}
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs"
                              >
                                <Copy className="w-3 h-3" />
                                Copiar
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {entry.responses360}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="gap-2">
                  Avançar para Etapa 3
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Analysis */}
        {currentStep === 3 && (
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Etapa 3: Análise Profunda com IA
              </CardTitle>
              <CardDescription>
                Seu prompt completo está pronto! Copie tudo e cole em uma IA de sua preferência (ChatGPT, Claude, Copilot, Gemini, etc.) para receber sua análise personalizada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 space-y-3">
                <p className="font-semibold text-accent">🤖 Prompt Completo Gerado</p>
                <p className="text-sm">
                  Consolidamos automaticamente todas as suas respostas da Etapa 1 (Autoavaliação) e as respostas coletadas na Etapa 2 (Avaliação 360º) em um único prompt pronto para usar.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Clique em "Copiar Prompt Completo" abaixo</li>
                  <li>Abra uma IA de sua preferência (ChatGPT, Claude, Copilot, Gemini, etc.)</li>
                  <li>Cole o prompt completo na IA</li>
                  <li>Aguarde a análise profunda</li>
                  <li>Use os insights para alimentar "Habilidades a Desenvolver" no seu Plano de Vida</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h4 className="font-semibold">PROMPT COMPLETO COM TODAS AS RESPOSTAS</h4>
                  <Button
                    onClick={() => copyToClipboard(generateCompletePrompt(), "Prompt completo")}
                    variant="default"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar Prompt Completo
                  </Button>
                </div>
                
                <div className="max-h-[500px] overflow-y-auto p-4 bg-muted/30 rounded-lg border text-sm whitespace-pre-wrap">
                  {generateCompletePrompt()}
                </div>
              </div>

              {/* Campo para resultado da análise da IA */}
              <div className="space-y-3">
                <h4 className="font-semibold">Resultado da Análise da IA</h4>
                <Textarea
                  value={aiAnalysis}
                  onChange={(e) => setAiAnalysis(e.target.value)}
                  placeholder="Cole aqui a análise completa que você recebeu da IA..."
                  className="min-h-[300px]"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    💾 Cole aqui o resultado completo da análise que você recebeu da IA para salvar e consultar futuramente
                  </p>
                  <Button
                    onClick={handleSaveAnalysis}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Análise
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="font-semibold text-primary mb-2">💡 Dica importante:</p>
                <p className="text-sm">
                  Após receber e salvar a análise da IA, identifique as principais habilidades que você precisa desenvolver 
                  e adicione-as na seção <strong>"Habilidades a Desenvolver"</strong> dentro do seu <strong>Plano de Vida</strong>. 
                  Isso vai te ajudar a criar um plano de ação concreto para seu desenvolvimento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button onClick={handleComplete} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Concluir Ferramenta
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                ⏰ Esta ferramenta poderá ser utilizada novamente em 3 meses
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Autoavaliacao360;