import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, UserCog, UserCheck, TrendingUp, Target, CheckCircle2, Activity, Calendar, Eye, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Metrics {
  totalUsers: number;
  totalCompanies: number;
  totalManagers: number;
  totalEmployees: number;
  activeManagers: number;
  activeEmployees: number;
  pdiSmartUsers: number;
  totalObjectives: number;
  completedObjectives: number;
  totalGoals: number;
  completedGoals: number;
  totalActions: number;
  completedActions: number;
  diaryEntriesLast30Days: number;
  usersWithDiaryLast7Days: number;
}

const AdminMetricsPanel = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();
      
      // Fetch all metrics in parallel
      const [
        usersResponse,
        companiesResult,
        managersResult,
        employeesResult,
        objectivesResult,
        goalsResult,
        actionsResult,
        diaryResult,
        pdiSmartResult
      ] = await Promise.all([
        // Total users from edge function (accurate count with email filter)
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-admin-users`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()),
        // Total companies
        supabase.from('companies').select('id', { count: 'exact' }),
        // All managers
        supabase.from('company_managers').select('id, accepted_at', { count: 'exact' }),
        // All employees  
        supabase.from('company_employees').select('id, accepted_at', { count: 'exact' }),
        // All objectives
        supabase.from('user_objectives').select('id, status'),
        // All goals
        supabase.from('user_goals').select('id, status'),
        // All actions
        supabase.from('user_actions').select('id, status'),
        // Diary entries last 30 days
        supabase.from('diary_entries')
          .select('id, user_id, entry_date')
          .gte('entry_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        // PDI Smart users count
        supabase.from('user_roles').select('id', { count: 'exact' }).eq('role', 'pdismart')
      ]);

      // Calculate metrics
      const totalUsers = usersResponse?.users?.length || 0;
      const totalCompanies = companiesResult.count || 0;
      
      const managers = managersResult.data || [];
      const totalManagers = managers.length;
      const activeManagers = managers.filter(m => m.accepted_at).length;
      
      const employees = employeesResult.data || [];
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(e => e.accepted_at).length;
      
      const objectives = objectivesResult.data || [];
      const totalObjectives = objectives.length;
      const completedObjectives = objectives.filter(o => o.status === 'concluído').length;
      
      const goals = goalsResult.data || [];
      const totalGoals = goals.length;
      const completedGoals = goals.filter(g => g.status === 'concluído').length;
      
      const actions = actionsResult.data || [];
      const totalActions = actions.length;
      const completedActions = actions.filter(a => a.status === 'concluído').length;

      const diaryEntries = diaryResult.data || [];
      const diaryEntriesLast30Days = diaryEntries.length;
      const pdiSmartUsers = pdiSmartResult.count || 0;
      
      // Unique users with diary entries in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const usersWithDiaryLast7Days = new Set(
        diaryEntries.filter(d => d.entry_date >= sevenDaysAgo).map(d => d.user_id)
      ).size;

      setMetrics({
        totalUsers,
        totalCompanies,
        totalManagers,
        totalEmployees,
        activeManagers,
        activeEmployees,
        totalObjectives,
        completedObjectives,
        totalGoals,
        completedGoals,
        totalActions,
        completedActions,
        diaryEntriesLast30Days,
        usersWithDiaryLast7Days,
        pdiSmartUsers
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const calculateSuccessRate = () => {
    if (!metrics) return 0;
    const totalItems = metrics.totalObjectives + metrics.totalGoals + metrics.totalActions;
    if (totalItems === 0) return 0;
    const completedItems = metrics.completedObjectives + metrics.completedGoals + metrics.completedActions;
    return Math.round((completedItems / totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const successRate = calculateSuccessRate();

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <Card 
          className="hover:shadow-medium transition-all cursor-pointer hover:border-primary/50"
          onClick={() => navigate("/admin/usuarios")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{metrics.totalUsers}</h3>
            <p className="text-sm text-muted-foreground">Usuários Cadastrados</p>
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" />
                <span>{metrics.usersWithDiaryLast7Days} ativos nos últimos 7 dias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies */}
        <Card className="hover:shadow-medium transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metrics.totalCompanies}</h3>
            <p className="text-sm text-muted-foreground">Empresas Cadastradas</p>
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <UserCog className="w-3 h-3" /> Gestores:
                </span>
                <span className="font-medium">{metrics.activeManagers}/{metrics.totalManagers}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Funcionários:
                </span>
                <span className="font-medium">{metrics.activeEmployees}/{metrics.totalEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="hover:shadow-medium transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant={successRate >= 50 ? "default" : "secondary"} className="text-xs">
                {successRate >= 50 ? "Bom" : "Melhorar"}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1 text-green-600">{successRate}%</h3>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Target className="w-3 h-3" /> Objetivos:
                </span>
                <span className="font-medium">{metrics.completedObjectives}/{metrics.totalObjectives}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Metas:</span>
                <span className="font-medium">{metrics.completedGoals}/{metrics.totalGoals}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ações:</span>
                <span className="font-medium">{metrics.completedActions}/{metrics.totalActions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diary Engagement */}
        <Card className="hover:shadow-medium transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metrics.diaryEntriesLast30Days}</h3>
            <p className="text-sm text-muted-foreground">Entradas de Diário</p>
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3" />
                <span>Últimos 30 dias</span>
              </div>
        {/* PDI Smart Users */}
        <Card className="hover:shadow-medium transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="text-xs">R$ 47</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metrics.pdiSmartUsers}</h3>
            <p className="text-sm text-muted-foreground">Usuários PDI Smart</p>
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="w-3 h-3" />
                <span>Jornada (compra avulsa)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumo da Plataforma</CardTitle>
          <CardDescription>Visão geral dos dados reais do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{metrics.totalObjectives}</p>
              <p className="text-xs text-muted-foreground">Objetivos criados</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{metrics.totalGoals}</p>
              <p className="text-xs text-muted-foreground">Metas definidas</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{metrics.totalActions}</p>
              <p className="text-xs text-muted-foreground">Ações cadastradas</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{metrics.completedObjectives + metrics.completedGoals + metrics.completedActions}</p>
              <p className="text-xs text-muted-foreground">Total concluído</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetricsPanel;
