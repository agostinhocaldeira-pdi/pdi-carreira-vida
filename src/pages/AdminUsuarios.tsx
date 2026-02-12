import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Users, Search, UserCheck, UserX, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dataCadastro: string;
  ultimoAcesso: string;
  status: "ativo" | "inativo";
  role: string;
  atividades: {
    objetivos: number;
    metas: number;
    acoes: number;
    diario: number;
  };
}

const AdminUsuarios = () => {
  const { isLoading: roleLoading, isAdmin } = useRoleProtection({
    allowedRoles: ["admin"],
    redirectTo: "/home"
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch auth users via edge function
      const { data: session } = await supabase.auth.getSession();
      let authUsersMap: Record<string, { name: string; email: string; phone: string; created_at: string }> = {};
      
      if (session.session) {
        const response = await supabase.functions.invoke("get-admin-users", {
          headers: { Authorization: `Bearer ${session.session.access_token}` }
        });
        
        if (response.data?.users) {
          response.data.users.forEach((u: any) => {
            authUsersMap[u.id] = {
              name: u.name || "-",
              email: u.email || "-",
              phone: u.phone || "-",
              created_at: u.created_at || "",
            };
          });
        }
      }

      // Buscar todos os usuários com roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at");

      if (rolesError) throw rolesError;

      // Para cada usuário, buscar dados de atividades
      // Filter out users that don't exist in auth (orphaned roles)
      const validRolesData = (rolesData || []).filter(roleEntry => 
        authUsersMap[roleEntry.user_id] && authUsersMap[roleEntry.user_id].email !== "-"
      );

      const usersWithData: UserData[] = await Promise.all(
        validRolesData.map(async (roleEntry) => {
          const userId = roleEntry.user_id;
          const authUser = authUsersMap[userId] || { name: "-", email: "-", phone: "-", created_at: "" };
          const userCreatedAt = authUser.created_at || roleEntry.created_at;

          // Buscar objetivos
          const { data: objetivos } = await supabase
            .from("user_objectives")
            .select("id, status")
            .eq("user_id", userId);

          // Buscar metas
          const { data: metas } = await supabase
            .from("user_goals")
            .select("id, status")
            .eq("user_id", userId);

          // Buscar ações
          const { data: acoes } = await supabase
            .from("user_actions")
            .select("id, status")
            .eq("user_id", userId);

          // Buscar entradas do diário
          const { data: diario } = await supabase
            .from("diary_entries")
            .select("id, entry_date")
            .eq("user_id", userId);

          // Buscar streaks para último acesso
          const { data: streaks } = await supabase
            .from("user_streaks")
            .select("last_activity_date, updated_at")
            .eq("user_id", userId)
            .maybeSingle();

          // Calcular progresso
          const totalObjetivos = objetivos?.length || 0;
          const objetivosConcluidos = objetivos?.filter(o => 
            o.status?.toLowerCase() === "concluido" || o.status?.toLowerCase() === "concluído"
          ).length || 0;
          const objetivosProgress = totalObjetivos > 0 ? Math.round((objetivosConcluidos / totalObjetivos) * 100) : 0;

          const totalMetas = metas?.length || 0;
          const metasConcluidas = metas?.filter(m => 
            m.status?.toLowerCase() === "concluido" || m.status?.toLowerCase() === "concluído"
          ).length || 0;
          const metasProgress = totalMetas > 0 ? Math.round((metasConcluidas / totalMetas) * 100) : 0;

          const totalAcoes = acoes?.length || 0;
          const acoesConcluidas = acoes?.filter(a => 
            a.status?.toLowerCase() === "concluido" || a.status?.toLowerCase() === "concluído"
          ).length || 0;
          const acoesProgress = totalAcoes > 0 ? Math.round((acoesConcluidas / totalAcoes) * 100) : 0;

          // Diário - calcular % baseado nos últimos 30 dias
          const last30Days = 30;
          const diarioEntries = diario?.length || 0;
          const diarioProgress = Math.min(100, Math.round((diarioEntries / last30Days) * 100));

          // Determinar último acesso
          const lastActivity = streaks?.last_activity_date || streaks?.updated_at || roleEntry.created_at;
          
          // Determinar status (inativo se mais de 30 dias sem acesso)
          const daysSinceAccess = lastActivity ? 
            Math.floor((new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 999;
          const status = daysSinceAccess > 30 ? "inativo" : "ativo";

          return {
            id: userId,
            name: authUser.name,
            email: authUser.email,
            phone: authUser.phone,
            dataCadastro: userCreatedAt,
            ultimoAcesso: lastActivity || userCreatedAt,
            status: status as "ativo" | "inativo",
            role: roleEntry.role,
            atividades: {
              objetivos: objetivosProgress,
              metas: metasProgress,
              acoes: acoesProgress,
              diario: diarioProgress
            }
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getUsageTime = (dataCadastro: string) => {
    const start = new Date(dataCadastro);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 1) return "Hoje";
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}a ${remainingMonths}m` : `${years}a`;
  };

  const getProgressAverage = (atividades: UserData["atividades"]) => {
    const { objetivos, metas, acoes, diario } = atividades;
    return Math.round((objetivos + metas + acoes + diario) / 4);
  };

  const getDaysSinceLastAccess = (ultimoAcesso: string) => {
    const lastAccess = new Date(ultimoAcesso);
    const today = new Date();
    const diffTime = today.getTime() - lastAccess.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "empresa":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Empresa</Badge>;
      case "gestor":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Gestor</Badge>;
      default:
        return <Badge variant="secondary">Usuário</Badge>;
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
                <Users className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Usuários Cadastrados
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Gestão de usuários do sistema
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Info Card */}
        <Card className="shadow-medium border-primary/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Lista de Usuários
                </CardTitle>
                <CardDescription>
                  Total: {filteredUsers.length} usuário(s) • 
                  Ativos: {filteredUsers.filter(u => u.status === "ativo").length} • 
                  Inativos: {filteredUsers.filter(u => u.status === "inativo").length}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail, telefone ou role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-medium">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Início</TableHead>
                      <TableHead className="hidden lg:table-cell">Tempo de Uso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center hidden lg:table-cell">Dias sem Acesso</TableHead>
                      <TableHead className="min-w-[150px] hidden xl:table-cell">Atividades</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name !== "-" ? user.name : (
                              <span className="text-muted-foreground text-xs">{user.id.slice(0, 8)}...</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {user.phone}
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {formatDate(user.dataCadastro)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {getUsageTime(user.dataCadastro)}
                          </TableCell>
                          <TableCell>
                            {user.status === "ativo" ? (
                              <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                                <UserCheck className="w-3 h-3" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <UserX className="w-3 h-3" />
                                Inativo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center hidden lg:table-cell">
                            {(() => {
                              const days = getDaysSinceLastAccess(user.ultimoAcesso);
                              if (days === 0) {
                                return <Badge variant="default" className="bg-green-600">Hoje</Badge>;
                              } else if (days <= 7) {
                                return <Badge variant="secondary">{days} dias</Badge>;
                              } else if (days <= 30) {
                                return <Badge variant="outline" className="text-yellow-600 border-yellow-600">{days} dias</Badge>;
                              } else {
                                return <Badge variant="destructive">{days} dias</Badge>;
                              }
                            })()}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-medium">{getProgressAverage(user.atividades)}%</span>
                              </div>
                              <Progress value={getProgressAverage(user.atividades)} className="h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => navigate(`/admin/pdi/${user.id}`)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Ver PDI</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-sm">Legenda de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Objetivos concluídos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/80" />
                <span className="text-muted-foreground">Metas alcançadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <span className="text-muted-foreground">Ações realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="text-muted-foreground">Dias com diário</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUsuarios;
