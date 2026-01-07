import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  TrendingUp, 
  Brain, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Eye,
  Layout,
  BarChart3,
  Cpu,
  Calendar,
  Compass,
  Star,
  Play
} from "lucide-react";
import Logo from "@/components/Logo";
import ToolsSection from "@/components/landing/ToolsSection";
import { StoicReflectionLanding } from "@/components/landing/StoicReflectionLanding";

// Import platform images
import planoDeVidaScreenshot from "@/assets/plano-de-vida-screenshot.png";
import vvdScreenshot from "@/assets/vvd-screenshot.png";
import smartScreenshot from "@/assets/smart-screenshot.png";
import progressoScreenshot from "@/assets/progresso-screenshot.png";
import ferramentasScreenshot from "@/assets/ferramentas-screenshot.png";

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
    document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const platformFeatures = [
    {
      icon: Eye,
      title: "Sua Vida, Sua Carreira: Uma Visão Integrada",
      description: "Tenha uma perspectiva clara de todos os aspectos importantes da sua vida e carreira em um só lugar.",
      image: planoDeVidaScreenshot
    },
    {
      icon: Target,
      title: "Clareza para o Futuro",
      description: "Defina seus objetivos de forma estratégica e alinhada com seus valores e aspirações.",
      image: vvdScreenshot
    },
    {
      icon: Layout,
      title: "Do Planejamento à Execução",
      description: "Transforme seus objetivos em planos de ação concretos e gerenciáveis.",
      image: smartScreenshot
    },
    {
      icon: BarChart3,
      title: "Evolução Constante",
      description: "Monitore seu progresso de forma visual e intuitiva, mantendo-se motivado e no caminho certo.",
      image: progressoScreenshot
    },
    {
      icon: Cpu,
      title: "Inteligência Artificial a Seu Favor",
      description: "Conte com o suporte da IA para insights, sugestões e otimização contínua do seu planejamento.",
      image: ferramentasScreenshot
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-primary border-primary/30 hover:bg-primary/10 text-xs sm:text-sm"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1) HERO SECTION - ABERTURA REFLEXIVA */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-36 pb-4 sm:pb-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-4xl text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-foreground leading-tight">
            No fundo, todo ser humano só quer viver uma vida que faça sentido — e ter certeza de que está fazendo a própria parte para construí-la.
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-6 font-light">
            Você vai saber para onde vai, o que fazer e dormir em paz sabendo que está no caminho certo.
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground/80 mt-8 mb-0">
            entenda como o Sistema PDI funciona
          </p>
          
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DE VÍDEO */}
      {/* ============================================================ */}
      <section id="video-section" className="pt-0 pb-4 sm:pb-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/30 bg-muted/50">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/R4oKexScqXU${videoPlaying ? '?autoplay=1' : ''}`}
              title="Apresentação PDI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="text-center text-base sm:text-lg text-muted-foreground mt-4 italic">
            Finalmente dê vida àquele objetivo que você engavetou, começou, parou — e quase esqueceu que ainda importava.
          </p>
          
          {/* CTA após vídeo */}
          <div className="text-center mt-10">
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">R$ 67,00</span>
              <span className="text-muted-foreground">/ano</span>
            </div>
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Quero experimentar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="mt-6 p-6 rounded-xl border border-border/50 bg-muted/20">
              <p className="text-sm sm:text-base text-muted-foreground">
                <strong>Você não precisa pagar agora.</strong><br />
                Use o sistema por 30 dias e veja como ele se encaixa na sua rotina.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  30 dias de uso real
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  cancelamento livre
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  cobrança só após esse período
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 2) SEÇÃO DE CONTEXTO E DESEJO */}
      {/* ============================================================ */}
      <section id="contexto" className="py-10 sm:py-14 px-4 bg-muted/20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Você não consegue colocar seus planos em prática, porque manter constância é difícil.
          </h2>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3) SEÇÃO DO PROBLEMA REAL */}
      {/* ============================================================ */}
      <section className="pt-0 pb-16 sm:pb-24 px-4 -mt-6">
        <div className="container mx-auto max-w-4xl">
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-8 sm:p-12">
              <div className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-center space-y-4">
                <p>Os dias passam entre urgências resolvidas e incêndios apagados.</p>
                <p>Tudo se mistura na cabeça: planos, responsabilidades, ideias e cobranças que vêm de fora e de dentro.</p>
                <p>No fim do dia vem o cansaço — no meio do ano o desânimo — no final do ano a frustração. E a percepção de que o tempo avança, e a gente continua na mesma, sem avanço. Bate o medo, a ansiedade, a angústia, e nos sentimos perdidos, sem saber o que fazer.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4) APRESENTAÇÃO DO MÉTODO PDI */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 px-4 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
              O PDI: Seu Sistema de Organização Pessoal
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              O PDI é um <strong className="text-foreground">sistema prático de organização de vida e carreira</strong>, 
              desenvolvido para oferecer clareza e direção. Com acompanhamento contínuo e o apoio da inteligência artificial, 
              ele foi criado para te ajudar a navegar pelas complexidades do dia a dia com mais segurança e propósito.
            </p>
            
            <p className="text-lg sm:text-xl md:text-2xl text-foreground font-medium leading-relaxed mt-8">
              Não é algo que você configura uma vez e esquece.
              <br />
              <span className="text-primary">É um sistema que acompanha decisões reais, semana após semana.</span>
            </p>
          </div>

          {/* 3 Pilares do Método */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                phase: "Autoconhecimento",
                icon: Brain,
                description: "Descubra seus valores, crenças e o que realmente importa para você através de ferramentas validadas."
              },
              {
                phase: "Planejamento",
                icon: Target,
                description: "Defina objetivos claros e construa um plano estruturado que conecta onde você está com onde quer chegar."
              },
              {
                phase: "Execução",
                icon: TrendingUp,
                description: "Transforme seu plano em ações diárias com acompanhamento contínuo e suporte inteligente."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary/50 bg-card">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.phase}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DOS 5 PASSOS DO SISTEMA PDI */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          {/* Título da seção */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              O Sistema PDI não é só um sistema.
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              É um caminho em 5 passos simples.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
              Você não avança na vida por força de vontade.<br />
              Você avança quando sabe quem é, onde quer chegar e o que fazer todos os dias.
            </p>
            <p className="text-base sm:text-lg text-foreground font-medium">
              O Sistema PDI organiza isso em 5 passos claros:
            </p>
          </div>

          <div className="space-y-12">
            {/* Passo 1 */}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-4 block">1️⃣</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Quem sou eu</h3>
              <p className="text-primary font-medium text-base sm:text-lg mb-4">Autoconhecimento</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Antes de decidir o futuro, você entende o presente:<br />
                seus valores, seus limites, seus pontos fortes e o que não faz mais sentido.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-3 italic">
                Sem isso, qualquer caminho serve — e nenhum funciona.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-4 block">2️⃣</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Pra onde vou</h3>
              <p className="text-primary font-medium text-base sm:text-lg mb-4">Clareza do que você quer</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Você define um destino claro.<br />
                Não um sonho vago, mas algo que você consegue explicar em poucas palavras.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-3 italic">
                Quem não sabe pra onde vai, se perde em qualquer rotina.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-4 block">3️⃣</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">O que eu quero conquistar</h3>
              <p className="text-primary font-medium text-base sm:text-lg mb-4">Objetivos certos</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Aqui você escolhe o que realmente importa agora,<br />
                em vez de tentar abraçar tudo ao mesmo tempo.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-3 italic">
                Menos objetivos. Mais avanço.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-4 block">4️⃣</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Como vou chegar lá</h3>
              <p className="text-primary font-medium text-base sm:text-lg mb-4">Planejamento simples</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Você transforma o objetivo em um plano possível,<br />
                do tamanho da sua rotina real — não da rotina perfeita.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-3 italic">
                Sem plano, todo objetivo vira frustração.
              </p>
            </div>

            {/* Passo 5 */}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-4 block">5️⃣</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Como vou manter</h3>
              <p className="text-primary font-medium text-base sm:text-lg mb-4">Execução guiada</p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Você executa com constância, mesmo nos dias difíceis,<br />
                porque sabe exatamente o próximo passo.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-3 italic">
                Não é sobre motivação. É sobre direção.
              </p>
            </div>
          </div>

          {/* Conclusão */}
          <div className="mt-16 text-center">
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-8 sm:p-10">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  O PDI funciona porque respeita a vida real
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                  Rotina cheia. Cansaço. Dúvidas. Pausas.<br />
                  O Sistema PDI foi feito para funcionar mesmo assim.
                </p>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("video-section")}
                  className="text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Entenda como o Sistema PDI pode organizar sua vida e seus objetivos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DE FERRAMENTAS */}
      {/* ============================================================ */}
      <ToolsSection />

      {/* ============================================================ */}
      {/* SEÇÃO DE REFLEXÃO ESTÓICA */}
      {/* ============================================================ */}
      <StoicReflectionLanding />

      {/* ============================================================ */}
      {/* 6) SEGURANÇA DE USO — GARANTIA DE 30 DIAS */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 shadow-xl bg-card">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Experimente Gratuitamente
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                Confiamos no poder transformador do PDI. Por isso, oferecemos a você a oportunidade de{" "}
                <strong className="text-foreground">usar o sistema completo por 30 dias, sem qualquer risco</strong>. 
                Você entra agora. Usa o sistema por 30 dias.
                <br />
                <strong className="text-foreground">A cobrança só acontece após esse período.</strong>
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>30 dias grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Cancele quando quiser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Sem burocracia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DEPOIMENTOS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Quem já transformou sua vida
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Depoimentos reais de quem viveu a jornada
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Pessoas comuns que decidiram investir em si mesmas e colheram resultados reais.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Depoimento 1 - Eric */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 leading-relaxed">
                  "Participar do PDI foi extremamente importante para mim. Além de sair com um plano de execução 
                  muito bem estruturado, ganhei conhecimento para repetir sozinho o ciclo de reflexão, planejamento 
                  e ação. Vale muito a pena."
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
                      href="https://www.linkedin.com/in/eric-pereira-b05a5611b/" 
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
                  onClick={() => setVideoModalUrl("i1VgEBOW4PI")}
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
                  O processo de reflexão foi transformador — hoje tenho clareza sobre minhas prioridades 
                  e consigo agir com muito mais consistência."
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
                  "Eu estava travada há muito tempo, sem saber exatamente por quê. O PDI me ajudou a 
                  identificar o que estava me prendendo e, mais importante, me deu ferramentas práticas 
                  para superar esses bloqueios. Recomendo muito!"
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
                  "Antes do PDI eu tinha muitos objetivos, mas nenhuma organização para alcançá-los. 
                  O sistema me ensinou a priorizar, planejar e executar de forma consistente. 
                  Em 6 meses conquistei mais do que nos últimos 3 anos."
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
      {/* 7) APRESENTAÇÃO DO LABORATÓRIO DE FUNDADORES */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Convite Especial
            </h2>
          </div>

          <Card className="border border-accent/30 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center">
                Estamos mantendo o valor de lançamento do produto (R$ 67,00), para tornar o produto acessível. Além de você ter 30 dias para usar e testar. Essas condições são por pouco tempo.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8) CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Dê o Próximo Passo com Confiança
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Comece hoje a construir a organização e a clareza que sua vida e carreira merecem. 
            Lembre-se: você tem <strong className="text-foreground">30 dias para experimentar o PDI sem risco</strong>.
          </p>

          <div className="mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">R$ 67,00</span>
            <span className="text-muted-foreground">/ano</span>
          </div>
          <Button 
            size="lg" 
            className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Experimentar agora
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            Acesso imediato • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FUNCIONALIDADES DA PLATAFORMA (VISUAL FIRST) */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">

          <div className="space-y-16 sm:space-y-24">
            {platformFeatures.map((feature, index) => (
              <div key={index}>
                <div 
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`space-y-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="rounded-xl shadow-xl w-full border border-border/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto max-w-3xl text-center">
          <Button 
            size="lg" 
            className="text-base sm:text-lg px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Comece agora
            <Sparkles className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDI - Carreira & Vida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
