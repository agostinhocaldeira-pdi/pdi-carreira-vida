import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Construction, Shield } from "lucide-react";

const GestaoPDIs = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGestor, setIsGestor] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const administrators = JSON.parse(localStorage.getItem("administrators") || "[]");
    const userIsAdmin = administrators.some((admin: any) => 
      admin.email.toLowerCase() === (user.email || "").toLowerCase()
    );
    setIsAdmin(userIsAdmin);
    setIsGestor(user.role === "gestor");

    // Se não for admin nem gestor, redirecionar
    if (!userIsAdmin && user.role !== "gestor") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Gestão de PDI's</h1>
              {isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
            </div>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              <Shield className="w-4 h-4 mr-2" />
              Painel Admin
            </Button>
          )}
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
              {isAdmin 
                ? "Como administrador, você terá acesso aos PDIs de todos os funcionários de todas as empresas."
                : "Aqui você poderá acompanhar o desenvolvimento dos PDIs dos funcionários da sua equipe, visualizar progresso, metas e dar feedbacks."
              }
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
