import { Link } from "react-router-dom";
import { ArrowLeft, Brain, ListTodo, Lightbulb, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { PendingTasksKanban } from "@/components/pending-tasks/PendingTasksKanban";
import LogoutButton from "@/components/LogoutButton";

const ListaPendencias = () => {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ferramentas">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Lista de Pendências</h1>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Explanation Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-primary" />
              Por que essa ferramenta existe?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Você já parou para pensar quantas pequenas tarefas ficam <strong>"martelando"</strong> na sua mente? 
              Trocar uma lâmpada queimada, resolver uma pendência em um órgão público, limpar uma janela, 
              ligar para alguém, pagar uma conta...
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">O Problema</h4>
                  <p className="text-sm text-muted-foreground">
                    Essas pequenas pendências consomem energia mental preciosa. Mesmo sem perceber, 
                    sua mente fica ocupada tentando "não esquecer" dessas tarefas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">A Solução</h4>
                  <p className="text-sm text-muted-foreground">
                    Ao registrar essas pendências aqui, você libera sua mente para focar no que 
                    realmente importa. É o conceito de "captura" do método GTD (Getting Things Done).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 rounded-lg p-4 border border-primary/10">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <span className="text-primary">💡</span> Como usar
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adicione todas as pendências que estão na sua cabeça em <strong>"A Fazer"</strong></li>
                <li>• Quando começar a trabalhar em algo, mova para <strong>"Fazendo"</strong></li>
                <li>• Ao concluir, mova para <strong>"Feito"</strong> (e celebre! 🎉)</li>
                <li>• As tarefas em "Fazendo" aparecem automaticamente na sua <strong>Agenda</strong></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Suas Pendências</h2>
          <PendingTasksKanban />
        </div>

        {/* Integration Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Integração com Agenda</h4>
                <p className="text-sm text-muted-foreground">
                  Todas as pendências com status <strong>"Fazendo"</strong> aparecem automaticamente 
                  na sua agenda diária, facilitando o acompanhamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ListaPendencias;
