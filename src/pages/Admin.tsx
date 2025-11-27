import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Shield, Home, Users, Settings, Activity, AlertCircle, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário logado é admin
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Acesso não autorizado");
      navigate("/home");
      return;
    }

    const userData = JSON.parse(user);
    
    // Carregar administradores salvos
    const savedAdmins = localStorage.getItem("administrators");
    if (savedAdmins) {
      const administrators = JSON.parse(savedAdmins);
      setAdministrators(administrators);
      
      // Verifica se o usuário está na lista de administradores
      const userIsAdmin = administrators.some(
        (admin: { email: string }) => admin.email === userData.email
      );
      
      if (!userIsAdmin) {
        toast.error("Acesso restrito apenas para administradores");
        navigate("/home");
        return;
      }
      
      setIsAdmin(true);
      setAdminEmail(userData.email);
    } else {
      // Inicializar com o admin principal se não existir
      if (userData.email === "agostinhocmcaldeira@gmail.com") {
        const initialAdmin: Administrator = {
          id: "1",
          name: "Agostinho Caldeira",
          email: "agostinhocmcaldeira@gmail.com",
          phone: "(00) 00000-0000",
          createdAt: new Date().toISOString()
        };
        setAdministrators([initialAdmin]);
        localStorage.setItem("administrators", JSON.stringify([initialAdmin]));
        setIsAdmin(true);
        setAdminEmail(userData.email);
      } else {
        toast.error("Acesso restrito apenas para administradores");
        navigate("/home");
      }
    }
  }, [navigate]);

  const handleAddAdmin = () => {
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.phone.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast.error("Email inválido");
      return;
    }

    // Verifica se o email já existe
    if (administrators.some(admin => admin.email === newAdmin.email)) {
      toast.error("Já existe um administrador com este email");
      return;
    }

    const administrator: Administrator = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      createdAt: new Date().toISOString()
    };

    const updatedAdmins = [...administrators, administrator];
    setAdministrators(updatedAdmins);
    localStorage.setItem("administrators", JSON.stringify(updatedAdmins));
    
    setNewAdmin({ name: "", email: "", phone: "" });
    toast.success("Administrador cadastrado com sucesso!");
  };

  const handleDeleteAdmin = (id: string) => {
    const adminToDelete = administrators.find(admin => admin.id === id);
    
    // Não permitir excluir o próprio usuário logado
    if (adminToDelete?.email === adminEmail) {
      toast.error("Você não pode excluir sua própria conta de administrador");
      return;
    }

    const updatedAdmins = administrators.filter(admin => admin.id !== id);
    setAdministrators(updatedAdmins);
    localStorage.setItem("administrators", JSON.stringify(updatedAdmins));
    toast.success("Administrador removido com sucesso!");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-to-r from-card via-card to-destructive/5 border-b shadow-elegant backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center shadow-glow">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Área Restrita - Administração
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Painel de controle administrativo
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/home")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Admin Info Card */}
        <Card className="shadow-medium border-destructive/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  Perfil de Administrador
                </CardTitle>
                <CardDescription>
                  Logado como: {adminEmail}
                </CardDescription>
              </div>
              <Badge variant="destructive" className="gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dados Mockados</p>
                  <p className="text-xs text-muted-foreground">
                    Esta é uma simulação de área administrativa. Os dados exibidos são mockados 
                    para fins de demonstração. Em produção, esta área seria protegida por autenticação 
                    real e políticas de RLS no banco de dados.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-medium transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">Mockado</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">127</h3>
              <p className="text-sm text-muted-foreground">Usuários Cadastrados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">Mockado</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">1.234</h3>
              <p className="text-sm text-muted-foreground">Objetivos Criados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">Mockado</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">98%</h3>
              <p className="text-sm text-muted-foreground">Taxa de Engajamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Cadastro de Administradores */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Cadastrar Novo Administrador
            </CardTitle>
            <CardDescription>Adicione novos administradores ao sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nome</Label>
                <Input
                  id="admin-name"
                  placeholder="Nome completo"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-phone">Telefone</Label>
                <Input
                  id="admin-phone"
                  placeholder="(00) 00000-0000"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddAdmin} className="w-full sm:w-auto gap-2">
              <UserPlus className="w-4 h-4" />
              Cadastrar Administrador
            </Button>
          </CardContent>
        </Card>

        {/* Tabela de Administradores */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Administradores Cadastrados
            </CardTitle>
            <CardDescription>
              Total: {administrators.length} administrador(es)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {administrators.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhum administrador cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    administrators.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {admin.name}
                            {admin.email === adminEmail && (
                              <Badge variant="secondary" className="text-xs">
                                Você
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.phone}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            disabled={admin.email === adminEmail}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Atividades Recentes (Mockado)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "João Silva", action: "completou um objetivo", time: "há 5 minutos" },
                { user: "Maria Santos", action: "criou novo PDI", time: "há 12 minutos" },
                { user: "Pedro Costa", action: "atualizou Roda da Vida", time: "há 23 minutos" },
                { user: "Ana Oliveira", action: "completou módulo de estudo", time: "há 1 hora" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
