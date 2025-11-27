import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Verificar se já existe usuário com este e-mail
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email === formData.email) {
        // Abrir modal de login ao invés de mostrar erro
        setLoginData({ email: formData.email, password: "" });
        setShowLoginModal(true);
        return;
      }
    }

    // Simular criação de perfil
    localStorage.setItem("user", JSON.stringify(formData));
    toast.success("Perfil criado com sucesso!");
    navigate("/onboarding");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Verificar credenciais
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email === loginData.email && userData.password === loginData.password) {
        toast.success("Login realizado com sucesso!");
        setShowLoginModal(false);
        navigate("/home");
      } else {
        toast.error("E-mail ou senha incorretos");
      }
    } else {
      toast.error("Usuário não encontrado");
    }
  };

  return (
    <>
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Bem-vindo de volta!
            </DialogTitle>
            <DialogDescription>
              Você já possui um perfil cadastrado. Faça login para acessar sua conta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Digite sua senha"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLoginModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
                placeholder="Crie uma senha segura"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4 sm:mt-6" size="lg">
              Criar Perfil
            </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Signup;
