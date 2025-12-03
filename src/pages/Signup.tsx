import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Verificar se já existe usuário com este e-mail
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email === formData.email) {
        toast.error("Este e-mail já está cadastrado. Faça login.");
        return;
      }
    }

    // Simular criação de perfil
    localStorage.setItem("user", JSON.stringify(formData));
    toast.success("Perfil criado com sucesso!");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:p-4 bg-gradient-subtle">
      <Card className="w-full max-w-md shadow-large animate-slide-up">
        <CardHeader className="space-y-2 text-center pb-4 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">PDI - Carreira & Vida</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Crie seu perfil e comece sua jornada de desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha segura (mín. 6 caracteres)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4 sm:mt-6" size="lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Perfil
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
