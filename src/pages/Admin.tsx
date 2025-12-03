import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Shield, Home, Users, Settings, Activity, AlertCircle, Trash2, UserPlus, Star, Zap, TrendingUp, Building2, UserCog, UserCheck, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import LogoutButton from "@/components/LogoutButton";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Company {
  id: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone?: string;
  representatives?: { name: string; email: string; phone?: string; isPrimary?: boolean }[];
}

interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string;
  acceptedAt?: string | null;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  acceptedAt?: string | null;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyManagers, setCompanyManagers] = useState<Record<string, Manager[]>>({});
  const [companyEmployees, setCompanyEmployees] = useState<Record<string, Employee[]>>({});
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
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

    // Carregar empresas cadastradas
    const savedCompanies = localStorage.getItem("companies");
    if (savedCompanies) {
      const companiesData: Company[] = JSON.parse(savedCompanies);
      setCompanies(companiesData);
      
      // Carregar gestores e funcionários de cada empresa
      const managersData: Record<string, Manager[]> = {};
      const employeesData: Record<string, Employee[]> = {};
      
      companiesData.forEach(company => {
        const managers = localStorage.getItem(`managers_${company.id}`);
        if (managers) {
          managersData[company.id] = JSON.parse(managers);
        }
        
        const employees = localStorage.getItem(`employees_${company.id}`);
        if (employees) {
          employeesData[company.id] = JSON.parse(employees);
        }
      });
      
      setCompanyManagers(managersData);
      setCompanyEmployees(employeesData);
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

    setDeleteAdminId(id);
  };

  const confirmDeleteAdmin = () => {
    if (deleteAdminId) {
      const updatedAdmins = administrators.filter(admin => admin.id !== deleteAdminId);
      setAdministrators(updatedAdmins);
      localStorage.setItem("administrators", JSON.stringify(updatedAdmins));
      toast.success("Administrador removido com sucesso!");
      setDeleteAdminId(null);
    }
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/home")}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <LogoutButton />
            </div>
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

        {/* Notificações Pendentes - Admin */}
        {(() => {
          // Contar mensagens de suporte não lidas (usando chaves corretas do localStorage)
          const supportTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
          const supportMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");
          
          // Mensagens de usuários aguardando resposta do admin
          const pendingSupportMessages = supportTickets.filter((ticket: any) => {
            const ticketMessages = supportMessages.filter((msg: any) => msg.ticket_id === ticket.id);
            if (ticketMessages.length === 0) return true;
            const lastMessage = ticketMessages[ticketMessages.length - 1];
            return !lastMessage.is_admin_response;
          }).length;

          // Contar conversas de gestores aguardando resposta
          const managerConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
          const managerMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
          let pendingManagerConversations = 0;
          let pendingEmployeeConversations = 0;

          managerConversations.forEach((conv: any) => {
            const convMessages = managerMessages.filter((msg: any) => msg.conversation_id === conv.id);
            if (convMessages.length > 0) {
              const lastMsg = convMessages[convMessages.length - 1];
              if (!lastMsg.is_manager_response && !lastMsg.read_by_manager) {
                pendingManagerConversations++;
              }
              if (lastMsg.is_manager_response && !lastMsg.read_by_employee) {
                pendingEmployeeConversations++;
              }
            }
          });

          const totalNotifications = pendingSupportMessages + pendingManagerConversations + pendingEmployeeConversations;

          if (totalNotifications > 0) {
            return (
              <Card className="shadow-medium border-accent/30 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    Notificações Pendentes
                    <Badge variant="destructive" className="ml-2">{totalNotifications}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Mensagens aguardando atenção de todos os perfis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {pendingSupportMessages > 0 && (
                      <div 
                        className="p-3 bg-background rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => navigate("/suporte", { state: { showPendingTickets: true } })}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Suporte</span>
                          <Badge variant="secondary" className="ml-auto">{pendingSupportMessages}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Tickets aguardando resposta</p>
                      </div>
                    )}
                    {pendingManagerConversations > 0 && (
                      <div 
                        className="p-3 bg-background rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => navigate("/gestao-pdis", { state: { showMessages: true } })}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <UserCog className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-sm">Gestores</span>
                          <Badge variant="secondary" className="ml-auto">{pendingManagerConversations}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Mensagens de funcionários</p>
                      </div>
                    )}
                    {pendingEmployeeConversations > 0 && (
                      <div 
                        className="p-3 bg-background rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => navigate("/gestao-pdis", { state: { showMessages: true } })}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <UserCheck className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-sm">Funcionários</span>
                          <Badge variant="secondary" className="ml-auto">{pendingEmployeeConversations}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Respostas dos gestores</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}

        {/* Quick Access - Admin pode acessar todas as páginas */}
        <Card className="shadow-medium border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Acesso Rápido
            </CardTitle>
            <CardDescription>
              Como administrador, você tem acesso a todas as áreas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate("/dashboard-empresa")}
              >
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Dashboard Empresa</span>
                <span className="text-xs text-muted-foreground">Gerenciar empresas</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate("/gestao-pdis")}
              >
                <UserCog className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Gestão de PDIs</span>
                <span className="text-xs text-muted-foreground">Ver PDIs dos funcionários</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50"
                onClick={() => navigate("/home")}
              >
                <Home className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Meu PDI</span>
                <span className="text-xs text-muted-foreground">Acessar meu dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="hover:shadow-medium transition-all cursor-pointer hover:border-primary/50"
            onClick={() => navigate("/admin/usuarios")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">Mockado</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">127</h3>
              <p className="text-sm text-muted-foreground">Usuários Cadastrados</p>
              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usuários Ativos:</span>
                  <span className="font-medium text-green-600">124</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Engajamento:</span>
                  <span className="font-bold text-primary">98%</span>
                </div>
                <p className="text-xs text-muted-foreground italic pt-1">
                  Fórmula: (usuários ativos nos últimos 30 dias / total) × 100
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary">Mockado</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-green-600">72%</h3>
              <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Objetivos:</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Metas:</span>
                  <span className="font-medium">891</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ações:</span>
                  <span className="font-medium">2.156</span>
                </div>
              </div>
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

        {/* Empresas Cadastradas */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Empresas Cadastradas
            </CardTitle>
            <CardDescription>
              Total: {companies.length} empresa(s) cadastrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma empresa cadastrada
              </div>
            ) : (
              <Accordion type="multiple" className="w-full space-y-2">
                {companies.map((company) => (
                  <AccordionItem key={company.id} value={company.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{company.razaoSocial}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {company.email}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* CNPJ e Telefone */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">CNPJ:</span>
                            <span className="ml-2 font-medium">{company.cnpj}</span>
                          </div>
                          {company.telefone && (
                            <div>
                              <span className="text-muted-foreground">Telefone:</span>
                              <span className="ml-2 font-medium">{company.telefone}</span>
                            </div>
                          )}
                        </div>

                        {/* Representantes */}
                        {company.representatives && company.representatives.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              Representantes ({company.representatives.length})
                            </h5>
                            <div className="space-y-2">
                              {company.representatives.map((rep, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md">
                                  <div>
                                    <p className="text-sm font-medium">{rep.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {rep.email}
                                    </p>
                                  </div>
                                  {rep.isPrimary && (
                                    <Badge variant="outline" className="text-xs">Principal</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Gestores */}
                        {companyManagers[company.id] && companyManagers[company.id].length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                              <UserCog className="w-4 h-4 text-amber-600" />
                              Gestores ({companyManagers[company.id].length})
                            </h5>
                            <div className="space-y-2">
                              {companyManagers[company.id].map((manager) => (
                                <div key={manager.id} className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md">
                                  <div>
                                    <p className="text-sm font-medium">{manager.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {manager.email}
                                    </p>
                                  </div>
                                  <Badge variant={manager.acceptedAt ? "default" : "secondary"} className="text-xs">
                                    {manager.acceptedAt ? "Ativo" : "Pendente"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Funcionários */}
                        {companyEmployees[company.id] && companyEmployees[company.id].length > 0 && (
                          <div>
                            <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-green-600" />
                              Funcionários ({companyEmployees[company.id].length})
                            </h5>
                            <div className="space-y-2">
                              {companyEmployees[company.id].map((employee) => (
                                <div key={employee.id} className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                                  <div>
                                    <p className="text-sm font-medium">{employee.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {employee.email}
                                    </p>
                                  </div>
                                  <Badge variant={employee.acceptedAt ? "default" : "secondary"} className="text-xs">
                                    {employee.acceptedAt ? "Ativo" : "Pendente"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mensagem se não houver pessoas cadastradas */}
                        {(!company.representatives || company.representatives.length === 0) &&
                         (!companyManagers[company.id] || companyManagers[company.id].length === 0) &&
                         (!companyEmployees[company.id] || companyEmployees[company.id].length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Nenhum representante, gestor ou funcionário cadastrado
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Pesquisas de Satisfação */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pesquisas de Satisfação
            </CardTitle>
            <CardDescription>
              Análise de CSAT (Satisfação) e CES (Esforço) dos usuários (Dados Mockados)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">CSAT Médio</span>
                </div>
                <p className="text-2xl font-bold">4.3/5</p>
                <p className="text-xs text-muted-foreground mt-1">Satisfação geral</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">CES Médio</span>
                </div>
                <p className="text-2xl font-bold">5.8/7</p>
                <p className="text-xs text-muted-foreground mt-1">Facilidade de uso</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Respostas</span>
                </div>
                <p className="text-2xl font-bold">143</p>
                <p className="text-xs text-muted-foreground mt-1">Total de feedbacks</p>
              </div>
            </div>

            {/* Gráfico de Tendência */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Tendência de Satisfação (últimos 6 meses)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={[
                    { mes: "Jan", csat: 3.8, ces: 5.2 },
                    { mes: "Fev", csat: 4.0, ces: 5.4 },
                    { mes: "Mar", csat: 4.1, ces: 5.6 },
                    { mes: "Abr", csat: 4.2, ces: 5.5 },
                    { mes: "Mai", csat: 4.3, ces: 5.7 },
                    { mes: "Jun", csat: 4.3, ces: 5.8 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="csat" stroke="hsl(var(--primary))" name="CSAT (1-5)" strokeWidth={2} />
                  <Line type="monotone" dataKey="ces" stroke="hsl(var(--destructive))" name="CES (1-7)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico por Seção */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Satisfação por Seção</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { secao: "Diário", csat: 4.5, ces: 6.2 },
                    { secao: "Plano de Vida", csat: 4.2, ces: 5.5 },
                    { secao: "Objetivos", csat: 4.4, ces: 5.8 },
                    { secao: "Roda da Vida", csat: 4.1, ces: 5.4 },
                    { secao: "SWOT", csat: 4.0, ces: 5.3 },
                    { secao: "VVD", csat: 4.3, ces: 5.9 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="secao" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="csat" fill="hsl(var(--primary))" name="CSAT (1-5)" />
                  <Bar dataKey="ces" fill="hsl(var(--destructive))" name="CES (1-7)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela de Feedbacks Recentes */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Feedbacks Recentes</h4>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Seção</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Comentário</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        data: "2025-01-20", 
                        tipo: "CSAT", 
                        secao: "Diário", 
                        nota: "5/5", 
                        comentario: "Muito útil para reflexão diária!",
                        usuario: "joao@exemplo.com"
                      },
                      { 
                        data: "2025-01-19", 
                        tipo: "CES", 
                        secao: "Roda da Vida", 
                        nota: "6/7", 
                        comentario: "Fácil de usar, interface intuitiva",
                        usuario: "maria@exemplo.com"
                      },
                      { 
                        data: "2025-01-19", 
                        tipo: "CSAT", 
                        secao: "Objetivos", 
                        nota: "4/5", 
                        comentario: "Bom, mas poderia ter mais exemplos",
                        usuario: "pedro@exemplo.com"
                      },
                      { 
                        data: "2025-01-18", 
                        tipo: "CES", 
                        secao: "VVD", 
                        nota: "7/7", 
                        comentario: "Muito fácil, adorei a IA!",
                        usuario: "ana@exemplo.com"
                      },
                      { 
                        data: "2025-01-18", 
                        tipo: "CSAT", 
                        secao: "SWOT", 
                        nota: "3/5", 
                        comentario: "Poderia ter mais explicações sobre cada quadrante",
                        usuario: "carlos@exemplo.com"
                      },
                    ].map((feedback, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{feedback.data}</TableCell>
                        <TableCell>
                          <Badge variant={feedback.tipo === "CSAT" ? "default" : "secondary"} className="gap-1">
                            {feedback.tipo === "CSAT" ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                            {feedback.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>{feedback.secao}</TableCell>
                        <TableCell className="font-semibold">{feedback.nota}</TableCell>
                        <TableCell className="max-w-xs truncate">{feedback.comentario}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{feedback.usuario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDeleteDialog
        open={deleteAdminId !== null}
        onOpenChange={() => setDeleteAdminId(null)}
        onConfirm={confirmDeleteAdmin}
        title="Excluir Administrador"
        description="Tem certeza que deseja excluir este administrador? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default Admin;
