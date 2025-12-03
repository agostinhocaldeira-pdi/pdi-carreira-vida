import jsPDF from 'jspdf';

interface PDIData {
  userName: string;
  vvd: string;
  valores: string[];
  areasVida: Array<{ area: string; nota_atual: number; nota_desejada: number }>;
  objetivos: Array<{ texto: string; status: string; data_alvo?: string }>;
  metas: Array<{ texto: string; concluida: boolean; data_alvo?: string }>;
  swot?: { forcas: string[]; fraquezas: string[]; oportunidades: string[]; ameacas: string[] };
}

export function exportPDIToPDF(data: PDIData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  
  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPos);
    yPos += size * 0.5 + 5;
  };

  const addText = (text: string, size: number = 11) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 6 + 3;
  };

  const addSection = (title: string) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 5;
    doc.setFillColor(59, 130, 246);
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 3, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;
  };

  const addListItem = (text: string, bullet: string = '•') => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(`${bullet} ${text}`, pageWidth - margin * 2 - 5);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 2;
  };

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PDI - Plano de Desenvolvimento Individual', margin, 25);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.userName} | ${new Date().toLocaleDateString('pt-BR')}`, margin, 35);
  doc.setTextColor(0, 0, 0);
  yPos = 55;

  // VVD
  if (data.vvd) {
    addSection('Visão de Vida Desejada');
    addText(data.vvd);
  }

  // Valores
  if (data.valores && data.valores.length > 0) {
    addSection('Meus Valores');
    const valoresGrid = data.valores.filter(v => v).join(' | ');
    addText(valoresGrid);
  }

  // Áreas da Vida
  if (data.areasVida && data.areasVida.length > 0) {
    addSection('Áreas da Vida');
    data.areasVida.forEach(area => {
      addListItem(`${area.area}: Atual ${area.nota_atual}/10 → Desejada ${area.nota_desejada}/10`);
    });
  }

  // Objetivos
  if (data.objetivos && data.objetivos.length > 0) {
    addSection('Meus Objetivos');
    data.objetivos.forEach(obj => {
      const status = obj.status === 'concluido' ? '✓' : '○';
      const prazo = obj.data_alvo ? ` (Prazo: ${new Date(obj.data_alvo).toLocaleDateString('pt-BR')})` : '';
      addListItem(`${obj.texto}${prazo}`, status);
    });
  }

  // Metas
  if (data.metas && data.metas.length > 0) {
    addSection('Minhas Metas');
    data.metas.forEach(meta => {
      const status = meta.concluida ? '✓' : '○';
      const prazo = meta.data_alvo ? ` (Prazo: ${new Date(meta.data_alvo).toLocaleDateString('pt-BR')})` : '';
      addListItem(`${meta.texto}${prazo}`, status);
    });
  }

  // SWOT
  if (data.swot) {
    addSection('Análise SWOT');
    if (data.swot.forcas?.length > 0) {
      addText('Forças:', 11);
      data.swot.forcas.forEach(item => addListItem(item, '+'));
    }
    if (data.swot.fraquezas?.length > 0) {
      addText('Fraquezas:', 11);
      data.swot.fraquezas.forEach(item => addListItem(item, '-'));
    }
    if (data.swot.oportunidades?.length > 0) {
      addText('Oportunidades:', 11);
      data.swot.oportunidades.forEach(item => addListItem(item, '→'));
    }
    if (data.swot.ameacas?.length > 0) {
      addText('Ameaças:', 11);
      data.swot.ameacas.forEach(item => addListItem(item, '!'));
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Gerado pelo PDI - Carreira & Vida | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`PDI_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportProgressReportToPDF(
  userName: string,
  period: string,
  stats: {
    objetivosTotal: number;
    objetivosConcluidos: number;
    metasTotal: number;
    metasConcluidas: number;
    acoesTotal: number;
    acoesConcluidas: number;
    diasDiario: number;
    streak: number;
  }
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Progresso', margin, 25);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${userName} | Período: ${period}`, margin, 35);
  doc.setTextColor(0, 0, 0);
  yPos = 55;

  // Stats Cards
  const cardWidth = (pageWidth - margin * 2 - 15) / 2;
  const cardHeight = 35;

  const drawStatCard = (x: number, y: number, label: string, value: string, color: number[]) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(label, x + 10, y + 12);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 10, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  };

  // Row 1
  drawStatCard(margin, yPos, 'Objetivos Concluídos', `${stats.objetivosConcluidos}/${stats.objetivosTotal}`, [59, 130, 246]);
  drawStatCard(margin + cardWidth + 15, yPos, 'Metas Concluídas', `${stats.metasConcluidas}/${stats.metasTotal}`, [16, 185, 129]);
  yPos += cardHeight + 15;

  // Row 2
  drawStatCard(margin, yPos, 'Ações Concluídas', `${stats.acoesConcluidas}/${stats.acoesTotal}`, [139, 92, 246]);
  drawStatCard(margin + cardWidth + 15, yPos, 'Dias de Diário', `${stats.diasDiario}`, [249, 115, 22]);
  yPos += cardHeight + 15;

  // Row 3
  drawStatCard(margin, yPos, 'Streak Atual', `${stats.streak} dias`, [236, 72, 153]);
  
  // Percentages
  yPos += cardHeight + 30;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Taxa de Conclusão', margin, yPos);
  yPos += 15;

  const drawProgressBar = (label: string, completed: number, total: number) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const barWidth = pageWidth - margin * 2;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${label}: ${percentage}%`, margin, yPos);
    yPos += 5;
    
    doc.setFillColor(229, 231, 235);
    doc.roundedRect(margin, yPos, barWidth, 8, 2, 2, 'F');
    
    if (percentage > 0) {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(margin, yPos, barWidth * (percentage / 100), 8, 2, 2, 'F');
    }
    yPos += 18;
  };

  drawProgressBar('Objetivos', stats.objetivosConcluidos, stats.objetivosTotal);
  drawProgressBar('Metas', stats.metasConcluidas, stats.metasTotal);
  drawProgressBar('Ações', stats.acoesConcluidas, stats.acoesTotal);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Gerado pelo PDI - Carreira & Vida | ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  doc.save(`Relatorio_Progresso_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
