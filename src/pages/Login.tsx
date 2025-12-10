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
import { LogIn, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import ManagerRoleModal from "@/components/ManagerRoleModal";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pendingLogin, setPendingLogin] = useState<{
    userId: string;
    userType: "manager" | "employee";
    companyId: string;
    name: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        await handleSuccessfulLogin(data.user);
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (user: any) => {
    const userId = user.id;
    const userEmail = user.email || "";
    const userName = user.user_metadata?.name || userEmail.split('@')[0] || 'Usuário';
    const userPhone = user.user_metadata?.phone || '';

    // 1. Buscar role do usuário
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const userRole = roleData?.role || 'user';

    // 2. Verificar se é empresa
    if (userRole === 'empresa') {
      const { data: companyData } = await supabase
        .from('companies')
        .select('id, razao_social')
        .eq('owner_user_id', userId)
        .single();

      localStorage.setItem("user", JSON.stringify({
        id: userId,
        name: companyData?.razao_social || userName,
        email: userEmail,
        phone: userPhone,
        role: "empresa",
        companyId: companyData?.id,
      }));

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard-empresa");
      return;
    }

    // 3. Verificar se é gestor
    if (userRole === 'gestor') {
      const { data: managerData } = await supabase
        .from('company_managers')
        .select('id, company_id, name, accepted_at')
        .eq('user_id', userId)
        .single();

      if (managerData) {
        // Verificar se é primeiro acesso via user_metadata
        const needsPasswordSetup = user.user_metadata?.needs_password_setup === true;
        
        if (!managerData.accepted_at && needsPasswordSetup) {
          setPendingLogin({
            userId,
            userType: "manager",
            companyId: managerData.company_id,
            name: managerData.name,
            email: userEmail,
          });
          setShowNewPasswordModal(true);
          return;
        }

        localStorage.setItem("user", JSON.stringify({
          id: userId,
          name: managerData.name || userName,
          email: userEmail,
          phone: userPhone,
          role: "gestor",
          companyId: managerData.company_id,
          managerId: managerData.id,
        }));

        toast.success("Login realizado com sucesso!");
        setShowManagerModal(true);
        return;
      }
    }

    // 4. Verificar se é funcionário
    const { data: employeeData } = await supabase
      .from('company_employees')
      .select('id, company_id, name, accepted_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (employeeData) {
      // Verificar se é primeiro acesso via user_metadata
      const needsPasswordSetup = user.user_metadata?.needs_password_setup === true;
      
      if (!employeeData.accepted_at && needsPasswordSetup) {
        setPendingLogin({
          userId,
          userType: "employee",
          companyId: employeeData.company_id,
          name: employeeData.name,
          email: userEmail,
        });
        setShowNewPasswordModal(true);
        return;
      }

      localStorage.setItem("user", JSON.stringify({
        id: userId,
        name: employeeData.name || userName,
        email: userEmail,
        phone: userPhone,
        role: "user",
        companyId: employeeData.company_id,
        employeeId: employeeData.id,
      }));

      toast.success("Login realizado com sucesso!");
      navigate("/home");
      return;
    }

    // 5. Verificar se é admin (verificação via Supabase user_roles)
    if (userRole === 'admin') {

      localStorage.setItem("user", JSON.stringify({
        id: userId,
        name: userName,
        email: userEmail,
        phone: userPhone,
        role: "admin",
      }));

      toast.success("Login realizado com sucesso!");
      navigate("/admin");
      return;
    }

    // 6. Usuário comum
    localStorage.setItem("user", JSON.stringify({
      id: userId,
      name: userName,
      email: userEmail,
      phone: userPhone,
      role: userRole,
    }));

    toast.success("Login realizado com sucesso!");
    navigate("/home");
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
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

    setIsChangingPassword(true);

    try {
      // Atualizar senha no Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPasswordData.newPassword
      });

      if (updateError) {
        toast.error("Erro ao atualizar senha: " + updateError.message);
        return;
      }

      // Atualizar accepted_at no banco e limpar flag de setup
      const tableName = pendingLogin.userType === "manager" ? "company_managers" : "company_employees";
      await supabase
        .from(tableName)
        .update({ 
          accepted_at: new Date().toISOString()
        })
        .eq("user_id", pendingLogin.userId)
        .eq("company_id", pendingLogin.companyId);

      // Limpar flag needs_password_setup do user metadata
      await supabase.auth.updateUser({
        data: { needs_password_setup: false }
      });

      // Criar sessão
      localStorage.setItem("user", JSON.stringify({
        id: pendingLogin.userId,
        name: pendingLogin.name,
        email: pendingLogin.email,
        role: pendingLogin.userType === "manager" ? "gestor" : "user",
        companyId: pendingLogin.companyId,
        isFirstAccess: true,
      }));

      toast.success("Senha atualizada com sucesso!");
      setShowNewPasswordModal(false);
      setNewPasswordData({ newPassword: "", confirmPassword: "" });

      if (pendingLogin.userType === "manager") {
        setShowManagerModal(true);
      } else {
        navigate("/onboarding");
      }

      setPendingLogin(null);
    } catch (error) {
      toast.error("Erro ao atualizar senha");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordEmail(loginData.email);
    setShowForgotPasswordModal(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      toast.error("Por favor, digite seu e-mail");
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
      setShowForgotPasswordModal(false);
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição");
    } finally {
      setIsResetting(false);
    }
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
                  disabled={isChangingPassword}
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
                  disabled={isChangingPassword}
                />
                <PasswordToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4 mr-2" />
              )}
              {isChangingPassword ? "Atualizando..." : "Confirmar"}
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
              Digite seu e-mail para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">E-mail</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                disabled={isResetting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPasswordModal(false)}
                className="flex-1"
                disabled={isResetting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isResetting}>
                {isResetting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                {isResetting ? "Enviando..." : "Enviar Link"}
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
                  disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>

              <Button type="submit" className="w-full mt-4 sm:mt-6" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Entrando..." : "Entrar"}
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
