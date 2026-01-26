import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  ArrowRight,
  User,
  Building2,
  Check,
  Star,
  Zap,
  Play,
  X,
  Compass,
  Cog,
  CalendarCheck,
  Target,
  Brain,
  Sparkles
} from "lucide-react";
import logoPdi from "@/assets/logo_pdi.png";
import WhatsAppButton from "@/components/WhatsAppButton";

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";


const LandingNova = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const handlePessoaFisicaClick = () => {
    setIsModalOpen(false);
    navigate("/signup");
  };

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <img src={logoPdi} alt="PDI" className="h-10 w-10 object-contain" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/login')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              O Painel de Controle da sua{" "}
              <span className="text-[#d4a853]">Vida Pessoal e Profissional.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#d4a853] font-medium mb-4">
              Um sistema para organizar decisões, não apenas tarefas.
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Se você sente que planeja muito mas sua vida não avança, o problema não é você. 
              É a falta de um método que conecte sua identidade à sua agenda de segunda-feira.
            </p>
            
            {/* CTA Principal */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <Button 
                size="lg" 
                onClick={handleCTAClick}
                className="text-lg px-8 py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-bold uppercase tracking-wide"
              >
                Começar Teste Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                30 dias gratuitos • Sem cartão de crédito • Acesso imediato
              </p>
            </div>

            {/* Video Section */}
            <div className="w-full max-w-3xl mx-auto">
              <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-700" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/F50nE1vYjaY?rel=0&controls=1"
                  title="PDI - Carreira e Vida"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SEÇÃO DE PROBLEMA - A Conexão com a Persona */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-[#222222]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Por que pessoas organizadas continuam{" "}
              <span className="text-[#d4a853]">frustradas?</span>
            </h2>
          </div>
          
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-red-500/30">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <X className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">O Erro Comum:</p>
                <p className="text-gray-400">
                  Você anota tudo em listas ou apps, mas a sensação de sobrecarga nunca passa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-amber-500/30">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <X className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">O Sintoma:</p>
                <p className="text-gray-400">
                  Sua agenda está cheia de urgências, mas seus projetos pessoais de longo prazo estão parados.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-[#d4a853]/30">
              <div className="w-8 h-8 rounded-full bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-[#d4a853]" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">A Verdade:</p>
                <p className="text-gray-400">
                  Você está tentando gerenciar <strong className="text-white">tarefas (o ruído)</strong>, 
                  quando deveria estar gerenciando <strong className="text-[#d4a853]">decisões (o essencial)</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SEÇÃO DE MÉTODO - O Sistema Operacional */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              O Sistema Operacional da{" "}
              <span className="text-[#d4a853]">Vida Consciente.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              O PDI não é um "balde de tarefas". É um sistema guiado que traduz sua visão em execução.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Coluna 1: A Raiz (Identidade) */}
            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-[#d4a853]/30 hover:border-[#d4a853]/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4a853]/30 to-[#d4a853]/10 flex items-center justify-center mb-6">
                <Compass className="h-7 w-7 text-[#d4a853]" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#d4a853] bg-[#d4a853]/20 px-2 py-1 rounded-full">1</span>
                <h3 className="text-xl font-bold text-white">A Raiz (Identidade)</h3>
              </div>
              <p className="text-sm font-medium text-[#d4a853] mb-2">Você define o Ponto de Partida</p>
              <p className="text-gray-400 leading-relaxed">
                Defina seus valores e Visão de Vida Desejada. Onde você quer estar daqui a 5 anos?
              </p>
            </div>

            {/* Coluna 2: O Tronco (Estratégia) */}
            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 flex items-center justify-center mb-6">
                <Cog className="h-7 w-7 text-purple-400" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text--purple-400 bg-purple-500/20 px-2 py-1 rounded-full">2</span>
                <h3 className="text-xl font-bold text-white">O Tronco (Estratégia)</h3>
              </div>
              <p className="text-sm font-medium text-purple-400 mb-2">O Sistema estrutura o Plano</p>
              <p className="text-gray-400 leading-relaxed">
                O PDI quebra esse desejo grande em Objetivos, Metas e Projetos organizados.
              </p>
            </div>

            {/* Coluna 3: A Ação (Execução) */}
            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center mb-6">
                <CalendarCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">3</span>
                <h3 className="text-xl font-bold text-white">A Ação (Execução)</h3>
              </div>
              <p className="text-sm font-medium text-emerald-400 mb-2">Você executa na Agenda</p>
              <p className="text-gray-400 leading-relaxed">
                O sistema blinda seu tempo e entrega apenas o próximo passo. Sem ansiedade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SEÇÃO DE FUNCIONALIDADES */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-[#222222]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Tudo o que você precisa para{" "}
              <span className="text-[#d4a853]">sair do caos.</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-[#d4a853]" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Gestão de Identidade</h4>
                <p className="text-sm text-gray-400">Pare de construir o teto antes da fundação. Defina quem você é para saber para onde ir.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Metas SMART Guiadas</h4>
                <p className="text-sm text-gray-400">Transforme sonhos vagos em planos concretos com prazos e métricas claras.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Agenda Inteligente</h4>
                <p className="text-sm text-gray-400">Não é sobre encaixar mais coisas. É sobre garantir tempo para o que é essencial.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#1a1a1a] rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Mentor IA Estratégico</h4>
                <p className="text-sm text-gray-400">Travou? Nossa IA analisa seus objetivos e sugere o próximo passo para destravar sua ação.</p>
              </div>
            </div>
          </div>

          {/* CTA Intermediário */}
          <div className="text-center mt-10">
            <Button 
              size="lg" 
              onClick={handleCTAClick}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-semibold"
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROVA SOCIAL - Depoimentos */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 mb-4 bg-[#d4a853]/20 text-[#d4a853] text-xs sm:text-sm px-4 py-1.5 rounded-full border border-[#d4a853]/30">
              <Sparkles className="h-3.5 w-3.5" />
              Histórias reais
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Quem já usa, <span className="text-[#d4a853]">recomenda.</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Depoimento 1 - Eric */}
            <Card className="border-gray-700 bg-[#252525]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  "O PDI me deu a clareza que eu precisava para sair do piloto automático. 
                  Pela primeira vez, sinto que minhas ações diárias estão conectadas com algo maior."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={ericPereira} 
                    alt="Eric Pereira" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-medium text-white">Eric Pereira</p>
                </div>
                <button
                  onClick={() => setVideoModalUrl("i1VgEBOW4PI")}
                  className="flex items-center justify-center gap-2 text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 2 - Gabriele */}
            <Card className="border-gray-700 bg-[#252525]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  "O PDI me ajudou a enxergar padrões que eu mesma criava. 
                  O processo de reflexão foi transformador — hoje tenho clareza sobre minhas prioridades."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={gabrieleCampos} 
                    alt="Gabriele Campos" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-medium text-white">Gabriele Campos</p>
                </div>
                <button
                  onClick={() => setVideoModalUrl("NjEA4WBiUvA")}
                  className="flex items-center justify-center gap-2 text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 3 - Larissa */}
            <Card className="border-gray-700 bg-[#252525]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  "Eu estava travada há muito tempo. O PDI me ajudou a 
                  identificar o que estava me prendendo e me deu ferramentas práticas para superar."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={larissaSchuartz} 
                    alt="Larissa Schuartz" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-medium text-white">Larissa Schuartz</p>
                </div>
                <button
                  onClick={() => setVideoModalUrl("Tpz2mmxUYHc")}
                  className="flex items-center justify-center gap-2 text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors mt-3 w-full"
                >
                  <Play className="h-4 w-4" />
                  <span>Assista o depoimento</span>
                </button>
              </CardContent>
            </Card>

            {/* Depoimento 4 - Lucas */}
            <Card className="border-gray-700 bg-[#252525]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  "Antes do PDI eu tinha muitos objetivos, mas nenhuma organização. 
                  O sistema me ensinou a priorizar e executar de forma consistente."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={lucasSa} 
                    alt="Lucas Sá" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm font-medium text-white">Lucas Sá</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. RODAPÉ DE CONVERSÃO - CTA Final */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 px-4 bg-[#222222]">
        <div className="container mx-auto max-w-3xl text-center">
          <Zap className="h-12 w-12 text-[#d4a853] mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
            Organize sua vida nos próximos 30 dias,{" "}
            <span className="text-[#d4a853]">de graça.</span>
          </h2>
          <p className="text-gray-400 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
            Acesse a plataforma completa. Se em um mês você não sentir que recuperou o controle do seu tempo, 
            você não paga nada. Simples assim.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              onClick={handleCTAClick}
              className="text-lg px-10 py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-bold uppercase tracking-wide"
            >
              Criar Minha Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-12 sm:py-16 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-white">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#252525] border border-gray-700">
              <p className="font-medium mb-2 text-sm sm:text-base text-white">Preciso de experiência com desenvolvimento pessoal?</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Não. O PDI foi feito para qualquer pessoa que queira mais clareza e direção na vida — 
                iniciantes ou experientes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#252525] border border-gray-700">
              <p className="font-medium mb-2 text-sm sm:text-base text-white">Quanto tempo preciso dedicar por dia?</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                5 a 10 minutos são suficientes para manter seu diário e acompanhar seu progresso.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#252525] border border-gray-700">
              <p className="font-medium mb-2 text-sm sm:text-base text-white">Posso cancelar a qualquer momento?</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Sim. Sem burocracia, sem perguntas. Mas apostamos que você vai querer ficar.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button variant="link" onClick={() => navigate("/faq")} className="text-[#d4a853]">
              Ver todas as perguntas →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 border-t border-gray-800 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            <p>© 2024 PDI - Carreira & Vida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Registration Type Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Como deseja se cadastrar?</DialogTitle>
            <DialogDescription className="text-center">
              Escolha a opção que melhor se aplica a você
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={handlePessoaFisicaClick}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Pessoa Física</div>
                <div className="text-sm text-muted-foreground">Quero criar meu PDI pessoal</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5"
              onClick={() => {
                setIsModalOpen(false);
                navigate("/empresas");
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Sou Empresa</div>
                <div className="text-sm text-muted-foreground">Conheça o PDI corporativo</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!videoModalUrl} onOpenChange={() => setVideoModalUrl(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black border-none">
          <div className="relative pt-[56.25%]">
            {videoModalUrl && (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoModalUrl}?autoplay=1`}
                title="Depoimento"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <button 
            onClick={() => setVideoModalUrl(null)}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingNova;
