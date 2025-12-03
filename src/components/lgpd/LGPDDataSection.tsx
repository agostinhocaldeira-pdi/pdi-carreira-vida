import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Trash2, Shield, FileJson, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const LGPDDataSection = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para exportar seus dados");
        return;
      }

      // Chamar função do banco para exportar dados
      const { data, error } = await supabase.rpc('export_user_data', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Erro ao exportar dados:', error);
        toast.error("Erro ao exportar dados. Tente novamente.");
        return;
      }

      // Criar arquivo JSON para download
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `meus-dados-pdi-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Seus dados foram exportados com sucesso!");
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao exportar dados");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (deleteConfirmation !== "EXCLUIR MEUS DADOS") {
      toast.error("Por favor, digite a confirmação corretamente");
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        return;
      }

      // Criar solicitação de exclusão
      const { error } = await supabase
        .from('data_deletion_requests')
        .insert({
          user_id: user.id,
          status: 'pending'
        });

      if (error) {
        console.error('Erro ao criar solicitação:', error);
        toast.error("Erro ao criar solicitação de exclusão");
        return;
      }

      toast.success(
        "Solicitação de exclusão registrada. Nossa equipe processará em até 15 dias úteis.",
        { duration: 6000 }
      );
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacidade e Dados (LGPD)
          </CardTitle>
          <CardDescription>
            Gerencie seus dados pessoais conforme a Lei Geral de Proteção de Dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileJson className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Exportar Meus Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Baixe uma cópia de todos os seus dados em formato JSON
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exportando..." : "Exportar Dados"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-destructive/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-destructive/10 rounded-full">
                    <Trash2 className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-medium">Excluir Minha Conta</h4>
                    <p className="text-sm text-muted-foreground">
                      Solicite a exclusão permanente de todos os seus dados
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Solicitar Exclusão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              <strong>Seus direitos (LGPD Art. 18):</strong> Acesso, correção, anonimização, 
              portabilidade, exclusão e revogação de consentimento. Para exercer qualquer 
              direito, entre em contato através do suporte.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Excluir todos os meus dados
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Esta ação é <strong>irreversível</strong>. Todos os seus dados serão 
                  permanentemente excluídos, incluindo:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Seu perfil e informações pessoais</li>
                  <li>Objetivos, metas e ações</li>
                  <li>Entradas do diário</li>
                  <li>Resultados de ferramentas (SWOT, VVD, etc.)</li>
                  <li>Histórico de progresso e conquistas</li>
                </ul>
                <p className="font-medium pt-2">
                  Para confirmar, digite: <code className="bg-muted px-1">EXCLUIR MEUS DADOS</code>
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Digite a confirmação"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestDeletion}
              disabled={deleteConfirmation !== "EXCLUIR MEUS DADOS" || isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Processando..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
