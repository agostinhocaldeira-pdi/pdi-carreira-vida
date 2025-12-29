import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileText, BarChart3, FileDown, ArrowLeft, CheckCircle, AlertCircle, Loader2, Sparkles, Target, BookOpen, Lightbulb } from "lucide-react";
import { exportPDIToPDF, exportProgressReportToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const Relatorios = () => {
  const [isExportingPDI, setIsExportingPDI] = useState(false);
  const [isExportingProgress, setIsExportingProgress] = useState(false);

  // Check completeness of PDI data
  const checkPDICompleteness = () => {
    const vvd = localStorage.getItem("vvd") || localStorage.getItem("visao_vida_desejada") || "";
    const valores = JSON.parse(localStorage.getItem("meus_valores") || localStorage.getItem("valores") || "[]");
    const areasVida = JSON.parse(localStorage.getItem("areasVida") || localStorage.getItem("areas_vida") || "[]");
    const objetivos = JSON.parse(localStorage.getItem("objetivos") || localStorage.getItem("meus_objetivos") || "[]");
    const metas = JSON.parse(localStorage.getItem("metas") || "[]");
    const diaryEntries = JSON.parse(localStorage.getItem("diary_entries") || "[]");

    const items = [
      { name: "Visão de Vida Desejada (VVD)", complete: !!vvd && vvd.length > 10, tip: "Acesse o Método VVD em Ferramentas" },
      { name: "Meus Valores", complete: valores.length >= 3, tip: "Defina ao menos 3 valores no Plano de Vida" },
      { name: "Roda da Vida", complete: areasVida.length > 0, tip: "Preencha as áreas da vida no Plano de Vida" },
      { name: "Objetivos", complete: objetivos.length > 0, tip: "Cadastre ao menos 1 objetivo em 'Para onde vou'" },
      { name: "Metas com Ações", complete: metas.length > 0 && metas.some((m: any) => m.acoes?.length > 0), tip: "Cadastre metas em 'Mão na Massa'" },
      { name: "Entradas no Diário", complete: diaryEntries.length >= 3, tip: "Registre ao menos 3 dias no Diário" },
    ];

    const completedCount = items.filter(i => i.complete).length;
    const percentage = Math.round((completedCount / items.length) * 100);

    return { items, completedCount, total: items.length, percentage };
  };

  const pdiCompleteness = checkPDICompleteness();

  const handleExportPDI = async () => {
    setIsExportingPDI(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      let companyName = "";
      const employees = JSON.parse(localStorage.getItem("company_employees") || "[]");
      const employee = employees.find((emp: any) => 
        emp.email?.toLowerCase() === user.email?.toLowerCase() && emp.is_active
      );
      if (employee) {
        const companies = JSON.parse(localStorage.getItem("companies") || "[]");
        const company = companies.find((c: any) => c.id === employee.company_id);
        if (company) companyName = company.razao_social;
      }

      const onboarding = JSON.parse(localStorage.getItem("onboarding_data") || "{}");
      const vvd = localStorage.getItem("vvd") || localStorage.getItem("visao_vida_desejada") || "";
      const valores = JSON.parse(localStorage.getItem("meus_valores") || localStorage.getItem("valores") || "[]");
      const areasVida = JSON.parse(localStorage.getItem("areasVida") || localStorage.getItem("areas_vida") || "[]");
      const objetivos = JSON.parse(localStorage.getItem("objetivos") || localStorage.getItem("meus_objetivos") || "[]");
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const competencias = JSON.parse(localStorage.getItem("competencias") || "[]");
      const pontosFortes = JSON.parse(localStorage.getItem("pontos_fortes") || "[]");
      const pontosAMelhorar = JSON.parse(localStorage.getItem("pontos_a_melhorar") || "[]");
      const swot = JSON.parse(localStorage.getItem("analise_swot") || "{}");
      const crencas = JSON.parse(localStorage.getItem("crencas_transformadas") || "[]");
      const eisenhower = JSON.parse(localStorage.getItem("eisenhower_tasks") || "{}");
      const insight = localStorage.getItem("userInsight") || "";
      const insightDate = localStorage.getItem("lastInsightDate") || "";
      const diaryEntries = JSON.parse(localStorage.getItem("diary_entries") || "[]");
      const streak = JSON.parse(localStorage.getItem("user_streak") || "{}");
      const achievements = JSON.parse(localStorage.getItem("user_achievements") || "[]");

      const moodHistory = diaryEntries.map((entry: any) => ({
        date: entry.date || entry.data,
        mood: entry.mood || entry.humor,
        reflexao: entry.reflexao || entry.reflexoes,
        gratidao: entry.gratidao,
        conquistas: entry.conquistas
      })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const diaryStats = {
        total: diaryEntries.length,
        feliz: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'feliz').length,
        neutro: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'neutro').length,
        triste: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'triste').length,
      };

      exportPDIToPDF({
        userName: user.name || "Usuário",
        userEmail: user.email || "",
        userPhone: user.phone || "",
        userRole: user.role || "user",
        companyName,
        currentPhase: onboarding.currentPhase || onboarding.fase_atual || "",
        expectations: onboarding.expectations || onboarding.expectativas || "",
        vvd,
        valores,
        areasVida,
        objetivos: objetivos.map((obj: any) => ({
          ...obj,
          id: obj.id || `obj_${Math.random().toString(36).substr(2, 9)}`,
        })),
        metas: metas.map((meta: any) => ({
          ...meta,
          id: meta.id || `meta_${Math.random().toString(36).substr(2, 9)}`,
          acoes: (meta.acoes || []).map((acao: any) => ({
            ...acao,
            passos: acao.passos || [],
          })),
        })),
        competencias,
        pontosFortes,
        pontosAMelhorar,
        swot: swot.forcas || swot.fraquezas ? swot : undefined,
        crencas: crencas.length > 0 ? crencas : undefined,
        eisenhower: eisenhower.urgente_importante ? eisenhower : undefined,
        insight,
        insightDate,
        moodHistory,
        diaryStats,
        streak: streak.current_streak || 0,
        longestStreak: streak.longest_streak || 0,
        level: streak.level || 1,
        totalPoints: streak.total_points || 0,
        achievements: achievements.map((a: any) => ({
          name: a.name || a.achievement_name,
          unlockedAt: a.unlocked_at
        })),
      });

      toast.success("PDI completo exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExportingPDI(false);
    }
  };

  const handleExportProgress = async () => {
    setIsExportingProgress(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const objetivos = JSON.parse(localStorage.getItem("objetivos") || localStorage.getItem("meus_objetivos") || "[]");
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const diarioEntries = JSON.parse(localStorage.getItem("diary_entries") || "[]");
      const streak = JSON.parse(localStorage.getItem("user_streak") || "{}");
      const insight = localStorage.getItem("userInsight") || "";

      const objetivosConcluidos = objetivos.filter((o: any) => o.status === "concluido").length;
      const metasConcluidas = metas.filter((m: any) => m.concluida).length;
      
      let acoesTotal = 0;
      let acoesConcluidas = 0;
      metas.forEach((meta: any) => {
        const acoes = meta.acoes || [];
        acoesTotal += acoes.length;
        acoesConcluidas += acoes.filter((a: any) => a.status === "concluido").length;
      });

      const moodStats = {
        total: diarioEntries.length,
        feliz: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'feliz').length,
        neutro: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'neutro').length,
        triste: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'triste').length,
      };

      const recentMoods = diarioEntries
        .map((entry: any) => ({
          date: entry.date || entry.data,
          mood: entry.mood || entry.humor,
          reflexao: entry.reflexao || entry.reflexoes,
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 14);

      exportProgressReportToPDF(
        user.name || "Usuário",
        new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        {
          objetivosTotal: objetivos.length,
          objetivosConcluidos,
          metasTotal: metas.length,
          metasConcluidas,
          acoesTotal,
          acoesConcluidas,
          diasDiario: diarioEntries.length,
          streak: streak.current_streak || 0,
          longestStreak: streak.longest_streak || 0,
          level: streak.level || 1,
          totalPoints: streak.total_points || 0,
        },
        moodStats,
        recentMoods,
        insight
      );

      toast.success("Relatório de progresso exportado!");
    } catch (error) {
      console.error("Error exporting progress report:", error);
      toast.error("Erro ao exportar relatório");
    } finally {
      setIsExportingProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-primary border-b border-primary/80 shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground">Relatórios</h1>
                <p className="text-sm text-primary-foreground/70">Exporte e acompanhe sua evolução</p>
              </div>
            </div>
            <Link to="/home">
              <Button variant="outline" size="sm" className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Status de Completude */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Status do seu PDI
            </CardTitle>
            <CardDescription>
              Para relatórios mais completos, preencha todas as seções do seu PDI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso geral:</span>
                <Badge variant={pdiCompleteness.percentage === 100 ? "default" : "secondary"}>
                  {pdiCompleteness.completedCount}/{pdiCompleteness.total} ({pdiCompleteness.percentage}%)
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pdiCompleteness.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {pdiCompleteness.items.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      item.complete ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {item.complete ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipos de Relatórios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDI Completo */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">PDI Completo</CardTitle>
                  <CardDescription>Documento completo do seu plano</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  O que inclui:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Seus dados pessoais e onboarding</li>
                  <li>Visão de Vida Desejada (VVD)</li>
                  <li>Valores pessoais e Roda da Vida</li>
                  <li>Objetivos, Metas e Ações</li>
                  <li>Análises SWOT, Crenças e Eisenhower</li>
                  <li>Histórico de humor e conquistas</li>
                  <li>Insight gerado pela IA</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Ideal para:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Compartilhar com seu gestor, mentor ou coach. Documentar formalmente seu plano 
                  de desenvolvimento e ter um registro completo da sua jornada.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  Como tirar o melhor proveito:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Preencha todas as seções do PDI antes de exportar. Revise periodicamente 
                  e atualize seus objetivos. Compartilhe com pessoas que podem te apoiar.
                </p>
              </div>

              <Button 
                onClick={handleExportPDI}
                disabled={isExportingPDI}
                className="w-full mt-4 gap-2"
                variant="cta"
                size="lg"
              >
                {isExportingPDI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                Exportar PDI Completo
              </Button>
            </CardContent>
          </Card>

          {/* Relatório de Progresso */}
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Relatório de Progresso</CardTitle>
                  <CardDescription>Resumo executivo da sua evolução</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  O que inclui:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Estatísticas de objetivos e metas</li>
                  <li>Taxa de conclusão de ações</li>
                  <li>Dias de diário preenchidos</li>
                  <li>Histórico de humor recente</li>
                  <li>Streak e pontuação atual</li>
                  <li>Insight mais recente</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Ideal para:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Reuniões de acompanhamento com seu gestor. Revisões mensais ou trimestrais. 
                  Ter uma visão rápida do seu progresso.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  Como tirar o melhor proveito:
                </h4>
                <p className="text-sm text-muted-foreground">
                  Exporte regularmente (semanal ou mensalmente). Compare com relatórios anteriores 
                  para ver sua evolução. Use como base para conversas de feedback.
                </p>
              </div>

              <Button 
                onClick={handleExportProgress}
                disabled={isExportingProgress}
                className="w-full mt-4 gap-2"
                variant="secondary"
                size="lg"
              >
                {isExportingProgress ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                Exportar Relatório de Progresso
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dicas */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Dica de ouro</h3>
                <p className="text-sm text-muted-foreground">
                  Exporte seu PDI completo no início e depois exporte relatórios de progresso 
                  regularmente. Isso cria um histórico valioso da sua jornada de desenvolvimento 
                  e facilita conversas com mentores e gestores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Relatorios;
