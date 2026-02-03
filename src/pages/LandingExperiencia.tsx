import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  UserPlus, Eye, EyeOff, Loader2, ArrowRight, Check, Star, Zap, Play, X,
  Compass, Cog, CalendarCheck, Target, Brain, Sparkles, Instagram
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LGPDConsentModal } from "@/components/lgpd/LGPDConsentModal";
import Logo from "@/components/Logo";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import WhatsAppButton from "@/components/WhatsAppButton";

// Import testimonial photos
import ericPereira from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleCampos from "@/assets/testimonials/gabriele-campos.jpg";
import larissaSchuartz from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasSa from "@/assets/testimonials/lucas-sa.jpg";

const LandingExperiencia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!lgpdAccepted) {
      toast.error("Você precisa aceitar os Termos de Uso e Política de Privacidade");
      return;
    }

    await performSignup();
  };

  const performSignup = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado. Faça login.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        const consents = [
          { user_id: data.user.id, consent_type: 'terms_of_service' },
          { user_id: data.user.id, consent_type: 'privacy_policy' },
          { user_id: data.user.id, consent_type: 'data_processing' },
        ];

        await supabase
          .from('user_consents')
          .upsert(consents, { onConflict: 'user_id,consent_type' });

        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: "user",
          createdAt: new Date().toISOString()
        }));

        localStorage.setItem('lgpd_consent_accepted', 'true');
        localStorage.setItem('lgpd_consent_date', new Date().toISOString());

        supabase.functions.invoke('send-welcome-email', {
          body: {
            name: formData.name,
            email: formData.email,
          },
        }).catch((emailError) => {
          console.error('Error sending welcome email:', emailError);
        });

        toast.success("Cadastro realizado! Você tem 30 dias de acesso gratuito.");
        navigate("/onboarding?signup=success");
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSignup = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* ============================================================ */}
      {/* SIGNUP SECTION - No topo */}
      {/* ============================================================ */}
      <section className="pt-8 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-large bg-[#222222] border-gray-700">
            <CardHeader className="space-y-2 text-center pb-4 sm:pb-6">
              <div className="flex justify-center mb-2">
                <Logo size="lg" showText={false} />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">PDI - Carreira & Vida</CardTitle>
              <CardDescription className="text-gray-400">
                Um sistema para organizar seus objetivos com clareza.
              </CardDescription>
              <div className="pt-4">
                <p className="text-lg font-bold text-[#d4a853] mb-2">
                  Acesso completo por 30 dias
                </p>
                <p className="text-sm text-gray-400">
                  Use o sistema completo por 30 dias para estruturar seus objetivos, metas e próximos passos com mais clareza.
                  <br />
                  Sem compromisso. Cancele quando quiser.
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Como podemos te chamar?</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500">Usado para salvar seu progresso e acessar o sistema.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Crie uma senha para acessar sua conta</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pr-10 bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="lgpd-preview" 
                    checked={lgpdAccepted}
                    onCheckedChange={(checked) => setLgpdAccepted(checked === true)}
                    disabled={isLoading}
                    className="border-gray-600 data-[state=checked]:bg-[#d4a853] data-[state=checked]:border-[#d4a853]"
                  />
                  <label htmlFor="lgpd-preview" className="text-xs text-gray-400 cursor-pointer leading-relaxed">
                    Ao criar sua conta, você concorda com os{" "}
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowLGPDModal(true);
                      }}
                      className="text-[#d4a853] hover:underline"
                    >
                      Termos de Uso e Política de Privacidade
                    </button>
                    .
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-4 sm:mt-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-semibold" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Processando..." : "Acessar o sistema"}
                </Button>
                <p className="text-center text-xs text-gray-500">Leva menos de 1 minuto</p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Já tem conta?{" "}
                  <Link to="/login" className="text-[#d4a853] hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DE PROBLEMA - A Conexão com a Persona */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-[#222222]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Por que pessoas se esforçam tanto mas não alcançam{" "}
              <span className="text-[#d4a853]">resultados?</span>
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

            <div className="relative mt-8 bg-gradient-to-br from-[#d4a853]/20 via-[#d4a853]/10 to-[#1a1a1a] rounded-2xl p-6 sm:p-8 border-2 border-[#d4a853] shadow-[0_0_30px_rgba(212,168,83,0.3)]">
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
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEÇÃO DE MÉTODO - O Sistema Operacional */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              O Sistema Operacional da{" "}
              <span className="text-[#d4a853]">Vida Consciente.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              O PDI não é um "balde de tarefas". É um sistema guiado que traduz sua visão em execução, em <strong className="text-[#d4a853] font-semibold">3 grandes pilares</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-[#d4a853]/30 hover:border-[#d4a853]/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4a853]/30 to-[#d4a853]/10 flex items-center justify-center mb-6">
                <Compass className="h-7 w-7 text-[#d4a853]" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#d4a853] bg-[#d4a853]/20 px-2 py-1 rounded-full">1</span>
                <h3 className="text-xl font-bold text-white">A Identidade</h3>
              </div>
              <p className="text-sm font-medium text-[#d4a853] mb-2">Você define o Ponto de Partida</p>
              <p className="text-gray-400 leading-relaxed">
                Defina seus valores e Visão de Vida Desejada. Onde você quer estar daqui a 5 anos?
              </p>
            </div>

            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 flex items-center justify-center mb-6">
                <Cog className="h-7 w-7 text-purple-400" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">2</span>
                <h3 className="text-xl font-bold text-white">A Estratégia</h3>
              </div>
              <p className="text-sm font-medium text-purple-400 mb-2">O Sistema estrutura o Plano</p>
              <p className="text-gray-400 leading-relaxed">
                O PDI quebra esse desejo grande em Objetivos, Metas e Projetos organizados.
              </p>
            </div>

            <div className="bg-[#252525] rounded-2xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 flex items-center justify-center mb-6">
                <CalendarCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">3</span>
                <h3 className="text-xl font-bold text-white">A Execução</h3>
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
      {/* SEÇÃO DE FUNCIONALIDADES */}
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
                <p className="text-sm text-gray-400">Se sente perdido? Peça ajuda para nosso mentor de IA, que vai te ajudar a ter clareza do próximo passo a executar.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button 
              size="lg" 
              onClick={scrollToSignup}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-semibold"
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROVA SOCIAL - Depoimentos */}
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
      {/* RODAPÉ DE CONVERSÃO - CTA Final */}
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
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              onClick={scrollToSignup}
              className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 bg-[#d4a853] hover:bg-[#c49843] text-[#1a1a1a] font-bold uppercase tracking-wide w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              Começar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              Recupere clareza e direção nos primeiros 7 dias.
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

      {/* Modal LGPD */}
      <LGPDConsentModal 
        open={showLGPDModal}
        onClose={() => setShowLGPDModal(false)}
      />

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

export default LandingExperiencia;
