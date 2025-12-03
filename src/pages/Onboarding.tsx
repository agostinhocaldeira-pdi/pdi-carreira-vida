import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, ArrowLeft, ArrowRight, Heart, Target, MapPin, ClipboardList, Loader2 } from "lucide-react";
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

interface SurveyData {
  wakeUpTime: string;
  sleepTime: string;
  exerciseFrequency: string;
  readingHabit: string;
  mainGoal: string;
  biggestChallenge: string;
  learningStyle: string;
  motivationSource: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [onboardingData, setOnboardingData] = useState({
    currentPhase: "",
    expectations: "",
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

  const [surveyData, setSurveyData] = useState<SurveyData>({
    wakeUpTime: "",
    sleepTime: "",
    exerciseFrequency: "",
    readingHabit: "",
    mainGoal: "",
    biggestChallenge: "",
    learningStyle: "",
    motivationSource: "",
  });

  // Verificar o tipo de usuário e obter ID do Supabase
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role || "user");
    }
    
    // Obter usuário autenticado do Supabase
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Verificar se deve mostrar a pesquisa (exceto admin e empresa)
  const showSurvey = userRole !== "admin" && userRole !== "empresa";
  
  // Total de etapas varia baseado no tipo de usuário
  const totalSteps = showSurvey ? 7 : 6;
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
      case 2:
      case 3:
        return true;
      case 4:
        return onboardingData.currentPhase.trim() !== "";
      case 5:
        return onboardingData.expectations.trim() !== "";
      case 6:
        return addressData.cep.replace(/\D/g, "").length === 8 && 
               addressData.cidade.trim() !== "" && 
               addressData.estado.trim() !== "";
      case 7:
        if (!showSurvey) return true;
        return surveyData.wakeUpTime !== "" && 
               surveyData.exerciseFrequency !== "" && 
               surveyData.mainGoal !== "" && 
               surveyData.learningStyle !== "";
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
      localStorage.setItem("onboarding", JSON.stringify(onboardingData));
      localStorage.setItem("userAddress", JSON.stringify(addressData));
      if (showSurvey) {
        localStorage.setItem("userSurvey", JSON.stringify(surveyData));
      }
      localStorage.setItem("onboardingComplete", "true");
      
      // Se tiver usuário autenticado, salvar no banco
      if (userId) {
        // Salvar dados do onboarding
        const { error: onboardingError } = await supabase
          .from("user_onboarding")
          .upsert({
            user_id: userId,
            current_phase: onboardingData.currentPhase,
            expectations: onboardingData.expectations,
          }, { onConflict: "user_id" });
        
        if (onboardingError) {
          console.error("Erro ao salvar onboarding:", onboardingError);
        }
        
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
        
        // Salvar pesquisa (se aplicável)
        if (showSurvey) {
          const { error: surveyError } = await supabase
            .from("user_surveys")
            .upsert({
              user_id: userId,
              wake_up_time: surveyData.wakeUpTime,
              sleep_time: surveyData.sleepTime,
              exercise_frequency: surveyData.exerciseFrequency,
              reading_habit: surveyData.readingHabit,
              main_goal: surveyData.mainGoal,
              biggest_challenge: surveyData.biggestChallenge,
              learning_style: surveyData.learningStyle,
              motivation_source: surveyData.motivationSource,
            }, { onConflict: "user_id" });
          
          if (surveyError) {
            console.error("Erro ao salvar pesquisa:", surveyError);
          }
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
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">PDI: Carreira & Vida</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed space-y-4">
                  <p>
                    <strong>Embora o PDI seja tradicionalmente usado para desenvolvimento de carreira, 
                    este aplicativo vai além:</strong> ele integra carreira e vida pessoal.
                  </p>
                  <p>
                    Por quê? Porque <strong>é impossível separar uma coisa da outra</strong>. Sua vida 
                    profissional impacta diretamente sua vida pessoal, e vice-versa.
                  </p>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm">
                      💡 <strong>Nossa abordagem</strong> considera que um profissional realizado
                      é também alguém que cuida da saúde, dos relacionamentos, das finanças, do 
                      desenvolvimento pessoal e do bem-estar emocional.
                    </p>
                  </div>
                </CardDescription>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleNext} size="lg" className="flex-1">
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">O que é o PDI?</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  <p className="mb-4">
                    O Plano de Desenvolvimento Individual é uma ferramenta poderosa que te ajuda a:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Descobrir sua visão de vida desejada</li>
                    <li>Identificar seus valores e prioridades</li>
                    <li>Avaliar as diferentes áreas da sua vida</li>
                    <li>Definir objetivos claros e alcançáveis</li>
                    <li>Criar um plano de ação prático</li>
                    <li>Acompanhar seu progresso diariamente</li>
                  </ul>
                </CardDescription>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleNext} size="lg" className="flex-1">
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">Vamos começar? 🚀</CardTitle>
                <CardDescription className="text-base">
                  Como você descreveria o momento que está vivendo agora?
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPhase">Fase Atual</Label>
                <Input
                  id="currentPhase"
                  placeholder="Ex: Em transição de carreira, buscando propósito..."
                  value={onboardingData.currentPhase}
                  onChange={(e) =>
                    setOnboardingData({ ...onboardingData, currentPhase: e.target.value })
                  }
                  spellCheck="true"
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleNext} size="lg" className="flex-1" disabled={!canAdvance()}>
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <CardTitle className="text-2xl">Suas Expectativas</CardTitle>
                <CardDescription className="text-base">
                  O que você espera alcançar com o PDI?
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectations">Expectativas</Label>
                <Textarea
                  id="expectations"
                  placeholder="Compartilhe suas expectativas, sonhos e o que deseja conquistar..."
                  value={onboardingData.expectations}
                  onChange={(e) =>
                    setOnboardingData({ ...onboardingData, expectations: e.target.value })
                  }
                  rows={5}
                  spellCheck="true"
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleNext} size="lg" className="flex-1" disabled={!canAdvance()}>
                  Avançar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Seu Endereço</CardTitle>
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
                {showSurvey ? (
                  <Button onClick={handleNext} size="lg" className="flex-1" disabled={!canAdvance()}>
                    Avançar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
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
                )}
              </div>
            </div>
          )}

          {step === 7 && showSurvey && (
            <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Conheça seu Perfil</CardTitle>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <CardDescription className="text-base">
                    ✨ <strong>Estas informações nos ajudarão a criar uma experiência personalizada para você.</strong> 
                    Conhecer seus hábitos e preferências nos permite oferecer insights mais relevantes e 
                    sugestões alinhadas com seu estilo de vida.
                  </CardDescription>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Horário de acordar */}
                <div className="space-y-3">
                  <Label className="font-semibold">Que horas você costuma acordar? *</Label>
                  <RadioGroup
                    value={surveyData.wakeUpTime}
                    onValueChange={(value) => setSurveyData(prev => ({ ...prev, wakeUpTime: value }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="antes-6h" id="antes-6h" />
                      <Label htmlFor="antes-6h" className="font-normal cursor-pointer">Antes das 6h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6h-8h" id="6h-8h" />
                      <Label htmlFor="6h-8h" className="font-normal cursor-pointer">Entre 6h e 8h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="8h-10h" id="8h-10h" />
                      <Label htmlFor="8h-10h" className="font-normal cursor-pointer">Entre 8h e 10h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="depois-10h" id="depois-10h" />
                      <Label htmlFor="depois-10h" className="font-normal cursor-pointer">Depois das 10h</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Frequência de exercícios */}
                <div className="space-y-3">
                  <Label className="font-semibold">Com que frequência você pratica exercícios físicos? *</Label>
                  <RadioGroup
                    value={surveyData.exerciseFrequency}
                    onValueChange={(value) => setSurveyData(prev => ({ ...prev, exerciseFrequency: value }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nunca" id="nunca" />
                      <Label htmlFor="nunca" className="font-normal cursor-pointer">Raramente/Nunca</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2x" id="1-2x" />
                      <Label htmlFor="1-2x" className="font-normal cursor-pointer">1-2x por semana</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4x" id="3-4x" />
                      <Label htmlFor="3-4x" className="font-normal cursor-pointer">3-4x por semana</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5+x" id="5+x" />
                      <Label htmlFor="5+x" className="font-normal cursor-pointer">5x ou mais</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Principal objetivo */}
                <div className="space-y-3">
                  <Label className="font-semibold">Qual seu principal objetivo agora? *</Label>
                  <RadioGroup
                    value={surveyData.mainGoal}
                    onValueChange={(value) => setSurveyData(prev => ({ ...prev, mainGoal: value }))}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="carreira" id="carreira" />
                      <Label htmlFor="carreira" className="font-normal cursor-pointer">Crescer na carreira</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="saude" id="saude" />
                      <Label htmlFor="saude" className="font-normal cursor-pointer">Melhorar a saúde</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="financeiro" id="financeiro" />
                      <Label htmlFor="financeiro" className="font-normal cursor-pointer">Estabilidade financeira</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="relacionamentos" id="relacionamentos" />
                      <Label htmlFor="relacionamentos" className="font-normal cursor-pointer">Melhorar relacionamentos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equilibrio" id="equilibrio" />
                      <Label htmlFor="equilibrio" className="font-normal cursor-pointer">Equilíbrio vida/trabalho</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="autoconhecimento" id="autoconhecimento" />
                      <Label htmlFor="autoconhecimento" className="font-normal cursor-pointer">Autoconhecimento</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Estilo de aprendizado */}
                <div className="space-y-3">
                  <Label className="font-semibold">Como você prefere aprender coisas novas? *</Label>
                  <RadioGroup
                    value={surveyData.learningStyle}
                    onValueChange={(value) => setSurveyData(prev => ({ ...prev, learningStyle: value }))}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lendo" id="lendo" />
                      <Label htmlFor="lendo" className="font-normal cursor-pointer">Lendo livros/artigos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="videos" id="videos" />
                      <Label htmlFor="videos" className="font-normal cursor-pointer">Assistindo vídeos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="praticando" id="praticando" />
                      <Label htmlFor="praticando" className="font-normal cursor-pointer">Praticando/Fazendo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conversando" id="conversando" />
                      <Label htmlFor="conversando" className="font-normal cursor-pointer">Conversando com pessoas</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Maior desafio */}
                <div className="space-y-3">
                  <Label htmlFor="biggestChallenge">Qual seu maior desafio no momento?</Label>
                  <Textarea
                    id="biggestChallenge"
                    placeholder="Descreva brevemente seu maior desafio atual..."
                    value={surveyData.biggestChallenge}
                    onChange={(e) => setSurveyData(prev => ({ ...prev, biggestChallenge: e.target.value }))}
                    rows={3}
                    spellCheck="true"
                  />
                </div>

                {/* Fonte de motivação */}
                <div className="space-y-3">
                  <Label htmlFor="motivationSource">O que mais te motiva?</Label>
                  <Textarea
                    id="motivationSource"
                    placeholder="O que te faz levantar da cama todos os dias?"
                    value={surveyData.motivationSource}
                    onChange={(e) => setSurveyData(prev => ({ ...prev, motivationSource: e.target.value }))}
                    rows={3}
                    spellCheck="true"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-background pb-2">
                <Button onClick={handlePrevious} variant="outline" size="lg" className="w-full sm:flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={handleFinish} size="lg" className="w-full sm:flex-1" disabled={!canAdvance() || isSaving}>
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
