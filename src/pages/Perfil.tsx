import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, User, Building2, Eye, EyeOff, Save, Crown, Sparkles, Star, Check, Loader2 } from "lucide-react";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { LGPDDataSection } from "@/components/lgpd/LGPDDataSection";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";


interface UserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

interface CompanyInfo {
  razao_social: string;
  cnpj: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscription = useSubscription();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Check for successful checkout return
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      toast.success("Assinatura realizada com sucesso! Bem-vindo ao Plano Básico!");
      subscription.refreshSubscription?.();
      // Remove the query param
      navigate('/perfil', { replace: true });
    } else if (checkoutStatus === 'canceled') {
      toast.info("Checkout cancelado. Você pode tentar novamente quando quiser.");
      navigate('/perfil', { replace: true });
    }
  }, [searchParams, navigate, subscription]);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado para assinar");
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error("Não foi possível criar a sessão de pagamento");
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || "Erro ao processar checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado");
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw new Error(error.message);

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Portal error:', error);
      toast.error("Erro ao acessar portal de assinatura");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);
    setFormData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      password: parsedUser.password || "",
    });

    // Verificar se usuário está associado a uma empresa
    checkCompanyAssociation(parsedUser.email);
  }, [navigate]);

  const checkCompanyAssociation = (userEmail: string) => {
    // Verificar se é funcionário de alguma empresa
    const employees = JSON.parse(localStorage.getItem("company_employees") || "[]");
    const employee = employees.find((emp: any) => 
      emp.email?.toLowerCase() === userEmail?.toLowerCase() && emp.is_active
    );

    if (employee) {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const company = companies.find((c: any) => c.id === employee.company_id);
      if (company) {
        setCompanyInfo({
          razao_social: company.razao_social,
          cnpj: company.cnpj,
        });
        return;
      }
    }

    // Verificar se é gestor de alguma empresa
    const managers = JSON.parse(localStorage.getItem("company_managers") || "[]");
    const manager = managers.find((mgr: any) => 
      mgr.email?.toLowerCase() === userEmail?.toLowerCase() && mgr.is_active
    );

    if (manager) {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const company = companies.find((c: any) => c.id === manager.company_id);
      if (company) {
        setCompanyInfo({
          razao_social: company.razao_social,
          cnpj: company.cnpj,
        });
        return;
      }
    }

    setCompanyInfo(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserData(updatedUser as UserData);
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const formatCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, "");
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/home")} className="border-primary/30 hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Meu Perfil</h1>
              <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais</p>
            </div>
          </div>
        </div>

        {/* Dados do Usuário */}
        <Card className="shadow-large">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações do seu cadastro</CardDescription>
                </div>
              </div>
              {userData.role && (
                <Badge variant="secondary" className="capitalize">
                  {userData.role}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={!isEditing}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                  Editar Dados
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empresa Associada */}
        {companyInfo && (
          <Card className="shadow-large border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Empresa Vinculada</CardTitle>
                  <CardDescription>Você está associado a uma empresa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">Razão Social</Label>
                <p className="font-medium">{companyInfo.razao_social}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">CNPJ</Label>
                <p className="font-medium">{formatCNPJ(companyInfo.cnpj)}</p>
              </div>
              <Badge variant="secondary" className="mt-2">
                ✓ Assinatura coberta pela empresa
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Planos de Assinatura (apenas quando não vinculado a empresa) */}
        {!companyInfo && (
          <Card className="shadow-large">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Planos de Assinatura</CardTitle>
                  <CardDescription>Escolha o melhor plano para você</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Plano Gratuito */}
                <Card className={`border-2 transition-colors ${subscription.plan === 'gratuito' || subscription.status === 'trial' ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Gratuito</CardTitle>
                      </div>
                      {(subscription.plan === 'gratuito' || subscription.status === 'trial') && (
                        <Badge variant="secondary" className="text-xs">Atual</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground"> por 30 dias</span></div>
                    <p className="text-xs text-muted-foreground">Experimente sem compromisso</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>1 objetivo ativo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>1 meta por objetivo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>5 ações por meta</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>4 ferramentas ilimitadas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>4 ferramentas com 1 uso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Diário de reflexão</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      {(subscription.plan === 'gratuito' || subscription.status === 'trial') ? '✓ Plano Atual' : 'Começar grátis'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Plano Básico */}
                <Card className={`border-2 transition-colors relative overflow-hidden ${subscription.plan === 'basico' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-green-500/50'}`}>
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    🚀 Promoção
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">Básico</CardTitle>
                      </div>
                      {subscription.plan === 'basico' && (
                        <Badge className="bg-green-500 text-xs">Atual</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">R$ 14,90<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                    <p className="text-xs text-muted-foreground">Tudo que você precisa para evoluir</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>PDI ilimitado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>1 insight de IA por mês</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Todas as ferramentas ilimitadas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Integração Google Calendar</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Construção Guiada completa</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Suporte prioritário</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-green-500 hover:bg-green-600" disabled>
                      {subscription.plan === 'basico' ? '✓ Plano Atual' : 'Assinar agora'}
                    </Button>
                    {subscription.plan === 'basico' && (
                      <Button 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={handleManageSubscription}
                      >
                        Gerenciar Assinatura
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Plano Completo */}
                <Card className="border-2 border-amber-500/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Em breve
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">Completo</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 59<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                    <p className="text-xs text-muted-foreground">Máximo potencial de crescimento</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Tudo do Básico</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Insights de IA ilimitados</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Notificações por e-mail</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Notificações por WhatsApp</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Relatórios em PDF</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Acompanhamento personalizado</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600" disabled>
                      Em breve
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center mt-4">
                <p className="text-sm font-medium text-primary">
                  Você tem acesso gratuito a todas as funções do PDI - Carreira e Vida durante 1 ano. Ao vencer esse prazo, escolha um novo plano.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notificações */}
        <NotificationPreferences />

        {/* Seção LGPD - Privacidade e Dados */}
        <LGPDDataSection />
      </div>
    </div>
  );
};

export default Perfil;
