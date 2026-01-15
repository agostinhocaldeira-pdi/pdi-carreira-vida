import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowLeft, ArrowRight, Heart, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [addressData, setAddressData] = useState<AddressData>({
    cep: "",
    logradouro: "",
    complemento: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  // MUDANÇA TEMPORÁRIA: Pular onboarding e ir direto para home
  // Para reativar as páginas de bem-vindo e endereço, remova este useEffect
  useEffect(() => {
    localStorage.setItem("onboardingComplete", "true");
    navigate("/home", { replace: true });
  }, [navigate]);

  // Obter usuário autenticado do Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

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

  const canAdvance = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return addressData.cep.replace(/\D/g, "").length === 8 && 
               addressData.cidade.trim() !== "" && 
               addressData.estado.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    if (!canAdvance()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Salvar localmente primeiro (fallback)
      localStorage.setItem("userAddress", JSON.stringify(addressData));
      localStorage.setItem("onboardingComplete", "true");
      
      // Se tiver usuário autenticado, salvar no banco
      if (userId) {
        // Salvar endereço
        const { error: addressError } = await supabase
          .from("user_addresses")
          .upsert({
            user_id: userId,
            cep: addressData.cep.replace(/\D/g, ""),
            logradouro: addressData.logradouro,
            numero: addressData.numero,
            complemento: addressData.complemento,
            bairro: addressData.bairro,
            cidade: addressData.cidade,
            estado: addressData.estado,
          }, { onConflict: "user_id" });
        
        if (addressError) {
          console.error("Erro ao salvar endereço:", addressError);
        }
      }
      
      navigate("/home");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error("Erro ao salvar dados, mas você pode continuar");
      navigate("/home");
    } finally {
      setIsSaving(false);
    }
  };

  const isLastStep = step === totalSteps;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-2xl shadow-large">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Etapa {step} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px] flex flex-col justify-between">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Bem-vindo ao PDI!</CardTitle>
                <CardDescription className="text-base max-w-md mx-auto">
                  O PDI - Carreira & Vida é um método completo para você alcançar clareza sobre quem você é, 
                  onde quer chegar e como vai realizar seus objetivos de vida e carreira.
                </CardDescription>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-semibold">PDI: Carreira & Vida</span>
                </div>
                <div className="text-base leading-relaxed space-y-4 text-muted-foreground">
                  <p>
                    <strong>Embora o PDI seja tradicionalmente usado para desenvolvimento de carreira, 
                    este aplicativo vai além:</strong> ele integra carreira e vida pessoal.
                  </p>
                  <p>
                    Por quê? Porque <strong>é impossível separar uma coisa da outra</strong>. Sua vida 
                    profissional impacta diretamente sua vida pessoal, e vice-versa.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleNext} size="lg" className="flex-1">
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Seu Endereço</CardTitle>
                    <p className="text-sm text-muted-foreground">Complete seu cadastro</p>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Digite seu CEP para preencher automaticamente o endereço.
                </CardDescription>
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
                    />
                    {isLoadingCep && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    placeholder="UF"
                    value={addressData.estado}
                    onChange={(e) => setAddressData(prev => ({ ...prev, estado: e.target.value }))}
                    maxLength={2}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    placeholder="Cidade"
                    value={addressData.cidade}
                    onChange={(e) => setAddressData(prev => ({ ...prev, cidade: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    value={addressData.bairro}
                    onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    placeholder="Rua, Avenida..."
                    value={addressData.logradouro}
                    onChange={(e) => setAddressData(prev => ({ ...prev, logradouro: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    placeholder="Nº"
                    value={addressData.numero}
                    onChange={(e) => setAddressData(prev => ({ ...prev, numero: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    placeholder="Apto, Bloco, etc."
                    value={addressData.complemento}
                    onChange={(e) => setAddressData(prev => ({ ...prev, complemento: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleFinish} size="lg" className="flex-1" disabled={!canAdvance() || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Ir para Home</span>
                      <span className="sm:hidden">Começar</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
