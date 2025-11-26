import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare } from "lucide-react";

const Suporte = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Suporte</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-large">
          <CardHeader>
            <CardTitle>Central de Ajuda</CardTitle>
            <CardDescription>Chat de suporte e orientação</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Chat de suporte em tempo real. Em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Suporte;
