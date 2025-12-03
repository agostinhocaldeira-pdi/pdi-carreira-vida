import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare, Send, Compass, Home, Users, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
  { value: "analise_swot", label: "Análise SWOT" },
  { value: "autoavaliacao_360", label: "Autoavaliação + 360º" },
  { value: "crencas", label: "Crenças" },
  { value: "diario", label: "Diário" },
  { value: "ferramentas", label: "Ferramentas (Geral)" },
  { value: "mao_na_massa", label: "Mão na Massa" },
  { value: "matriz_eisenhower", label: "Matriz de Eisenhower" },
  { value: "metodo_vvd", label: "Método VVD" },
  { value: "plano_de_vida", label: "Plano de Vida" },
  { value: "progresso", label: "Progresso" },
  { value: "roda_da_vida", label: "Roda da Vida" },
  { value: "smart", label: "SMART" },
  { value: "valores", label: "Valores" },
  { value: "outros", label: "Outros" },
];

interface SupportTicket {
  id: string;
  category: string;
  question: string;
  created_at: string;
}

interface SupportMessage {
  id: string;
  ticket_id: string;
  message: string;
  is_admin_response: boolean;
  created_at: string;
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
}

const Suporte = () => {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [adminResponse, setAdminResponse] = useState<string>("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [messages, setMessages] = useState<Record<string, SupportMessage[]>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("atendimento");
  
  // Estados para conversa com gestor
  const [managerSubject, setManagerSubject] = useState("");
  const [managerMessage, setManagerMessage] = useState("");
  const [managerConversations, setManagerConversations] = useState<ManagerConversation[]>([]);
  const [managerMessages, setManagerMessages] = useState<Record<string, ManagerMessage[]>>({});

  useEffect(() => {
    checkUserRole();
    loadTickets();
    loadManagerConversations();
  }, []);

  const checkUserRole = () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userData = JSON.parse(user);
    setUserId(userData.email);

    // Verificar se é admin
    const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}");
    if (userRoles[userData.email] === "admin") {
      setIsAdmin(true);
    }

    // Verificar se é funcionário de alguma empresa
    const employees = JSON.parse(localStorage.getItem("mockEmployees") || "[]");
    const employee = employees.find((emp: any) => 
      emp.email?.toLowerCase() === userData.email?.toLowerCase() && emp.is_active
    );

    if (employee) {
      setIsEmployee(true);
      setEmployeeData(employee);
    }
  };

  const loadTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");

    const sortedTickets = allTickets.sort((a: SupportTicket, b: SupportTicket) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setTickets(sortedTickets);

    const messagesMap: Record<string, SupportMessage[]> = {};
    sortedTickets.forEach((ticket: SupportTicket) => {
      messagesMap[ticket.id] = allMessages
        .filter((m: SupportMessage) => m.ticket_id === ticket.id)
        .sort((a: SupportMessage, b: SupportMessage) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    });
    setMessages(messagesMap);
  };

  const loadManagerConversations = () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userData = JSON.parse(user);
    const allConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");

    // Filtrar conversas do funcionário atual
    const userConversations = allConversations.filter((conv: ManagerConversation) =>
      conv.employee_email?.toLowerCase() === userData.email?.toLowerCase()
    ).sort((a: ManagerConversation, b: ManagerConversation) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setManagerConversations(userConversations);

    const messagesMap: Record<string, ManagerMessage[]> = {};
    userConversations.forEach((conv: ManagerConversation) => {
      messagesMap[conv.id] = allMessages
        .filter((m: ManagerMessage) => m.conversation_id === conv.id)
        .sort((a: ManagerMessage, b: ManagerMessage) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    });
    setManagerMessages(messagesMap);
  };

  const handleSubmitQuestion = () => {
    if (!category || !question.trim()) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria e escreva sua dúvida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const ticketId = `ticket-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      category: category,
      question: question.trim(),
      created_at: new Date().toISOString(),
    };

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      message: question.trim(),
      is_admin_response: false,
      created_at: new Date().toISOString(),
    };

    const allTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");
    
    allTickets.push(newTicket);
    allMessages.push(newMessage);
    
    localStorage.setItem("supportTickets", JSON.stringify(allTickets));
    localStorage.setItem("supportMessages", JSON.stringify(allMessages));

    toast({
      title: "Sucesso",
      description: "Sua dúvida foi enviada!",
    });
    
    setCategory("");
    setQuestion("");
    loadTickets();
    setIsLoading(false);
  };

  const handleSubmitAdminResponse = (ticketId: string) => {
    if (!adminResponse.trim()) {
      toast({
        title: "Erro",
        description: "Escreva uma resposta",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      message: adminResponse.trim(),
      is_admin_response: true,
      created_at: new Date().toISOString(),
    };

    const allMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");
    allMessages.push(newMessage);
    localStorage.setItem("supportMessages", JSON.stringify(allMessages));

    toast({
      title: "Sucesso",
      description: "Resposta enviada!",
    });
    
    setAdminResponse("");
    loadTickets();
    setIsLoading(false);
  };

  const handleSubmitManagerMessage = () => {
    if (!managerSubject.trim() || !managerMessage.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o assunto e a mensagem",
        variant: "destructive",
      });
      return;
    }

    if (!employeeData?.manager_id) {
      toast({
        title: "Erro",
        description: "Você não está associado a nenhum gestor",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const conversationId = `conv-${Date.now()}`;

    const newConversation: ManagerConversation = {
      id: conversationId,
      employee_id: employeeData.id,
      employee_name: user.name || employeeData.name,
      employee_email: user.email || employeeData.email,
      manager_id: employeeData.manager_id,
      subject: managerSubject.trim(),
      created_at: new Date().toISOString(),
    };

    const newMessage: ManagerMessage = {
      id: `mgr-msg-${Date.now()}`,
      conversation_id: conversationId,
      message: managerMessage.trim(),
      is_manager_response: false,
      sender_name: user.name || employeeData.name,
      created_at: new Date().toISOString(),
    };

    const allConversations = JSON.parse(localStorage.getItem("managerConversations") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
    
    allConversations.push(newConversation);
    allMessages.push(newMessage);
    
    localStorage.setItem("managerConversations", JSON.stringify(allConversations));
    localStorage.setItem("managerMessages", JSON.stringify(allMessages));

    toast({
      title: "Sucesso",
      description: "Mensagem enviada ao seu gestor!",
    });
    
    setManagerSubject("");
    setManagerMessage("");
    loadManagerConversations();
    setIsLoading(false);
  };

  const handleReplyToManagerConversation = (conversationId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const newMessage: ManagerMessage = {
      id: `mgr-msg-${Date.now()}`,
      conversation_id: conversationId,
      message: replyText.trim(),
      is_manager_response: false,
      sender_name: user.name || employeeData?.name || "Funcionário",
      created_at: new Date().toISOString(),
    };

    const allMessages = JSON.parse(localStorage.getItem("managerMessages") || "[]");
    allMessages.push(newMessage);
    localStorage.setItem("managerMessages", JSON.stringify(allMessages));

    toast({
      title: "Sucesso",
      description: "Resposta enviada!",
    });

    loadManagerConversations();
  };

  const renderSupportForm = () => (
    <>
      {/* Formulário de Nova Dúvida */}
      <Card className="max-w-4xl mx-auto shadow-large">
        <CardHeader>
          <CardTitle>Enviar Nova Dúvida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Sobre o que é sua dúvida?</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Sua dúvida</Label>
            <Textarea
              id="question"
              placeholder="Descreva sua dúvida em detalhes..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={handleSubmitQuestion} 
            disabled={isLoading}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Dúvida
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Conversas */}
      <Card className="max-w-4xl mx-auto shadow-large">
        <CardHeader>
          <CardTitle>Histórico de Conversas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tickets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma conversa ainda
            </p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-2">
                        {CATEGORIES.find((c) => c.value === ticket.category)?.label}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">{ticket.question}</p>
                </div>

                {messages[ticket.id] && messages[ticket.id].length > 0 && (
                  <div className="space-y-2">
                    <Label>Histórico de Conversas</Label>
                    <div className="space-y-3 pl-4 border-l-2 border-border">
                      {messages[ticket.id].map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg ${
                            msg.is_admin_response
                              ? "bg-primary/5 border border-primary/20"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">
                              {msg.is_admin_response ? "Suporte" : "Você"}
                            </span>
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

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor={`admin-response-${ticket.id}`}>
                    Resposta do Suporte
                  </Label>
                  <Textarea
                    id={`admin-response-${ticket.id}`}
                    placeholder="Escreva sua resposta..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={() => handleSubmitAdminResponse(ticket.id)}
                    disabled={isLoading || !adminResponse.trim()}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );

  const renderManagerConversation = () => {
    const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

    return (
      <>
        {/* Verificar se tem gestor associado */}
        {!employeeData?.manager_id ? (
          <Card className="max-w-4xl mx-auto shadow-large">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sem Gestor Associado</h3>
              <p className="text-muted-foreground">
                Você ainda não está associado a um gestor. Entre em contato com o administrador da sua empresa.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Formulário de Nova Mensagem para Gestor */}
            <Card className="max-w-4xl mx-auto shadow-large">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Nova Mensagem para o Gestor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manager-subject">Assunto</Label>
                  <Textarea
                    id="manager-subject"
                    placeholder="Qual o assunto da sua mensagem?"
                    value={managerSubject}
                    onChange={(e) => setManagerSubject(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager-message">Mensagem</Label>
                  <Textarea
                    id="manager-message"
                    placeholder="Escreva sua mensagem para o gestor..."
                    value={managerMessage}
                    onChange={(e) => setManagerMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={handleSubmitManagerMessage} 
                  disabled={isLoading || !managerSubject.trim() || !managerMessage.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para o Gestor
                </Button>
              </CardContent>
            </Card>

            {/* Histórico de Conversas com Gestor */}
            <Card className="max-w-4xl mx-auto shadow-large">
              <CardHeader>
                <CardTitle>Conversas com o Gestor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {managerConversations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma conversa com o gestor ainda
                  </p>
                ) : (
                  managerConversations.map((conv) => (
                    <div key={conv.id} className="border rounded-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="inline-block px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium mb-2">
                              {conv.subject}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(conv.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {managerMessages[conv.id] && managerMessages[conv.id].length > 0 && (
                        <div className="space-y-2">
                          <Label>Mensagens</Label>
                          <div className="space-y-3 pl-4 border-l-2 border-green-500/30">
                            {managerMessages[conv.id].map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.is_manager_response
                                    ? "bg-green-500/5 border border-green-500/20"
                                    : "bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold">
                                    {msg.is_manager_response ? "Gestor" : "Você"}
                                  </span>
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
                          placeholder="Escreva sua resposta..."
                          value={replyTexts[conv.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [conv.id]: e.target.value }))}
                          className="min-h-[80px]"
                        />
                        <Button
                          onClick={() => {
                            handleReplyToManagerConversation(conv.id, replyTexts[conv.id] || "");
                            setReplyTexts(prev => ({ ...prev, [conv.id]: "" }));
                          }}
                          disabled={isLoading || !replyTexts[conv.id]?.trim()}
                          className="w-full"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Resposta
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessagesSquare className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Suporte</h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Toggle para funcionários */}
        {isEmployee && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="atendimento" className="flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Atendimento ao Cliente
                  </TabsTrigger>
                  <TabsTrigger value="gestor" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Conversa com o Gestor
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo baseado na aba selecionada */}
        {isEmployee && activeTab === "gestor" ? (
          renderManagerConversation()
        ) : (
          renderSupportForm()
        )}

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20 shadow-medium">
          <CardContent className="py-8 text-center space-y-3">
            <h3 className="text-xl font-semibold">Pronto para continuar sua jornada?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore mais recursos e ferramentas ou volte ao seu dashboard principal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/home">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Home className="w-4 h-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              <Link to="/construcao-guiada">
                <Button className="w-full sm:w-auto gap-2">
                  <Compass className="w-4 h-4" />
                  Construção Guiada
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Suporte;
