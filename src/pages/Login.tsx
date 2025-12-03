import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { LogIn, KeyRound, UserPlus } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      if (userData.email.toLowerCase() === loginData.email.toLowerCase() && userData.password === loginData.password) {
        toast.success("Login realizado com sucesso!");
        navigate("/home");
      } else {
        toast.error("E-mail ou senha incorretos");
      }
    } else {
      toast.error("Usuário não encontrado. Cadastre-se primeiro.");
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordData({ email: loginData.email, newPassword: "", confirmPassword: "" });
    setShowForgotPasswordModal(true);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordData.email || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Verificar se o usuário existe
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email.toLowerCase() === forgotPasswordData.email.toLowerCase()) {
        // Atualizar senha no localStorage
        userData.password = forgotPasswordData.newPassword;
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Senha alterada com sucesso!");
        setShowForgotPasswordModal(false);
        setLoginData({ email: userData.email, password: "" });
        return;
      }
    }

    toast.error("E-mail não encontrado");
  };

  return (
    <>
      {/* Modal de Esqueci minha senha */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Redefinir senha
            </DialogTitle>
            <DialogDescription>
              Digite seu e-mail e crie uma nova senha para acessar sua conta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">E-mail</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={forgotPasswordData.email}
                onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite sua nova senha"
                value={forgotPasswordData.newPassword}
                onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua nova senha"
                value={forgotPasswordData.confirmPassword}
                onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPasswordModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <KeyRound className="w-4 h-4 mr-2" />
                Redefinir
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
              Faça login para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </button>

              <Button type="submit" className="w-full mt-4 sm:mt-6" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
