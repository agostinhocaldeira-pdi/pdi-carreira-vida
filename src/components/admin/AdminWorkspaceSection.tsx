import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminPendingTasksKanban } from "@/components/admin/AdminPendingTasksKanban";
import { ClipboardList, StickyNote, ChevronDown, ChevronUp, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminWorkspaceSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [projectNotes, setProjectNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load project notes from Supabase
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('admin_project_notes')
          .select('notes')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data?.notes) {
          setProjectNotes(data.notes);
        }
      } catch (error) {
        console.error('Error loading project notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('admin_project_notes')
        .upsert({
          user_id: user.id,
          notes: projectNotes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success("Anotações salvas!");
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error("Erro ao salvar anotações");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-medium border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Workspace do Projeto
              </CardTitle>
              <CardDescription>
                Gerencie pendências e anotações do projeto
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Lista de Pendências */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-sm">
                <ClipboardList className="w-4 h-4 text-primary" />
                Lista de Pendências
              </h3>
              <div className="border rounded-lg p-3 bg-muted/30">
                <AdminPendingTasksKanban />
              </div>
            </div>

            {/* Anotações do Projeto */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2 text-sm">
                <StickyNote className="w-4 h-4 text-amber-500" />
                Anotações do Projeto
              </h3>
              <Textarea
                placeholder="Digite suas anotações sobre o projeto aqui... (ideias, lembretes, decisões importantes, etc.)"
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                className="min-h-[150px] resize-y"
              />
              <Button 
                onClick={handleSaveNotes} 
                disabled={isSaving}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Salvando..." : "Salvar Anotações"}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdminWorkspaceSection;
