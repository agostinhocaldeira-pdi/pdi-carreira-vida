import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, TrendingUp, TrendingDown, Minus, MessageSquare, Star, ThumbsUp, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SatisfactionSurvey {
  id: string;
  user_id: string;
  user_email: string | null;
  section: string;
  survey_type: string;
  rating: number;
  feedback: string | null;
  created_at: string;
}

interface SurveyMetrics {
  totalResponses: number;
  averageRating: number;
  npsScore: number;
  csatPercentage: number;
  cesAverage: number;
  promoters: number;
  passives: number;
  detractors: number;
}

const sectionLabels: Record<string, string> = {
  'plano-vida': 'Plano de Vida',
  'ferramentas': 'Ferramentas',
  'diario': 'Diário',
  'mao-na-massa': 'Mão na Massa',
  'progresso': 'Progresso',
  'perfil': 'Perfil',
  'home': 'Home',
  'onboarding': 'Onboarding',
  'construcao-guiada': 'Construção Guiada',
};

export function SatisfactionSurveyPanel() {
  const [surveys, setSurveys] = useState<SatisfactionSurvey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("satisfaction_surveys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error("Erro ao buscar pesquisas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const filteredSurveys = surveys.filter(survey => {
    if (filterType !== "all" && survey.survey_type !== filterType) return false;
    if (filterSection !== "all" && survey.section !== filterSection) return false;
    return true;
  });

  const calculateMetrics = (surveyData: SatisfactionSurvey[]): SurveyMetrics => {
    if (surveyData.length === 0) {
      return {
        totalResponses: 0,
        averageRating: 0,
        npsScore: 0,
        csatPercentage: 0,
        cesAverage: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
      };
    }

    const totalResponses = surveyData.length;
    const averageRating = surveyData.reduce((sum, s) => sum + s.rating, 0) / totalResponses;

    // NPS calculation (ratings 9-10 = promoters, 7-8 = passives, 1-6 = detractors)
    const npsSurveys = surveyData.filter(s => s.survey_type === 'nps');
    const promoters = npsSurveys.filter(s => s.rating >= 9).length;
    const passives = npsSurveys.filter(s => s.rating >= 7 && s.rating <= 8).length;
    const detractors = npsSurveys.filter(s => s.rating <= 6).length;
    const npsTotal = npsSurveys.length;
    const npsScore = npsTotal > 0 
      ? Math.round(((promoters - detractors) / npsTotal) * 100) 
      : 0;

    // CSAT calculation (ratings 4-5 on scale of 5, or 8-10 on scale of 10)
    const csatSurveys = surveyData.filter(s => s.survey_type === 'csat');
    const satisfiedResponses = csatSurveys.filter(s => s.rating >= 4).length;
    const csatPercentage = csatSurveys.length > 0 
      ? Math.round((satisfiedResponses / csatSurveys.length) * 100) 
      : 0;

    // CES calculation (Customer Effort Score)
    const cesSurveys = surveyData.filter(s => s.survey_type === 'ces');
    const cesAverage = cesSurveys.length > 0 
      ? cesSurveys.reduce((sum, s) => sum + s.rating, 0) / cesSurveys.length 
      : 0;

    return {
      totalResponses,
      averageRating: Math.round(averageRating * 10) / 10,
      npsScore,
      csatPercentage,
      cesAverage: Math.round(cesAverage * 10) / 10,
      promoters,
      passives,
      detractors,
    };
  };

  const metrics = calculateMetrics(filteredSurveys);

  const getNPSBadge = (score: number) => {
    if (score >= 50) return <Badge className="bg-green-500">Excelente</Badge>;
    if (score >= 0) return <Badge className="bg-yellow-500">Bom</Badge>;
    return <Badge className="bg-red-500">Precisa Melhorar</Badge>;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const exportToCSV = () => {
    const headers = ["Data", "Usuário", "Seção", "Tipo", "Nota", "Feedback"];
    const rows = filteredSurveys.map(s => [
      format(new Date(s.created_at), "dd/MM/yyyy HH:mm"),
      s.user_email || "Não informado",
      sectionLabels[s.section] || s.section,
      s.survey_type.toUpperCase(),
      s.rating.toString(),
      s.feedback || "",
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pesquisas-satisfacao-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const uniqueSections = [...new Set(surveys.map(s => s.section))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Pesquisas de Satisfação
            </CardTitle>
            <CardDescription>
              Análise de NPS, CSAT e CES dos usuários
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={fetchSurveys}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Respostas</p>
                  <p className="text-2xl font-bold">{metrics.totalResponses}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NPS Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{metrics.npsScore}</p>
                    {getNPSBadge(metrics.npsScore)}
                  </div>
                </div>
                {getTrendIcon(metrics.npsScore, 50)}
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-green-600">P: {metrics.promoters}</span>
                <span className="text-yellow-600">N: {metrics.passives}</span>
                <span className="text-red-600">D: {metrics.detractors}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CSAT</p>
                  <p className="text-2xl font-bold">{metrics.csatPercentage}%</p>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-8 h-8 text-muted-foreground" />
                  {getTrendIcon(metrics.csatPercentage, 80)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                  <p className="text-2xl font-bold">{metrics.averageRating}/5</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-8 h-8 text-muted-foreground" />
                  {getTrendIcon(metrics.averageRating, 4)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tipo:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="nps">NPS</SelectItem>
                <SelectItem value="csat">CSAT</SelectItem>
                <SelectItem value="ces">CES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Seção:</span>
            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {uniqueSections.map(section => (
                  <SelectItem key={section} value={section}>
                    {sectionLabels[section] || section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Survey Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Seção</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredSurveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma pesquisa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredSurveys.slice(0, 50).map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(survey.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {survey.user_email || "Não informado"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sectionLabels[survey.section] || survey.section}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          survey.survey_type === 'nps' ? 'bg-blue-100 text-blue-800' :
                          survey.survey_type === 'csat' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }
                      >
                        {survey.survey_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getRatingColor(survey.rating)}`}>
                        {survey.rating}/5
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {survey.feedback || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredSurveys.length > 50 && (
          <p className="text-sm text-muted-foreground text-center">
            Mostrando 50 de {filteredSurveys.length} resultados
          </p>
        )}
      </CardContent>
    </Card>
  );
}
