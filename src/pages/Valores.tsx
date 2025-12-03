import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LogoutButton from "@/components/LogoutButton";

const VALORES_LISTA = [
  "Abundância", "Aceitação", "Adaptabilidade", "Afeto", "Ajuda", "Alegria",
  "Amabilidade", "Ambição", "Amizade", "Amor", "Apoio", "Aprendizagem",
  "Assertividade", "Atitude Positiva", "Autenticidade", "Autoconfiança", "Autoconhecimento", "Autonomia",
  "Aventura", "Bem-estar", "Benevolência", "Bondade", "Calma", "Caridade",
  "Carinho", "Colaboração", "Comunidade", "Compromisso", "Comunicação", "Confiabilidade",
  "Confiança", "Conhecimento", "Conexão", "Consciência", "Consistência", "Contentamento",
  "Contribuição", "Controle", "Coragem", "Crescimento", "Criatividade", "Cuidado",
  "Curiosidade", "Dedicação", "Delicadeza", "Determinação", "Dignidade", "Disciplina",
  "Diversão", "Eficiência", "Empatia", "Energia", "Entusiasmo", "Equilíbrio",
  "Espiritualidade", "Estabilidade", "Ética", "Excelência", "Família", "Felicidade",
  "Fidelidade", "Flexibilidade", "Foco", "Força", "Generosidade", "Gratidão",
  "Harmonia", "Honestidade", "Humildade", "Humor", "Inovação", "Inspiração",
  "Integridade", "Inteligência", "Intimidade", "Intuição", "Justiça", "Lealdade",
  "Liberdade", "Liderança", "Lógica", "Mansidão", "Motivação", "Natureza",
  "Objetividade", "Ordem", "Organização", "Otimismo", "Paciência", "Paixão",
  "Paz", "Perdão", "Perseverança", "Persistência", "Praticidade", "Prazer",
  "Presença", "Produtividade", "Profissionalismo", "Propósito", "Realização", "Reconhecimento",
  "Renovação", "Resiliência", "Respeito", "Responsabilidade",
];

const Valores = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [valoresSelecionados20, setValoresSelecionados20] = useState<string[]>([]);
  const [valoresSelecionados10, setValoresSelecionados10] = useState<string[]>([]);
  const [valoresSelecionados6, setValoresSelecionados6] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [exercicioConcluido, setExercicioConcluido] = useState(false);

  useEffect(() => {
    // Verificar se o exercício já foi concluído
    const savedValores = localStorage.getItem("meus_valores");
    if (savedValores) {
      const valores = JSON.parse(savedValores);
      if (valores.length === 6) {
        setExercicioConcluido(true);
        setValoresSelecionados6(valores);
      }
    }
  }, []);

  const toggleValor = (valor: string) => {
    if (etapa === 1) {
      if (valoresSelecionados20.includes(valor)) {
        setValoresSelecionados20(valoresSelecionados20.filter(v => v !== valor));
      } else if (valoresSelecionados20.length < 20) {
        setValoresSelecionados20([...valoresSelecionados20, valor]);
      } else {
        toast.error("Você já selecionou 20 valores!");
      }
    } else if (etapa === 2) {
      if (valoresSelecionados10.includes(valor)) {
        setValoresSelecionados10(valoresSelecionados10.filter(v => v !== valor));
      } else if (valoresSelecionados10.length < 10) {
        setValoresSelecionados10([...valoresSelecionados10, valor]);
      } else {
        toast.error("Você já selecionou 10 valores!");
      }
    } else if (etapa === 3) {
      if (valoresSelecionados6.includes(valor)) {
        setValoresSelecionados6(valoresSelecionados6.filter(v => v !== valor));
      } else if (valoresSelecionados6.length < 6) {
        setValoresSelecionados6([...valoresSelecionados6, valor]);
      } else {
        toast.error("Você já selecionou 6 valores!");
      }
    }
  };

  const handleProximo = () => {
    if (etapa === 1 && valoresSelecionados20.length === 20) {
      setEtapa(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (etapa === 2 && valoresSelecionados10.length === 10) {
      setEtapa(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVoltar = () => {
    if (etapa === 2) {
      setEtapa(1);
      setValoresSelecionados10([]);
    } else if (etapa === 3) {
      setEtapa(2);
      setValoresSelecionados6([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalvar = () => {
    if (valoresSelecionados6.length === 6) {
      // Salvar no localStorage
      localStorage.setItem("meus_valores", JSON.stringify(valoresSelecionados6));
      
      // Atualizar também o formato antigo para compatibilidade
      const valoresArray = Array(12).fill("");
      valoresSelecionados6.forEach((valor, index) => {
        valoresArray[index] = valor;
      });
      localStorage.setItem("valores", JSON.stringify(valoresArray));
      
      // Disparar evento para sincronizar
      window.dispatchEvent(new Event("valoresUpdated"));
      
      setShowSuccessDialog(true);
    }
  };

  const getValoresParaExibir = () => {
    if (etapa === 1) return VALORES_LISTA;
    if (etapa === 2) return valoresSelecionados20;
    return valoresSelecionados10;
  };

  const getValoresSelecionados = () => {
    if (etapa === 1) return valoresSelecionados20;
    if (etapa === 2) return valoresSelecionados10;
    return valoresSelecionados6;
  };

  const getQuantidadeObjetivo = () => {
    if (etapa === 1) return 20;
    if (etapa === 2) return 10;
    return 6;
  };

  const getTitulo = () => {
    if (etapa === 1) return "Escolha 20 Valores que Ressoam com Você";
    if (etapa === 2) return "Refine para 10 Valores Essenciais";
    return "Selecione seus 6 Valores Fundamentais";
  };

  const getDescricao = () => {
    if (etapa === 1) return "Explore a lista e selecione os 20 valores que mais se conectam com quem você é e com o que você acredita.";
    if (etapa === 2) return "Agora, dos 20 valores escolhidos, identifique os 10 que são realmente inegociáveis na sua vida.";
    return "Por fim, escolha os 6 valores que representam a essência do que você é. Estes serão seus valores fundamentais.";
  };

  const progresso = (getValoresSelecionados().length / getQuantidadeObjetivo()) * 100;

  // Se o exercício já foi concluído, mostrar mensagem de bloqueio
  if (exercicioConcluido) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="bg-card border-b shadow-soft sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold truncate">Descobrindo Seus Valores</h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/ferramentas">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Voltar</span>
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="shadow-large border-primary/20">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Exercício Já Concluído!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Você já realizou o exercício de descoberta de valores e identificou seus 6 valores fundamentais. 
                  Este exercício só pode ser realizado uma vez para garantir autenticidade na sua jornada de autoconhecimento.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Seus Valores Fundamentais:
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {valoresSelecionados6.map((valor) => (
                    <Badge key={valor} variant="secondary" className="text-base px-4 py-2">
                      {valor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-2">
                <p className="text-sm font-medium">💡 Deseja fazer alterações?</p>
                <p className="text-sm text-muted-foreground">
                  Para editar seus valores, acesse a seção <strong>"Meus Valores"</strong> dentro do <strong>Plano de Vida</strong> na página inicial.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Funcionalidade Premium (Em breve)
                </p>
                <p className="text-sm text-muted-foreground">
                  Em breve, usuários com plano Premium poderão refazer este exercício quantas vezes desejarem, 
                  permitindo uma revisão periódica dos seus valores conforme sua evolução pessoal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => navigate("/ferramentas")} className="w-full sm:w-auto">
                  Voltar às Ferramentas
                </Button>
                <Button onClick={() => navigate("/home")} className="w-full sm:w-auto gap-2">
                  <Heart className="w-4 h-4" />
                  Ir para o Plano de Vida
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-2xl font-bold truncate">Descobrindo Seus Valores</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/ferramentas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Indicator */}
        <Card className="mb-8 shadow-large border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Etapa {etapa} de 3</span>
              <Badge variant={etapa === 3 ? "default" : "secondary"} className="animate-pulse">
                {getValoresSelecionados().length}/{getQuantidadeObjetivo()} selecionados
              </Badge>
            </div>
            <Progress value={progresso} className="h-3" />
            
            {/* Etapas */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className={`text-center p-2 rounded-lg border-2 transition-all ${
                    etapa === num 
                      ? 'bg-primary text-primary-foreground border-primary shadow-glow' 
                      : etapa > num 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {etapa > num && <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-xs font-semibold">
                      {num === 1 ? '20' : num === 2 ? '10' : '6'} valores
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">{getTitulo()}</h2>
                <p className="text-muted-foreground leading-relaxed">{getDescricao()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Valores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {getValoresParaExibir().map((valor) => {
            const isSelected = getValoresSelecionados().includes(valor);
            return (
              <button
                key={valor}
                onClick={() => toggleValor(valor)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-glow scale-105'
                    : 'bg-card hover:bg-accent hover:border-primary/30 hover:scale-105 border-border'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1 text-left">{valor}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botões de Navegação */}
        <Card className="shadow-medium sticky bottom-4">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                variant="outline"
                onClick={handleVoltar}
                disabled={etapa === 1}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {etapa < 3 ? (
                  <Button
                    onClick={handleProximo}
                    disabled={getValoresSelecionados().length !== getQuantidadeObjetivo()}
                    className="w-full sm:w-auto gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSalvar}
                    disabled={valoresSelecionados6.length !== 6}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Salvar no Plano de Vida
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Valores Salvos com Sucesso! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <p>
                Seus 6 valores fundamentais foram salvos na seção <strong>"Meus Valores"</strong> dentro do 
                <strong> Plano de Vida</strong>.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {valoresSelecionados6.map((valor) => (
                  <Badge key={valor} variant="secondary" className="text-sm">
                    {valor}
                  </Badge>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction asChild>
              <Button variant="outline" onClick={() => navigate("/ferramentas")} className="w-full sm:w-auto">
                Voltar às Ferramentas
              </Button>
            </AlertDialogAction>
            <AlertDialogAction asChild>
              <Button onClick={() => navigate("/home")} className="w-full sm:w-auto">
                Ir para o Plano de Vida
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Valores;