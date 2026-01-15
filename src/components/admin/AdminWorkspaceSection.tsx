import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminPendingTasksKanban } from "@/components/admin/AdminPendingTasksKanban";
import { ClipboardList, StickyNote, ChevronDown, ChevronUp, Save } from "lucide-react";
import { toast } from "sonner";

const AdminWorkspaceSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [projectNotes, setProjectNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load project notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("admin_project_notes");
    if (savedNotes) {
      setProjectNotes(savedNotes);
    }
  }, []);

  const handleSaveNotes = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("admin_project_notes", projectNotes);
      toast.success("Anotações salvas!");
    } catch (error) {
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
