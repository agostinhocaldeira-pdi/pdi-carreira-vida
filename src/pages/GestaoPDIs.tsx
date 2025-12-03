import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Shield, Eye, ChevronRight, AlertCircle, Building2, Home } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmployeeProgressModal from "@/components/EmployeeProgressModal";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  manager_id?: string;
  company_id?: string;
}

interface Manager {
  id: string;
  name: string;
  email: string;
  company_id: string;
}

interface Company {
  id: string;
  razao_social: string;
}

const GestaoPDIs = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGestor, setIsGestor] = useState(false);
  const [currentManagerId, setCurrentManagerId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const administrators = JSON.parse(localStorage.getItem("administrators") || "[]");
    const userIsAdmin = administrators.some((admin: any) => 
      admin.email?.toLowerCase() === (user.email || "").toLowerCase()
    );
    setIsAdmin(userIsAdmin);
    setIsGestor(user.role === "gestor");

    // Se não for admin nem gestor, redirecionar
    if (!userIsAdmin && user.role !== "gestor") {
      navigate("/login");
      return;
    }

    // Carregar dados
    loadData(userIsAdmin, user);
  }, [navigate]);

  const loadData = (userIsAdmin: boolean, user: any) => {
    const mockCompanies = JSON.parse(localStorage.getItem("mockCompanies") || "[]");
    const mockManagers = JSON.parse(localStorage.getItem("mockManagers") || "[]");
    const mockEmployees = JSON.parse(localStorage.getItem("mockEmployees") || "[]");

    setCompanies(mockCompanies);
    setManagers(mockManagers);

    if (userIsAdmin) {
      // Admin vê todos os funcionários
      setEmployees(mockEmployees);
      if (mockCompanies.length > 0) {
        setSelectedCompany(mockCompanies[0].id);
      }
    } else if (user.role === "gestor") {
      // Gestor vê apenas funcionários associados a ele
      const currentManager = mockManagers.find((m: Manager) => 
        m.email?.toLowerCase() === user.email?.toLowerCase()
      );
      
      if (currentManager) {
        setCurrentManagerId(currentManager.id);
        const managerEmployees = mockEmployees.filter((emp: Employee) => 
          emp.manager_id === currentManager.id
        );
        setEmployees(managerEmployees);
      }
    }
  };

  useEffect(() => {
    if (isAdmin && selectedCompany) {
      const mockEmployees = JSON.parse(localStorage.getItem("mockEmployees") || "[]");
      const filteredEmployees = mockEmployees.filter((emp: Employee) => 
        emp.company_id === selectedCompany
      );
      setEmployees(filteredEmployees);
    }
  }, [selectedCompany, isAdmin]);

  const getManagerName = (managerId?: string) => {
    if (!managerId) return "-";
    const manager = managers.find(m => m.id === managerId);
    return manager?.name || "-";
  };

  const handleViewProgress = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowProgressModal(true);
  };

  const filteredEmployees = employees.filter(emp => {
    if (isAdmin && selectedCompany) {
      return emp.company_id === selectedCompany;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg">Gestão de PDI's</h1>
              {isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
              {isGestor && !isAdmin && <Badge variant="outline" className="text-xs">Gestor</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGestor && (
              <Button variant="outline" size="sm" onClick={() => navigate("/home")}>
                <Home className="w-4 h-4 mr-2" />
                Meu PDI
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4 mr-2" />
                Painel Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtro por empresa (apenas para admin) */}
        {isAdmin && companies.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Filtrar por Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.razao_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Lista de funcionários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {isAdmin ? "Funcionários da Empresa" : "Meus Funcionários"}
            </CardTitle>
            <CardDescription>
              {isAdmin 
                ? "Visualize o progresso de PDI dos funcionários de todas as empresas"
                : "Acompanhe o desenvolvimento dos funcionários associados a você"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isGestor && !isAdmin 
                    ? "Nenhum funcionário associado a você ainda."
                    : "Nenhum funcionário encontrado para esta empresa."
                  }
                </p>
                {isGestor && !isAdmin && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Solicite ao administrador da empresa que associe funcionários ao seu perfil.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Status</TableHead>
                      {isAdmin && <TableHead>Gestor</TableHead>}
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow 
                        key={employee.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewProgress(employee)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {employee.name}
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <Badge variant={employee.is_active ? "default" : "secondary"}>
                            {employee.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>{getManagerName(employee.manager_id)}</TableCell>
                        )}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProgress(employee);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Progresso
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <EmployeeProgressModal
        open={showProgressModal}
        onOpenChange={setShowProgressModal}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default GestaoPDIs;
