import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MessageSquare, Users, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Recipient {
  id: string;
  email: string;
  name: string;
  type: "user" | "lead";
  role?: string;
}

type ProfileFilter = "user" | "gestor" | "empresa" | "admin" | "leads";

const FILTER_OPTIONS: { value: ProfileFilter; label: string }[] = [
  { value: "user", label: "Usuários" },
  { value: "gestor", label: "Gestores" },
  { value: "empresa", label: "Empresas" },
  { value: "admin", label: "Administradores" },
  { value: "leads", label: "Leads (confirmados)" },
];

const AdminBroadcastPanel = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<ProfileFilter[]>(["user"]);
  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState(false);
  const [allRecipients, setAllRecipients] = useState<Recipient[]>([]);
  const [filteredRecipients, setFilteredRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterRecipients();
  }, [selectedFilters, allRecipients]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [usersResult, leadsResult] = await Promise.all([
        supabase.functions.invoke('get-admin-users'),
        supabase.from('leads').select('id, name, email').eq('email_confirmed', true)
      ]);

      const recipients: Recipient[] = [];

      if (usersResult.data?.users) {
        usersResult.data.users.forEach((u: any) => {
          if (u.email && u.email !== '-') {
            recipients.push({
              id: u.id,
              email: u.email,
              name: u.name || 'Usuário',
              type: "user",
              role: u.role || 'user'
            });
          }
        });
      }

      if (leadsResult.data) {
        const existingEmails = new Set(recipients.map(r => r.email.toLowerCase()));
        leadsResult.data.forEach((lead: any) => {
          if (lead.email && !existingEmails.has(lead.email.toLowerCase())) {
            recipients.push({
              id: lead.id,
              email: lead.email,
              name: lead.name || 'Lead',
              type: "lead"
            });
          }
        });
      }

      setAllRecipients(recipients);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar destinatários");
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecipients = () => {
    if (selectedFilters.length === 0) {
      setFilteredRecipients([]);
      return;
    }

    const filtered = allRecipients.filter(r => {
      if (r.type === "lead") {
        return selectedFilters.includes("leads");
      }
      return selectedFilters.includes(r.role as ProfileFilter);
    });

    setFilteredRecipients(filtered);
  };

  const toggleFilter = (filter: ProfileFilter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
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
    if (filteredRecipients.length === 0) {
      toast.error("Não há destinatários para enviar com os filtros selecionados");
      return;
    }
    setShowPreview(true);
  };

  const handleSendBroadcast = async () => {
    setIsSending(true);
    try {
      const recipients = filteredRecipients.map(r => ({
        email: r.email,
        name: r.name
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

  const getSelectedFiltersLabel = () => {
    if (selectedFilters.length === 0) return "Nenhum selecionado";
    if (selectedFilters.length === FILTER_OPTIONS.length) return "Todos";
    return selectedFilters.map(f => FILTER_OPTIONS.find(o => o.value === f)?.label).join(", ");
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
          <div className="space-y-2">
            <Label htmlFor="broadcast-subject">Assunto do E-mail</Label>
            <Input
              id="broadcast-subject"
              placeholder="Ex: Novidades do PDI - Carreira & Vida"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

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

          <div className="space-y-3">
            <Label>Destinatários (selecione um ou mais perfis)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FILTER_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${option.value}`}
                    checked={selectedFilters.includes(option.value)}
                    onCheckedChange={() => toggleFilter(option.value)}
                  />
                  <label
                    htmlFor={`filter-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : `${filteredRecipients.length} destinatário(s) selecionado(s)`}
            </p>
          </div>

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

          <div className="flex justify-end pt-4">
            <Button onClick={handleOpenPreview} className="gap-2" disabled={isLoading}>
              <Eye className="w-4 h-4" />
              Pré-visualizar e Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Destinatários:</strong> {filteredRecipients.length} - {getSelectedFiltersLabel()}
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

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <span className="text-sm font-medium">Prévia do E-mail</span>
              </div>
              <div 
                className="p-4 bg-background"
                dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }}
              />
            </div>

            {filteredRecipients.length <= 10 && (
              <div className="border rounded-lg">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-sm font-medium">Lista de Destinatários</span>
                </div>
                <div className="p-4 max-h-[200px] overflow-y-auto">
                  <ul className="text-sm space-y-1">
                    {filteredRecipients.map(r => (
                      <li key={r.id} className="text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {r.type === "lead" ? "Lead" : r.role}
                        </Badge>
                        {r.name} ({r.email})
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
