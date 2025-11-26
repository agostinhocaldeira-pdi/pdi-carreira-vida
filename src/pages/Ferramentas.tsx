import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const Ferramentas = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Ferramentas de Desenvolvimento</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-large">
          <CardHeader>
            <CardTitle>Ferramentas Disponíveis</CardTitle>
            <CardDescription>SWOT, Roda da Vida, Forças e Fraquezas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aqui você terá acesso a diversas ferramentas de autoconhecimento. Em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Ferramentas;
