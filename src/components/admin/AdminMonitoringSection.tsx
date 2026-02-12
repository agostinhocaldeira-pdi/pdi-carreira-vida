import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Users, Target, CheckCircle2, BookOpen, Calendar,
  TrendingUp, TrendingDown, HelpCircle, Activity, Map, Layers,
  Percent, Clock, ArrowRightLeft, Eye
} from "lucide-react";

interface MonitoringData {
  // Funnel
  totalUsers: number;
  usersWithVvd: number;
  usersWithValues: number;
  usersWithLifeAreas: number;
  usersWithObjectives: number;
  usersWithGoals: number;
  usersWithActions: number;
  usersWithDiary: number;
  usersWithSwot: number;
  usersWithBeliefs: number;
  usersWithSelfAssessment: number;

  // Engagement
  diaryEntriesLast7Days: number;
  diaryEntriesLast30Days: number;
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  avgDiaryPerUser: number;

  // Success rates
  totalObjectives: number;
  completedObjectives: number;
  totalGoals: number;
  completedGoals: number;
  totalActions: number;
  completedActions: number;

  // Companies
  totalCompanies: number;
  totalManagers: number;
  activeManagers: number;
  totalEmployees: number;
  activeEmployees: number;

  // Top pages
  topPages: { page: string; views: number }[];

  // Satisfaction
  avgSatisfaction: number;
  totalSurveys: number;
}

const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help inline ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const MetricCard = ({ icon: Icon, iconColor, label, value, subtitle, tooltip, onClick }: {
  icon: any; iconColor: string; label: string; value: string | number; subtitle?: string; tooltip: string; onClick?: () => void;
}) => (
  <div 
    className={`p-4 bg-card rounded-xl border border-border/50 space-y-2 ${onClick ? 'cursor-pointer hover:border-primary/50 hover:shadow-md transition-all' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span>{label}</span>
        <InfoTooltip text={tooltip} />
      </div>
      {onClick && <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
    </div>
    <p className="text-2xl font-bold">{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </div>
);

const FunnelBar = ({ label, value, total, tooltip }: { label: string; value: number; total: number; tooltip: string }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          {label}
          <InfoTooltip text={tooltip} />
        </span>
        <span className="font-medium">{value} ({pct}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const AdminMonitoringSection = () => {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMonitoring();
  }, []);

  const fetchMonitoring = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const [
        usersRes,
        vvdRes, valoresRes, lifeAreasRes, objectivesRes, goalsRes, actionsRes,
        diaryRes, swotRes, beliefsRes, selfAssessRes,
        companiesRes, managersRes, employeesRes,
        pageViewsRes, satisfactionRes
      ] = await Promise.all([
        // Total users
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-admin-users`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' }
        }).then(r => r.json()),
        // Funnel steps - distinct user counts
        supabase.from('user_vvd').select('user_id'),
        supabase.from('user_valores').select('user_id'),
        supabase.from('user_life_areas').select('user_id'),
        supabase.from('user_objectives').select('id, user_id, status'),
        supabase.from('user_goals').select('id, user_id, status'),
        supabase.from('user_actions').select('id, user_id, status'),
        supabase.from('diary_entries').select('id, user_id, entry_date'),
        supabase.from('user_swot').select('user_id'),
        supabase.from('user_beliefs').select('user_id'),
        supabase.from('user_self_assessment').select('user_id'),
        // Companies
        supabase.from('companies').select('id', { count: 'exact' }),
        supabase.from('company_managers').select('id, accepted_at', { count: 'exact' }),
        supabase.from('company_employees').select('id, accepted_at', { count: 'exact' }),
        // Page views (last 30 days)
        (supabase as any).from('page_views').select('page_path, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        // Satisfaction
        supabase.from('satisfaction_surveys').select('rating'),
      ]);

      const totalUsers = usersRes?.users?.length || 0;

      // Distinct users per tool
      const distinctUsers = (arr: any[] | null) => new Set((arr || []).map(r => r.user_id)).size;

      // Diary metrics
      const diaryEntries = diaryRes.data || [];
      const now = Date.now();
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const diary7 = diaryEntries.filter(d => d.entry_date >= sevenDaysAgo);
      const diary30 = diaryEntries.filter(d => d.entry_date >= thirtyDaysAgo);
      const activeUsers7 = new Set(diary7.map(d => d.user_id)).size;
      const activeUsers30 = new Set(diary30.map(d => d.user_id)).size;
      const usersWithDiaryCount = distinctUsers(diaryRes.data);
      const avgDiary = usersWithDiaryCount > 0 ? Math.round(diaryEntries.length / usersWithDiaryCount) : 0;

      // Objectives/Goals/Actions
      const objectives = objectivesRes.data || [];
      const goals = goalsRes.data || [];
      const actions = actionsRes.data || [];

      // Companies
      const managers = managersRes.data || [];
      const employees = employeesRes.data || [];

      // Top pages
      const pageViews = pageViewsRes.data || [];
      const pageCountMap: Record<string, number> = {};
      pageViews.forEach((pv: any) => {
        pageCountMap[pv.page_path] = (pageCountMap[pv.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([page, views]) => ({ page, views }));

      // Satisfaction
      const surveys = satisfactionRes.data || [];
      const avgSat = surveys.length > 0
        ? Math.round((surveys.reduce((s: number, r: any) => s + r.rating, 0) / surveys.length) * 10) / 10
        : 0;

      setData({
        totalUsers,
        usersWithVvd: distinctUsers(vvdRes.data),
        usersWithValues: distinctUsers(valoresRes.data),
        usersWithLifeAreas: distinctUsers(lifeAreasRes.data),
        usersWithObjectives: distinctUsers(objectivesRes.data),
        usersWithGoals: distinctUsers(goalsRes.data),
        usersWithActions: distinctUsers(actionsRes.data),
        usersWithDiary: usersWithDiaryCount,
        usersWithSwot: distinctUsers(swotRes.data),
        usersWithBeliefs: distinctUsers(beliefsRes.data),
        usersWithSelfAssessment: distinctUsers(selfAssessRes.data),
        diaryEntriesLast7Days: diary7.length,
        diaryEntriesLast30Days: diary30.length,
        activeUsersLast7Days: activeUsers7,
        activeUsersLast30Days: activeUsers30,
        avgDiaryPerUser: avgDiary,
        totalObjectives: objectives.length,
        completedObjectives: objectives.filter(o => o.status === 'concluído').length,
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.status === 'concluído').length,
        totalActions: actions.length,
        completedActions: actions.filter(a => a.status === 'concluído').length,
        totalCompanies: companiesRes.count || 0,
        totalManagers: managers.length,
        activeManagers: managers.filter(m => m.accepted_at).length,
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.accepted_at).length,
        topPages,
        avgSatisfaction: avgSat,
        totalSurveys: surveys.length,
      });
    } catch (err) {
      console.error("Error fetching monitoring data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const successRate = (() => {
    const total = data.totalObjectives + data.totalGoals + data.totalActions;
    if (total === 0) return 0;
    const done = data.completedObjectives + data.completedGoals + data.completedActions;
    return Math.round((done / total) * 100);
  })();

  const retentionRate7d = data.totalUsers > 0 ? Math.round((data.activeUsersLast7Days / data.totalUsers) * 100) : 0;

  return (
    <Card className="shadow-medium border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Monitoramento da Plataforma
        </CardTitle>
        <CardDescription>
          Indicadores de uso, engajamento e sucesso extraídos dos dados reais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* 1. Indicadores Gerais */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Indicadores Gerais
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              icon={Users} iconColor="text-primary" label="Usuários"
              value={data.totalUsers}
              tooltip="Total de contas criadas na plataforma. Fonte: auth.users"
              onClick={() => navigate("/admin/usuarios")}
            />
            <MetricCard
              icon={Activity} iconColor="text-green-600" label="Ativos (7d)"
              value={data.activeUsersLast7Days}
              subtitle={`${retentionRate7d}% de retenção`}
              tooltip="Usuários que escreveram no diário nos últimos 7 dias. Insight: quanto maior, melhor o engajamento recente."
            />
            <MetricCard
              icon={Calendar} iconColor="text-amber-600" label="Ativos (30d)"
              value={data.activeUsersLast30Days}
              tooltip="Usuários com atividade de diário nos últimos 30 dias. Insight: se muito menor que 7d, o engajamento é pontual."
            />
            <MetricCard
              icon={Percent} iconColor="text-green-600" label="Taxa de Sucesso"
              value={`${successRate}%`}
              subtitle={`${data.completedObjectives + data.completedGoals + data.completedActions} concluídos`}
              tooltip="% de objetivos, metas e ações marcados como 'concluído'. Insight: reflete o quanto a plataforma está gerando resultado."
            />
          </div>
        </section>

        {/* 2. Funil da Jornada */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Funil da Jornada
            <InfoTooltip text="Mostra em qual etapa os usuários param. Cada barra indica quantos usuários completaram aquela ferramenta. Use para identificar gargalos." />
          </h3>
          <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
            <FunnelBar label="Visão, Valores e Decisão (VVD)" value={data.usersWithVvd} total={data.totalUsers}
              tooltip="Etapa inicial: definir propósito. Se baixo, o onboarding pode estar confuso." />
            <FunnelBar label="Valores Pessoais" value={data.usersWithValues} total={data.totalUsers}
              tooltip="Usuários que definiram seus valores. Complemento do VVD." />
            <FunnelBar label="Roda da Vida" value={data.usersWithLifeAreas} total={data.totalUsers}
              tooltip="Autoavaliação das áreas da vida. Insight: se cai aqui, pode ser excesso de etapas." />
            <FunnelBar label="Análise SWOT" value={data.usersWithSwot} total={data.totalUsers}
              tooltip="Análise de forças e fraquezas. Ferramenta mais avançada." />
            <FunnelBar label="Crenças Limitantes" value={data.usersWithBeliefs} total={data.totalUsers}
              tooltip="Transformação de crenças. Parte do autoconhecimento." />
            <FunnelBar label="Autoavaliação 360°" value={data.usersWithSelfAssessment} total={data.totalUsers}
              tooltip="Avaliação de competências. Demanda mais esforço do usuário." />
            <FunnelBar label="Objetivos Definidos" value={data.usersWithObjectives} total={data.totalUsers}
              tooltip="Usuários que criaram pelo menos 1 objetivo. Etapa crucial — aqui começa o plano de ação." />
            <FunnelBar label="Metas Criadas" value={data.usersWithGoals} total={data.totalUsers}
              tooltip="Usuários com metas vinculadas a objetivos. Se cair muito em relação a objetivos, pode ser UX." />
            <FunnelBar label="Ações Cadastradas" value={data.usersWithActions} total={data.totalUsers}
              tooltip="Ações práticas do dia a dia. Base do 'Mão na Massa'." />
            <FunnelBar label="Diário Utilizado" value={data.usersWithDiary} total={data.totalUsers}
              tooltip="Usuários que usaram o diário pelo menos 1 vez. Sinal de engajamento contínuo." />
          </div>
        </section>

        {/* 3. Engajamento do Diário */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Engajamento do Diário
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              icon={BookOpen} iconColor="text-amber-600" label="Entradas (7d)"
              value={data.diaryEntriesLast7Days}
              tooltip="Total de entradas de diário na última semana. Insight: volume semanal mostra hábito."
            />
            <MetricCard
              icon={Calendar} iconColor="text-amber-600" label="Entradas (30d)"
              value={data.diaryEntriesLast30Days}
              tooltip="Total no último mês. Compare com 7d × 4 para ver tendência."
            />
            <MetricCard
              icon={TrendingUp} iconColor="text-green-600" label="Média/Usuário"
              value={data.avgDiaryPerUser}
              subtitle="entradas totais"
              tooltip="Média de entradas de diário por usuário que já usou. Insight: se < 5, poucos formaram hábito."
            />
          </div>
        </section>

        {/* 4. Resultados (Objetivos, Metas, Ações) */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Resultados dos Usuários
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  Objetivos
                  <InfoTooltip text="Objetivos criados vs concluídos. Insight: taxa baixa pode indicar objetivos muito ambiciosos." />
                </span>
                <Badge variant={data.totalObjectives > 0 && (data.completedObjectives / data.totalObjectives) > 0.3 ? "default" : "secondary"}>
                  {data.totalObjectives > 0 ? Math.round((data.completedObjectives / data.totalObjectives) * 100) : 0}%
                </Badge>
              </div>
              <p className="text-xl font-bold">{data.completedObjectives} <span className="text-sm font-normal text-muted-foreground">/ {data.totalObjectives}</span></p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  Metas
                  <InfoTooltip text="Metas concluídas. Insight: metas são mais granulares que objetivos. Taxa baixa pode significar prazos irreais." />
                </span>
                <Badge variant={data.totalGoals > 0 && (data.completedGoals / data.totalGoals) > 0.3 ? "default" : "secondary"}>
                  {data.totalGoals > 0 ? Math.round((data.completedGoals / data.totalGoals) * 100) : 0}%
                </Badge>
              </div>
              <p className="text-xl font-bold">{data.completedGoals} <span className="text-sm font-normal text-muted-foreground">/ {data.totalGoals}</span></p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  Ações
                  <InfoTooltip text="Ações práticas concluídas. Insight: essa é a métrica mais operacional. Alta taxa = plataforma está gerando ação real." />
                </span>
                <Badge variant={data.totalActions > 0 && (data.completedActions / data.totalActions) > 0.3 ? "default" : "secondary"}>
                  {data.totalActions > 0 ? Math.round((data.completedActions / data.totalActions) * 100) : 0}%
                </Badge>
              </div>
              <p className="text-xl font-bold">{data.completedActions} <span className="text-sm font-normal text-muted-foreground">/ {data.totalActions}</span></p>
            </div>
          </div>
        </section>

        {/* 5. Empresas */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Empresas & Equipes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              icon={Layers} iconColor="text-blue-600" label="Empresas"
              value={data.totalCompanies}
              tooltip="Total de empresas cadastradas na plataforma."
            />
            <MetricCard
              icon={Users} iconColor="text-amber-600" label="Gestores"
              value={`${data.activeManagers}/${data.totalManagers}`}
              subtitle="ativos / total"
              tooltip="Gestores que aceitaram o convite vs total convidado. Se muitos pendentes, revise o fluxo de convite."
            />
            <MetricCard
              icon={Users} iconColor="text-green-600" label="Funcionários"
              value={`${data.activeEmployees}/${data.totalEmployees}`}
              subtitle="ativos / total"
              tooltip="Funcionários ativos vs convidados. Insight: taxa de aceitação baixa pode indicar problema no e-mail de convite."
            />
          </div>
        </section>

        {/* 6. Páginas Mais Acessadas */}
        {data.topPages.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              Páginas Mais Acessadas (30d)
              <InfoTooltip text="Ranking de páginas visitadas nos últimos 30 dias. Fonte: tabela page_views. Insight: identifique quais funcionalidades são mais usadas." />
            </h3>
            <div className="space-y-1 p-4 bg-muted/30 rounded-xl border border-border/50">
              {data.topPages.map((p, i) => (
                <div key={p.page} className="flex items-center justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium mr-2">{i + 1}.</span>
                    {p.page}
                  </span>
                  <Badge variant="secondary" className="text-xs">{p.views} views</Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Satisfação */}
        {data.totalSurveys > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Satisfação dos Usuários
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={TrendingUp} iconColor="text-green-600" label="Nota Média"
                value={data.avgSatisfaction}
                subtitle={`de ${data.totalSurveys} avaliações`}
                tooltip="Média das notas dadas nas pesquisas de satisfação (1-5). Insight: abaixo de 3.5 requer ação urgente."
              />
              <MetricCard
                icon={Users} iconColor="text-primary" label="Respostas"
                value={data.totalSurveys}
                tooltip="Total de pesquisas respondidas. Insight: compare com total de usuários para ver taxa de resposta."
              />
            </div>
          </section>
        )}

      </CardContent>
    </Card>
  );
};

export default AdminMonitoringSection;
