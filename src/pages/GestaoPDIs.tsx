import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Construction } from "lucide-react";

const GestaoPDIs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-lg">Gestão de PDI's</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-amber-500/10 w-fit">
              <Construction className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Em Construção</CardTitle>
            <CardDescription className="text-base">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Aqui você poderá acompanhar o desenvolvimento dos PDIs dos funcionários da sua equipe,
              visualizar progresso, metas e dar feedbacks.
            </p>
            <Button onClick={() => navigate("/home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Meu PDI
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GestaoPDIs;
