import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, User, Building2, Eye, EyeOff, Save, Crown, Sparkles, Star, Check, Loader2, Camera } from "lucide-react";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { LGPDDataSection } from "@/components/lgpd/LGPDDataSection";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { ProfilePictureEditor } from "@/components/profile/ProfilePictureEditor";


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
  const [isSaving, setIsSaving] = useState(false);
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

  const handleCheckout = async (priceOverride?: string) => {
    setIsCheckoutLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast.error("Você precisa estar logado para assinar");
        navigate('/login');
        return;
      }

      const functionName = priceOverride ? 'create-checkout' : 'create-checkout';
      const { data, error } = await supabase.functions.invoke(functionName, {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: priceOverride ? { price_id: priceOverride } : undefined,
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
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const userMetadata = user.user_metadata || {};
      const loadedUser: UserData = {
        name: userMetadata.name || userMetadata.full_name || "",
        email: user.email || "",
        phone: userMetadata.phone || "",
        password: "", // Password is never returned from Supabase
      };

      setUserData(loadedUser);
      setFormData({
        name: loadedUser.name,
        email: loadedUser.email,
        phone: loadedUser.phone,
        password: "",
      });

      // Also update localStorage for other parts of the app
      localStorage.setItem("user", JSON.stringify(loadedUser));

      // Verificar se usuário está associado a uma empresa
      checkCompanyAssociation(loadedUser.email);
    };

    loadUserData();
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

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      // Update user metadata in Supabase
      const updateData: { data?: { name?: string; phone?: string }; password?: string } = {
        data: {
          name: formData.name,
          phone: formData.phone,
        }
      };

      // Only update password if it was provided
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres");
          setIsSaving(false);
          return;
        }
        updateData.password = formData.password;
      }

      const { error } = await supabase.auth.updateUser(updateData);

      if (error) {
        throw error;
      }

      // Update local state and localStorage
      const updatedUser = { ...userData, name: formData.name, phone: formData.phone };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser as UserData);
      setFormData(prev => ({ ...prev, password: "" })); // Clear password field after save
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
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

        {/* Foto de Perfil */}
        <Card className="shadow-large">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Personalize sua conta com uma foto</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProfilePictureEditor userName={userData.name} />
          </CardContent>
        </Card>

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
                  <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1" disabled={isSaving}>
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
                  <CardTitle>Sua Assinatura</CardTitle>
                  <CardDescription>Gerencie seu plano de acesso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Período de Teste Gratuito */}
                <Card className={`border-2 transition-colors ${subscription.status === 'trial' ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">Teste Gratuito</CardTitle>
                      </div>
                      {subscription.status === 'trial' && (
                        <Badge variant="secondary" className="text-xs">Atual</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground"> / 30 dias</span></div>
                    <p className="text-xs text-muted-foreground">Experimente sem compromisso</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Acesso por 30 dias</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Todas as ferramentas liberadas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Sem cartão de crédito</span>
                      </div>
                    </div>
                    {subscription.status === 'trial' && (
                      <div className="mt-4 p-2 bg-primary/10 rounded-lg text-center">
                        <p className="text-xs text-primary font-medium">
                          {subscription.daysRemaining !== undefined 
                            ? `${subscription.daysRemaining} dias restantes`
                            : 'Período de teste ativo'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Plano Acesso Completo Anual */}
                <Card className={`border-2 transition-colors relative overflow-hidden ${subscription.plan === 'basico' || (subscription.status === 'active' && subscription.plan !== 'black') ? 'border-accent ring-2 ring-accent/20' : 'border-accent/50'}`}>
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Popular
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-accent" />
                        <CardTitle className="text-base">Acesso Completo</CardTitle>
                      </div>
                      {(subscription.plan === 'basico' || (subscription.status === 'active' && subscription.plan !== 'black')) && (
                        <Badge className="bg-accent text-accent-foreground text-xs">Atual</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">R$ 67</span>
                      <span className="text-sm font-normal text-muted-foreground">/ano</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Apenas R$ 5,58/mês</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>PDI limitado a 1 insight de IA por mês</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Todas as ferramentas com 1 aplicação por mês</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Diário de reflexão</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Construção guiada</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Relatórios e progresso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Suporte prioritário ilimitado</span>
                      </div>
                    </div>
                    {(subscription.plan === 'basico' || (subscription.status === 'active' && subscription.plan !== 'black')) ? (
                      <>
                        <div className="mt-4 p-2 bg-accent/10 rounded-lg text-center">
                          <p className="text-xs text-accent font-medium">
                            ✓ Assinatura ativa
                            {subscription.subscriptionEnd && (
                              <span className="block mt-1 text-muted-foreground">
                                Válida até {new Date(subscription.subscriptionEnd).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full text-xs mt-2"
                          onClick={handleManageSubscription}
                        >
                          Gerenciar Assinatura
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" 
                        onClick={() => handleCheckout()}
                        disabled={isCheckoutLoading}
                      >
                        {isCheckoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          'Assinar por R$ 67/ano'
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Plano Black */}
                <Card className={`border-2 transition-colors relative overflow-hidden ${subscription.plan === 'black' ? 'ring-2 ring-amber-400/40' : ''}`} style={{ backgroundColor: '#1A1A1A', borderColor: '#D4AF37' }}>
                  <div className="absolute top-0 right-0 text-xs px-3 py-1 rounded-bl-lg font-bold" style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E6A3)', color: '#1A1A1A' }}>
                    Premium
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" style={{ color: '#D4AF37' }} />
                        <CardTitle className="text-base text-white">Assinatura Black</CardTitle>
                      </div>
                      {subscription.plan === 'black' && (
                        <Badge className="text-xs" style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E6A3)', color: '#1A1A1A' }}>Atual</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">R$ 297</span>
                      <span className="text-sm font-normal" style={{ color: '#999' }}>/ano</span>
                    </div>
                    <p className="text-xs" style={{ color: '#999' }}>Apenas R$ 24,75/mês • Tudo ilimitado</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="space-y-1.5" style={{ color: '#ccc' }}>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>PDI ilimitado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>Todas as ferramentas com <strong className="text-white">IA ilimitada</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>Diário de reflexão</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>Construção guiada</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>Relatórios e progresso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span>Suporte prioritário ilimitado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                        <span className="text-white font-medium">Desafio Gestão de tempo, Foco e produtividade</span>
                      </div>
                    </div>
                    {subscription.plan === 'black' ? (
                      <>
                        <div className="mt-4 p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
                          <p className="text-xs font-medium" style={{ color: '#D4AF37' }}>
                            ✓ Assinatura Black ativa
                            {subscription.subscriptionEnd && (
                              <span className="block mt-1" style={{ color: '#999' }}>
                                Válida até {new Date(subscription.subscriptionEnd).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full text-xs mt-2 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                          onClick={handleManageSubscription}
                        >
                          Gerenciar Assinatura
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full mt-4 font-bold border-0"
                        style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E6A3)', color: '#1A1A1A' }}
                        onClick={() => handleCheckout('price_1SzMoi3aJLvyiewRtfFcNYju')}
                        disabled={isCheckoutLoading}
                      >
                        {isCheckoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          'Assinar Black'
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {subscription.status === 'trial' && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center mt-4">
                  <p className="text-sm font-medium text-accent">
                    Aproveite seu teste gratuito! Após 30 dias, assine por apenas R$ 67/ano para continuar.
                  </p>
                </div>
              )}
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
