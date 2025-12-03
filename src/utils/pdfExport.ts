import jsPDF from 'jspdf';

interface PDIData {
  // Dados Pessoais
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: string;
  companyName?: string;
  
  // Onboarding
  currentPhase?: string;
  expectations?: string;
  
  // Quem sou eu
  vvd: string;
  valores: string[];
  areasVida: Array<{ area: string; nota_atual: number; nota_desejada: number }>;
  
  // Para onde vou
  objetivos: Array<{ texto?: string; objetivo?: string; status: string; data_alvo?: string; conexao_vvd?: string }>;
  
  // Como chegar lá
  metas: Array<{ texto?: string; meta?: string; concluida: boolean; data_alvo?: string; objetivo_id?: string; acoes?: Array<{ texto?: string; acao?: string; status: string; periodicidade?: string }> }>;
  competencias?: string[];
  pontosFortes?: string[];
  pontosAMelhorar?: string[];
  
  // Ferramentas
  swot?: { forcas: string[]; fraquezas: string[]; oportunidades: string[]; ameacas: string[] };
  crencas?: Array<{ crencaLimitante: string; crencaFortalecedora: string; transformedAt?: string }>;
  
  // Gamificação
  streak?: number;
  level?: number;
  totalPoints?: number;
}

export function exportPDIToPDF(data: PDIData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  
  const checkPageBreak = (neededSpace: number = 20) => {
    if (yPos > 280 - neededSpace) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addTitle = (text: string, size: number = 16) => {
    checkPageBreak(20);
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(text, margin, yPos);
    yPos += size * 0.5 + 5;
  };

  const addText = (text: string, size: number = 11, indent: number = 0) => {
    checkPageBreak(10);
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - indent);
    doc.text(lines, margin + indent, yPos);
    yPos += lines.length * 5 + 3;
  };

  const addSection = (title: string, color: number[] = [59, 130, 246]) => {
    checkPageBreak(25);
    yPos += 8;
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, yPos - 6, pageWidth - margin * 2, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPos + 1);
    doc.setTextColor(0, 0, 0);
    yPos += 12;
  };

  const addSubSection = (title: string) => {
    checkPageBreak(15);
    yPos += 3;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(title, margin, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 8;
  };

  const addListItem = (text: string, bullet: string = '•', color?: number[]) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (color) {
      doc.setTextColor(color[0], color[1], color[2]);
    } else {
      doc.setTextColor(60, 60, 60);
    }
    const lines = doc.splitTextToSize(`${bullet} ${text}`, pageWidth - margin * 2 - 10);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 2;
    doc.setTextColor(0, 0, 0);
  };

  const addKeyValue = (key: string, value: string) => {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(`${key}:`, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(value, margin + doc.getTextWidth(`${key}: `) + 2, yPos);
    yPos += 7;
  };

  // ==================== HEADER ====================
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PDI - Plano de Desenvolvimento Individual', margin, 22);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.userName}`, margin, 32);
  doc.setFontSize(9);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}`, margin, 40);
  doc.setTextColor(0, 0, 0);
  yPos = 55;

  // ==================== 1. DADOS PESSOAIS ====================
  addSection('1. Dados Pessoais', [107, 114, 128]);
  if (data.userName) addKeyValue('Nome', data.userName);
  if (data.userEmail) addKeyValue('E-mail', data.userEmail);
  if (data.userPhone) addKeyValue('Telefone', data.userPhone);
  if (data.userRole) addKeyValue('Perfil', data.userRole);
  if (data.companyName) addKeyValue('Empresa', data.companyName);

  // ==================== 2. ONBOARDING ====================
  if (data.currentPhase || data.expectations) {
    addSection('2. Ponto de Partida', [139, 92, 246]);
    if (data.currentPhase) addKeyValue('Fase atual da vida', data.currentPhase);
    if (data.expectations) {
      addSubSection('Expectativas com o PDI:');
      addText(data.expectations, 10);
    }
  }

  // ==================== 3. QUEM SOU EU ====================
  addSection('3. Quem Sou Eu', [16, 185, 129]);

  // VVD
  if (data.vvd) {
    addSubSection('Visão de Vida Desejada (VVD)');
    addText(data.vvd, 10);
  }

  // Valores
  if (data.valores && data.valores.filter(v => v).length > 0) {
    addSubSection('Meus Valores');
    const valoresAtivos = data.valores.filter(v => v);
    const valoresGrid = valoresAtivos.join('  •  ');
    addText(valoresGrid, 10);
  }

  // Áreas da Vida
  if (data.areasVida && data.areasVida.length > 0) {
    addSubSection('Áreas da Vida (Roda da Vida)');
    data.areasVida.forEach(area => {
      const gap = area.nota_desejada - area.nota_atual;
      const gapText = gap > 0 ? ` (gap: ${gap})` : '';
      addListItem(`${area.area}: ${area.nota_atual}/10 → ${area.nota_desejada}/10${gapText}`);
    });
  }

  // ==================== 4. PARA ONDE VOU ====================
  if (data.objetivos && data.objetivos.length > 0) {
    addSection('4. Para Onde Vou - Objetivos', [249, 115, 22]);
    data.objetivos.forEach((obj, idx) => {
      const texto = obj.texto || obj.objetivo || '';
      const statusIcon = obj.status === 'concluido' ? '✓' : obj.status === 'em_andamento' ? '→' : '○';
      const statusColor = obj.status === 'concluido' ? [34, 197, 94] : obj.status === 'pendente' ? [239, 68, 68] : [60, 60, 60];
      const prazo = obj.data_alvo ? ` | Prazo: ${new Date(obj.data_alvo).toLocaleDateString('pt-BR')}` : '';
      addListItem(`${texto}${prazo}`, `${idx + 1}.`, statusColor as number[]);
      if (obj.conexao_vvd) {
        addText(`   Conexão com VVD: ${obj.conexao_vvd}`, 9, 10);
      }
    });
  }

  // ==================== 5. COMO CHEGAR LÁ ====================
  addSection('5. Como Chegar Lá - Metas e Ações', [236, 72, 153]);

  // Metas e Ações
  if (data.metas && data.metas.length > 0) {
    data.metas.forEach((meta, idx) => {
      const texto = meta.texto || meta.meta || '';
      const statusIcon = meta.concluida ? '✓' : '○';
      const prazo = meta.data_alvo ? ` | Prazo: ${new Date(meta.data_alvo).toLocaleDateString('pt-BR')}` : '';
      addSubSection(`Meta ${idx + 1}: ${texto}${prazo}`);
      
      // Ações da meta
      if (meta.acoes && meta.acoes.length > 0) {
        meta.acoes.forEach(acao => {
          const acaoTexto = acao.texto || acao.acao || '';
          const acaoStatus = acao.status === 'concluido' ? '✓' : acao.status === 'em_andamento' ? '→' : '○';
          const periodicidade = acao.periodicidade ? ` [${acao.periodicidade}]` : '';
          addListItem(`${acaoTexto}${periodicidade}`, acaoStatus);
        });
      }
    });
  }

  // Competências
  if (data.competencias && data.competencias.filter(c => c).length > 0) {
    addSubSection('Competências a Desenvolver');
    data.competencias.filter(c => c).forEach(comp => addListItem(comp));
  }

  // Pontos Fortes e a Melhorar
  if (data.pontosFortes && data.pontosFortes.filter(p => p).length > 0) {
    addSubSection('Pontos Fortes');
    data.pontosFortes.filter(p => p).forEach(ponto => addListItem(ponto, '+', [34, 197, 94]));
  }
  if (data.pontosAMelhorar && data.pontosAMelhorar.filter(p => p).length > 0) {
    addSubSection('Pontos a Melhorar');
    data.pontosAMelhorar.filter(p => p).forEach(ponto => addListItem(ponto, '-', [239, 68, 68]));
  }

  // ==================== 6. ANÁLISE SWOT ====================
  if (data.swot && (data.swot.forcas?.length > 0 || data.swot.fraquezas?.length > 0 || data.swot.oportunidades?.length > 0 || data.swot.ameacas?.length > 0)) {
    addSection('6. Análise SWOT', [59, 130, 246]);
    
    if (data.swot.forcas?.length > 0) {
      addSubSection('Forças (Strengths)');
      data.swot.forcas.forEach(item => addListItem(item, '+', [34, 197, 94]));
    }
    if (data.swot.fraquezas?.length > 0) {
      addSubSection('Fraquezas (Weaknesses)');
      data.swot.fraquezas.forEach(item => addListItem(item, '-', [239, 68, 68]));
    }
    if (data.swot.oportunidades?.length > 0) {
      addSubSection('Oportunidades (Opportunities)');
      data.swot.oportunidades.forEach(item => addListItem(item, '→', [59, 130, 246]));
    }
    if (data.swot.ameacas?.length > 0) {
      addSubSection('Ameaças (Threats)');
      data.swot.ameacas.forEach(item => addListItem(item, '!', [249, 115, 22]));
    }
  }

  // ==================== 7. CRENÇAS TRANSFORMADAS ====================
  if (data.crencas && data.crencas.length > 0) {
    addSection('7. Crenças Transformadas', [139, 92, 246]);
    data.crencas.forEach((crenca, idx) => {
      addSubSection(`Transformação ${idx + 1}`);
      addText(`Crença Limitante: "${crenca.crencaLimitante}"`, 10);
      addText(`↓ Transformada em ↓`, 9, 10);
      addText(`Crença Fortalecedora: "${crenca.crencaFortalecedora}"`, 10);
      yPos += 3;
    });
  }

  // ==================== 8. GAMIFICAÇÃO ====================
  if (data.streak || data.level || data.totalPoints) {
    addSection('8. Progresso e Gamificação', [249, 115, 22]);
    if (data.level) addKeyValue('Nível', `${data.level}`);
    if (data.totalPoints) addKeyValue('Pontos Totais', `${data.totalPoints}`);
    if (data.streak) addKeyValue('Streak Atual', `${data.streak} dias`);
  }

  // Footer em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `PDI - Carreira & Vida | ${data.userName} | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`PDI_Completo_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
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
