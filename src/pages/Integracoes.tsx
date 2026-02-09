import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationType } from "@/types/integrations";
import { ArrowLeft, Link2, Link2Off, RefreshCw, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";
import { GoogleCalendarService } from "@/services/integrations/GoogleCalendarService";

const IntegracoesInner = () => {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { integrations, isLoading, connectIntegration, disconnectIntegration } = useIntegrations();
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleGoogleCalendarSync = async () => {
    setSyncing(true);
    try {
      const service = new GoogleCalendarService();
      const result = await service.syncEvents();
      
      if (result.success && result.itemsSynced > 0) {
        toast({
          title: "Sincronização concluída!",
          description: `${result.itemsSynced} item(ns) exportado(s) para o Google Calendar.`,
        });
      } else if (result.errors && result.errors.length > 0) {
        // Check if it's a token error - if so, re-authenticate automatically
        const isTokenError = result.errors.some(e => 
          e.includes('Token') || e.includes('expirado') || e.includes('reconect')
        );
        
        if (isTokenError) {
          toast({
            title: "Renovando acesso...",
            description: "Redirecionando para autenticação do Google.",
          });
          // Trigger OAuth with pending sync flag
          await service.connect({ pendingSync: 'true' });
          return;
        }
        
        toast({
          title: "Erro na sincronização",
          description: result.errors[0],
          variant: "destructive",
        });
      } else {
        toast({
          title: "Nada para sincronizar",
          description: "Nenhum objetivo ou meta com data alvo encontrado.",
        });
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      toast({
        title: "Erro na sincronização",
        description: error.message || "Não foi possível sincronizar.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  // Check if Google Calendar is connected via OAuth and handle pending sync
  useEffect(() => {
    const checkGoogleConnection = async () => {
      // First check if there's a fresh session with provider_token (just returned from OAuth)
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;
      
      console.log('[GoogleCalendar] Session check - provider_token exists:', !!providerToken);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has Google provider linked
        const hasGoogleProvider = user.app_metadata?.providers?.includes('google') ||
          user.identities?.some(i => i.provider === 'google');
        
        console.log('[GoogleCalendar] Has Google provider:', hasGoogleProvider);
        
        if (hasGoogleProvider) {
          setGoogleCalendarConnected(true);
          // Save to user_integrations
          await supabase
            .from('user_integrations')
            .upsert({
              user_id: user.id,
              integration_type: 'google_calendar',
              is_connected: true,
              connected_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,integration_type' });
          
          // Check if there's a pending sync AND we have a fresh provider_token
          const service = new GoogleCalendarService();
          if (service.hasPendingSync() && providerToken) {
            console.log('[GoogleCalendar] Pending sync detected with valid token - syncing now');
            service.clearPendingSync();
            
            setSyncing(true);
            try {
              const result = await service.syncEvents();
              console.log('[GoogleCalendar] Sync result:', result);
              
              if (result.success && result.itemsSynced > 0) {
                toast({
                  title: "Sincronização concluída!",
                  description: `${result.itemsSynced} item(ns) exportado(s) para o Google Calendar.`,
                });
              } else if (result.errors && result.errors.length > 0) {
                toast({
                  title: "Erro na sincronização",
                  description: result.errors[0],
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Nada para sincronizar",
                  description: "Nenhum objetivo ou meta com data alvo encontrado.",
                });
              }
            } finally {
              setSyncing(false);
            }
          } else if (service.hasPendingSync() && !providerToken) {
            console.log('[GoogleCalendar] Pending sync but no provider_token - clearing flag');
            service.clearPendingSync();
            toast({
              title: "Token não disponível",
              description: "Por favor, clique em Sincronizar novamente para autenticar.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    checkGoogleConnection();
  }, [toast]);

  const handleGoogleCalendarConnect = async () => {
    setConnecting(true);
    try {
      const service = new GoogleCalendarService();
      await service.connect();
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar ao Google Calendar. Tente novamente.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const handleGoogleCalendarDisconnect = async () => {
    const service = new GoogleCalendarService();
    await service.disconnect();
    setGoogleCalendarConnected(false);
    toast({
      title: "Desconectado",
      description: "Google Calendar foi desconectado.",
    });
  };

  const handleConnect = async (type: IntegrationType, name: string) => {
    if (type === 'google_calendar') {
      handleGoogleCalendarConnect();
      return;
    }
    
    try {
      await connectIntegration(type);
      toast({
        title: "Conectado!",
        description: `${name} foi conectado com sucesso.`,
      });
    } catch {
      toast({
        title: "Em breve!",
        description: `A integração com ${name} estará disponível em breve.`,
        variant: "default",
      });
    }
  };

  const handleDisconnect = async (type: IntegrationType, name: string) => {
    if (type === 'google_calendar') {
      handleGoogleCalendarDisconnect();
      return;
    }
    
    await disconnectIntegration(type);
    toast({
      title: "Desconectado",
      description: `${name} foi desconectado.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Update Google Calendar status in integrations array
  const updatedIntegrations = integrations.map(integration => {
    if (integration.id === 'google_calendar') {
      return { ...integration, isConnected: googleCalendarConnected };
    }
    return integration;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Integrações</h1>
            <p className="text-muted-foreground">
              Conecte o PDI com suas ferramentas favoritas de produtividade
            </p>
          </div>
        </div>

        {/* Google Calendar Highlight */}
        <Card className="mb-8 border-green-500/30 bg-green-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Google Calendar disponível!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Conecte seu Google Calendar para sincronizar seus objetivos, metas e ações 
                diretamente com seu calendário.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Outras integrações em desenvolvimento</p>
              <p className="text-sm text-muted-foreground mt-1">
                Estamos trabalhando para disponibilizar mais integrações. 
                Em breve você poderá sincronizar com Notion, Todoist e outras ferramentas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {updatedIntegrations.map((integration) => {
            const isGoogleCalendar = integration.id === 'google_calendar';
            const isAvailable = isGoogleCalendar;
            
            return (
              <Card 
                key={integration.id} 
                className={`relative overflow-hidden ${isGoogleCalendar ? 'ring-2 ring-green-500/30' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={integration.isConnected ? "default" : isAvailable ? "outline" : "secondary"}
                      className={`shrink-0 ${integration.isConnected ? 'bg-green-500' : isAvailable ? 'border-green-500 text-green-600' : ''}`}
                    >
                      {integration.isConnected ? "Conectado" : isAvailable ? "Disponível" : "Em breve"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {integration.isConnected ? (
                    <div className="space-y-3">
                      {integration.lastSyncAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            Última sincronização:{" "}
                            {new Date(integration.lastSyncAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDisconnect(integration.id, integration.name)}
                        >
                          <Link2Off className="w-4 h-4 mr-2" />
                          Desconectar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleGoogleCalendarSync}
                          disabled={syncing}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                          {syncing ? 'Sincronizando...' : 'Sincronizar'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant={isAvailable ? "default" : "outline"}
                      className={`w-full ${isAvailable ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={() => handleConnect(integration.id, integration.name)}
                      disabled={!isGoogleCalendar || (connecting && isGoogleCalendar)}
                    >
                      {connecting && isGoogleCalendar ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Link2 className="w-4 h-4 mr-2" />
                      )}
                      {isAvailable ? 'Conectar agora' : 'Em breve'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

import SubscriptionGate from "@/components/subscription/SubscriptionGate";

const Integracoes = () => (
  <SubscriptionGate featureName="Integrações">
    <IntegracoesInner />
  </SubscriptionGate>
);

export default Integracoes;
