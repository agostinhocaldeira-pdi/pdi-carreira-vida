import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown, FileText, BarChart3, Loader2 } from "lucide-react";
import { exportPDIToPDF, exportProgressReportToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";

interface ExportPDFButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportPDFButton({ variant = "outline", size = "sm" }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDI = async () => {
    setIsExporting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const vvd = localStorage.getItem("visao_vida_desejada") || "";
      const valores = JSON.parse(localStorage.getItem("meus_valores") || "[]");
      const areasVida = JSON.parse(localStorage.getItem("areas_vida") || "[]");
      const objetivos = JSON.parse(localStorage.getItem("meus_objetivos") || "[]");
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const swot = JSON.parse(localStorage.getItem("analise_swot") || "{}");

      exportPDIToPDF({
        userName: user.name || "Usuário",
        vvd,
        valores,
        areasVida,
        objetivos,
        metas,
        swot: swot.forcas || swot.fraquezas ? swot : undefined,
      });

      toast.success("PDI exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportProgress = async () => {
    setIsExporting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const objetivos = JSON.parse(localStorage.getItem("meus_objetivos") || "[]");
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const diarioEntries = JSON.parse(localStorage.getItem("diary_entries") || "[]");
      const streak = JSON.parse(localStorage.getItem("user_streak") || "{}");

      const objetivosConcluidos = objetivos.filter((o: any) => o.status === "concluido").length;
      const metasConcluidas = metas.filter((m: any) => m.concluida).length;
      
      let acoesTotal = 0;
      let acoesConcluidas = 0;
      metas.forEach((meta: any) => {
        const acoes = meta.acoes || [];
        acoesTotal += acoes.length;
        acoesConcluidas += acoes.filter((a: any) => a.status === "concluido").length;
      });

      exportProgressReportToPDF(
        user.name || "Usuário",
        new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        {
          objetivosTotal: objetivos.length,
          objetivosConcluidos,
          metasTotal: metas.length,
          metasConcluidas,
          acoesTotal,
          acoesConcluidas,
          diasDiario: diarioEntries.length,
          streak: streak.current_streak || 0,
        }
      );

      toast.success("Relatório de progresso exportado!");
    } catch (error) {
      console.error("Error exporting progress report:", error);
      toast.error("Erro ao exportar relatório");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4 mr-2" />
          )}
          Exportar PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDI}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar PDI Completo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportProgress}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Relatório de Progresso
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
