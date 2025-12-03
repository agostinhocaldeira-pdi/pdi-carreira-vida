import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, ArrowLeft, Plus, Trash2, UserPlus } from "lucide-react";
import { formatCNPJ, validateCNPJ } from "@/types/company";

interface Representative {
  name: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

const CadastrarEmpresa = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    razaoSocial: "",
    cnpj: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
  });
  const [representatives, setRepresentatives] = useState<Representative[]>([
    { name: "", email: "", phone: "", isPrimary: true }
  ]);

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCompanyData({ ...companyData, cnpj: formatted });
  };

  const addRepresentative = () => {
    if (representatives.length < 3) {
      setRepresentatives([...representatives, { name: "", email: "", phone: "", isPrimary: false }]);
    }
  };

  const removeRepresentative = (index: number) => {
    if (representatives.length > 1 && !representatives[index].isPrimary) {
      setRepresentatives(representatives.filter((_, i) => i !== index));
    }
  };

  const updateRepresentative = (index: number, field: keyof Representative, value: string | boolean) => {
    const updated = [...representatives];
    updated[index] = { ...updated[index], [field]: value };
    setRepresentatives(updated);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyData.razaoSocial || !companyData.cnpj || !companyData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const cleanCNPJ = companyData.cnpj.replace(/\D/g, "");
    if (!validateCNPJ(cleanCNPJ)) {
      toast.error("CNPJ inválido");
      return;
    }

    if (companyData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (companyData.password !== companyData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    const primaryRep = representatives.find(r => r.isPrimary);
    if (!primaryRep?.name || !primaryRep?.email) {
      toast.error("O representante principal é obrigatório");
      return;
    }

    // Salvar empresa no localStorage (simulação)
    const company = {
      id: crypto.randomUUID(),
      ...companyData,
      cnpj: companyData.cnpj.replace(/\D/g, ""),
      representatives,
      role: "empresa",
      createdAt: new Date().toISOString(),
    };

    // Salvar como usuário logado
    localStorage.setItem("user", JSON.stringify({
      name: companyData.razaoSocial,
      email: companyData.email,
      password: companyData.password,
      role: "empresa",
      companyId: company.id,
    }));

    // Salvar dados da empresa
    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    companies.push(company);
    localStorage.setItem("companies", JSON.stringify(companies));

    toast.success("Empresa cadastrada com sucesso!");
    navigate("/dashboard-empresa");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-subtle">
      <Card className="w-full max-w-2xl shadow-large animate-slide-up">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {step === 1 ? "Cadastre sua Empresa" : "Representantes"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Preencha os dados da empresa para criar sua conta"
              : "Adicione os representantes da empresa (máximo 3)"
            }
          </CardDescription>
          <div className="flex justify-center gap-2 pt-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  placeholder="Nome da empresa"
                  value={companyData.razaoSocial}
                  onChange={(e) => setCompanyData({ ...companyData, razaoSocial: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={companyData.cnpj}
                    onChange={(e) => handleCNPJChange(e.target.value)}
                    maxLength={18}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={companyData.telefone}
                    onChange={(e) => setCompanyData({ ...companyData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@empresa.com.br"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={companyData.password}
                    onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={companyData.confirmPassword}
                    onChange={(e) => setCompanyData({ ...companyData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button type="submit" className="flex-1">
                  Próximo
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              {representatives.map((rep, index) => (
                <Card key={index} className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">
                      {rep.isPrimary ? "Representante Principal" : `Representante ${index + 1}`}
                    </span>
                    {!rep.isPrimary && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRepresentative(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Nome completo *"
                      value={rep.name}
                      onChange={(e) => updateRepresentative(index, "name", e.target.value)}
                      required={rep.isPrimary}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        type="email"
                        placeholder="E-mail *"
                        value={rep.email}
                        onChange={(e) => updateRepresentative(index, "email", e.target.value)}
                        required={rep.isPrimary}
                      />
                      <Input
                        placeholder="Telefone"
                        value={rep.phone}
                        onChange={(e) => updateRepresentative(index, "phone", e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {representatives.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRepresentative}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Representante
                </Button>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button type="submit" className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Finalizar Cadastro
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastrarEmpresa;
