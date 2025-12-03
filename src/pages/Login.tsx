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
import { LogIn, KeyRound, UserPlus, Database, Eye, EyeOff } from "lucide-react";
import ManagerRoleModal from "@/components/ManagerRoleModal";
import { createMockCompanyData } from "@/utils/mockCompanyData";

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
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pendingLogin, setPendingLogin] = useState<{
    type: "manager" | "employee";
    companyId: string;
    personId: string;
    email: string;
  } | null>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showForgotNewPw, setShowForgotNewPw] = useState(false);
  const [showForgotConfirmPw, setShowForgotConfirmPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Verificar credenciais de usuário comum
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email.toLowerCase() === loginData.email.toLowerCase() && userData.password === loginData.password) {
        toast.success("Login realizado com sucesso!");
        
        // Redirecionar baseado no role
        if (userData.role === "empresa") {
          navigate("/dashboard-empresa");
        } else if (userData.role === "gestor") {
          setShowManagerModal(true);
        } else {
          navigate("/home");
        }
        return;
      }
    }

    // Verificar se é gestor ou funcionário de alguma empresa
    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    
    for (const company of companies) {
      // Verificar gestores
      const managers = JSON.parse(localStorage.getItem(`managers_${company.id}`) || "[]");
      const manager = managers.find((m: any) => m.email.toLowerCase() === loginData.email.toLowerCase());
      
      if (manager) {
        if (manager.provisionalPassword === loginData.password && !manager.acceptedAt) {
          // Primeiro login do gestor - precisa trocar senha
          setPendingLogin({ type: "manager", companyId: company.id, personId: manager.id, email: manager.email });
          setShowNewPasswordModal(true);
          return;
        } else if (manager.password === loginData.password) {
          // Login normal do gestor
          localStorage.setItem("user", JSON.stringify({
            name: manager.name,
            email: manager.email,
            role: "gestor",
            companyId: company.id,
            managerId: manager.id,
          }));
          toast.success("Login realizado com sucesso!");
          setShowManagerModal(true);
          return;
        }
      }

      // Verificar funcionários
      const employees = JSON.parse(localStorage.getItem(`employees_${company.id}`) || "[]");
      const employee = employees.find((emp: any) => emp.email.toLowerCase() === loginData.email.toLowerCase());
      
      if (employee) {
        if (employee.provisionalPassword === loginData.password && !employee.acceptedAt) {
          // Primeiro login do funcionário - precisa trocar senha
          setPendingLogin({ type: "employee", companyId: company.id, personId: employee.id, email: employee.email });
          setShowNewPasswordModal(true);
          return;
        } else if (employee.password === loginData.password) {
          // Login normal do funcionário
          localStorage.setItem("user", JSON.stringify({
            name: employee.name,
            email: employee.email,
            role: "user",
            companyId: company.id,
            employeeId: employee.id,
          }));
          toast.success("Login realizado com sucesso!");
          navigate("/home");
          return;
        }
      }
    }

    // Nenhuma credencial encontrada
    if (existingUser) {
      toast.error("E-mail ou senha incorretos");
    } else {
      toast.error("Nenhum usuário cadastrado neste navegador. Cadastre-se primeiro.", {
        description: "Os dados de cadastro são salvos localmente e não são compartilhados entre abas diferentes.",
        duration: 5000
      });
    }
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPasswordData.newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!pendingLogin) return;

    const storageKey = pendingLogin.type === "manager" 
      ? `managers_${pendingLogin.companyId}` 
      : `employees_${pendingLogin.companyId}`;
    
    const people = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const personIndex = people.findIndex((p: any) => p.id === pendingLogin.personId);
    
    if (personIndex >= 0) {
      people[personIndex].password = newPasswordData.newPassword;
      people[personIndex].acceptedAt = new Date().toISOString();
      people[personIndex].provisionalPassword = null;
      localStorage.setItem(storageKey, JSON.stringify(people));

      // Criar sessão do usuário
      localStorage.setItem("user", JSON.stringify({
        name: people[personIndex].name,
        email: people[personIndex].email,
        role: pendingLogin.type === "manager" ? "gestor" : "user",
        companyId: pendingLogin.companyId,
        [pendingLogin.type === "manager" ? "managerId" : "employeeId"]: pendingLogin.personId,
      }));

      toast.success("Senha atualizada com sucesso!");
      setShowNewPasswordModal(false);
      setNewPasswordData({ newPassword: "", confirmPassword: "" });
      setPendingLogin(null);

      if (pendingLogin.type === "manager") {
        setShowManagerModal(true);
      } else {
        navigate("/home");
      }
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
        userData.password = forgotPasswordData.newPassword;
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Senha alterada com sucesso!");
        setShowForgotPasswordModal(false);
        setLoginData({ email: userData.email, password: "" });
        return;
      }
    }

    toast.error("Nenhum usuário cadastrado neste navegador com este e-mail.", {
      description: "Os dados são salvos localmente. Se abriu em nova aba, cadastre-se novamente.",
      duration: 5000
    });
  };

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <>
      {/* Modal de troca de senha (primeiro acesso) */}
      <Dialog open={showNewPasswordModal} onOpenChange={setShowNewPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Crie sua nova senha
            </DialogTitle>
            <DialogDescription>
              Este é seu primeiro acesso. Por favor, crie uma nova senha para sua conta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPasswordSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="new-pw">Nova senha</Label>
              <div className="relative">
                <Input
                  id="new-pw"
                  type={showNewPw ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={newPasswordData.newPassword}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                  required
                  className="pr-10"
                />
                <PasswordToggle show={showNewPw} onToggle={() => setShowNewPw(!showNewPw)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirm-pw"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={newPasswordData.confirmPassword}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                  required
                  className="pr-10"
                />
                <PasswordToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <KeyRound className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de seleção para gestor */}
      <ManagerRoleModal open={showManagerModal} onOpenChange={setShowManagerModal} />

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
              <div className="relative">
                <Input
                  id="new-password"
                  type={showForgotNewPw ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={forgotPasswordData.newPassword}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
                  required
                  className="pr-10"
                />
                <PasswordToggle show={showForgotNewPw} onToggle={() => setShowForgotNewPw(!showForgotNewPw)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showForgotConfirmPw ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={forgotPasswordData.confirmPassword}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirmPassword: e.target.value })}
                  required
                  className="pr-10"
                />
                <PasswordToggle show={showForgotConfirmPw} onToggle={() => setShowForgotConfirmPw(!showForgotConfirmPw)} />
              </div>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
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

            {/* Botão de teste - remover em produção */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  createMockCompanyData();
                  toast.success("Dados de teste criados! Veja as credenciais no console (F12)");
                }}
              >
                <Database className="w-3 h-3 mr-2" />
                Criar dados de teste (empresa, gestores, funcionários)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;