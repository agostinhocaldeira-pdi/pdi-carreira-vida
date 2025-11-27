import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CATEGORIES = [
  { value: "progresso", label: "Progresso" },
  { value: "diario", label: "Diário" },
  { value: "plano_de_vida", label: "Plano de Vida" },
  { value: "mao_na_massa", label: "Mão na Massa" },
  { value: "ferramentas", label: "Ferramentas" },
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

  const checkUserRole = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const user = JSON.parse(currentUser);
    setUserId(user.email);

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.email)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
    }
  };

  const loadTickets = async () => {
    const { data: ticketsData } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (ticketsData) {
      setTickets(ticketsData);
      
      // Load messages for each ticket
      const messagesMap: Record<string, SupportMessage[]> = {};
      for (const ticket of ticketsData) {
        const { data: messagesData } = await supabase
          .from("support_messages")
          .select("*")
          .eq("ticket_id", ticket.id)
          .order("created_at", { ascending: true });
        
        if (messagesData) {
          messagesMap[ticket.id] = messagesData;
        }
      }
      setMessages(messagesMap);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!category || !question.trim()) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria e escreva sua dúvida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert([{
        user_id: userId,
        category: category as any,
        question: question.trim(),
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua dúvida",
        variant: "destructive",
      });
    } else if (ticket) {
      // Add initial message
      await supabase.from("support_messages").insert([{
        ticket_id: ticket.id,
        user_id: userId,
        message: question.trim(),
        is_admin_response: false,
      }]);

      toast({
        title: "Sucesso",
        description: "Sua dúvida foi enviada!",
      });
      setCategory("");
      setQuestion("");
      loadTickets();
    }
    setIsLoading(false);
  };

  const handleSubmitAdminResponse = async (ticketId: string) => {
    if (!adminResponse.trim()) {
      toast({
        title: "Erro",
        description: "Escreva uma resposta",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from("support_messages").insert([{
      ticket_id: ticketId,
      user_id: userId,
      message: adminResponse.trim(),
      is_admin_response: true,
    }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Resposta enviada!",
      });
      setAdminResponse("");
      loadTickets();
    }
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
                <SelectContent>
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

                  {/* Messages */}
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {messages[ticket.id]?.map((msg) => (
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
                            {msg.is_admin_response ? "Administrador" : "Você"}
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

                  {/* Admin Response Field */}
                  {isAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor={`admin-response-${ticket.id}`}>
                        Resposta do Administrador
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
                        disabled={isLoading}
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Resposta
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Suporte;
