import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, User, Building2, Eye, EyeOff, Save, Crown, Sparkles, Star } from "lucide-react";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { ExportPDFButton } from "@/components/reports/ExportPDFButton";

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais</p>
            </div>
          </div>
          <ExportPDFButton />
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
                <Card className="border-2 border-muted hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Gratuito</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Acesso básico às ferramentas</p>
                    <p>• Diário limitado</p>
                    <p>• 1 objetivo por vez</p>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Plano Atual
                    </Button>
                  </CardContent>
                </Card>

                {/* Plano Básico */}
                <Card className="border-2 border-primary/30 hover:border-primary transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Básico</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 29<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Todas as ferramentas</p>
                    <p>• Diário ilimitado</p>
                    <p>• 3 objetivos simultâneos</p>
                    <Button className="w-full mt-4" disabled>
                      Em breve
                    </Button>
                  </CardContent>
                </Card>

                {/* Plano Completo */}
                <Card className="border-2 border-amber-500/50 hover:border-amber-500 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Recomendado
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">Completo</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Tudo do Básico</p>
                    <p>• IA ilimitada</p>
                    <p>• Suporte prioritário</p>
                    <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600" disabled>
                      Em breve
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Os planos pagos estarão disponíveis em breve. Fique atento às novidades!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Notificações */}
        <NotificationPreferences />
      </div>
    </div>
  );
};

export default Perfil;
