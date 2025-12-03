import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Building2, 
  Users, 
  UserCog, 
  Plus, 
  Trash2, 
  LogOut,
  Pencil,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { generateProvisionalPassword } from "@/types/company";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  provisionalPassword: string;
  acceptedAt: string | null;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  provisionalPassword: string;
  acceptedAt: string | null;
  managerId?: string;
  createdAt: string;
}

const DashboardEmpresa = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"managers" | "employees">("managers");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", email: "", phone: "" });

  // Verificar se é admin
  const checkIsAdmin = (email: string): boolean => {
    const administrators = JSON.parse(localStorage.getItem("administrators") || "[]");
    return administrators.some((admin: any) => admin.email.toLowerCase() === email.toLowerCase());
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userIsAdmin = checkIsAdmin(user.email || "");
    setIsAdmin(userIsAdmin);

    // Admin tem acesso total
    if (!userIsAdmin && user.role !== "empresa") {
      navigate("/login");
      return;
    }

    const companies = JSON.parse(localStorage.getItem("companies") || "[]");
    setAllCompanies(companies);

    if (userIsAdmin) {
      // Admin: mostrar primeira empresa ou permitir seleção
      if (companies.length > 0) {
        const companyId = selectedCompanyId || companies[0].id;
        setSelectedCompanyId(companyId);
        setCompany(companies.find((c: any) => c.id === companyId));
        const storedManagers = JSON.parse(localStorage.getItem(`managers_${companyId}`) || "[]");
        const storedEmployees = JSON.parse(localStorage.getItem(`employees_${companyId}`) || "[]");
        setManagers(storedManagers);
        setEmployees(storedEmployees);
      }
    } else {
      // Empresa normal
      const userCompany = companies.find((c: any) => c.id === user.companyId);
      setCompany(userCompany);
      setSelectedCompanyId(user.companyId);

      const storedManagers = JSON.parse(localStorage.getItem(`managers_${user.companyId}`) || "[]");
      const storedEmployees = JSON.parse(localStorage.getItem(`employees_${user.companyId}`) || "[]");
      setManagers(storedManagers);
      setEmployees(storedEmployees);
    }
  }, [navigate, selectedCompanyId]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleAddManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }

    const companyId = selectedCompanyId;
    if (!companyId) {
      toast.error("Nenhuma empresa selecionada");
      return;
    }

    const provisionalPassword = generateProvisionalPassword();
    
    const newManager: Manager = {
      id: crypto.randomUUID(),
      ...newPerson,
      provisionalPassword,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    };

    const updatedManagers = [...managers, newManager];
    setManagers(updatedManagers);
    localStorage.setItem(`managers_${companyId}`, JSON.stringify(updatedManagers));

    toast.success("Gestor adicionado!", {
      description: `Senha provisória: ${provisionalPassword}`,
      duration: 10000,
    });

    setNewPerson({ name: "", email: "", phone: "" });
    setShowAddManagerModal(false);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }

    const companyId = selectedCompanyId;
    if (!companyId) {
      toast.error("Nenhuma empresa selecionada");
      return;
    }

    const provisionalPassword = generateProvisionalPassword();
    
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      ...newPerson,
      provisionalPassword,
      acceptedAt: null,
      createdAt: new Date().toISOString(),
    };

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    localStorage.setItem(`employees_${companyId}`, JSON.stringify(updatedEmployees));

    toast.success("Funcionário adicionado!", {
      description: `Senha provisória: ${provisionalPassword}`,
      duration: 10000,
    });

    setNewPerson({ name: "", email: "", phone: "" });
    setShowAddEmployeeModal(false);
  };

  const handleRemoveManager = (id: string) => {
    if (!selectedCompanyId) return;
    const updatedManagers = managers.filter(m => m.id !== id);
    setManagers(updatedManagers);
    localStorage.setItem(`managers_${selectedCompanyId}`, JSON.stringify(updatedManagers));
    toast.success("Gestor removido");
  };

  const handleRemoveEmployee = (id: string) => {
    if (!selectedCompanyId) return;
    const updatedEmployees = employees.filter(e => e.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem(`employees_${selectedCompanyId}`, JSON.stringify(updatedEmployees));
    toast.success("Funcionário removido");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-bold text-lg">
                {company?.razaoSocial || "Dashboard Empresa"}
                {isAdmin && <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>}
              </h1>
              <p className="text-xs text-muted-foreground">Gestão de PDI Corporativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                Painel Admin
              </Button>
            )}
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Seletor de empresa para admin */}
        {isAdmin && allCompanies.length > 1 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Label className="font-medium whitespace-nowrap">Empresa:</Label>
                <select
                  value={selectedCompanyId || ""}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {allCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razaoSocial}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{managers.length}</p>
                  <p className="text-sm text-muted-foreground">Gestores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-sm text-muted-foreground">Funcionários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Calendar className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {managers.filter(m => m.acceptedAt).length + employees.filter(e => e.acceptedAt).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "managers" ? "default" : "outline"}
            onClick={() => setActiveTab("managers")}
          >
            <UserCog className="w-4 h-4 mr-2" />
            Gestores
          </Button>
          <Button
            variant={activeTab === "employees" ? "default" : "outline"}
            onClick={() => setActiveTab("employees")}
          >
            <Users className="w-4 h-4 mr-2" />
            Funcionários
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{activeTab === "managers" ? "Gestores" : "Funcionários"}</CardTitle>
              <CardDescription>
                {activeTab === "managers" 
                  ? "Gerencie os gestores que terão acesso aos PDIs dos funcionários"
                  : "Gerencie os funcionários da empresa"
                }
              </CardDescription>
            </div>
            <Button onClick={() => activeTab === "managers" ? setShowAddManagerModal(true) : setShowAddEmployeeModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activeTab === "managers" ? managers : employees).map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{person.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={person.acceptedAt ? "default" : "secondary"}>
                        {person.acceptedAt ? "Ativo" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => activeTab === "managers" 
                          ? handleRemoveManager(person.id) 
                          : handleRemoveEmployee(person.id)
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(activeTab === "managers" ? managers : employees).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum {activeTab === "managers" ? "gestor" : "funcionário"} cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Add Manager Modal */}
      <Dialog open={showAddManagerModal} onOpenChange={setShowAddManagerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Gestor</DialogTitle>
            <DialogDescription>
              O gestor receberá uma senha provisória e deverá alterá-la no primeiro acesso.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddManager} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                placeholder="Nome do gestor"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                placeholder="email@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={newPerson.phone}
                onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddManagerModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
            <DialogDescription>
              O funcionário receberá uma senha provisória e deverá alterá-la no primeiro acesso.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                placeholder="Nome do funcionário"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input
                type="email"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                placeholder="email@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={newPerson.phone}
                onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddEmployeeModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardEmpresa;
