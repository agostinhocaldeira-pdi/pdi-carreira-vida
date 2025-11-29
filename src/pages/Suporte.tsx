import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare, Send, Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const Suporte = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [adminResponse, setAdminResponse] = useState<string>("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [messages, setMessages] = useState<Record<string, SupportMessage[]>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUserRole();
    loadTickets();
  }, []);

  const checkUserRole = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const user = JSON.parse(currentUser);
    setUserId(user.email);

    // Mock: Check if user is admin (you can set this manually in localStorage for testing)
    const userRoles = JSON.parse(localStorage.getItem("userRoles") || "{}");
    if (userRoles[user.email] === "admin") {
      setIsAdmin(true);
    }
  };

  const loadTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem("supportTickets") || "[]");
    const allMessages = JSON.parse(localStorage.getItem("supportMessages") || "[]");

    const sortedTickets = allTickets.sort((a: SupportTicket, b: SupportTicket) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setTickets(sortedTickets);

    // Load messages for each ticket
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

    // Create new ticket
    const ticketId = `ticket-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      category: category,
      question: question.trim(),
      created_at: new Date().toISOString(),
    };

    // Create initial message
    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      message: question.trim(),
      is_admin_response: false,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
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

    // Create admin response message
    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      message: adminResponse.trim(),
      is_admin_response: true,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Suporte</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
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

                  {/* Messages - Histórico de Conversas */}
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

                  {/* Admin Response Field - Always visible */}
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
