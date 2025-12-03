import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Shield, Eye, ChevronRight, AlertCircle, Building2, Home, MessageSquare, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface ManagerConversation {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  manager_id: string;
  subject: string;
  created_at: string;
}

interface ManagerMessage {
  id: string;
  conversation_id: string;
  message: string;
  is_manager_response: boolean;
  sender_name: string;
  created_at: string;
  read_by_employee?: boolean;
  read_by_manager?: boolean;
}

const GestaoPDIs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGestor, setIsGestor] = useState(false);
  const [currentManagerId, setCurrentManagerId] = useState<string | null>(null);
  const [currentManagerName, setCurrentManagerName] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [activeTab, setActiveTab] = useState("funcionarios");

  // Estados para mensagens
  const [conversations, setConversations] = useState<ManagerConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ManagerMessage[]>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const administrators = JSON.parse(localStorage.getItem("administrators") || "[]");
    const userIsAdmin = administrators.some((admin: any) => 
      admin.email?.toLowerCase() === (user.email || "").toLowerCase()
    );
    setIsAdmin(userIsAdmin);
    setIsGestor(user.role === "gestor");

    if (!userIsAdmin && user.role !== "gestor") {
      navigate("/login");
      return;
    }

    loadData(userIsAdmin, user);
  }, [navigate]);

  useEffect(() => {
    if (currentManagerId) {
      loadConversations();
    }
  }, [currentManagerId]);

  const loadData = (userIsAdmin: boolean, user: any) => {
    const mockCompanies = JSON.parse(localStorage.getItem("mockCompanies") || "[]");
    const mockManagers = JSON.parse(localStorage.getItem("mockManagers") || "[]");
    const mockEmployees = JSON.parse(localStorage.getItem("mockEmployees") || "[]");

    setCompanies(mockCompanies);
    setManagers(mockManagers);

    if (userIsAdmin) {
      setEmployees(mockEmployees);
      if (mockCompanies.length > 0) {
        setSelectedCompany(mockCompanies[0].id);
      }
    } else if (user.role === "gestor") {
      const currentManager = mockManagers.find((m: Manager) => 
        m.email?.toLowerCase() === user.email?.toLowerCase()
      );
      
      if (currentManager) {
        setCurrentManagerId(currentManager.id);
        setCurrentManagerName(currentManager.name);
        const managerEmployees = mockEmployees.filter((emp: Employee) => 
          emp.manager_id === currentManager.id
        );
        setEmployees(managerEmployees);
      }
    }
  };

  const loadConversations = () => {
    if (!currentManagerId) return;

    const allConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");

    // Filtrar conversas do gestor atual
    const managerConversations = allConversations.filter((conv: ManagerConversation) =>
      conv.manager_id === currentManagerId
    ).sort((a: ManagerConversation, b: ManagerConversation) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setConversations(managerConversations);

    const messagesMap: Record<string, ManagerMessage[]> = {};
    let totalUnread = 0;
    
    managerConversations.forEach((conv: ManagerConversation) => {
      const convMessages = allMessages
        .filter((m: ManagerMessage) => m.conversation_id === conv.id)
        .sort((a: ManagerMessage, b: ManagerMessage) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      messagesMap[conv.id] = convMessages;
      
      // Contar mensagens não lidas (do funcionário para o gestor)
      convMessages.forEach((msg: ManagerMessage) => {
        if (!msg.is_manager_response && !msg.read_by_manager) {
          totalUnread++;
        }
      });
    });
    
    setMessages(messagesMap);
    setUnreadCount(totalUnread);
  };

  const markMessagesAsRead = (conversationId: string) => {
    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
    let updated = false;
    
    const updatedMessages = allMessages.map((msg: ManagerMessage) => {
      if (msg.conversation_id === conversationId && !msg.is_manager_response && !msg.read_by_manager) {
        updated = true;
        return { ...msg, read_by_manager: true };
      }
      return msg;
    });
    
    if (updated) {
      localStorage.setItem("managerMessages", JSON.stringify(updatedMessages));
      loadConversations();
    }
  };

  const getUnreadCountForConversation = (conversationId: string) => {
    const convMessages = messages[conversationId] || [];
    return convMessages.filter(msg => !msg.is_manager_response && !msg.read_by_manager).length;
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

  const handleSendReply = (conversationId: string) => {
    const replyText = replyTexts[conversationId];
    if (!replyText?.trim()) {
      toast({
        title: "Erro",
        description: "Escreva uma resposta",
        variant: "destructive",
      });
      return;
    }

    const newMessage: ManagerMessage = {
      id: `mgr-msg-${Date.now()}`,
      conversation_id: conversationId,
      message: replyText.trim(),
      is_manager_response: true,
      sender_name: currentManagerName || "Gestor",
      created_at: new Date().toISOString(),
      read_by_employee: false,
      read_by_manager: true,
    };

    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
    allMessages.push(newMessage);
    localStorage.setItem("managerMessages", JSON.stringify(allMessages));

    toast({
      title: "Sucesso",
      description: "Resposta enviada!",
    });

    setReplyTexts(prev => ({ ...prev, [conversationId]: "" }));
    loadConversations();
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
        {/* Tabs para gestores */}
        {isGestor && !isAdmin && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="funcionarios" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Funcionários
                  </TabsTrigger>
                  <TabsTrigger value="mensagens" className="flex items-center gap-2 relative">
                    <MessageSquare className="w-4 h-4" />
                    Mensagens
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 min-w-[20px] p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo baseado na aba */}
        {activeTab === "mensagens" && isGestor && !isAdmin ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Mensagens dos Funcionários
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Responda às mensagens enviadas pelos seus funcionários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma mensagem recebida ainda.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    As mensagens dos seus funcionários aparecerão aqui.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const convUnread = getUnreadCountForConversation(conv.id);
                  return (
                    <div 
                      key={conv.id} 
                      className={`border rounded-lg p-4 space-y-4 ${convUnread > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
                      onClick={() => markMessagesAsRead(conv.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{conv.employee_name}</span>
                              <span className="text-xs text-muted-foreground">({conv.employee_email})</span>
                              {convUnread > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {convUnread} nova{convUnread > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                            <span className="inline-block px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium">
                              {conv.subject}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(conv.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {messages[conv.id] && messages[conv.id].length > 0 && (
                        <div className="space-y-2">
                          <Label>Conversa</Label>
                          <div className="space-y-3 pl-4 border-l-2 border-green-500/30">
                            {messages[conv.id].map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.is_manager_response
                                    ? "bg-primary/5 border border-primary/20"
                                    : `bg-muted ${!msg.read_by_manager ? 'ring-2 ring-primary/30' : ''}`
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold">
                                    {msg.is_manager_response ? "Você" : msg.sender_name}
                                  </span>
                                  {!msg.is_manager_response && !msg.read_by_manager && (
                                    <Badge variant="secondary" className="text-xs">Nova</Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(msg.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                      locale: ptBR,
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm">{msg.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Campo de resposta */}
                      <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor={`reply-${conv.id}`}>Responder</Label>
                        <Textarea
                          id={`reply-${conv.id}`}
                          placeholder="Escreva sua resposta para o funcionário..."
                          value={replyTexts[conv.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [conv.id]: e.target.value }))}
                          className="min-h-[100px]"
                        />
                        <Button
                          onClick={() => handleSendReply(conv.id)}
                          disabled={!replyTexts[conv.id]?.trim()}
                          className="w-full"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Resposta
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ) : (
          <>
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
          </>
        )}
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
