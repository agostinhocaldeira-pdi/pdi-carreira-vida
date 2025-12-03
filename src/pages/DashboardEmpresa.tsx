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
  Calendar,
  UserPlus,
  Power,
  Eye
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { generateProvisionalPassword } from "@/types/company";
import EmployeeProgressModal from "@/components/EmployeeProgressModal";

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
  managerName?: string;
  createdAt: string;
}

interface PersonProgress {
  id: string;
  name: string;
  email: string;
  type: "manager" | "employee";
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
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonProgress | null>(null);
  const [newPerson, setNewPerson] = useState({ name: "", email: "", phone: "" });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

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

  const handleToggleManagerStatus = (id: string) => {
    if (!selectedCompanyId) return;
    const updatedManagers = managers.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          acceptedAt: m.acceptedAt ? null : new Date().toISOString(),
          password: m.acceptedAt ? null : m.provisionalPassword // Reset password if deactivating
        };
      }
      return m;
    });
    setManagers(updatedManagers);
    localStorage.setItem(`managers_${selectedCompanyId}`, JSON.stringify(updatedManagers));
    const manager = updatedManagers.find(m => m.id === id);
    toast.success(manager?.acceptedAt ? "Gestor ativado" : "Gestor desativado");
  };

  const handleRemoveEmployee = (id: string) => {
    if (!selectedCompanyId) return;
    const updatedEmployees = employees.filter(e => e.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem(`employees_${selectedCompanyId}`, JSON.stringify(updatedEmployees));
    toast.success("Funcionário removido");
  };

  const handleToggleEmployeeStatus = (id: string) => {
    if (!selectedCompanyId) return;
    const updatedEmployees = employees.map(e => {
      if (e.id === id) {
        return { 
          ...e, 
          acceptedAt: e.acceptedAt ? null : new Date().toISOString(),
          password: e.acceptedAt ? null : e.provisionalPassword
        };
      }
      return e;
    });
    setEmployees(updatedEmployees);
    localStorage.setItem(`employees_${selectedCompanyId}`, JSON.stringify(updatedEmployees));
    const employee = updatedEmployees.find(e => e.id === id);
    toast.success(employee?.acceptedAt ? "Funcionário ativado" : "Funcionário desativado");
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAllEmployees = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map(e => e.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleAssignManager = (managerId: string) => {
    if (!selectedCompanyId || selectedEmployees.length === 0) return;
    
    const manager = managers.find(m => m.id === managerId);
    const updatedEmployees = employees.map(emp => {
      if (selectedEmployees.includes(emp.id)) {
        return { ...emp, managerId, managerName: manager?.name };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    localStorage.setItem(`employees_${selectedCompanyId}`, JSON.stringify(updatedEmployees));
    setSelectedEmployees([]);
    setShowAssignManagerModal(false);
    toast.success(`Gestor ${manager?.name} associado a ${selectedEmployees.length} funcionário(s)`);
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
            <div className="flex gap-2">
              {activeTab === "employees" && selectedEmployees.length > 0 && (
                <Button variant="outline" onClick={() => setShowAssignManagerModal(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Associar Gestor ({selectedEmployees.length})
                </Button>
              )}
              <Button onClick={() => activeTab === "managers" ? setShowAddManagerModal(true) : setShowAddEmployeeModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "managers" ? (
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
                  {managers.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">
                        <button
                          onClick={() => {
                            setSelectedPerson({ id: person.id, name: person.name, email: person.email, type: "manager" });
                            setShowProgressModal(true);
                          }}
                          className="hover:text-primary hover:underline text-left"
                        >
                          {person.name}
                        </button>
                      </TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>{person.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={person.acceptedAt ? "default" : "secondary"}>
                          {person.acceptedAt ? "Ativo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPerson({ id: person.id, name: person.name, email: person.email, type: "manager" });
                            setShowProgressModal(true);
                          }}
                          className="text-primary hover:text-primary/80"
                          title="Ver Progresso"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleManagerStatus(person.id)}
                          className={person.acceptedAt ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-foreground"}
                          title={person.acceptedAt ? "Desativar" : "Ativar"}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveManager(person.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {managers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum gestor cadastrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={employees.length > 0 && selectedEmployees.length === employees.length}
                        onCheckedChange={handleSelectAllEmployees}
                      />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Gestor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(person.id)}
                          onCheckedChange={(checked) => handleSelectEmployee(person.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <button
                          onClick={() => {
                            setSelectedPerson({ id: person.id, name: person.name, email: person.email, type: "employee" });
                            setShowProgressModal(true);
                          }}
                          className="hover:text-primary hover:underline text-left"
                        >
                          {person.name}
                        </button>
                      </TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>{person.phone || "-"}</TableCell>
                      <TableCell>
                        {person.managerName ? (
                          <Badge variant="outline" className="bg-primary/10">
                            {person.managerName}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={person.acceptedAt ? "default" : "secondary"}>
                          {person.acceptedAt ? "Ativo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPerson({ id: person.id, name: person.name, email: person.email, type: "employee" });
                            setShowProgressModal(true);
                          }}
                          className="text-primary hover:text-primary/80"
                          title="Ver Progresso"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleEmployeeStatus(person.id)}
                          className={person.acceptedAt ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-foreground"}
                          title={person.acceptedAt ? "Desativar" : "Ativar"}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEmployee(person.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Nenhum funcionário cadastrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
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

      {/* Assign Manager Modal */}
      <Dialog open={showAssignManagerModal} onOpenChange={setShowAssignManagerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associar Gestor</DialogTitle>
            <DialogDescription>
              Selecione um gestor para associar aos {selectedEmployees.length} funcionário(s) selecionado(s).
            </DialogDescription>
          </DialogHeader>
          {managers.length === 0 ? (
            <div className="py-8 text-center">
              <UserCog className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum gestor cadastrado.</p>
              <p className="text-sm text-muted-foreground mt-2">Cadastre um gestor primeiro na aba "Gestores".</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setShowAssignManagerModal(false);
                  setActiveTab("managers");
                  setShowAddManagerModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Gestor
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {managers.map((manager) => (
                <Button
                  key={manager.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleAssignManager(manager.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <UserCog className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{manager.name}</p>
                      <p className="text-xs text-muted-foreground">{manager.email}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Modal */}
      {selectedPerson && (
        <EmployeeProgressModal
          open={showProgressModal}
          onOpenChange={setShowProgressModal}
          employee={{
            id: selectedPerson.id,
            name: selectedPerson.name,
            email: selectedPerson.email,
          }}
        />
      )}
    </div>
  );
};

export default DashboardEmpresa;
