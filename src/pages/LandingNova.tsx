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
  Sparkles,
  Instagram
} from "lucide-react";
import { motion } from "framer-motion";
import logoPdi from "@/assets/logo_pdi.png";
import WhatsAppButton from "@/components/WhatsAppButton";
import ExcellenteParaSection from "@/components/landing-nova/ExcellenteParaSection";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";


const LandingNova = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-center">
          <img src={logoPdi} alt="PDI" className="h-10 w-10 object-contain" />
        </div>
      </header>

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              Transforme semanas ocupadas em{" "}
              <span className="text-[#d4a853]">progresso real de vida e carreira.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Elimine excessos e distrações e comece a executar o que realmente gera resultados pra você.
            </p>
            {/* CTA Principal */}
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-bold uppercase tracking-wide"
              >
                Criar minha conta grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                Acesso gratuito • Sem cartão de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 1.5. SEÇÃO "EXCELENTE PARA" */}
      {/* ============================================================ */}
      <ExcellenteParaSection />

      {/* ============================================================ */}
      {/* 2. SEÇÃO DE PROBLEMA - A Conexão com a Persona */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-0 sm:px-4 bg-[#222222]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Por que pessoas se esforçam tanto mas não alcançam{" "}
              <span className="text-[#d4a853]">resultados?</span>
            </h2>
          </motion.div>
          
          <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            {[
              { label: "O Erro Comum:", text: "Você anota tudo em listas ou apps, mas a sensação de sobrecarga nunca passa.", color: "red", icon: X },
              { label: "O Sintoma:", text: "Sua agenda está cheia de urgências, mas seus projetos pessoais de longo prazo estão parados.", color: "amber", icon: X },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-4 bg-[#1a1a1a] sm:rounded-xl p-5"
              >
                <div className={`w-8 h-8 rounded-full bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{item.label}</p>
                  <p className="text-gray-400">{item.text}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeUp}
              className="flex items-start gap-4 bg-[#1a1a1a] sm:rounded-xl p-5"
            >
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
            </motion.div>

            {/* Destaque principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mt-8 bg-gradient-to-br from-[#d4a853]/20 via-[#d4a853]/10 to-[#1a1a1a] sm:rounded-2xl p-6 sm:p-8 border-y-2 sm:border-2 border-[#d4a853] shadow-[0_0_30px_rgba(212,168,83,0.3)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-max">
                <span className="bg-[#d4a853] text-[#1a1a1a] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">
                  O Problema Central
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#d4a853] mb-3 text-center mt-2">
                Falta de foco no essencial
              </h3>
              <p className="text-gray-300 text-center text-base sm:text-lg leading-relaxed">
                Você se esforça muito, mas executa tarefas que não geram grandes resultados. 
                <strong className="text-white"> Quando deveria ter ao menos uma tarefa no dia que faz você avançar.</strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SEÇÃO DE MÉTODO - O Sistema Operacional */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-0 sm:px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              O Sistema Operacional da{" "}
              <span className="text-[#d4a853]">Vida Consciente.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              O PDI não é um "balde de tarefas". É um sistema guiado que traduz sua visão em execução, em <strong className="text-[#d4a853] font-semibold">3 grandes pilares</strong>
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { num: "1", title: "A Identidade", subtitle: "Você define o Ponto de Partida", desc: "Defina seus valores e Visão de Vida Desejada. Onde você quer estar daqui a 5 anos?", Icon: Compass, accent: "#d4a853" },
              { num: "2", title: "A Estratégia", subtitle: "O Sistema estrutura o Plano", desc: "O PDI quebra esse desejo grande em Objetivos, Metas e Projetos organizados.", Icon: Cog, accent: "#a78bfa" },
              { num: "3", title: "A Execução", subtitle: "Você executa na Agenda", desc: "O sistema blinda seu tempo e entrega apenas o próximo passo. Sem ansiedade.", Icon: CalendarCheck, accent: "#34d399" },
            ].map((col, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#252525] sm:rounded-2xl p-6 sm:p-8 border-l-4 sm:border-l-0 sm:border-t-4 transition-shadow hover:shadow-xl hover:shadow-black/30"
                style={{ borderColor: `${col.accent}50` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${col.accent}20` }}
                >
                  <col.Icon className="h-7 w-7" style={{ color: col.accent }} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ color: col.accent, background: `${col.accent}20` }}
                  >
                    {col.num}
                  </span>
                  <h3 className="text-xl font-bold text-white">{col.title}</h3>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: col.accent }}>{col.subtitle}</p>
                <p className="text-gray-400 leading-relaxed">{col.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SEÇÃO DE FUNCIONALIDADES */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-0 sm:px-4 bg-[#222222]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Tudo o que você precisa para{" "}
              <span className="text-[#d4a853]">sair do caos.</span>
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
            {[
              { title: "Gestão de Identidade", desc: "Pare de construir o teto antes da fundação. Defina quem você é para saber para onde ir.", Icon: Target, accent: "#d4a853" },
              { title: "Metas SMART Guiadas", desc: "Transforme sonhos vagos em planos concretos com prazos e métricas claras.", Icon: Sparkles, accent: "#a78bfa" },
              { title: "Agenda Inteligente", desc: "Não é sobre encaixar mais coisas. É sobre garantir tempo para o que é essencial.", Icon: CalendarCheck, accent: "#34d399" },
              { title: "Mentor IA Estratégico", desc: "Se sente perdido? Peça ajuda para nosso mentor de IA, que vai te ajudar a ter clareza do próximo passo.", Icon: Brain, accent: "#22d3ee" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="flex items-start gap-4 bg-[#1a1a1a] sm:rounded-xl p-5"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feat.accent}20` }}
                >
                  <feat.Icon className="h-5 w-5" style={{ color: feat.accent }} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{feat.title}</h4>
                  <p className="text-sm text-gray-400">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Intermediário */}
          <div className="text-center mt-10 px-4 sm:px-0">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-semibold"
            >
              Criar minha conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Acesso gratuito • Sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROVA SOCIAL - Depoimentos */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-0 sm:px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-1.5 mb-4 bg-[#d4a853]/20 text-[#d4a853] text-xs sm:text-sm px-4 py-1.5 rounded-full border border-[#d4a853]/30">
              <Sparkles className="h-3.5 w-3.5" />
              Histórias reais
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Quem já usa, <span className="text-[#d4a853]">recomenda.</span>
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { name: "Eric Pereira", img: ericPereira, quote: "O PDI me deu a clareza que eu precisava para sair do piloto automático. Pela primeira vez, sinto que minhas ações diárias estão conectadas com algo maior.", videoId: "i1VgEBOW4PI" },
              { name: "Gabriele Campos", img: gabrieleCampos, quote: "O PDI me ajudou a enxergar padrões que eu mesma criava. O processo de reflexão foi transformador — hoje tenho clareza sobre minhas prioridades.", videoId: "NjEA4WBiUvA" },
              { name: "Larissa Schuartz", img: larissaSchuartz, quote: "Eu estava travada há muito tempo. O PDI me ajudou a identificar o que estava me prendendo e me deu ferramentas práticas para superar.", videoId: "Tpz2mmxUYHc" },
              { name: "Lucas Sá", img: lucasSa, quote: "Antes do PDI eu tinha muitos objetivos, mas nenhuma organização. O sistema me ensinou a priorizar e executar de forma consistente.", videoId: null },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#252525] sm:rounded-xl p-5 sm:p-6"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 italic mb-4 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <p className="text-sm font-medium text-white">{t.name}</p>
                </div>
                {t.videoId && (
                  <button
                    onClick={() => setVideoModalUrl(t.videoId)}
                    className="flex items-center justify-center gap-2 text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors mt-3 w-full"
                  >
                    <Play className="h-4 w-4" />
                    <span>Assista o depoimento</span>
                  </button>
                )}
              </motion.div>
            ))}
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
            Utilize nossa plataforma para organizar sua vida em 2026,{" "}
            <span className="text-[#d4a853]">gratuitamente.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Crie sua conta e comece agora mesmo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="bg-[#d4a853] hover:bg-[#c49943] text-black font-bold text-lg px-8 py-6"
              onClick={() => navigate("/signup")}
            >
              Criar minha conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              Acesso gratuito • Sem cartão de crédito
            </p>
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
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://www.instagram.com/pdicarreiraevida/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#d4a853]/10 flex items-center justify-center hover:bg-[#d4a853]/20 transition-colors"
            >
              <Instagram className="w-5 h-5 text-[#d4a853]" />
            </a>
            <p className="text-xs sm:text-sm text-gray-500">
              © 2024 PDI - Carreira & Vida. Todos os direitos reservados.
            </p>
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
              onClick={() => { setIsModalOpen(false); navigate("/signup"); }}
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
