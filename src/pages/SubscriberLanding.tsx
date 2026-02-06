import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Compass,
  Target,
  CheckCircle2,
  Calendar,
  Brain,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LGPDConsentModal } from "@/components/lgpd/LGPDConsentModal";
import Logo from "@/components/Logo";

const SubscriberLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

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
        
        navigate("/onboarding?signup=success");
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Compass,
      title: "Identidade",
      description: "Defina como quer viver\nantes de decidir o que fazer."
    },
    {
      icon: Target,
      title: "Objetivos / Estratégia",
      description: "Objetivos coerentes com a vida que você quer sustentar."
    },
    {
      icon: CheckCircle2,
      title: "Metas",
      description: "Poucas, essenciais e conectadas ao que importa."
    },
    {
      icon: Calendar,
      title: "Agenda / Execução",
      description: "O próximo passo aparece.\nO ruído some."
    },
    {
      icon: Brain,
      title: "Mentor IA",
      description: "Apoio para pensar melhor\nquando a clareza falha."
    }
  ];

  const clarityBenefits = [
    "o cansaço diminui antes mesmo dos resultados aparecerem",
    "decisões ficam menos dramáticas",
    "dizer \"não\" gera menos culpa",
    "a semana deixa de parecer uma reação em cadeia"
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            onClick={() => navigate("/login")}
            variant="ghost"
            className="text-[#D4AF37] hover:bg-[#D4AF37]/10 text-sm sm:text-base"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 pb-6 sm:pb-16 px-4 relative overflow-hidden min-h-[100dvh] sm:min-h-0 flex flex-col justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#D4AF37]/3" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-6xl">
          {/* Headlines - centered on all screens */}
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 text-white leading-tight">
              Você já percebeu onde sua vida está{" "}
              <span className="text-[#D4AF37]">desalinhada</span>.
            </h1>
            
            <h2 className="text-base sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed">
              Agora é hora de viver com mais clareza, intenção e direção.
            </h2>
          </div>

          {/* Mobile: Video only, full width */}
          <div className="lg:hidden w-full mb-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube-nocookie.com/embed/DM2O6USHJQg?autoplay=1&mute=1&loop=1&playlist=DM2O6USHJQg&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="PDI - Sistema de Clareza"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Desktop: Two columns - Video 9:16 left, Content right */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-10 items-center">
            {/* Video 9:16 - Left */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/DM2O6USHJQg?autoplay=1&mute=1&loop=1&playlist=DM2O6USHJQg&controls=0&modestbranding=1&rel=0&showinfo=0"
                  title="PDI - Sistema de Clareza"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* O que acontece agora - Right */}
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                O que acontece agora
              </h2>
              
              <div className="text-white/70 text-base md:text-lg leading-relaxed space-y-5">
                <p>
                  A partir daqui, você não vai aprender a fazer mais.<br />
                  Vai aprender a <span className="text-[#D4AF37] font-medium">decidir melhor</span>.
                </p>
                
                <p>
                  O sistema que você está prestes a acessar<br />
                  organiza a vida na única ordem que realmente sustenta:
                </p>
                
                <p className="text-[#D4AF37] font-medium text-lg md:text-xl">
                  vida → objetivo → metas → ações → passos → presença
                </p>
                
                <p>
                  Não para acelerar você.<br />
                  <span className="text-white font-medium">Para tirar peso.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que acontece agora - Mobile only */}
      <section className="lg:hidden py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            O que acontece agora
          </h2>
          
          <div className="text-white/70 text-base sm:text-lg leading-relaxed text-center space-y-6">
            <p>
              A partir daqui, você não vai aprender a fazer mais.<br />
              Vai aprender a <span className="text-[#D4AF37] font-medium">decidir melhor</span>.
            </p>
            
            <p>
              O sistema que você está prestes a acessar<br />
              organiza a vida na única ordem que realmente sustenta:
            </p>
            
            <p className="text-[#D4AF37] font-medium text-lg sm:text-xl">
              vida → objetivo → metas → ações → passos → presença
            </p>
            
            <p>
              Não para acelerar você.<br />
              <span className="text-white font-medium">Para tirar peso.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Nome do sistema */}
      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4">
            PDI — Planejamento e Decisão Intencional
          </p>
          <p className="text-white/70 text-lg sm:text-xl">
            Um sistema para voltar a confiar<br />
            nas próprias decisões.
          </p>
        </div>
      </section>

      {/* Formulário de Cadastro */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="bg-[#222222] border-[#D4AF37]/30">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
                Criar acesso ao seu sistema de clareza
              </h3>
              <p className="text-white/60 text-center text-sm mb-6">
                Leva menos de 1 minuto.<br />
                Nada aqui é definitivo.<br />
                Você pode sair quando quiser.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Como podemos te chamar?</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-[#1a1a1a] border-white/20 text-white placeholder:text-white/40 focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="bg-[#1a1a1a] border-white/20 text-white placeholder:text-white/40 focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">Crie uma senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pr-10 bg-[#1a1a1a] border-white/20 text-white placeholder:text-white/40 focus:border-[#D4AF37]"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
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
                    className="border-white/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                  />
                  <label htmlFor="lgpd-preview" className="text-xs text-white/50 cursor-pointer leading-relaxed">
                    Ao criar sua conta, você concorda com os{" "}
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowLGPDModal(true);
                      }}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Termos de Uso e Política de Privacidade
                    </button>
                    .
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1a1a1a] font-semibold py-6" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? "Processando..." : "Continuar com clareza"}
                </Button>
                
                <p className="text-center text-xs text-white/50">
                  Trial de 30 dias · sem cartão
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Já tem conta?{" "}
                  <Link to="/login" className="text-[#D4AF37] hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bloco de funcionalidades */}
      <section className="py-12 sm:py-16 px-4 bg-[#1d1d1d]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-10 text-center">
            O que sustenta decisões melhores no dia a dia
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-5 rounded-xl bg-[#252525] border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 whitespace-pre-line leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social - O que costuma acontecer */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            O que costuma acontecer quando a clareza vem primeiro
          </h2>
          
          <p className="text-white/60 text-center mb-8">
            Não é uma transformação cinematográfica.<br />
            É algo mais silencioso — e mais sustentável.
          </p>

          <div className="text-white/70 text-base sm:text-lg leading-relaxed text-center space-y-4">
            <p>Com mais clareza, as pessoas percebem que:</p>
            
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {clarityBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <p className="pt-4">
              Não porque a vida ficou perfeita.<br />
              Mas porque ela passou a <span className="text-white font-medium">fazer mais sentido</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Acesso sem risco */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-t from-[#D4AF37]/10 via-[#1A1A1A] to-[#1A1A1A]">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium">Acesso sem risco</span>
          </div>

          <div className="text-white/70 text-base sm:text-lg leading-relaxed space-y-4 mb-8">
            <p>
              Use o PDI por 30 dias completos.<br />
              Sem cartão.<br />
              Sem compromisso.
            </p>
            
            <p>Se em um mês você não sentir:</p>
            
            <ul className="space-y-2 text-left max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37]">•</span>
                <span>mais clareza</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37]">•</span>
                <span>menos peso mental</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37]">•</span>
                <span>mais coerência entre vida e ações</span>
              </li>
            </ul>
            
            <p>você simplesmente sai.</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Button 
            size="lg" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg px-10 py-7 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1A1A1A] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Acessar o PDI agora
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
          <p className="text-white/50 text-sm mt-4">
            Trial gratuito · leva menos de 1 minuto
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 bg-[#151515]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/50">
            <Link to="/termos" className="hover:text-[#D4AF37] transition-colors">
              Termos de uso
            </Link>
            <span className="hidden sm:inline">·</span>
            <Link to="/privacidade" className="hover:text-[#D4AF37] transition-colors">
              Política de privacidade
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} PDI - Carreira e Vida</span>
          </div>
        </div>
      </footer>

      {/* Modal LGPD */}
      <LGPDConsentModal 
        open={showLGPDModal}
        onClose={() => setShowLGPDModal(false)}
      />
    </div>
  );
};

export default SubscriberLanding;
