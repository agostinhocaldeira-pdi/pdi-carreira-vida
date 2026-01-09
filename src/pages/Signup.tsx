import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserPlus, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LGPDConsentModal } from "@/components/lgpd/LGPDConsentModal";
import Logo from "@/components/Logo";

const Signup = () => {
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
        }

        toast.success("Cadastro realizado! Você tem 30 dias de acesso gratuito.");
        
        // Direcionar para onboarding (sem Stripe checkout)
        navigate("/onboarding?signup=success");
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
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
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-3 mt-2 text-center">
            <p className="text-base font-bold text-primary mb-1">
              30 dias grátis
            </p>
            <p className="text-sm text-muted-foreground">
              R$ 67,00/ano • Acesso completo por 12 meses
            </p>
          </div>
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
              {isLoading ? "Processando..." : "Criar Perfil Grátis"}
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
    </div>
  );
};

export default Signup;
