import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus, Eye, EyeOff, Loader2, Shield, Star, Sparkles, Crown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LGPDConsentModal } from "@/components/lgpd/LGPDConsentModal";
import Logo from "@/components/Logo";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFromUrl = searchParams.get('plan');
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
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
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
      // Cadastrar usuário no Supabase Auth
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
        // Registrar consentimentos LGPD
        const consents = [
          { user_id: data.user.id, consent_type: 'terms_of_service' },
          { user_id: data.user.id, consent_type: 'privacy_policy' },
          { user_id: data.user.id, consent_type: 'data_processing' },
        ];

        await supabase
          .from('user_consents')
          .upsert(consents, { onConflict: 'user_id,consent_type' });

        // Manter localStorage para compatibilidade com código existente
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

        // Enviar e-mail de boas-vindas
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              name: formData.name,
              email: formData.email,
            },
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Não bloqueia o fluxo se o e-mail falhar
        }

        toast.success("Perfil criado com sucesso!");
        
        // If user came with basico plan intent, go directly to checkout
        if (planFromUrl === 'basico') {
          // Trigger checkout directly
          setTimeout(async () => {
            try {
              const { data: session } = await supabase.auth.getSession();
              
              if (!session?.session?.access_token) {
                toast.error("Sessão expirada. Por favor, faça login novamente.");
                navigate("/login");
                return;
              }

              const { data, error } = await supabase.functions.invoke('create-checkout', {
                headers: {
                  Authorization: `Bearer ${session.session.access_token}`,
                },
              });

              if (error) {
                console.error('Checkout error:', error);
                toast.error("Erro ao iniciar checkout. Tente novamente.");
                setShowPlansModal(true);
                return;
              }

              if (data?.url) {
                window.location.href = data.url;
              } else {
                toast.error("Erro ao obter URL de checkout.");
                setShowPlansModal(true);
              }
            } catch (error) {
              console.error('Checkout error:', error);
              toast.error("Erro ao processar pagamento. Tente novamente.");
              setShowPlansModal(true);
            }
          }, 500);
        } else {
          // Show plans modal for plan selection
          setShowPlansModal(true);
        }
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSelectFreePlan = () => {
    setShowPlansModal(false);
    navigate("/onboarding");
  };

  const handleSelectBasicPlan = async () => {
    setIsCheckoutLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error("Erro ao iniciar checkout. Tente novamente.");
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error("Erro ao obter URL de checkout.");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:p-4 bg-gradient-subtle">
      <Card className="w-full max-w-md shadow-large animate-slide-up">
        <CardHeader className="space-y-2 text-center pb-4 sm:pb-6">
          <div className="flex justify-center mb-2">
            <Logo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">PDI - Carreira & Vida</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Crie seu perfil e comece sua jornada de desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha segura (mín. 6 caracteres)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox de aceite */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="lgpd-preview" 
                checked={lgpdAccepted}
                onCheckedChange={(checked) => setLgpdAccepted(checked === true)}
                disabled={isLoading}
              />
              <label htmlFor="lgpd-preview" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                <Shield className="w-3 h-3 inline mr-1" />
                Li e aceito os{" "}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLGPDModal(true);
                  }}
                  className="text-primary hover:underline"
                >
                  Termos de Uso e Política de Privacidade
                </button>
                {" "}(LGPD)
              </label>
            </div>

            <Button type="submit" className="w-full mt-4 sm:mt-6" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Criando..." : "Criar Perfil"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal LGPD */}
      <LGPDConsentModal 
        open={showLGPDModal}
        onClose={() => setShowLGPDModal(false)}
      />

      {/* Plans Selection Modal */}
      <Dialog open={showPlansModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Escolha seu plano</DialogTitle>
            <DialogDescription className="text-center">
              Selecione o plano que melhor atende suas necessidades
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-3">
            {/* Plano Gratuito */}
            <Card 
              className="border-2 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
              onClick={handleSelectFreePlan}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Gratuito</CardTitle>
                </div>
                <div className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><span className="line-through text-muted-foreground">30 dias</span> <strong className="text-primary">1 ANO</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Gerar 1 insight</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>1 objetivo, 1 meta, 5 ações</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">Ferramentas ilimitadas: Roda da Vida, VVD, Valores, Eisenhower</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">1 uso: SWOT, SMART, Autoavaliação 360º, Crenças</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 group-hover:bg-primary/10">
                  Começar grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Básico */}
            <Card 
              className="border-2 border-muted opacity-70 relative overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg text-muted-foreground">Básico</CardTitle>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">
                  R$ 14,90<span className="text-sm font-normal">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>1 insight por mês</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>
                  Em breve
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  acesso ilimitado* a todas funcionalidades
                </p>
                <p className="text-[10px] text-center text-muted-foreground">
                  *exceto insights com limite de 1 por mês
                </p>
              </CardContent>
            </Card>

            {/* Plano Completo */}
            <Card className="border-2 border-muted opacity-70 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                Recomendado
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg text-muted-foreground">Completo</CardTitle>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">R$ 49<span className="text-sm font-normal">/mês</span></div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Dashboard "Seu Progresso"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Insights ilimitados</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Diário completo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Plano de Vida ilimitado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Todas as ferramentas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Integração Google Calendar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Notificações e-mail e WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Construção Guiada</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Gerar relatórios PDF</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              🚀 Promoção de lançamento: acesso do plano completo liberado no Plano Gratuito para os primeiros 100 assinantes, por 1 ano!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup;
