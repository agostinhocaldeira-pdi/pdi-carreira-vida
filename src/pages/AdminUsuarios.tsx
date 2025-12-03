import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Users, Search, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  dataCadastro: string;
  ultimoAcesso: string;
  status: "ativo" | "inativo";
  atividades: {
    objetivos: number;
    metas: number;
    acoes: number;
    diario: number;
  };
}

// Dados mockados para teste
const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    dataCadastro: "2024-01-15",
    ultimoAcesso: "2024-12-03",
    status: "ativo",
    atividades: { objetivos: 80, metas: 65, acoes: 45, diario: 90 }
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(21) 99876-5432",
    dataCadastro: "2024-02-20",
    ultimoAcesso: "2024-12-01",
    status: "ativo",
    atividades: { objetivos: 50, metas: 40, acoes: 30, diario: 60 }
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(31) 91234-5678",
    dataCadastro: "2024-03-10",
    ultimoAcesso: "2024-10-15",
    status: "inativo",
    atividades: { objetivos: 20, metas: 15, acoes: 10, diario: 25 }
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(41) 92345-6789",
    dataCadastro: "2024-04-05",
    ultimoAcesso: "2024-12-02",
    status: "ativo",
    atividades: { objetivos: 95, metas: 88, acoes: 75, diario: 100 }
  },
  {
    id: "5",
    name: "Fernanda Lima",
    email: "fernanda.lima@email.com",
    phone: "(51) 93456-7890",
    dataCadastro: "2024-05-12",
    ultimoAcesso: "2024-11-28",
    status: "ativo",
    atividades: { objetivos: 70, metas: 55, acoes: 60, diario: 80 }
  },
  {
    id: "6",
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(61) 94567-8901",
    dataCadastro: "2024-06-18",
    ultimoAcesso: "2024-08-20",
    status: "inativo",
    atividades: { objetivos: 10, metas: 5, acoes: 0, diario: 15 }
  },
  {
    id: "7",
    name: "Patrícia Mendes",
    email: "patricia.mendes@email.com",
    phone: "(71) 95678-9012",
    dataCadastro: "2024-07-22",
    ultimoAcesso: "2024-12-03",
    status: "ativo",
    atividades: { objetivos: 85, metas: 72, acoes: 68, diario: 95 }
  },
  {
    id: "8",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@email.com",
    phone: "(81) 96789-0123",
    dataCadastro: "2024-08-30",
    ultimoAcesso: "2024-11-30",
    status: "ativo",
    atividades: { objetivos: 60, metas: 48, acoes: 35, diario: 70 }
  },
  {
    id: "9",
    name: "Juliana Rocha",
    email: "juliana.rocha@email.com",
    phone: "(91) 97890-1234",
    dataCadastro: "2024-09-14",
    ultimoAcesso: "2024-11-25",
    status: "ativo",
    atividades: { objetivos: 45, metas: 38, acoes: 25, diario: 55 }
  },
  {
    id: "10",
    name: "Marcos Souza",
    email: "marcos.souza@email.com",
    phone: "(11) 98901-2345",
    dataCadastro: "2024-10-08",
    ultimoAcesso: "2024-10-10",
    status: "inativo",
    atividades: { objetivos: 5, metas: 0, acoes: 0, diario: 10 }
  }
];

const AdminUsuarios = () => {
  // Proteção de role - apenas admin pode acessar
  const { isLoading: roleLoading, isAdmin } = useRoleProtection({
    allowedRoles: ["admin"],
    redirectTo: "/home"
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<MockUser[]>(mockUsers);
  const navigate = useNavigate();

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getProgressAverage = (atividades: MockUser["atividades"]) => {
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
              <Badge variant="secondary" className="w-fit">Dados Mockados</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
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
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead className="hidden md:table-cell">Telefone</TableHead>
                    <TableHead className="hidden lg:table-cell">Data Cadastro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Dias sem Acesso</TableHead>
                    <TableHead className="min-w-[200px]">Atividades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {user.phone}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {formatDate(user.dataCadastro)}
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
                        <TableCell className="text-center">
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
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progresso geral</span>
                              <span className="font-medium">{getProgressAverage(user.atividades)}%</span>
                            </div>
                            <Progress value={getProgressAverage(user.atividades)} className="h-2" />
                            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                              <span>Obj: {user.atividades.objetivos}%</span>
                              <span>Metas: {user.atividades.metas}%</span>
                              <span>Ações: {user.atividades.acoes}%</span>
                              <span>Diário: {user.atividades.diario}%</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
