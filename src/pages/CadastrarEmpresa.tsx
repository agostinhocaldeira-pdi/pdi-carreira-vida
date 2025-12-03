import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, ArrowLeft, Plus, Trash2, UserPlus, Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { formatCNPJ, validateCNPJ } from "@/types/company";

interface Representative {
  name: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const CadastrarEmpresa = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [companyData, setCompanyData] = useState({
    razaoSocial: "",
    cnpj: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    inscricaoEstadual: "",
  });
  const [addressData, setAddressData] = useState<AddressData>({
    cep: "",
    logradouro: "",
    complemento: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [representatives, setRepresentatives] = useState<Representative[]>([
    { name: "", email: "", phone: "", isPrimary: true }
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCompanyData({ ...companyData, cnpj: formatted });
  };

  // Buscar CEP
  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setAddressData(prev => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
      toast.success("Endereço preenchido automaticamente!");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formattedCep = value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
    setAddressData(prev => ({ ...prev, cep: formattedCep }));
    
    if (formattedCep.replace(/\D/g, "").length === 8) {
      fetchCep(formattedCep);
    }
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

    if (!addressData.cep || !addressData.cidade || !addressData.estado) {
      toast.error("Preencha os campos obrigatórios do endereço");
      return;
    }

    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
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
      address: {
        ...addressData,
        cep: addressData.cep.replace(/\D/g, ""),
      },
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
            {step === 2 ? (
              <MapPin className="h-8 w-8 text-primary" />
            ) : (
              <Building2 className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {step === 1 ? "Cadastre sua Empresa" : step === 2 ? "Endereço da Empresa" : "Representantes"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Preencha os dados da empresa para criar sua conta"
              : step === 2
              ? "Informe o endereço completo da empresa"
              : "Adicione os representantes da empresa (máximo 3)"
            }
          </CardDescription>
          <div className="flex justify-center gap-2 pt-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={companyData.password}
                      onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                      required
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={companyData.confirmPassword}
                      onChange={(e) => setCompanyData({ ...companyData, confirmPassword: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
          ) : step === 2 ? (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  placeholder="000.000.000.000"
                  value={companyData.inscricaoEstadual}
                  onChange={(e) => setCompanyData({ ...companyData, inscricaoEstadual: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Deixe em branco caso a empresa seja isenta</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={addressData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      maxLength={9}
                      required
                    />
                    {isLoadingCep && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    placeholder="123"
                    value={addressData.numero}
                    onChange={(e) => setAddressData({ ...addressData, numero: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  placeholder="Rua, Avenida, etc."
                  value={addressData.logradouro}
                  onChange={(e) => setAddressData({ ...addressData, logradouro: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    placeholder="Sala, Andar, etc."
                    value={addressData.complemento}
                    onChange={(e) => setAddressData({ ...addressData, complemento: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    value={addressData.bairro}
                    onChange={(e) => setAddressData({ ...addressData, bairro: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    placeholder="Cidade"
                    value={addressData.cidade}
                    onChange={(e) => setAddressData({ ...addressData, cidade: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    placeholder="UF"
                    value={addressData.estado}
                    onChange={(e) => setAddressData({ ...addressData, estado: e.target.value })}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

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
                  Próximo
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep3Submit} className="space-y-4">
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
                  onClick={() => setStep(2)}
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
