import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3, Globe, Monitor, Smartphone, Chrome, Users,
  Eye, MousePointerClick, ArrowUpRight, RefreshCw, TrendingUp,
  HelpCircle, MapPin, Link2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface PostHogData {
  summary: {
    uniqueUsers30d: number;
    totalPageviews30d: number;
    avgPageviewsPerUser: number;
  };
  dailyActiveUsers: { date: string; value: number }[];
  topPages: { label: string; count: number }[];
  topCountries: { label: string; count: number }[];
  topBrowsers: { label: string; count: number }[];
  topDevices: { label: string; count: number }[];
  topReferrers: { label: string; count: number }[];
  eventTotals: { event: string; count: number }[];
}

const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help inline ml-1" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs">{text}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const MetricCard = ({ icon: Icon, iconColor, label, value, subtitle, tooltip }: {
  icon: any; iconColor: string; label: string; value: string | number; subtitle?: string; tooltip: string;
}) => (
  <div className="p-4 bg-card rounded-xl border border-border/50 space-y-2">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span>{label}</span>
      <InfoTooltip text={tooltip} />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </div>
);

const RankingList = ({ items, icon: Icon, iconColor, maxItems = 8 }: {
  items: { label: string; count: number }[];
  icon: any;
  iconColor: string;
  maxItems?: number;
}) => (
  <div className="space-y-1 p-4 bg-muted/30 rounded-xl border border-border/50">
    {items.slice(0, maxItems).map((item, i) => (
      <div key={item.label} className="flex items-center justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
        <span className="text-muted-foreground truncate max-w-[70%]">
          <span className="text-foreground font-medium mr-2">{i + 1}.</span>
          <span className="hidden sm:inline">{item.label}</span>
          <span className="sm:hidden">{item.label.startsWith('/') ? `/${item.label.split('/').pop()}` : item.label}</span>
        </span>
        <Badge variant="secondary" className="text-xs shrink-0">{item.count}</Badge>
      </div>
    ))}
    {items.length === 0 && (
      <p className="text-xs text-muted-foreground text-center py-2">Sem dados ainda</p>
    )}
  </div>
);

const PostHogAnalyticsPanel = () => {
  const [data, setData] = useState<PostHogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/posthog-analytics`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Erro ${res.status}: ${errBody}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      console.error('PostHog fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-medium border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-destructive" />
            PostHog Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  // Format daily chart data
  const chartData = data.dailyActiveUsers.map(d => ({
    date: d.date.split(' ')[0] || d.date,
    DAU: d.value,
  })).slice(-30);

  return (
    <Card className="shadow-medium border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              PostHog Analytics
              <Badge variant="outline" className="text-xs">30 dias</Badge>
            </CardTitle>
            <CardDescription>
              Dados reais de tráfego, comportamento e origem dos visitantes
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchData} title="Atualizar">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Summary */}
        <section className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Resumo Geral
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetricCard
              icon={Users} iconColor="text-primary" label="Usuários Únicos"
              value={data.summary.uniqueUsers30d}
              tooltip="Quantidade de visitantes únicos nos últimos 30 dias (PostHog DAU acumulado)."
            />
            <MetricCard
              icon={Eye} iconColor="text-green-600" label="Pageviews"
              value={data.summary.totalPageviews30d.toLocaleString()}
              tooltip="Total de páginas visualizadas nos últimos 30 dias."
            />
            <MetricCard
              icon={MousePointerClick} iconColor="text-amber-600" label="Páginas/Usuário"
              value={data.summary.avgPageviewsPerUser}
              tooltip="Média de páginas por usuário único. Quanto maior, mais engajamento."
            />
          </div>
        </section>

        {/* DAU Chart */}
        {chartData.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Usuários Ativos Diários (DAU)
              <InfoTooltip text="Quantidade de usuários únicos por dia nos últimos 30 dias." />
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => {
                    const parts = v.split('-');
                    return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : v;
                  }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="DAU" stroke="hsl(var(--primary))" fill="url(#dauGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Top Pages */}
        {data.topPages.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-primary" />
              Páginas Mais Visitadas
              <InfoTooltip text="URLs mais acessadas nos últimos 30 dias, direto do PostHog." />
            </h3>
            <RankingList items={data.topPages} icon={Eye} iconColor="text-green-600" />
          </section>
        )}

        {/* Traffic Sources */}
        {data.topReferrers.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              Fontes de Tráfego
              <InfoTooltip text="De onde os visitantes estão vindo (referring domains)." />
            </h3>
            <RankingList items={data.topReferrers} icon={Link2} iconColor="text-blue-600" maxItems={6} />
          </section>
        )}

        {/* Geo + Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.topCountries.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Países
              </h3>
              <RankingList items={data.topCountries} icon={Globe} iconColor="text-blue-600" maxItems={5} />
            </section>
          )}
          {data.topBrowsers.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Chrome className="w-4 h-4 text-primary" />
                Navegadores
              </h3>
              <RankingList items={data.topBrowsers} icon={Chrome} iconColor="text-amber-600" maxItems={5} />
            </section>
          )}
          {data.topDevices.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                Dispositivos
              </h3>
              <RankingList items={data.topDevices} icon={Monitor} iconColor="text-green-600" maxItems={5} />
            </section>
          )}
        </div>

        {/* Event Totals */}
        {data.eventTotals.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-primary" />
              Eventos Capturados
              <InfoTooltip text="Total de eventos rastreados automaticamente pelo PostHog." />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.eventTotals.map(evt => (
                <div key={evt.event} className="p-3 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground">{evt.event.replace('$', '')}</p>
                  <p className="text-lg font-bold">{evt.count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </CardContent>
    </Card>
  );
};

export default PostHogAnalyticsPanel;
