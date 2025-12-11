import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Shield, Home, Users, Trash2, UserPlus, Building2, UserCog, UserCheck, Mail, Zap, BookOpen } from "lucide-react";
import FinancialDashboard from "@/components/admin/FinancialDashboard";
import AdminMetricsPanel from "@/components/admin/AdminMetricsPanel";
import LeadsManagement from "@/components/admin/LeadsManagement";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

import LogoutButton from "@/components/LogoutButton";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";

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
  // Proteção de role - apenas admin pode acessar
  const { isLoading: roleLoading, isAdmin } = useRoleProtection({
    allowedRoles: ["admin"],
    redirectTo: "/home"
  });
  
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
    const loadData = async () => {
      if (roleLoading || !isAdmin) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAdminEmail(session.user.email || "");
      }
      
      // Carregar administradores do Supabase (users com role admin)
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (adminRoles && adminRoles.length > 0) {
        // Buscar dados dos usuários admin via auth.users não é possível diretamente
        // Os admins são gerenciados via user_roles table - exibimos apenas info básica
        const adminList: Administrator[] = adminRoles.map((role, index) => ({
          id: role.user_id,
          name: `Admin ${index + 1}`,
          email: session?.user?.id === role.user_id ? session.user.email || '' : `admin-${role.user_id.slice(0, 8)}`,
          phone: '',
          createdAt: new Date().toISOString()
        }));
        setAdministrators(adminList);
      }

      // Carregar empresas do Supabase
      const { data: companiesData } = await supabase.from('companies').select('*');
      if (companiesData) {
        const formattedCompanies: Company[] = companiesData.map((c: any) => ({
          id: c.id,
          razaoSocial: c.razao_social,
          cnpj: c.cnpj,
          email: c.email,
          telefone: c.telefone
        }));
        setCompanies(formattedCompanies);
        
        // Carregar gestores e funcionários de cada empresa do Supabase
        const managersMap: Record<string, Manager[]> = {};
        const employeesMap: Record<string, Employee[]> = {};
        
        for (const company of formattedCompanies) {
          const { data: managers } = await supabase
            .from('company_managers')
            .select('*')
            .eq('company_id', company.id);
          
          if (managers) {
            managersMap[company.id] = managers.map((m: any) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              phone: m.phone,
              acceptedAt: m.accepted_at
            }));
          }
          
          const { data: employees } = await supabase
            .from('company_employees')
            .select('*')
            .eq('company_id', company.id);
          
          if (employees) {
            employeesMap[company.id] = employees.map((e: any) => ({
              id: e.id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              acceptedAt: e.accepted_at
            }));
          }
        }
        
        setCompanyManagers(managersMap);
        setCompanyEmployees(employeesMap);
      }
    };
    
    loadData();
  }, [roleLoading, isAdmin]);

  // Loading state
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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

    // Nota: Para adicionar admin, é necessário criar o usuário no Supabase Auth
    // e depois adicionar o role na tabela user_roles
    toast.error("Para adicionar um novo administrador, é necessário primeiro criar o usuário no sistema e depois atribuir o role de admin via banco de dados.");
    setNewAdmin({ name: "", email: "", phone: "" });
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

  const confirmDeleteAdmin = async () => {
    if (deleteAdminId) {
      // Remover role de admin no Supabase
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', deleteAdminId)
        .eq('role', 'admin');
      
      if (error) {
        toast.error("Erro ao remover administrador: " + error.message);
        return;
      }
      
      const updatedAdmins = administrators.filter(admin => admin.id !== deleteAdminId);
      setAdministrators(updatedAdmins);
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

        {/* Painel de Métricas Real */}
        <AdminMetricsPanel />

        {/* Gestão de Leads */}
        <LeadsManagement />

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

        {/* Financial Dashboard */}
        <FinancialDashboard />
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
