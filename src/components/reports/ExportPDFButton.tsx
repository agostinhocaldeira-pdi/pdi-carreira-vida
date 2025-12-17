import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown, FileText, BarChart3, Loader2 } from "lucide-react";
import { exportPDIToPDF, exportProgressReportToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";

interface ExportPDFButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
}

export function ExportPDFButton({ variant = "outline", size = "sm", label = "Exportar PDF" }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDI = async () => {
    setIsExporting(true);
    try {
      // 1. Dados Pessoais
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Verificar empresa associada
      let companyName = "";
      const employees = JSON.parse(localStorage.getItem("company_employees") || "[]");
      const employee = employees.find((emp: any) => 
        emp.email?.toLowerCase() === user.email?.toLowerCase() && emp.is_active
      );
      if (employee) {
        const companies = JSON.parse(localStorage.getItem("companies") || "[]");
        const company = companies.find((c: any) => c.id === employee.company_id);
        if (company) companyName = company.razao_social;
      }
      if (!companyName) {
        const managers = JSON.parse(localStorage.getItem("company_managers") || "[]");
        const manager = managers.find((mgr: any) => 
          mgr.email?.toLowerCase() === user.email?.toLowerCase() && mgr.is_active
        );
        if (manager) {
          const companies = JSON.parse(localStorage.getItem("companies") || "[]");
          const company = companies.find((c: any) => c.id === manager.company_id);
          if (company) companyName = company.razao_social;
        }
      }

      // 2. Onboarding
      const onboarding = JSON.parse(localStorage.getItem("onboarding_data") || "{}");
      
      // 3. Quem sou eu
      const vvd = localStorage.getItem("visao_vida_desejada") || "";
      const valores = JSON.parse(localStorage.getItem("meus_valores") || "[]");
      const areasVida = JSON.parse(localStorage.getItem("areas_vida") || "[]");
      
      // 4. Para onde vou - Objetivos
      const objetivos = JSON.parse(localStorage.getItem("meus_objetivos") || "[]");
      
      // 5. Como chegar lá - Metas com ações e passos
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const competencias = JSON.parse(localStorage.getItem("competencias") || "[]");
      const pontosFortes = JSON.parse(localStorage.getItem("pontos_fortes") || "[]");
      const pontosAMelhorar = JSON.parse(localStorage.getItem("pontos_a_melhorar") || "[]");
      
      // 6. Ferramentas
      const swot = JSON.parse(localStorage.getItem("analise_swot") || "{}");
      const crencas = JSON.parse(localStorage.getItem("crencas_transformadas") || "[]");
      const eisenhower = JSON.parse(localStorage.getItem("eisenhower_tasks") || "{}");
      
      // 7. Insight gerado
      const insight = localStorage.getItem("userInsight") || "";
      const insightDate = localStorage.getItem("lastInsightDate") || "";
      
      // 8. Histórico de Humor e Diário
      const diaryEntries = JSON.parse(localStorage.getItem("diary_entries") || "[]");
      const moodHistory = diaryEntries.map((entry: any) => ({
        date: entry.date || entry.data,
        mood: entry.mood || entry.humor,
        reflexao: entry.reflexao || entry.reflexoes,
        gratidao: entry.gratidao,
        conquistas: entry.conquistas
      })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Calcular estatísticas de humor
      const diaryStats = {
        total: diaryEntries.length,
        feliz: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'feliz').length,
        neutro: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'neutro').length,
        triste: diaryEntries.filter((e: any) => (e.mood || e.humor) === 'triste').length,
      };
      
      // 9. Gamificação
      const streak = JSON.parse(localStorage.getItem("user_streak") || "{}");
      const achievements = JSON.parse(localStorage.getItem("user_achievements") || "[]");

      exportPDIToPDF({
        // Dados Pessoais
        userName: user.name || "Usuário",
        userEmail: user.email || "",
        userPhone: user.phone || "",
        userRole: user.role || "user",
        companyName,
        
        // Onboarding
        currentPhase: onboarding.currentPhase || onboarding.fase_atual || "",
        expectations: onboarding.expectations || onboarding.expectativas || "",
        
        // Quem sou eu
        vvd,
        valores,
        areasVida,
        
        // Para onde vou
        objetivos: objetivos.map((obj: any) => ({
          ...obj,
          id: obj.id || `obj_${Math.random().toString(36).substr(2, 9)}`,
        })),
        
        // Como chegar lá
        metas: metas.map((meta: any) => ({
          ...meta,
          id: meta.id || `meta_${Math.random().toString(36).substr(2, 9)}`,
          acoes: (meta.acoes || []).map((acao: any) => ({
            ...acao,
            passos: acao.passos || [],
          })),
        })),
        competencias,
        pontosFortes,
        pontosAMelhorar,
        
        // Ferramentas
        swot: swot.forcas || swot.fraquezas ? swot : undefined,
        crencas: crencas.length > 0 ? crencas : undefined,
        eisenhower: eisenhower.urgente_importante ? eisenhower : undefined,
        
        // Insight
        insight,
        insightDate,
        
        // Humor
        moodHistory,
        diaryStats,
        
        // Gamificação
        streak: streak.current_streak || 0,
        longestStreak: streak.longest_streak || 0,
        level: streak.level || 1,
        totalPoints: streak.total_points || 0,
        achievements: achievements.map((a: any) => ({
          name: a.name || a.achievement_name,
          unlockedAt: a.unlocked_at
        })),
      });

      toast.success("PDI completo exportado com sucesso!");
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
      const insight = localStorage.getItem("userInsight") || "";

      const objetivosConcluidos = objetivos.filter((o: any) => o.status === "concluido").length;
      const metasConcluidas = metas.filter((m: any) => m.concluida).length;
      
      let acoesTotal = 0;
      let acoesConcluidas = 0;
      metas.forEach((meta: any) => {
        const acoes = meta.acoes || [];
        acoesTotal += acoes.length;
        acoesConcluidas += acoes.filter((a: any) => a.status === "concluido").length;
      });

      // Mood stats
      const moodStats = {
        total: diarioEntries.length,
        feliz: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'feliz').length,
        neutro: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'neutro').length,
        triste: diarioEntries.filter((e: any) => (e.mood || e.humor) === 'triste').length,
      };

      // Recent moods
      const recentMoods = diarioEntries
        .map((entry: any) => ({
          date: entry.date || entry.data,
          mood: entry.mood || entry.humor,
          reflexao: entry.reflexao || entry.reflexoes,
        }))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 14);

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
          longestStreak: streak.longest_streak || 0,
          level: streak.level || 1,
          totalPoints: streak.total_points || 0,
        },
        moodStats,
        recentMoods,
        insight
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
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDI}>
          <FileText className="w-4 h-4 mr-2" />
          PDI Completo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportProgress}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Relatório de Progresso
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
