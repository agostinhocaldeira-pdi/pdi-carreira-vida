import jsPDF from "jspdf";

interface EmployeeStats {
  id: string;
  name: string;
  objetivos: number;
  objetivosConcluidos: number;
  metas: number;
  metasConcluidas: number;
  diasDiario: number;
  objetivosAlinhados: number;
}

interface CompanyReportData {
  companyName: string;
  period: string;
  generatedAt: string;
  totalEmployees: number;
  totalManagers: number;
  aggregatedStats: {
    totalObjetivos: number;
    objetivosConcluidos: number;
    totalMetas: number;
    metasConcluidas: number;
    mediaEngagement: number;
    funcionariosAtivos: number;
    funcionariosAlinhados: number;
  };
  taxaConclusaoObjetivos: number;
  taxaConclusaoMetas: number;
  okrAlignmentRate: number;
  employeeStats: EmployeeStats[];
  managers: Array<{ id: string; name: string; email: string }>;
}

class CompanyPDFHelper {
  private doc: jsPDF;
  private yPos: number = 20;
  private pageHeight: number = 280;
  private leftMargin: number = 20;
  private rightMargin: number = 190;
  private contentWidth: number = 170;

  constructor() {
    this.doc = new jsPDF();
  }

  private checkPageBreak(requiredSpace: number = 30) {
    if (this.yPos + requiredSpace > this.pageHeight) {
      this.doc.addPage();
      this.yPos = 20;
    }
  }

  addHeader(title: string, subtitle?: string) {
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(0, 0, 210, 40, "F");

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(22);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.leftMargin, 22);

    if (subtitle) {
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(subtitle, this.leftMargin, 32);
    }

    this.doc.setTextColor(0, 0, 0);
    this.yPos = 55;
  }

  addSection(title: string, color: [number, number, number] = [59, 130, 246]) {
    this.checkPageBreak(40);

    this.doc.setFillColor(...color);
    this.doc.rect(this.leftMargin, this.yPos - 5, this.contentWidth, 10, "F");

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.leftMargin + 5, this.yPos + 2);

    this.doc.setTextColor(0, 0, 0);
    this.yPos += 15;
  }

  addSubSection(title: string) {
    this.checkPageBreak(20);
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(59, 130, 246);
    this.doc.text(title, this.leftMargin, this.yPos);
    this.doc.setTextColor(0, 0, 0);
    this.yPos += 8;
  }

  addKeyValue(key: string, value: string) {
    this.checkPageBreak(10);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    const keyText = `${key}: `;
    const keyWidth = this.doc.getTextWidth(keyText);
    this.doc.text(keyText, this.leftMargin, this.yPos);
    
    this.doc.setFont("helvetica", "normal");
    const valueX = this.leftMargin + keyWidth;
    const maxWidth = this.rightMargin - valueX;
    const lines = this.doc.splitTextToSize(value, maxWidth);
    this.doc.text(lines, valueX, this.yPos);
    this.yPos += lines.length * 5 + 3;
  }

  addKPIRow(kpis: Array<{ label: string; value: string; color?: [number, number, number] }>) {
    this.checkPageBreak(25);
    const kpiWidth = this.contentWidth / kpis.length;

    kpis.forEach((kpi, index) => {
      const x = this.leftMargin + index * kpiWidth;
      
      // Box background
      this.doc.setFillColor(245, 247, 250);
      this.doc.roundedRect(x + 2, this.yPos - 5, kpiWidth - 4, 22, 3, 3, "F");
      
      // Value
      this.doc.setFontSize(16);
      this.doc.setFont("helvetica", "bold");
      if (kpi.color) {
        this.doc.setTextColor(...kpi.color);
      } else {
        this.doc.setTextColor(59, 130, 246);
      }
      this.doc.text(kpi.value, x + kpiWidth / 2, this.yPos + 5, { align: "center" });
      
      // Label
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(kpi.label, x + kpiWidth / 2, this.yPos + 12, { align: "center" });
    });

    this.doc.setTextColor(0, 0, 0);
    this.yPos += 28;
  }

  addProgressBar(label: string, value: number, total: number) {
    this.checkPageBreak(15);
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`${label}: ${value}/${total} (${percentage}%)`, this.leftMargin, this.yPos);
    this.yPos += 5;

    // Background bar
    this.doc.setFillColor(229, 231, 235);
    this.doc.roundedRect(this.leftMargin, this.yPos, this.contentWidth, 5, 2, 2, "F");

    // Progress bar
    const progressWidth = (percentage / 100) * this.contentWidth;
    if (progressWidth > 0) {
      const color: [number, number, number] = percentage >= 70 ? [34, 197, 94] : percentage >= 40 ? [245, 158, 11] : [239, 68, 68];
      this.doc.setFillColor(...color);
      this.doc.roundedRect(this.leftMargin, this.yPos, progressWidth, 5, 2, 2, "F");
    }

    this.yPos += 12;
  }

  addTable(headers: string[], rows: string[][], columnWidths?: number[]) {
    this.checkPageBreak(30);
    const defaultWidth = this.contentWidth / headers.length;
    const widths = columnWidths || headers.map(() => defaultWidth);

    // Header
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(this.leftMargin, this.yPos - 4, this.contentWidth, 8, "F");
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");

    let xPos = this.leftMargin + 2;
    headers.forEach((header, i) => {
      this.doc.text(header, xPos, this.yPos);
      xPos += widths[i];
    });

    this.doc.setTextColor(0, 0, 0);
    this.yPos += 8;

    // Rows
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);

    rows.forEach((row, rowIndex) => {
      this.checkPageBreak(10);
      
      // Alternate row background
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(249, 250, 251);
        this.doc.rect(this.leftMargin, this.yPos - 4, this.contentWidth, 7, "F");
      }

      xPos = this.leftMargin + 2;
      row.forEach((cell, i) => {
        const maxWidth = widths[i] - 4;
        const truncated = this.doc.getTextWidth(cell) > maxWidth 
          ? cell.substring(0, Math.floor(cell.length * (maxWidth / this.doc.getTextWidth(cell)))) + "..."
          : cell;
        this.doc.text(truncated, xPos, this.yPos);
        xPos += widths[i];
      });

      this.yPos += 7;
    });

    this.yPos += 5;
  }

  addText(text: string, indent: number = 0) {
    this.checkPageBreak(10);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const lines = this.doc.splitTextToSize(text, this.contentWidth - indent);
    this.doc.text(lines, this.leftMargin + indent, this.yPos);
    this.yPos += lines.length * 5 + 3;
  }

  addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(`Pagina ${i} de ${pageCount}`, 105, 290, { align: "center" });
      this.doc.text("PDI - Carreira & Vida | Relatorio Corporativo", 105, 295, { align: "center" });
    }
  }

  addSpace(space: number = 10) {
    this.yPos += space;
  }

  save(filename: string) {
    this.addFooter();
    this.doc.save(filename);
  }
}

const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    week: "Ultima Semana",
    month: "Ultimo Mes",
    quarter: "Ultimo Trimestre",
    year: "Ultimo Ano",
  };
  return labels[period] || period;
};

export function exportCompanyReportToPDF(data: CompanyReportData) {
  const pdf = new CompanyPDFHelper();

  // Header
  pdf.addHeader(
    "Relatorio Corporativo PDI",
    `${data.companyName} | ${getPeriodLabel(data.period)} | Gerado em ${data.generatedAt}`
  );

  // ============= PARTE 1: DADOS CONSOLIDADOS =============
  pdf.addSection("RESUMO EXECUTIVO", [34, 197, 94]);
  
  pdf.addKPIRow([
    { label: "Taxa Objetivos", value: `${data.taxaConclusaoObjetivos}%`, color: [59, 130, 246] },
    { label: "Taxa Metas", value: `${data.taxaConclusaoMetas}%`, color: [34, 197, 94] },
    { label: "Alinhados OKRs", value: `${data.okrAlignmentRate}%`, color: [139, 92, 246] },
    { label: "Engajamento", value: `${data.aggregatedStats.mediaEngagement}%`, color: [245, 158, 11] },
  ]);

  pdf.addSpace(5);

  pdf.addKeyValue("Total de Funcionarios", data.totalEmployees.toString());
  pdf.addKeyValue("Total de Gestores", data.totalManagers.toString());
  pdf.addKeyValue("Funcionarios Ativos no Periodo", data.aggregatedStats.funcionariosAtivos.toString());
  pdf.addKeyValue("Funcionarios com OKRs Alinhados", data.aggregatedStats.funcionariosAlinhados.toString());

  pdf.addSpace(10);

  // Progresso Consolidado
  pdf.addSection("PROGRESSO CONSOLIDADO", [59, 130, 246]);

  pdf.addProgressBar(
    "Objetivos Concluidos",
    data.aggregatedStats.objetivosConcluidos,
    data.aggregatedStats.totalObjetivos
  );

  pdf.addProgressBar(
    "Metas Concluidas",
    data.aggregatedStats.metasConcluidas,
    data.aggregatedStats.totalMetas
  );

  pdf.addSpace(5);

  pdf.addSubSection("Analise de Engajamento");
  const engagementAnalysis = data.aggregatedStats.mediaEngagement >= 70
    ? "Excelente nivel de engajamento. A equipe esta ativa e comprometida com seus PDIs."
    : data.aggregatedStats.mediaEngagement >= 40
    ? "Nivel moderado de engajamento. Ha espaco para melhorias na participacao da equipe."
    : "Nivel baixo de engajamento. Recomenda-se acao imediata para aumentar a adesao ao PDI.";
  pdf.addText(engagementAnalysis);

  pdf.addSubSection("Analise de Alinhamento OKR");
  const alignmentAnalysis = data.okrAlignmentRate >= 70
    ? "Excelente alinhamento com os objetivos corporativos. Os funcionarios estao direcionados para as metas da empresa."
    : data.okrAlignmentRate >= 40
    ? "Alinhamento moderado. Alguns funcionarios ainda precisam vincular seus objetivos aos OKRs corporativos."
    : "Alinhamento baixo. E recomendado realizar sessoes de cascateamento de OKRs com a equipe.";
  pdf.addText(alignmentAnalysis);

  pdf.addSpace(10);

  // ============= PARTE 2: DADOS ANALITICOS =============
  pdf.addSection("RANKING DE PERFORMANCE", [139, 92, 246]);

  const sortedEmployees = [...data.employeeStats].sort((a, b) => {
    const rateA = a.metas > 0 ? a.metasConcluidas / a.metas : 0;
    const rateB = b.metas > 0 ? b.metasConcluidas / b.metas : 0;
    return rateB - rateA;
  });

  const topPerformers = sortedEmployees.slice(0, 10);
  
  if (topPerformers.length > 0) {
    pdf.addSubSection("Top 10 Funcionarios por Taxa de Conclusao");
    
    const headers = ["#", "Nome", "Metas", "Concl.", "Taxa", "OKRs"];
    const rows = topPerformers.map((emp, index) => {
      const rate = emp.metas > 0 ? Math.round((emp.metasConcluidas / emp.metas) * 100) : 0;
      return [
        (index + 1).toString(),
        emp.name,
        emp.metas.toString(),
        emp.metasConcluidas.toString(),
        `${rate}%`,
        emp.objetivosAlinhados > 0 ? "Sim" : "Nao",
      ];
    });

    pdf.addTable(headers, rows, [15, 60, 25, 25, 25, 20]);
  }

  pdf.addSpace(10);

  // Detalhamento por Funcionário
  pdf.addSection("DETALHAMENTO POR FUNCIONARIO", [245, 158, 11]);

  const detailHeaders = ["Nome", "Obj.", "Obj.Concl.", "Metas", "Metas Concl.", "Diario", "OKRs"];
  const detailRows = data.employeeStats.map((emp) => [
    emp.name,
    emp.objetivos.toString(),
    emp.objetivosConcluidos.toString(),
    emp.metas.toString(),
    emp.metasConcluidas.toString(),
    `${emp.diasDiario}d`,
    emp.objetivosAlinhados.toString(),
  ]);

  pdf.addTable(detailHeaders, detailRows, [50, 18, 25, 20, 30, 18, 18]);

  pdf.addSpace(10);

  // Gestores
  if (data.managers.length > 0) {
    pdf.addSection("GESTORES DA EMPRESA", [100, 116, 139]);
    
    const managerHeaders = ["Nome", "E-mail"];
    const managerRows = data.managers.map((m) => [m.name, m.email]);
    pdf.addTable(managerHeaders, managerRows, [70, 100]);
  }

  pdf.addSpace(10);

  // Recomendações
  pdf.addSection("RECOMENDACOES", [34, 197, 94]);

  const recommendations: string[] = [];

  if (data.aggregatedStats.mediaEngagement < 50) {
    recommendations.push("- Realizar campanhas de engajamento para aumentar a adesao ao PDI");
  }
  if (data.okrAlignmentRate < 50) {
    recommendations.push("- Promover sessoes de cascateamento de OKRs com gestores e equipes");
  }
  if (data.taxaConclusaoMetas < 40) {
    recommendations.push("- Revisar metas para garantir que sao realistas e alcancaveis (SMART)");
  }
  if (data.taxaConclusaoObjetivos < 40) {
    recommendations.push("- Avaliar se os objetivos estao bem definidos e com prazos adequados");
  }

  const lowPerformers = sortedEmployees.filter((emp) => {
    const rate = emp.metas > 0 ? emp.metasConcluidas / emp.metas : 0;
    return rate < 0.3;
  });

  if (lowPerformers.length > 3) {
    recommendations.push(`- ${lowPerformers.length} funcionarios com baixa performance precisam de acompanhamento`);
  }

  if (recommendations.length === 0) {
    recommendations.push("- Manter o ritmo atual de acompanhamento e desenvolvimento");
    recommendations.push("- Celebrar conquistas da equipe para manter a motivacao");
  }

  recommendations.forEach((rec) => {
    pdf.addText(rec, 5);
  });

  // Save
  const filename = `relatorio-corporativo-${data.companyName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(filename);
}
