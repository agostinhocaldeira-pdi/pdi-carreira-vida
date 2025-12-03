import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Target, TrendingUp, Calendar, FileDown, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportCompanyReportToPDF } from "@/utils/companyPdfExport";
import { toast } from "sonner";

interface EmployeeStats {
  id: string;
  name: string;
  objetivos: number;
  objetivosConcluidos: number;
  metas: number;
  metasConcluidas: number;
  diasDiario: number;
  objetivosAlinhados: number;
}

interface CompanyReportsTabProps {
  companyId: string;
  companyName?: string;
  employees: Array<{ id: string; name: string; email: string }>;
  managers: Array<{ id: string; name: string; email: string }>;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CompanyReportsTab({ companyId, companyName = "Empresa", employees, managers }: CompanyReportsTabProps) {
  const [period, setPeriod] = useState("month");
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats[]>([]);
  const [okrAlignmentRate, setOkrAlignmentRate] = useState(0);
  const [aggregatedStats, setAggregatedStats] = useState({
    totalObjetivos: 0,
    objetivosConcluidos: 0,
    totalMetas: 0,
    metasConcluidas: 0,
    mediaEngagement: 0,
    funcionariosAtivos: 0,
    funcionariosAlinhados: 0,
  });

  useEffect(() => {
    loadReports();
  }, [companyId, employees, period]);

  const loadReports = () => {
    // Simular carregamento de dados agregados dos funcionários
    // Em produção, isso viria do Supabase
    const stats: EmployeeStats[] = employees.map((emp) => {
      const objetivos = Math.floor(Math.random() * 5) + 1;
      const objetivosAlinhados = Math.floor(Math.random() * (objetivos + 1));
      return {
        id: emp.id,
        name: emp.name,
        objetivos,
        objetivosConcluidos: Math.floor(Math.random() * 3),
        metas: Math.floor(Math.random() * 10) + 2,
        metasConcluidas: Math.floor(Math.random() * 8),
        diasDiario: Math.floor(Math.random() * 30),
        objetivosAlinhados,
      };
    });

    setEmployeeStats(stats);

    // Calcular agregados
    const totals = stats.reduce(
      (acc, emp) => ({
        totalObjetivos: acc.totalObjetivos + emp.objetivos,
        objetivosConcluidos: acc.objetivosConcluidos + emp.objetivosConcluidos,
        totalMetas: acc.totalMetas + emp.metas,
        metasConcluidas: acc.metasConcluidas + emp.metasConcluidas,
        diasDiario: acc.diasDiario + emp.diasDiario,
        objetivosAlinhados: acc.objetivosAlinhados + emp.objetivosAlinhados,
      }),
      { totalObjetivos: 0, objetivosConcluidos: 0, totalMetas: 0, metasConcluidas: 0, diasDiario: 0, objetivosAlinhados: 0 }
    );

    const funcionariosAtivos = stats.filter((s) => s.diasDiario > 0).length;
    const funcionariosAlinhados = stats.filter((s) => s.objetivosAlinhados > 0).length;
    const mediaEngagement = employees.length > 0 ? Math.round((funcionariosAtivos / employees.length) * 100) : 0;
    const alignmentRate = employees.length > 0 ? Math.round((funcionariosAlinhados / employees.length) * 100) : 0;

    setOkrAlignmentRate(alignmentRate);
    setAggregatedStats({
      ...totals,
      mediaEngagement,
      funcionariosAtivos,
      funcionariosAlinhados,
    });
  };

  const taxaConclusaoObjetivos = aggregatedStats.totalObjetivos > 0
    ? Math.round((aggregatedStats.objetivosConcluidos / aggregatedStats.totalObjetivos) * 100)
    : 0;

  const taxaConclusaoMetas = aggregatedStats.totalMetas > 0
    ? Math.round((aggregatedStats.metasConcluidas / aggregatedStats.totalMetas) * 100)
    : 0;

  const chartData = [
    { name: 'Objetivos', concluidos: aggregatedStats.objetivosConcluidos, total: aggregatedStats.totalObjetivos },
    { name: 'Metas', concluidos: aggregatedStats.metasConcluidas, total: aggregatedStats.totalMetas },
  ];

  const engagementData = [
    { name: 'Ativos', value: aggregatedStats.funcionariosAtivos },
    { name: 'Inativos', value: employees.length - aggregatedStats.funcionariosAtivos },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Relatórios Consolidados
          </h3>
          <p className="text-sm text-muted-foreground">
            Visão agregada do progresso de todos os funcionários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const now = new Date();
              exportCompanyReportToPDF({
                companyName,
                period,
                generatedAt: now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                totalEmployees: employees.length,
                totalManagers: managers.length,
                aggregatedStats,
                taxaConclusaoObjetivos,
                taxaConclusaoMetas,
                okrAlignmentRate,
                employeeStats,
                managers,
              });
              toast.success("Relatório exportado com sucesso!");
            }}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taxaConclusaoObjetivos}%</p>
                <p className="text-xs text-muted-foreground">Taxa Objetivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taxaConclusaoMetas}%</p>
                <p className="text-xs text-muted-foreground">Taxa Metas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{okrAlignmentRate}%</p>
                <p className="text-xs text-muted-foreground">Alinhados OKRs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aggregatedStats.mediaEngagement}%</p>
                <p className="text-xs text-muted-foreground">Engajamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aggregatedStats.funcionariosAtivos}</p>
                <p className="text-xs text-muted-foreground">Func. Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conclusão por Categoria</CardTitle>
            <CardDescription>Comparativo entre objetivos e metas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="concluidos" fill="#22c55e" name="Concluídos" />
                  <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engajamento dos Funcionários</CardTitle>
            <CardDescription>Funcionários que acessaram o PDI no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking de Performance</CardTitle>
          <CardDescription>Funcionários com maior taxa de conclusão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employeeStats
              .sort((a, b) => {
                const rateA = a.metas > 0 ? a.metasConcluidas / a.metas : 0;
                const rateB = b.metas > 0 ? b.metasConcluidas / b.metas : 0;
                return rateB - rateA;
              })
              .slice(0, 5)
              .map((emp, index) => {
                const rate = emp.metas > 0 ? Math.round((emp.metasConcluidas / emp.metas) * 100) : 0;
                return (
                  <div key={emp.id} className="flex items-center gap-4">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{emp.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={rate} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-12">{rate}%</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{emp.metasConcluidas}/{emp.metas} metas</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
