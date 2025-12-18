import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MessageSquare, Users, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  hasSubscription: boolean;
}

type UserFilter = "all" | "user" | "gestor" | "empresa" | "admin" | "with_subscription" | "without_subscription";

const AdminBroadcastPanel = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered users when filter changes
  useEffect(() => {
    filterUsers();
  }, [userFilter, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get users via edge function
      const { data, error } = await supabase.functions.invoke('get-admin-users');
      
      if (error) throw error;

      if (data?.users) {
        // Map users with roles
        const usersWithRoles: User[] = data.users.map((u: any) => ({
          id: u.id,
          email: u.email || '',
          name: u.name || 'Usuário',
          role: u.role || 'user',
          hasSubscription: u.has_subscription || false
        }));
        setUsers(usersWithRoles);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    switch (userFilter) {
      case "user":
        filtered = users.filter(u => u.role === "user");
        break;
      case "gestor":
        filtered = users.filter(u => u.role === "gestor");
        break;
      case "empresa":
        filtered = users.filter(u => u.role === "empresa");
        break;
      case "admin":
        filtered = users.filter(u => u.role === "admin");
        break;
      case "with_subscription":
        filtered = users.filter(u => u.hasSubscription);
        break;
      case "without_subscription":
        filtered = users.filter(u => !u.hasSubscription);
        break;
      default:
        filtered = users;
    }

    setFilteredUsers(filtered);
  };

  const handleOpenPreview = () => {
    if (!subject.trim()) {
      toast.error("Digite o assunto do e-mail");
      return;
    }
    if (!message.trim()) {
      toast.error("Digite a mensagem");
      return;
    }
    if (!sendViaEmail && !sendViaWhatsapp) {
      toast.error("Selecione pelo menos um canal de envio");
      return;
    }
    if (filteredUsers.length === 0) {
      toast.error("Não há usuários para enviar com o filtro selecionado");
      return;
    }
    setShowPreview(true);
  };

  const handleSendBroadcast = async () => {
    setIsSending(true);
    try {
      const recipients = filteredUsers.map(u => ({
        email: u.email,
        name: u.name
      }));

      const { data, error } = await supabase.functions.invoke('send-broadcast-email', {
        body: {
          subject,
          message,
          recipients,
          sendViaEmail,
          sendViaWhatsapp
        }
      });

      if (error) throw error;

      toast.success(`E-mails enviados para ${data?.sent || recipients.length} destinatários!`);
      setShowPreview(false);
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending broadcast:", error);
      toast.error("Erro ao enviar comunicado: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const getFilterLabel = (filter: UserFilter) => {
    switch (filter) {
      case "all": return "Todos os usuários";
      case "user": return "Usuários (perfil comum)";
      case "gestor": return "Gestores";
      case "empresa": return "Empresas";
      case "admin": return "Administradores";
      case "with_subscription": return "Com assinatura ativa";
      case "without_subscription": return "Sem assinatura";
      default: return "Todos";
    }
  };

  const generatePreviewHtml = () => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📢 PDI - Carreira & Vida</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px; text-align: center;">
            Este email foi enviado pelo PDI - Carreira & Vida.
          </p>
        </div>
      </div>
    `;
  };

  return (
    <>
      <Card className="shadow-medium border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Comunicados em Massa
          </CardTitle>
          <CardDescription>
            Envie mensagens para os usuários da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="broadcast-subject">Assunto do E-mail</Label>
            <Input
              id="broadcast-subject"
              placeholder="Ex: Novidades do PDI - Carreira & Vida"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="broadcast-message">Mensagem</Label>
            <Textarea
              id="broadcast-message"
              placeholder="Digite sua mensagem aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
              enableVoice={false}
            />
          </div>

          {/* User Filter */}
          <div className="space-y-2">
            <Label>Destinatários</Label>
            <Select value={userFilter} onValueChange={(v) => setUserFilter(v as UserFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="user">Usuários (perfil comum)</SelectItem>
                <SelectItem value="gestor">Gestores</SelectItem>
                <SelectItem value="empresa">Empresas</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="with_subscription">Com assinatura ativa</SelectItem>
                <SelectItem value="without_subscription">Sem assinatura</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : `${filteredUsers.length} usuário(s) selecionado(s)`}
            </p>
          </div>

          {/* Send Channels */}
          <div className="space-y-3">
            <Label>Canais de Envio</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email"
                  checked={sendViaEmail}
                  onCheckedChange={(checked) => setSendViaEmail(checked as boolean)}
                />
                <label
                  htmlFor="send-email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  E-mail
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-whatsapp"
                  checked={sendViaWhatsapp}
                  onCheckedChange={(checked) => setSendViaWhatsapp(checked as boolean)}
                  disabled
                />
                <label
                  htmlFor="send-whatsapp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  WhatsApp
                  <Badge variant="outline" className="text-xs">Em breve</Badge>
                </label>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleOpenPreview} className="gap-2" disabled={isLoading}>
              <Eye className="w-4 h-4" />
              Pré-visualizar e Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Pré-visualização do Comunicado
            </DialogTitle>
            <DialogDescription>
              Confira a mensagem antes de enviar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Destinatários:</strong> {filteredUsers.length} usuário(s) - {getFilterLabel(userFilter)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Assunto:</strong> {subject}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Canais:</span>
                {sendViaEmail && <Badge variant="secondary" className="gap-1"><Mail className="w-3 h-3" /> E-mail</Badge>}
                {sendViaWhatsapp && <Badge variant="secondary" className="gap-1"><MessageSquare className="w-3 h-3" /> WhatsApp</Badge>}
              </div>
            </div>

            {/* Email Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <span className="text-sm font-medium">Prévia do E-mail</span>
              </div>
              <div 
                className="p-4 bg-background"
                dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }}
              />
            </div>

            {/* Recipients List */}
            {filteredUsers.length <= 10 && (
              <div className="border rounded-lg">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-sm font-medium">Lista de Destinatários</span>
                </div>
                <div className="p-4 max-h-[200px] overflow-y-auto">
                  <ul className="text-sm space-y-1">
                    {filteredUsers.map(u => (
                      <li key={u.id} className="text-muted-foreground">
                        {u.name} ({u.email})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)} disabled={isSending}>
              Cancelar
            </Button>
            <Button onClick={handleSendBroadcast} disabled={isSending} className="gap-2">
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Confirmar Envio
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminBroadcastPanel;
