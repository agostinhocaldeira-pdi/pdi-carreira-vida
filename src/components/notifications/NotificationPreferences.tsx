import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Calendar, Clock, Save } from "lucide-react";
import { toast } from "sonner";

interface NotificationPrefs {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  diary_reminder_enabled: boolean;
  diary_reminder_time: string;
  goal_deadline_reminder: boolean;
  goal_deadline_days_before: number;
  weekly_summary_enabled: boolean;
  weekly_summary_day: number;
}

const DAYS_OF_WEEK = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
];

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    email_enabled: true,
    whatsapp_enabled: false,
    diary_reminder_enabled: true,
    diary_reminder_time: "20:00",
    goal_deadline_reminder: true,
    goal_deadline_days_before: 3,
    weekly_summary_enabled: true,
    weekly_summary_day: 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("notification_preferences");
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("notification_preferences", JSON.stringify(preferences));
      toast.success("Preferências de notificação salvas!");
    } catch (error) {
      toast.error("Erro ao salvar preferências");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = <K extends keyof NotificationPrefs>(
    key: K,
    value: NotificationPrefs[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="shadow-large">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Bell className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <CardTitle>Notificações e Lembretes</CardTitle>
            <CardDescription>Configure como deseja ser notificado</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canais de Notificação */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Canais de Notificação
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>E-mail</Label>
                  <p className="text-xs text-muted-foreground">Receba lembretes por e-mail</p>
                </div>
              </div>
              <Switch
                checked={preferences.email_enabled}
                onCheckedChange={(checked) => updatePreference("email_enabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>WhatsApp</Label>
                  <p className="text-xs text-muted-foreground">Receba lembretes via WhatsApp</p>
                </div>
              </div>
              <Switch
                checked={preferences.whatsapp_enabled}
                onCheckedChange={(checked) => updatePreference("whatsapp_enabled", checked)}
              />
            </div>
          </div>
        </div>

        {/* Lembrete do Diário */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Lembrete do Diário
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Lembrete diário</Label>
                  <p className="text-xs text-muted-foreground">Lembrar de preencher o diário</p>
                </div>
              </div>
              <Switch
                checked={preferences.diary_reminder_enabled}
                onCheckedChange={(checked) => updatePreference("diary_reminder_enabled", checked)}
              />
            </div>
            {preferences.diary_reminder_enabled && (
              <div className="flex items-center gap-3 pl-8">
                <Label className="text-sm">Horário:</Label>
                <Input
                  type="time"
                  value={preferences.diary_reminder_time}
                  onChange={(e) => updatePreference("diary_reminder_time", e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </div>
        </div>

        {/* Lembrete de Metas */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Lembrete de Prazos
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Lembrar antes do prazo</Label>
                  <p className="text-xs text-muted-foreground">Aviso de metas próximas do vencimento</p>
                </div>
              </div>
              <Switch
                checked={preferences.goal_deadline_reminder}
                onCheckedChange={(checked) => updatePreference("goal_deadline_reminder", checked)}
              />
            </div>
            {preferences.goal_deadline_reminder && (
              <div className="flex items-center gap-3 pl-8">
                <Label className="text-sm">Dias antes:</Label>
                <Select
                  value={String(preferences.goal_deadline_days_before)}
                  onValueChange={(value) => updatePreference("goal_deadline_days_before", Number(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="2">2 dias</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="5">5 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Resumo Semanal */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Resumo Semanal
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Resumo semanal</Label>
                  <p className="text-xs text-muted-foreground">Receba um resumo do seu progresso</p>
                </div>
              </div>
              <Switch
                checked={preferences.weekly_summary_enabled}
                onCheckedChange={(checked) => updatePreference("weekly_summary_enabled", checked)}
              />
            </div>
            {preferences.weekly_summary_enabled && (
              <div className="flex items-center gap-3 pl-8">
                <Label className="text-sm">Dia:</Label>
                <Select
                  value={String(preferences.weekly_summary_day)}
                  onValueChange={(value) => updatePreference("weekly_summary_day", Number(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </CardContent>
    </Card>
  );
}
