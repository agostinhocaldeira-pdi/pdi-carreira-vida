import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  CheckCircle2, 
  ArrowRight,
  User,
  Compass,
  Map,
  Shield,
  Star,
  Play,
  X,
  AlertTriangle,
  RefreshCcw,
  Heart,
  Brain,
  Sparkles
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";

const LeadP = () => {
  const navigate = useNavigate();
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const faqItems = [
    {
      question: "Preciso de experiência com desenvolvimento pessoal?",
      answer: "Não. O PDI foi feito para iniciantes e experientes."
    },
    {
      question: "Quanto tempo por dia?",
      answer: "5 a 10 minutos."
    },
    {
      question: "Funciona no celular?",
      answer: "Sim. 100% responsivo."
    },
    {
      question: "Posso cancelar?",
      answer: "Sim. Sem burocracia."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-center">
          <Logo size="md" />
        </div>
      </header>

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
            O PDI
          </Badge>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground leading-tight">
            O PDI é mais do que um sistema para planejar a vida.<br />
            É um sistema para viver a vida com direção e conquistas.
          </h1>

          {/* CTA Principal */}
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 transition-all duration-300 whitespace-normal leading-tight max-w-full"
              onClick={() => navigate("/signup")}
            >
              <span className="sm:hidden">Acesse Grátis</span>
              <span className="hidden sm:flex items-center gap-2">
                👉 Acesse Grátis
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </span>
            </Button>
            
            <div className="mt-6 p-6 rounded-xl border border-border/50 bg-muted/20 max-w-lg mx-auto">
              <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <strong>Teste o sistema por 30 dias, e avalie se faz sentido para você</strong>
                </p>
                <p className="flex items-start justify-center gap-2 text-left">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>Depois de 30 dias, se você quiser continuar, é só efetivar sua assinatura.<br />
                  Por apenas R$ 67,00, você garante o acesso ao sistema por um ano, e ainda ganha + 30 dias para pagar.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO: O QUE VOCÊ QUER */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight mb-8">
              Se você quer:
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed">
              Crescer profissionalmente, gerar mais renda e sentir-se realizado no trabalho.
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed">
              Ter estabilidade financeira, tempo para a família e a sensação real de estar avançando na vida — não apenas sobrevivendo.
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed">
              Sentir que cada esforço está te levando para algum lugar que vale a pena. Não viver ciclos que se repetem, ano após ano.
            </p>
            
            <div className="py-4">
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-primary">
                Significa que você tem o desejo legítimo de viver uma vida com propósito, segurança e liberdade.
              </p>
            </div>
            
            <div className="bg-card border border-border/50 rounded-xl p-6 sm:p-8 shadow-sm">
              <p className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed mb-4">
                Mas aí, entra o problema:
              </p>
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-4">
                Mesmo sendo capaz, dedicado e inteligente, você se sente travado.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
                Já tentou mudar, já tentou se organizar, já consumiu conteúdos…<br />
                Mas tudo parece desconectado, confuso e difícil de manter no longo prazo.
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-6">
                Falta um sistema.
              </p>
            </div>
            
            <div className="pt-6 space-y-4">
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                E é exatamente isso que o PDI – Carreira e Vida se tornou.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                O PDI não é mais apenas um plano.<br />
                Ele evoluiu para um <strong className="text-foreground">sistema completo</strong>, que integra vida pessoal, carreira, decisões financeiras e execução prática — tudo no mesmo lugar, de forma simples e aplicável.
              </p>
            </div>
            
            <div className="py-8">
              <p className="text-base sm:text-lg text-foreground mb-6">
                Um método que te ajuda a:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-primary">Planejar</p>
                  <p className="text-sm text-muted-foreground">com clareza</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-primary">Agir</p>
                  <p className="text-sm text-muted-foreground">com consistência</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-semibold text-primary">Evoluir</p>
                  <p className="text-sm text-muted-foreground">com direção</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-base sm:text-lg text-muted-foreground">
              <p>Sem depender de motivação passageira.</p>
              <p>Sem fórmulas milagrosas.</p>
              <p>Sem promessas vazias.</p>
            </div>
            
            <div className="pt-6 space-y-4">
              <p className="text-base sm:text-lg text-foreground leading-relaxed">
                A evolução na carreira e na vida não acontece por acaso.<br />
                Ela é consequência direta de <strong className="text-primary">decisões certas aplicadas de forma contínua</strong>.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Continuar fazendo tudo do mesmo jeito só garante o mesmo resultado.<br />
                Se você quer uma vida diferente, precisa de uma estrutura diferente.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 sm:p-8 mt-8">
              <p className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                O Sistema PDI – Carreira e Vida existe para isso:
              </p>
              <div className="space-y-2 text-base sm:text-lg">
                <p className="text-foreground">Transformar <span className="text-primary font-medium">confusão</span> em <span className="text-primary font-medium">clareza</span>.</p>
                <p className="text-foreground"><span className="text-primary font-medium">Intenção</span> em <span className="text-primary font-medium">ação</span>.</p>
                <p className="text-foreground"><span className="text-primary font-medium">Esforço</span> em <span className="text-primary font-medium">progresso real</span>.</p>
              </div>
            </div>
            
            <div className="pt-8 space-y-4">
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                Prepare-se para assumir o controle da sua trajetória.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Porque quando você aplica um plano prático e organizado, a evolução deixa de ser uma promessa e passa a ser <strong className="text-foreground">inevitável</strong>.
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary pt-4">
                Agora é a sua vez de planejar, agir e alcançar.
              </p>
              <Button 
                size="lg" 
                className="mt-6 text-base sm:text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/signup")}
              >
                Começar já
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* O PROBLEMA - 92% das pessoas */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium text-sm sm:text-base">A maioria das pessoas não falha por falta de vontade</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              92% das pessoas não alcançam os objetivos que definem.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Estudos amplamente citados, como os da University of Scranton, mostram que apenas cerca de 8% conseguem sustentar metas ao longo do tempo.
            </p>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/30 mb-8">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center space-y-4">
                <p className="text-base sm:text-lg text-foreground font-medium">
                  👉 O problema não é querer.
                </p>
                <p className="text-base sm:text-lg text-foreground font-medium">
                  👉 É não ter um sistema que sustente a ação.
                </p>
                <p className="text-muted-foreground mt-6">
                  A maioria até começa…<br />
                  <span className="text-lg">mas desiste nos primeiros meses.</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Por que isso acontece? */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-6">
              Por que isso acontece?
            </h3>
            <p className="text-center text-muted-foreground mb-6">Porque, sem estrutura:</p>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Metas ficam vagas ou genéricas",
                "Não há prazos, indicadores ou etapas claras",
                "A intenção não vira ação",
                "O cérebro prefere alívio imediato à execução contínua",
                "Maus hábitos vencem boas intenções"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border/50">
                  <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-center text-muted-foreground mt-6 italic">
              Mesmo pessoas competentes acabam presas nesse padrão.
            </p>
          </div>

          {/* O que acontece quando você tenta... */}
          <Card className="border-destructive/20 bg-gradient-to-br from-card to-destructive/5 mb-8">
            <CardContent className="p-8 sm:p-12">
              <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-6">
                O que acontece quando você tenta várias vezes e não consegue?
              </h3>
              <p className="text-center text-muted-foreground mb-6">Com o tempo, o pensamento muda:</p>
              
              <div className="space-y-3 max-w-xl mx-auto">
                <p className="text-center text-muted-foreground">
                  "Ainda não consegui" vira <strong className="text-foreground">"eu não consigo"</strong>
                </p>
                <p className="text-center text-muted-foreground">Surgem culpa, frustração e dúvida</p>
                <p className="text-center text-muted-foreground">A pessoa passa a evitar novos compromissos</p>
                <p className="text-center text-muted-foreground">
                  <strong className="text-foreground">Procrastinação deixa de ser preguiça — vira autoproteção emocional</strong>
                </p>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">Externamente, parece falta de disciplina.</p>
                <p className="text-sm text-foreground font-medium">Internamente, é medo de confirmar o fracasso.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CICLO DA ESCASSEZ */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <RefreshCcw className="h-6 w-6 text-destructive" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                O ciclo da escassez
              </h2>
            </div>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-br from-destructive/5 to-card mb-8">
            <CardContent className="p-6 sm:p-12">
              {/* Mobile: vertical layout */}
              <div className="flex sm:hidden flex-col items-center gap-2 text-sm text-muted-foreground">
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">Tenta</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">falha ou abandona</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">Sente frustração e culpa</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">Passa a duvidar de si</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">Evita novas tentativas</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-card rounded-lg border w-full text-center">Perde oportunidades</span>
                <ArrowRight className="h-4 w-4 text-destructive rotate-90" />
                <span className="px-4 py-2 bg-destructive/10 rounded-lg border border-destructive/30 font-medium text-destructive w-full text-center">Confirma a crença de incapacidade</span>
              </div>
              
              {/* Desktop: horizontal layout */}
              <div className="hidden sm:flex flex-wrap justify-center items-center gap-4 text-base text-muted-foreground">
                <span className="px-3 py-2 bg-card rounded-lg border">Tenta</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-card rounded-lg border">falha ou abandona</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-card rounded-lg border">Sente frustração e culpa</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-card rounded-lg border">Passa a duvidar de si</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-card rounded-lg border">Evita novas tentativas</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-card rounded-lg border">Perde oportunidades</span>
                <ArrowRight className="h-4 w-4 text-destructive" />
                <span className="px-3 py-2 bg-destructive/10 rounded-lg border border-destructive/30 font-medium text-destructive">Confirma a crença de incapacidade</span>
              </div>
              
              <p className="text-center text-muted-foreground mt-8 font-medium">
                Esse ciclo se autoalimenta.
              </p>
            </CardContent>
          </Card>

          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-4">Se mantido por anos, pode gerar:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Estagnação profissional e financeira",
                "Sensação de \"vida não vivida\"",
                "Ansiedade e perda de propósito"
              ].map((item, i) => (
                <span key={i} className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground mt-4 italic">
              Muitas pessoas descrevem isso como <strong>ver a vida passar</strong>.
            </p>
          </div>

          {/* Ponto essencial */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Um ponto essencial</span>
              </div>
              
              <p className="text-lg sm:text-xl text-foreground font-bold mb-4">
                Esse padrão não define quem você é.
              </p>
              <p className="text-muted-foreground mb-4">
                Ele reflete processos aprendidos, crenças construídas e estratégias emocionais que um dia protegeram — mas que hoje não servem mais.
              </p>
              <p className="text-primary font-bold text-lg">
                👉 E tudo que foi aprendido pode ser reconstruído.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* O PDI NÃO É SÓ ORGANIZAÇÃO */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              O PDI não é só organização
            </h2>
            <p className="text-xl sm:text-2xl text-primary font-bold">
              É reconstrução de direção
            </p>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/30 mb-12">
            <CardContent className="p-8 sm:p-12">
              <p className="text-center text-muted-foreground mb-6">
                O PDI entrega organização, controle de objetivos, gestão de tempo e produtividade.<br />
                Mas essas são <strong className="text-foreground">ferramentas intermediárias</strong>.
              </p>
              <p className="text-center text-xl sm:text-2xl text-primary font-bold">
                O resultado final é outro.
              </p>
            </CardContent>
          </Card>

          {/* O que você vai conquistar */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-8">
              O que você vai conquistar:
            </h3>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-8 sm:p-12">
                <ul className="space-y-4 text-base sm:text-lg text-muted-foreground">
                  {[
                    "Sentir que sua vida está indo para algum lugar",
                    "Ter controle real sobre suas escolhas",
                    "Parar de viver com o medo de estar desperdiçando a própria vida",
                    "Construir um futuro melhor do que o presente",
                    "Sentir orgulho do caminho que está trilhando",
                    "Ter paz interna por saber que está fazendo o que precisa ser feito"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 text-center">
                  <p className="text-lg sm:text-xl text-primary font-bold">
                    👉 Você dá um basta definitivo no ciclo da escassez.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* O papel do PDI nessa transformação */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-8">
              O papel do PDI nessa transformação
            </h3>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-card">
              <CardContent className="p-8 sm:p-12">
                <p className="text-base sm:text-lg text-muted-foreground mb-6 text-center">
                  O PDI transforma:
                </p>
                <div className="space-y-3 text-base sm:text-lg text-center">
                  <p><span className="text-muted-foreground">desejo</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-foreground font-medium">direção</span></p>
                  <p><span className="text-muted-foreground">confusão</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-foreground font-medium">clareza</span></p>
                  <p><span className="text-muted-foreground">vontade</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-foreground font-medium">plano</span></p>
                  <p><span className="text-muted-foreground">plano</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-foreground font-medium">execução</span></p>
                  <p><span className="text-muted-foreground">execução</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-foreground font-medium">resultado</span></p>
                  <p><span className="text-muted-foreground">resultado</span> <ArrowRight className="inline w-4 h-4 mx-2 text-primary" /> <span className="text-primary font-bold">orgulho pessoal</span></p>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-base sm:text-lg text-muted-foreground italic">
                    E esse orgulho não vem do que você "conquistou fora".<br />
                    <span className="text-foreground font-medium">Vem do que você se tornou no processo.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA INTERMEDIÁRIO */}
      <div className="py-8 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Button 
            size="lg" 
            className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 whitespace-normal leading-tight max-w-full"
            onClick={() => navigate("/signup")}
          >
            <span className="sm:hidden">Acesse Grátis</span>
            <span className="hidden sm:flex items-center gap-2">
              👉 Acesse Grátis
              <ArrowRight className="h-5 w-5 flex-shrink-0" />
            </span>
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* COMO O PDI FUNCIONA - 3 PASSOS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Como funciona na prática
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como o PDI funciona na prática
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              O PDI não é algo que você configura uma vez e esquece.<br />
              Ele acompanha decisões reais, semana após semana.
            </p>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-8">
            Um caminho claro em 3 passos:
          </h3>

          <div className="grid gap-6">
            {/* Passo 1 */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-primary/10 p-6 sm:p-8 flex items-center justify-center sm:w-24">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-6 w-6 text-primary" />
                      <h4 className="text-lg sm:text-xl font-bold text-foreground">Quem sou eu</h4>
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">Autoconhecimento</Badge>
                    <p className="text-muted-foreground mb-4">
                      Antes de decidir o futuro, você entende o presente: seus valores, limites, forças e o que não faz mais sentido.
                    </p>
                    <p className="text-sm text-primary font-medium italic">
                      Sem isso, qualquer caminho serve — e nenhum funciona.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 2 */}
            <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-secondary/10 p-6 sm:p-8 flex items-center justify-center sm:w-24">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Compass className="h-6 w-6 text-secondary" />
                      <h4 className="text-lg sm:text-xl font-bold text-foreground">Pra onde vou</h4>
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">Clareza do que realmente importa</Badge>
                    <p className="text-muted-foreground">
                      Você define objetivos certos para o momento certo. Menos metas. Mais avanço.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 3 */}
            <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-accent/10 p-6 sm:p-8 flex items-center justify-center sm:w-24">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Map className="h-6 w-6 text-accent" />
                      <h4 className="text-lg sm:text-xl font-bold text-foreground">Como vou chegar lá</h4>
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">Planejamento simples e possível</Badge>
                    <p className="text-muted-foreground mb-4">
                      Você transforma objetivos em planos do tamanho da sua rotina real — não da rotina perfeita.
                    </p>
                    <p className="text-sm text-accent font-medium italic">
                      Sem plano, todo objetivo vira frustração.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              👉 Esse é o caminho. Quer começar pelo passo 1?
            </p>
            <Button 
              size="lg" 
              className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 whitespace-normal leading-tight max-w-full"
              onClick={() => navigate("/signup")}
            >
              <span className="flex items-center justify-center gap-2 flex-wrap">
                <span>Quero experimentar o PDI</span>
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DEPOIMENTOS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Pessoas comuns. Resultados reais.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Depoimento 1 - Eric */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
              {/* Balão de destaque */}
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-lg z-10">
                Em Destaque
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Em poucos meses, consegui dar clareza ao que eu queria da vida e do trabalho. O PDI me ajudou a me organizar, definir prioridades e agir com consistência."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={ericPereira} 
                    alt="Eric Pereira" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Eric Pereira</p>
                    <a 
                      href="https://www.linkedin.com/in/ericqsf/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Eric Pereira"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("zMF2q2c4fRU")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 2 - Gabriele */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "O PDI me ajudou a enxergar padrões que eu mesma criava e que me impediam de avançar. 
                  Hoje tenho clareza sobre minhas prioridades e ajo com mais consistência."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={gabrieleCampos} 
                    alt="Gabriele Campos" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Gabriele Campos</p>
                    <a 
                      href="https://www.linkedin.com/in/gabriele-ribeiro-campos/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Gabriele Campos"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("NjEA4WBiUvA")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 3 - Larissa */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Eu estava travada há muito tempo. O PDI me ajudou a identificar o que me prendia e me deu 
                  ferramentas práticas para avançar."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={larissaSchuartz} 
                    alt="Larissa Schuartz" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Larissa Schuartz</p>
                    <a 
                      href="https://www.linkedin.com/in/larissa-dos-santos-schuartz-17a7aa189/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Larissa Schuartz"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setVideoModalUrl("Tpz2mmxUYHc")}
                  className="flex items-center justify-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento completo</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 4 - Lucas */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Em 6 meses conquistei mais do que nos últimos 3 anos."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={lucasSa} 
                    alt="Lucas Sá" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Lucas Sá</p>
                    <a 
                      href="https://www.linkedin.com/in/lucazartu/?locale=pt_BR" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      aria-label="LinkedIn de Lucas Sá"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModalUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoModalUrl(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setVideoModalUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              Fechar ✕
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoModalUrl}?autoplay=1`}
              title="Depoimento"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EXPERIMENTE SEM RISCO */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 shadow-xl bg-card">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Experimente sem risco
              </h2>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>30 dias de uso completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Se continuar, ganha mais 30 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>2 meses grátis no total</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 whitespace-normal leading-tight max-w-full"
                onClick={() => navigate("/signup")}
              >
                <span className="flex items-center justify-center gap-2 flex-wrap">
                  <span>Acesse Grátis</span>
                  <ArrowRight className="h-5 w-5 flex-shrink-0" />
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* É PARA VOCÊ? */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            O PDI é para você?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* É para você */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  É para você se:
                </h3>
                <ul className="space-y-4">
                  {[
                    "Sente que pode mais, mas não sabe por onde começar",
                    "Quer organizar vida e carreira com método",
                    "Está disposto a dedicar alguns minutos por dia à sua evolução"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Não é para você */}
            <Card className="border-muted bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-muted-foreground mb-6 flex items-center gap-2">
                  <X className="h-6 w-6" />
                  Não é para você se:
                </h3>
                <ul className="space-y-4">
                  {[
                    "Busca resultados mágicos",
                    "Não quer se comprometer com o processo",
                    "Não tem 5 minutos por dia para investir em si mesmo"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <X className="h-5 w-5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              Se você se viu aqui, o próximo passo é simples.
            </p>
            <Button 
              size="lg" 
              className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 whitespace-normal leading-tight max-w-full"
              onClick={() => navigate("/signup")}
            >
              <span className="flex items-center justify-center gap-2 flex-wrap">
                <span>👉 Começar agora</span>
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
            Perguntas frequentes
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            O melhor momento para começar era ontem
          </h2>
          <p className="text-xl sm:text-2xl text-primary font-bold mb-8">
            O segundo melhor é agora
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Você já sabe o que precisa fazer.<br />
            Nós vamos te ajudar a <strong className="text-foreground">realmente fazer</strong>.
          </p>

          <Button 
            size="lg" 
            className="text-sm sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 whitespace-normal leading-tight max-w-full"
            onClick={() => navigate("/signup")}
          >
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <span>Assumir o Controle</span>
              <ArrowRight className="h-5 w-5 flex-shrink-0" />
            </span>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            No seu ritmo • Com suporte humano e Inteligência Artificial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PDI - Carreira e Vida. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LeadP;
