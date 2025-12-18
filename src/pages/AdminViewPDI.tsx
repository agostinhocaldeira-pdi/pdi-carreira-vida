import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, User, Target, CheckSquare, Zap, BookOpen, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";
import LogoutButton from "@/components/LogoutButton";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

const AdminViewPDI = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isLoading: roleLoading, isAdmin } = useRoleProtection({
    allowedRoles: ["admin"],
    redirectTo: "/home"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  // PDI Data states
  const [vvd, setVvd] = useState<any>(null);
  const [valores, setValores] = useState<string[]>([]);
  const [areasVida, setAreasVida] = useState<any[]>([]);
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [metas, setMetas] = useState<any[]>([]);
  const [acoes, setAcoes] = useState<any[]>([]);
  const [diarioEntries, setDiarioEntries] = useState<any[]>([]);
  const [swot, setSwot] = useState<any>(null);
  const [habilidades, setHabilidades] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin && userId) {
      fetchUserPDI();
    }
  }, [isAdmin, userId]);

  const fetchUserPDI = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Fetch all user PDI data in parallel
      const [
        vvdRes,
        valoresRes,
        areasRes,
        objetivosRes,
        metasRes,
        acoesRes,
        diarioRes,
        swotRes,
        habilidadesRes
      ] = await Promise.all([
        supabase.from("user_vvd").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_valores").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_life_areas").select("*").eq("user_id", userId),
        supabase.from("user_objectives").select("*").eq("user_id", userId),
        supabase.from("user_goals").select("*").eq("user_id", userId),
        supabase.from("user_actions").select("*").eq("user_id", userId),
        supabase.from("diary_entries").select("*").eq("user_id", userId).order("entry_date", { ascending: false }).limit(10),
        supabase.from("user_swot").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_skills").select("*").eq("user_id", userId),
      ]);

      setVvd(vvdRes.data);
      setValores(valoresRes.data?.valores || []);
      setAreasVida(areasRes.data || []);
      setObjetivos(objetivosRes.data || []);
      setMetas(metasRes.data || []);
      setAcoes(acoesRes.data || []);
      setDiarioEntries(diarioRes.data || []);
      setSwot(swotRes.data);
      setHabilidades(habilidadesRes.data || []);

      // Fetch user info via edge function
      const { data: session } = await supabase.auth.getSession();
      if (session.session) {
        const response = await supabase.functions.invoke("get-admin-users", {
          headers: { Authorization: `Bearer ${session.session.access_token}` }
        });
        
        if (response.data?.users) {
          const user = response.data.users.find((u: any) => u.id === userId);
          if (user) {
            setUserName(user.name || "Usuário");
            setUserEmail(user.email || "-");
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar PDI:", error);
      toast.error("Erro ao carregar dados do PDI");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase().replace(" ", "-")) {
      case "concluido":
      case "concluído":
        return <Badge className="bg-green-600">Concluído</Badge>;
      case "em-andamento":
        return <Badge className="bg-blue-600">Em andamento</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      default:
        return <Badge variant="secondary">A fazer</Badge>;
    }
  };

  const radarData = areasVida.map((area) => ({
    area: area.area_name,
    atual: area.current_score || 0,
    desejado: area.desired_score || 0,
  }));

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando PDI do usuário...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-to-r from-card via-card to-primary/5 border-b shadow-elegant backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shadow-glow">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Visualizar PDI
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {userName} • {userEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin/usuarios")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Badge variant="outline" className="mb-4 gap-2">
          <Eye className="w-3 h-3" />
          Modo consulta - Somente leitura
        </Badge>

        <Tabs defaultValue="plano" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="plano" className="gap-1">
              <Target className="w-4 h-4" />
              Plano de Vida
            </TabsTrigger>
            <TabsTrigger value="metas" className="gap-1">
              <CheckSquare className="w-4 h-4" />
              Metas e Ações
            </TabsTrigger>
            <TabsTrigger value="diario" className="gap-1">
              <BookOpen className="w-4 h-4" />
              Diário
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="gap-1">
              <Zap className="w-4 h-4" />
              Ferramentas
            </TabsTrigger>
          </TabsList>

          {/* Plano de Vida Tab */}
          <TabsContent value="plano" className="space-y-4">
            {/* VVD */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visão de Vida Desejada (VVD)</CardTitle>
              </CardHeader>
              <CardContent>
                {vvd?.vvd_text || vvd?.vvd_paragraph || vvd?.vvd_sentence ? (
                  <div className="space-y-3">
                    {vvd.vvd_text && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Texto completo:</p>
                        <p className="text-foreground whitespace-pre-wrap">{vvd.vvd_text}</p>
                      </div>
                    )}
                    {vvd.vvd_paragraph && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Parágrafo:</p>
                        <p className="text-foreground">{vvd.vvd_paragraph}</p>
                      </div>
                    )}
                    {vvd.vvd_sentence && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Frase:</p>
                        <p className="text-foreground font-medium">{vvd.vvd_sentence}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhum VVD cadastrado</p>
                )}
              </CardContent>
            </Card>

            {/* Valores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                {valores.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {valores.map((valor, idx) => (
                      <Badge key={idx} variant="secondary">{valor}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhum valor cadastrado</p>
                )}
              </CardContent>
            </Card>

            {/* Roda da Vida */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roda da Vida</CardTitle>
              </CardHeader>
              <CardContent>
                {areasVida.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 10]} />
                        <Radar name="Atual" dataKey="atual" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                        <Radar name="Desejado" dataKey="desejado" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma área cadastrada</p>
                )}
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objetivos ({objetivos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {objetivos.length > 0 ? (
                  <div className="space-y-3">
                    {objetivos.map((obj) => (
                      <div key={obj.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{obj.texto}</p>
                            {obj.data_alvo && (
                              <p className="text-sm text-muted-foreground">
                                Data alvo: {new Date(obj.data_alvo).toLocaleDateString("pt-BR")}
                              </p>
                            )}
                            {obj.conexao_vvd && (
                              <p className="text-sm text-muted-foreground">
                                Conexão VVD: {obj.conexao_vvd}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(obj.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhum objetivo cadastrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metas e Ações Tab */}
          <TabsContent value="metas" className="space-y-4">
            {/* Metas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metas ({metas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {metas.length > 0 ? (
                  <div className="space-y-3">
                    {metas.map((meta) => (
                      <div key={meta.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{meta.texto}</p>
                            {meta.data_alvo && (
                              <p className="text-sm text-muted-foreground">
                                Data alvo: {new Date(meta.data_alvo).toLocaleDateString("pt-BR")}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(meta.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma meta cadastrada</p>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações ({acoes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {acoes.length > 0 ? (
                  <div className="space-y-3">
                    {acoes.map((acao) => (
                      <div key={acao.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{acao.texto}</p>
                            {acao.periodicidade && (
                              <p className="text-sm text-muted-foreground">
                                Periodicidade: {acao.periodicidade}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(acao.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma ação cadastrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diário Tab */}
          <TabsContent value="diario" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimas Entradas do Diário</CardTitle>
                <CardDescription>Últimas 10 entradas</CardDescription>
              </CardHeader>
              <CardContent>
                {diarioEntries.length > 0 ? (
                  <div className="space-y-4">
                    {diarioEntries.map((entry) => (
                      <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {new Date(entry.entry_date).toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                          {entry.mood && (
                            <Badge variant="outline">{entry.mood}</Badge>
                          )}
                        </div>
                        {entry.reflections && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Reflexões:</p>
                            <p className="text-sm">{entry.reflections}</p>
                          </div>
                        )}
                        {entry.conquests && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Conquistas:</p>
                            <p className="text-sm">{entry.conquests}</p>
                          </div>
                        )}
                        {entry.gratitude && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Gratidão:</p>
                            <p className="text-sm">{entry.gratitude}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma entrada no diário</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ferramentas Tab */}
          <TabsContent value="ferramentas" className="space-y-4">
            {/* SWOT */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise SWOT</CardTitle>
              </CardHeader>
              <CardContent>
                {swot ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400 mb-2">Forças</p>
                      <ul className="text-sm space-y-1">
                        {swot.strengths?.map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        )) || <li className="text-muted-foreground italic">Nenhum item</li>}
                      </ul>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <p className="font-medium text-red-700 dark:text-red-400 mb-2">Fraquezas</p>
                      <ul className="text-sm space-y-1">
                        {swot.weaknesses?.map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        )) || <li className="text-muted-foreground italic">Nenhum item</li>}
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="font-medium text-blue-700 dark:text-blue-400 mb-2">Oportunidades</p>
                      <ul className="text-sm space-y-1">
                        {swot.opportunities?.map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        )) || <li className="text-muted-foreground italic">Nenhum item</li>}
                      </ul>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Ameaças</p>
                      <ul className="text-sm space-y-1">
                        {swot.threats?.map((item: string, idx: number) => (
                          <li key={idx}>• {item}</li>
                        )) || <li className="text-muted-foreground italic">Nenhum item</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma análise SWOT cadastrada</p>
                )}
              </CardContent>
            </Card>

            {/* Habilidades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                {habilidades.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pontos Fortes:</p>
                      <div className="flex flex-wrap gap-2">
                        {habilidades.filter(h => h.category === "forte").map((h) => (
                          <Badge key={h.id} className="bg-green-600">{h.skill_name}</Badge>
                        ))}
                        {habilidades.filter(h => h.category === "forte").length === 0 && (
                          <span className="text-muted-foreground italic text-sm">Nenhum</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pontos a Desenvolver:</p>
                      <div className="flex flex-wrap gap-2">
                        {habilidades.filter(h => h.category === "fraco").map((h) => (
                          <Badge key={h.id} variant="outline">{h.skill_name}</Badge>
                        ))}
                        {habilidades.filter(h => h.category === "fraco").length === 0 && (
                          <span className="text-muted-foreground italic text-sm">Nenhum</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma habilidade cadastrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminViewPDI;
