import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, TrendingUp, AlertTriangle, Target, Shield, Plus, Trash2, CheckCircle2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import LogoutButton from "@/components/LogoutButton";

interface SwotItem {
  id: number;
  texto: string;
}

interface SwotData {
  forcas: SwotItem[];
  fraquezas: SwotItem[];
  oportunidades: SwotItem[];
  ameacas: SwotItem[];
  habilidadesADesenvolver: Array<{ id: number; fraqueza: string; habilidade: string }>;
}

const AnaliseSwot = () => {
  const [swotData, setSwotData] = useState<SwotData>({
    forcas: [],
    fraquezas: [],
    oportunidades: [],
    ameacas: [],
    habilidadesADesenvolver: [],
  });

  const [novoItem, setNovoItem] = useState({
    forca: "",
    fraqueza: "",
    oportunidade: "",
    ameaca: "",
  });

  const [novasHabilidades, setNovasHabilidades] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Carregar dados do localStorage
    const savedSwot = localStorage.getItem("analise_swot");
    if (savedSwot) {
      setSwotData(JSON.parse(savedSwot));
    }
  }, []);

  const salvarSwot = (novosSwotData: SwotData, mostrarNotificacaoSync = false) => {
    localStorage.setItem("analise_swot", JSON.stringify(novosSwotData));
    setSwotData(novosSwotData);

    // Sincronizar habilidades com Plano de Vida
    const habilidadesTexto = novosSwotData.habilidadesADesenvolver
      .filter(h => h.habilidade.trim())
      .map((h, index) => ({ id: Date.now() + index, texto: h.habilidade }));

    if (habilidadesTexto.length > 0) {
      const habilidadesExistentes = JSON.parse(localStorage.getItem("habilidades") || "[]");
      const habilidadesMerged = [...habilidadesExistentes, ...habilidadesTexto];
      localStorage.setItem("habilidades", JSON.stringify(habilidadesMerged));
      
      // Disparar evento para sincronizar
      window.dispatchEvent(new Event("habilidadesUpdated"));
      
      // Mostrar notificação de sincronização se solicitado
      if (mostrarNotificacaoSync) {
        toast.success("✨ Habilidade sincronizada com o Plano de Vida!", {
          description: "Acesse a aba 'Como chegar lá' no seu Plano de Vida",
        });
      }
    }
  };

  const adicionarItem = (tipo: "forcas" | "fraquezas" | "oportunidades" | "ameacas") => {
    const campoMap = {
      forcas: "forca",
      fraquezas: "fraqueza",
      oportunidades: "oportunidade",
      ameacas: "ameaca",
    };
    
    const campo = campoMap[tipo];
    const valor = novoItem[campo as keyof typeof novoItem];
    
    if (!valor.trim()) {
      toast.error("Digite um item para adicionar");
      return;
    }

    const novoItemObj = { id: Date.now(), texto: valor };
    const novosSwotData = {
      ...swotData,
      [tipo]: [...swotData[tipo], novoItemObj],
    };

    salvarSwot(novosSwotData);
    setNovoItem({ ...novoItem, [campo]: "" });
    toast.success("Item adicionado!");
  };

  const removerItem = (tipo: "forcas" | "fraquezas" | "oportunidades" | "ameacas", id: number) => {
    const novosSwotData = {
      ...swotData,
      [tipo]: swotData[tipo].filter((item) => item.id !== id),
    };

    // Se removeu uma fraqueza, remover também a habilidade associada
    if (tipo === "fraquezas") {
      novosSwotData.habilidadesADesenvolver = swotData.habilidadesADesenvolver.filter(
        (hab) => hab.id !== id
      );
    }

    salvarSwot(novosSwotData);
    toast.success("Item removido!");
  };

  const adicionarHabilidade = (fraquezaId: number, fraquezaTexto: string) => {
    const habilidade = novasHabilidades[fraquezaId];
    if (!habilidade || !habilidade.trim()) {
      return; // Opcional, não exibir erro
    }

    const novaHabilidade = { id: fraquezaId, fraqueza: fraquezaTexto, habilidade };
    const novosSwotData = {
      ...swotData,
      habilidadesADesenvolver: [...swotData.habilidadesADesenvolver, novaHabilidade],
    };

    salvarSwot(novosSwotData, true); // true para mostrar notificação de sincronização
    setNovasHabilidades({ ...novasHabilidades, [fraquezaId]: "" });
    toast.success("Habilidade adicionada!");
  };

  const removerHabilidade = (id: number) => {
    const novosSwotData = {
      ...swotData,
      habilidadesADesenvolver: swotData.habilidadesADesenvolver.filter((hab) => hab.id !== id),
    };

    salvarSwot(novosSwotData);
    toast.success("Habilidade removida!");
  };

  const quadrantes = [
    {
      tipo: "forcas" as const,
      titulo: "Forças",
      descricao: "Pontos fortes internos",
      icon: TrendingUp,
      colorClasses: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-300 dark:border-emerald-700",
      iconClasses: "text-emerald-600 dark:text-emerald-400",
      badgeClasses: "bg-emerald-500 text-white",
      inputPlaceholder: "Ex: Comunicação eficaz, Experiência técnica...",
      campo: "forca" as keyof typeof novoItem,
    },
    {
      tipo: "fraquezas" as const,
      titulo: "Fraquezas",
      descricao: "Pontos fracos internos",
      icon: AlertTriangle,
      colorClasses: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-300 dark:border-amber-700",
      iconClasses: "text-amber-600 dark:text-amber-400",
      badgeClasses: "bg-amber-500 text-white",
      inputPlaceholder: "Ex: Dificuldade em delegar, Falta de conhecimento em...",
      campo: "fraqueza" as keyof typeof novoItem,
    },
    {
      tipo: "oportunidades" as const,
      titulo: "Oportunidades",
      descricao: "Fatores externos positivos",
      icon: Target,
      colorClasses: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-300 dark:border-blue-700",
      iconClasses: "text-blue-600 dark:text-blue-400",
      badgeClasses: "bg-blue-500 text-white",
      inputPlaceholder: "Ex: Mercado em crescimento, Novas tecnologias...",
      campo: "oportunidade" as keyof typeof novoItem,
    },
    {
      tipo: "ameacas" as const,
      titulo: "Ameaças",
      descricao: "Fatores externos negativos",
      icon: Shield,
      colorClasses: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-300 dark:border-rose-700",
      iconClasses: "text-rose-600 dark:text-rose-400",
      badgeClasses: "bg-rose-500 text-white",
      inputPlaceholder: "Ex: Concorrência intensa, Mudanças no mercado...",
      campo: "ameaca" as keyof typeof novoItem,
    },
  ];

  const getHabilidadeParaFraqueza = (fraquezaId: number) => {
    return swotData.habilidadesADesenvolver.find((hab) => hab.id === fraquezaId);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Análise SWOT
              </h1>
              <p className="text-muted-foreground">
                Identifique suas Forças, Fraquezas, Oportunidades e Ameaças
              </p>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">O que é Análise SWOT?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A Análise SWOT é uma ferramenta estratégica que ajuda você a identificar fatores internos 
                    (Forças e Fraquezas) e externos (Oportunidades e Ameaças) que influenciam seu desenvolvimento 
                    pessoal e profissional. Use-a para tomar decisões mais conscientes e criar estratégias eficazes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid SWOT 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {quadrantes.map((quadrante) => {
            const Icon = quadrante.icon;
            const items = swotData[quadrante.tipo];
            
            return (
              <Card key={quadrante.tipo} className={`${quadrante.colorClasses} border-2 shadow-lg transition-all hover:shadow-xl`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-white dark:bg-card rounded-full flex items-center justify-center shadow-md`}>
                        <Icon className={`w-6 h-6 ${quadrante.iconClasses}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{quadrante.titulo}</CardTitle>
                        <CardDescription>{quadrante.descricao}</CardDescription>
                      </div>
                    </div>
                    <Badge className={quadrante.badgeClasses}>{items.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de itens */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic text-center py-4">
                        Nenhum item adicionado ainda
                      </p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id}>
                          <div className="flex items-start justify-between gap-2 p-3 bg-white dark:bg-card rounded-lg shadow-sm border">
                            <p className="text-sm flex-1">{item.texto}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerItem(quadrante.tipo, item.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Campo de habilidade para fraquezas */}
                          {quadrante.tipo === "fraquezas" && (
                            <div className="ml-4 mt-2 space-y-2">
                              {getHabilidadeParaFraqueza(item.id) ? (
                                <div className="flex items-start gap-2 p-2 bg-primary/5 rounded-md border border-primary/20">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-primary mb-1">Habilidade a Desenvolver:</p>
                                    <p className="text-xs">{getHabilidadeParaFraqueza(item.id)?.habilidade}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removerHabilidade(item.id)}
                                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Habilidade a desenvolver (opcional)"
                                    value={novasHabilidades[item.id] || ""}
                                    onChange={(e) =>
                                      setNovasHabilidades({ ...novasHabilidades, [item.id]: e.target.value })
                                    }
                                    className="text-xs h-8"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => adicionarHabilidade(item.id, item.texto)}
                                    disabled={!novasHabilidades[item.id]?.trim()}
                                    className="h-8 px-2"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Campo de adicionar novo item */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Input
                      placeholder={quadrante.inputPlaceholder}
                      value={novoItem[quadrante.campo]}
                      onChange={(e) => setNovoItem({ ...novoItem, [quadrante.campo]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          adicionarItem(quadrante.tipo);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => adicionarItem(quadrante.tipo)}
                      disabled={!novoItem[quadrante.campo].trim()}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Resumo de Habilidades a Desenvolver */}
        {swotData.habilidadesADesenvolver.length > 0 && (
          <Card className="mb-8 border-primary/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Habilidades a Desenvolver
              </CardTitle>
              <CardDescription>
                Essas habilidades foram identificadas a partir das suas fraquezas e sincronizadas com seu Plano de Vida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {swotData.habilidadesADesenvolver.map((hab) => (
                  <div key={hab.id} className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-2">
                      ↳ {hab.fraqueza}
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {hab.habilidade}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/ferramentas" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar às Ferramentas
            </Button>
          </Link>
          <Link to="/home" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              <Home className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnaliseSwot;
