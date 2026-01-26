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

        // Enviar e-mail de boas-vindas em background (não bloqueia o fluxo)
        supabase.functions.invoke('send-welcome-email', {
          body: {
            name: formData.name,
            email: formData.email,
          },
        }).catch((emailError) => {
          console.error('Error sending welcome email:', emailError);
        });

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
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:p-4 bg-[#1a1a1a]">
      <Card className="w-full max-w-md shadow-large animate-slide-up bg-[#222222] border-gray-700">
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

            {/* Campo de telefone oculto temporariamente - será reativado no futuro */}

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

            {/* Checkbox de aceite */}
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

      {/* Modal LGPD */}
      <LGPDConsentModal 
        open={showLGPDModal}
        onClose={() => setShowLGPDModal(false)}
      />
    </div>
  );
};

export default Signup;
