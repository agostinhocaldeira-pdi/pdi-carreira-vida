import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationType } from "@/types/integrations";
import { ArrowLeft, Link2, Link2Off, RefreshCw, Clock, AlertCircle } from "lucide-react";

const Integracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { integrations, isLoading, connectIntegration, disconnectIntegration } = useIntegrations();

  const handleConnect = async (type: IntegrationType, name: string) => {
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

        {/* Info Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Integrações em desenvolvimento</p>
              <p className="text-sm text-muted-foreground mt-1">
                Estamos trabalhando para disponibilizar as integrações abaixo. 
                Em breve você poderá sincronizar seus objetivos, metas e ações 
                com suas ferramentas favoritas de gestão de tarefas e calendário.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <Card key={integration.id} className="relative overflow-hidden">
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
                    variant={integration.isConnected ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {integration.isConnected ? "Conectado" : "Disponível em breve"}
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
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleConnect(integration.id, integration.name)}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Conectar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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

export default Integracoes;
