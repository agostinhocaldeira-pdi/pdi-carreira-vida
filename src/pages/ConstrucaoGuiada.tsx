import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const ConstrucaoGuiada = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Construção Guiada do PDI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-large">
          <CardHeader>
            <CardTitle>Trilha de Desenvolvimento</CardTitle>
            <CardDescription>Siga o passo a passo para construir seu PDI completo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta página conterá a trilha guiada com vídeos e exercícios. Em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConstrucaoGuiada;
