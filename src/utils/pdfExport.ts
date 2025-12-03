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
  
  // Para onde vou - Objetivos com suas Metas e Ações
  objetivos: Array<{
    id?: string;
    texto?: string;
    objetivo?: string;
    status: string;
    data_alvo?: string;
    conexao_vvd?: string;
  }>;
  
  // Como chegar lá - Metas vinculadas aos objetivos
  metas: Array<{
    id?: string;
    texto?: string;
    meta?: string;
    concluida: boolean;
    status?: string;
    data_alvo?: string;
    objetivo_id?: string;
    acoes?: Array<{
      id?: string;
      texto?: string;
      acao?: string;
      status: string;
      periodicidade?: string;
      passos?: Array<{
        texto?: string;
        concluido?: boolean;
      }>;
    }>;
  }>;
  
  // Competências e Pontos
  competencias?: string[];
  pontosFortes?: string[];
  pontosAMelhorar?: string[];
  
  // Ferramentas
  swot?: { forcas: string[]; fraquezas: string[]; oportunidades: string[]; ameacas: string[] };
  crencas?: Array<{ crencaLimitante: string; crencaFortalecedora: string; transformedAt?: string }>;
  eisenhower?: { urgente_importante: string[]; nao_urgente_importante: string[]; urgente_nao_importante: string[]; nao_urgente_nao_importante: string[] };
  
  // Insights
  insight?: string;
  insightDate?: string;
  
  // Diário e Humor
  moodHistory?: Array<{ date: string; mood: string; reflexao?: string; gratidao?: string; conquistas?: string }>;
  diaryStats?: { total: number; feliz: number; neutro: number; triste: number };
  
  // Gamificação
  streak?: number;
  longestStreak?: number;
  level?: number;
  totalPoints?: number;
  achievements?: Array<{ name: string; unlockedAt?: string }>;
}

// Helper functions for PDF generation
class PDFHelper {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  yPos: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.yPos = 20;
  }

  checkPageBreak(neededSpace: number = 20) {
    if (this.yPos > this.pageHeight - neededSpace - 15) {
      this.doc.addPage();
      this.yPos = 20;
    }
  }

  addHeader(title: string, subtitle: string, date: string, color: number[] = [37, 99, 235]) {
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.rect(0, 0, this.pageWidth, 42, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 18);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(subtitle, this.margin, 28);
    this.doc.setFontSize(9);
    this.doc.text(date, this.margin, 37);
    this.doc.setTextColor(0, 0, 0);
    this.yPos = 52;
  }

  addSection(title: string, color: number[] = [59, 130, 246]) {
    this.checkPageBreak(25);
    this.yPos += 6;
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(this.margin, this.yPos - 5, this.pageWidth - this.margin * 2, 9, 2, 2, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin + 4, this.yPos + 1);
    this.doc.setTextColor(0, 0, 0);
    this.yPos += 12;
  }

  addSubSection(title: string, color: number[] = [107, 114, 128]) {
    this.checkPageBreak(15);
    this.yPos += 2;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(color[0], color[1], color[2]);
    this.doc.text(title, this.margin, this.yPos);
    this.doc.setTextColor(0, 0, 0);
    this.yPos += 6;
  }

  addText(text: string, size: number = 10, indent: number = 0, bold: boolean = false) {
    this.checkPageBreak(10);
    this.doc.setFontSize(size);
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
    this.doc.setTextColor(50, 50, 50);
    const lines = this.doc.splitTextToSize(text, this.pageWidth - this.margin * 2 - indent);
    this.doc.text(lines, this.margin + indent, this.yPos);
    this.yPos += lines.length * (size * 0.4) + 3;
  }

  addKeyValue(key: string, value: string, keyWidth: number = 35) {
    this.checkPageBreak(8);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`${key}:`, this.margin, this.yPos);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(40, 40, 40);
    const valueLines = this.doc.splitTextToSize(value, this.pageWidth - this.margin * 2 - keyWidth);
    this.doc.text(valueLines, this.margin + keyWidth, this.yPos);
    this.yPos += Math.max(valueLines.length * 4, 5) + 1;
  }

  addListItem(text: string, bullet: string = '•', color?: number[], indent: number = 5) {
    this.checkPageBreak(8);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    if (color) {
      this.doc.setTextColor(color[0], color[1], color[2]);
    } else {
      this.doc.setTextColor(60, 60, 60);
    }
    const lines = this.doc.splitTextToSize(`${bullet} ${text}`, this.pageWidth - this.margin * 2 - indent - 5);
    this.doc.text(lines, this.margin + indent, this.yPos);
    this.yPos += lines.length * 4 + 1;
    this.doc.setTextColor(0, 0, 0);
  }

  addStatusBadge(status: string, x: number, y: number): string {
    const statusMap: Record<string, { text: string; color: number[] }> = {
      'concluido': { text: '✓ Concluído', color: [34, 197, 94] },
      'em_andamento': { text: '→ Em Andamento', color: [59, 130, 246] },
      'pendente': { text: '○ Pendente', color: [239, 68, 68] },
      'a_fazer': { text: '○ A Fazer', color: [249, 115, 22] },
    };
    return statusMap[status]?.text || status;
  }

  addProgressBar(label: string, current: number, total: number, color: number[] = [34, 197, 94]) {
    this.checkPageBreak(15);
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const barWidth = this.pageWidth - this.margin * 2 - 50;
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(label, this.margin, this.yPos);
    this.doc.text(`${current}/${total} (${percentage}%)`, this.pageWidth - this.margin - 35, this.yPos);
    this.yPos += 4;
    
    // Background bar
    this.doc.setFillColor(229, 231, 235);
    this.doc.roundedRect(this.margin, this.yPos, barWidth, 5, 1, 1, 'F');
    
    // Progress bar
    if (percentage > 0) {
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(this.margin, this.yPos, barWidth * (percentage / 100), 5, 1, 1, 'F');
    }
    this.yPos += 10;
  }

  addMiniChart(data: Array<{ label: string; value: number; maxValue: number }>, title: string) {
    this.checkPageBreak(data.length * 8 + 15);
    this.addSubSection(title, [59, 130, 246]);
    
    data.forEach(item => {
      const barWidth = 80;
      const percentage = item.maxValue > 0 ? (item.value / item.maxValue) : 0;
      
      this.doc.setFontSize(8);
      this.doc.setTextColor(80, 80, 80);
      const labelWidth = 60;
      const truncatedLabel = item.label.length > 20 ? item.label.substring(0, 18) + '...' : item.label;
      this.doc.text(truncatedLabel, this.margin, this.yPos);
      
      // Bar background
      this.doc.setFillColor(229, 231, 235);
      this.doc.roundedRect(this.margin + labelWidth, this.yPos - 3, barWidth, 4, 1, 1, 'F');
      
      // Bar fill
      const hue = percentage * 120; // 0 = red, 120 = green
      this.doc.setFillColor(
        percentage < 0.5 ? 239 : Math.round(239 - (percentage - 0.5) * 2 * (239 - 34)),
        percentage > 0.3 ? Math.round(68 + percentage * (197 - 68)) : 68,
        94
      );
      this.doc.roundedRect(this.margin + labelWidth, this.yPos - 3, barWidth * percentage, 4, 1, 1, 'F');
      
      // Value
      this.doc.text(`${item.value}/${item.maxValue}`, this.margin + labelWidth + barWidth + 3, this.yPos);
      this.yPos += 6;
    });
    this.yPos += 3;
  }

  addMoodChart(stats: { feliz: number; neutro: number; triste: number; total: number }) {
    this.checkPageBreak(30);
    const chartWidth = 100;
    const startX = this.margin;
    
    const total = stats.total || 1;
    const felizWidth = (stats.feliz / total) * chartWidth;
    const neutroWidth = (stats.neutro / total) * chartWidth;
    const tristeWidth = (stats.triste / total) * chartWidth;
    
    // Feliz (green)
    if (felizWidth > 0) {
      this.doc.setFillColor(34, 197, 94);
      this.doc.roundedRect(startX, this.yPos, felizWidth, 12, 2, 2, 'F');
    }
    
    // Neutro (yellow)
    if (neutroWidth > 0) {
      this.doc.setFillColor(250, 204, 21);
      this.doc.rect(startX + felizWidth, this.yPos, neutroWidth, 12, 'F');
    }
    
    // Triste (red)
    if (tristeWidth > 0) {
      this.doc.setFillColor(239, 68, 68);
      this.doc.roundedRect(startX + felizWidth + neutroWidth, this.yPos, tristeWidth, 12, 2, 2, 'F');
    }
    
    this.yPos += 16;
    
    // Legend
    this.doc.setFontSize(8);
    this.doc.setFillColor(34, 197, 94);
    this.doc.circle(this.margin + 2, this.yPos, 2, 'F');
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(`Feliz: ${stats.feliz} (${Math.round((stats.feliz / total) * 100)}%)`, this.margin + 6, this.yPos + 1);
    
    this.doc.setFillColor(250, 204, 21);
    this.doc.circle(this.margin + 52, this.yPos, 2, 'F');
    this.doc.text(`Neutro: ${stats.neutro} (${Math.round((stats.neutro / total) * 100)}%)`, this.margin + 56, this.yPos + 1);
    
    this.doc.setFillColor(239, 68, 68);
    this.doc.circle(this.margin + 107, this.yPos, 2, 'F');
    this.doc.text(`Triste: ${stats.triste} (${Math.round((stats.triste / total) * 100)}%)`, this.margin + 111, this.yPos + 1);
    
    this.yPos += 8;
  }

  addSWOTGrid(swot: { forcas: string[]; fraquezas: string[]; oportunidades: string[]; ameacas: string[] }) {
    this.checkPageBreak(60);
    const cellWidth = (this.pageWidth - this.margin * 2 - 5) / 2;
    const cellHeight = 40;
    const startX = this.margin;
    const startY = this.yPos;
    
    // Forças (top-left)
    this.doc.setFillColor(220, 252, 231);
    this.doc.roundedRect(startX, startY, cellWidth, cellHeight, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(21, 128, 61);
    this.doc.text('FORÇAS', startX + 3, startY + 6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    swot.forcas?.slice(0, 4).forEach((item, i) => {
      const truncated = item.length > 35 ? item.substring(0, 33) + '...' : item;
      this.doc.text(`• ${truncated}`, startX + 3, startY + 12 + i * 6);
    });
    
    // Fraquezas (top-right)
    this.doc.setFillColor(254, 226, 226);
    this.doc.roundedRect(startX + cellWidth + 5, startY, cellWidth, cellHeight, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(185, 28, 28);
    this.doc.text('FRAQUEZAS', startX + cellWidth + 8, startY + 6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    swot.fraquezas?.slice(0, 4).forEach((item, i) => {
      const truncated = item.length > 35 ? item.substring(0, 33) + '...' : item;
      this.doc.text(`• ${truncated}`, startX + cellWidth + 8, startY + 12 + i * 6);
    });
    
    // Oportunidades (bottom-left)
    this.doc.setFillColor(219, 234, 254);
    this.doc.roundedRect(startX, startY + cellHeight + 3, cellWidth, cellHeight, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(29, 78, 216);
    this.doc.text('OPORTUNIDADES', startX + 3, startY + cellHeight + 9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    swot.oportunidades?.slice(0, 4).forEach((item, i) => {
      const truncated = item.length > 35 ? item.substring(0, 33) + '...' : item;
      this.doc.text(`• ${truncated}`, startX + 3, startY + cellHeight + 15 + i * 6);
    });
    
    // Ameaças (bottom-right)
    this.doc.setFillColor(254, 243, 199);
    this.doc.roundedRect(startX + cellWidth + 5, startY + cellHeight + 3, cellWidth, cellHeight, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(180, 83, 9);
    this.doc.text('AMEAÇAS', startX + cellWidth + 8, startY + cellHeight + 9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    swot.ameacas?.slice(0, 4).forEach((item, i) => {
      const truncated = item.length > 35 ? item.substring(0, 33) + '...' : item;
      this.doc.text(`• ${truncated}`, startX + cellWidth + 8, startY + cellHeight + 15 + i * 6);
    });
    
    this.yPos = startY + cellHeight * 2 + 10;
  }

  addFooter(userName: string) {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(7);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        `PDI - Carreira & Vida | ${userName} | Página ${i} de ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: 'center' }
      );
    }
  }
}

export function exportPDIToPDF(data: PDIData): void {
  const pdf = new PDFHelper();
  
  // ==================== HEADER ====================
  pdf.addHeader(
    'PDI - Plano de Desenvolvimento Individual',
    data.userName,
    `Gerado em ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}`
  );

  // ==================== 1. DADOS PESSOAIS ====================
  pdf.addSection('1. DADOS PESSOAIS', [107, 114, 128]);
  if (data.userName) pdf.addKeyValue('Nome', data.userName);
  if (data.userEmail) pdf.addKeyValue('E-mail', data.userEmail);
  if (data.userPhone) pdf.addKeyValue('Telefone', data.userPhone);
  if (data.userRole) pdf.addKeyValue('Perfil', data.userRole);
  if (data.companyName) pdf.addKeyValue('Empresa', data.companyName);

  // ==================== 2. PONTO DE PARTIDA ====================
  if (data.currentPhase || data.expectations) {
    pdf.addSection('2. PONTO DE PARTIDA (Onboarding)', [139, 92, 246]);
    if (data.currentPhase) pdf.addKeyValue('Fase atual da vida', data.currentPhase);
    if (data.expectations) {
      pdf.addSubSection('Minhas expectativas com o PDI:');
      pdf.addText(data.expectations, 9, 5);
    }
  }

  // ==================== 3. QUEM SOU EU ====================
  pdf.addSection('3. QUEM SOU EU', [16, 185, 129]);

  // VVD
  if (data.vvd) {
    pdf.addSubSection('📍 Visão de Vida Desejada (VVD)', [16, 185, 129]);
    pdf.addText(data.vvd, 9, 5);
  }

  // Valores
  if (data.valores && data.valores.filter(v => v).length > 0) {
    pdf.addSubSection('💎 Meus Valores Fundamentais', [16, 185, 129]);
    const valoresAtivos = data.valores.filter(v => v);
    valoresAtivos.forEach((valor, idx) => {
      pdf.addListItem(valor, `${idx + 1}.`);
    });
  }

  // Áreas da Vida - Mini Chart
  if (data.areasVida && data.areasVida.length > 0) {
    pdf.addMiniChart(
      data.areasVida.map(area => ({
        label: area.area,
        value: area.nota_atual,
        maxValue: 10
      })),
      '🎯 Roda da Vida - Estado Atual'
    );
    
    // Gap analysis
    pdf.addSubSection('📊 Análise de Gaps (Atual → Desejado)', [107, 114, 128]);
    const sortedByGap = [...data.areasVida].sort((a, b) => (b.nota_desejada - b.nota_atual) - (a.nota_desejada - a.nota_atual));
    sortedByGap.slice(0, 5).forEach(area => {
      const gap = area.nota_desejada - area.nota_atual;
      if (gap > 0) {
        pdf.addListItem(`${area.area}: ${area.nota_atual} → ${area.nota_desejada} (gap: ${gap})`, '↑', [249, 115, 22]);
      }
    });
  }

  // ==================== 4. ANÁLISE SWOT ====================
  if (data.swot && (data.swot.forcas?.length > 0 || data.swot.fraquezas?.length > 0)) {
    pdf.addSection('4. ANÁLISE SWOT', [59, 130, 246]);
    pdf.addSWOTGrid(data.swot);
  }

  // ==================== 5. JORNADA: VVD → OBJETIVO → META → AÇÃO ====================
  pdf.addSection('5. JORNADA DE DESENVOLVIMENTO', [249, 115, 22]);
  
  if (data.vvd) {
    pdf.addSubSection('🎯 VVD (Ponto de Chegada)', [249, 115, 22]);
    const vvdTruncated = data.vvd.length > 200 ? data.vvd.substring(0, 197) + '...' : data.vvd;
    pdf.addText(`"${vvdTruncated}"`, 9, 5);
    pdf.yPos += 3;
  }

  // Para cada objetivo, listar suas metas e ações
  if (data.objetivos && data.objetivos.length > 0) {
    data.objetivos.forEach((objetivo, objIdx) => {
      const objTexto = objetivo.texto || objetivo.objetivo || '';
      const objStatus = objetivo.status === 'concluido' ? '✓' : objetivo.status === 'em_andamento' ? '→' : '○';
      const prazo = objetivo.data_alvo ? new Date(objetivo.data_alvo).toLocaleDateString('pt-BR') : '';
      
      pdf.checkPageBreak(30);
      pdf.addSubSection(`📌 Objetivo ${objIdx + 1}: ${objTexto}`, [249, 115, 22]);
      pdf.addText(`Status: ${pdf.addStatusBadge(objetivo.status, 0, 0)} ${prazo ? `| Prazo: ${prazo}` : ''}`, 8, 5);
      if (objetivo.conexao_vvd) {
        pdf.addText(`Conexão VVD: ${objetivo.conexao_vvd}`, 8, 5);
      }
      
      // Metas vinculadas a este objetivo
      const metasDoObjetivo = data.metas?.filter(m => m.objetivo_id === objetivo.id) || [];
      
      if (metasDoObjetivo.length > 0) {
        metasDoObjetivo.forEach((meta, metaIdx) => {
          const metaTexto = meta.texto || meta.meta || '';
          const metaStatus = meta.concluida ? '✓' : (meta.status === 'em_andamento' ? '→' : '○');
          const metaPrazo = meta.data_alvo ? new Date(meta.data_alvo).toLocaleDateString('pt-BR') : '';
          
          pdf.checkPageBreak(20);
          pdf.addText(`   └─ Meta ${metaIdx + 1}: ${metaTexto}`, 9, 10, true);
          pdf.addText(`      Status: ${metaStatus} ${meta.concluida ? 'Concluída' : 'Pendente'} ${metaPrazo ? `| Prazo: ${metaPrazo}` : ''}`, 8, 15);
          
          // Ações da meta
          if (meta.acoes && meta.acoes.length > 0) {
            meta.acoes.forEach((acao, acaoIdx) => {
              const acaoTexto = acao.texto || acao.acao || '';
              const acaoStatus = acao.status === 'concluido' ? '✓' : '○';
              const periodicidade = acao.periodicidade || '';
              
              pdf.addListItem(
                `${acaoTexto} ${periodicidade ? `[${periodicidade}]` : ''}`,
                `      ${acaoStatus}`,
                acao.status === 'concluido' ? [34, 197, 94] : [107, 114, 128],
                20
              );
              
              // Passos da ação
              if (acao.passos && acao.passos.length > 0) {
                acao.passos.forEach((passo, passoIdx) => {
                  const passoTexto = passo.texto || '';
                  const passoStatus = passo.concluido ? '✓' : '○';
                  pdf.addListItem(passoTexto, `         ${passoStatus}`, [150, 150, 150], 30);
                });
              }
            });
          }
        });
      } else {
        pdf.addText('   Nenhuma meta vinculada a este objetivo ainda.', 8, 10);
      }
      pdf.yPos += 3;
    });
  }

  // Metas sem objetivo vinculado
  const metasSemObjetivo = data.metas?.filter(m => !m.objetivo_id) || [];
  if (metasSemObjetivo.length > 0) {
    pdf.addSubSection('📋 Metas Avulsas (sem objetivo vinculado)', [107, 114, 128]);
    metasSemObjetivo.forEach((meta, idx) => {
      const metaTexto = meta.texto || meta.meta || '';
      pdf.addListItem(`${metaTexto}`, `${idx + 1}.`);
    });
  }

  // ==================== 6. COMPETÊNCIAS E DESENVOLVIMENTO ====================
  if ((data.competencias && data.competencias.filter(c => c).length > 0) ||
      (data.pontosFortes && data.pontosFortes.filter(p => p).length > 0) ||
      (data.pontosAMelhorar && data.pontosAMelhorar.filter(p => p).length > 0)) {
    pdf.addSection('6. COMPETÊNCIAS E AUTOCONHECIMENTO', [139, 92, 246]);
    
    if (data.competencias && data.competencias.filter(c => c).length > 0) {
      pdf.addSubSection('🎓 Competências a Desenvolver');
      data.competencias.filter(c => c).forEach(comp => pdf.addListItem(comp, '→'));
    }
    
    if (data.pontosFortes && data.pontosFortes.filter(p => p).length > 0) {
      pdf.addSubSection('💪 Pontos Fortes');
      data.pontosFortes.filter(p => p).forEach(ponto => pdf.addListItem(ponto, '+', [34, 197, 94]));
    }
    
    if (data.pontosAMelhorar && data.pontosAMelhorar.filter(p => p).length > 0) {
      pdf.addSubSection('🔧 Pontos a Melhorar');
      data.pontosAMelhorar.filter(p => p).forEach(ponto => pdf.addListItem(ponto, '-', [239, 68, 68]));
    }
  }

  // ==================== 7. CRENÇAS TRANSFORMADAS ====================
  if (data.crencas && data.crencas.length > 0) {
    pdf.addSection('7. CRENÇAS TRANSFORMADAS', [236, 72, 153]);
    data.crencas.forEach((crenca, idx) => {
      pdf.checkPageBreak(25);
      pdf.addSubSection(`Transformação ${idx + 1}`);
      pdf.addText(`❌ Limitante: "${crenca.crencaLimitante}"`, 9, 5);
      pdf.addText(`↓`, 9, 15);
      pdf.addText(`✓ Fortalecedora: "${crenca.crencaFortalecedora}"`, 9, 5);
      pdf.yPos += 3;
    });
  }

  // ==================== 8. INSIGHT GERADO ====================
  if (data.insight) {
    pdf.addSection('8. INSIGHT GERADO POR IA', [59, 130, 246]);
    if (data.insightDate) {
      pdf.addText(`Gerado em: ${new Date(data.insightDate).toLocaleDateString('pt-BR')}`, 8);
    }
    pdf.addText(data.insight, 9, 5);
  }

  // ==================== 9. HISTÓRICO DE HUMOR ====================
  if (data.diaryStats && data.diaryStats.total > 0) {
    pdf.addSection('9. HISTÓRICO DE HUMOR', [250, 204, 21]);
    pdf.addText(`Total de registros no diário: ${data.diaryStats.total} dias`, 9);
    pdf.yPos += 3;
    pdf.addMoodChart(data.diaryStats);
    
    // Últimas reflexões
    if (data.moodHistory && data.moodHistory.length > 0) {
      pdf.addSubSection('📝 Últimas Reflexões');
      data.moodHistory.slice(0, 5).forEach(entry => {
        const moodEmoji = entry.mood === 'feliz' ? '😊' : entry.mood === 'neutro' ? '😐' : '😔';
        pdf.addListItem(`${new Date(entry.date).toLocaleDateString('pt-BR')} ${moodEmoji}: ${entry.reflexao?.substring(0, 100) || 'Sem reflexão'}...`, '');
      });
    }
  }

  // ==================== 10. GAMIFICAÇÃO ====================
  if (data.level || data.totalPoints || data.streak) {
    pdf.addSection('10. PROGRESSO E CONQUISTAS', [249, 115, 22]);
    
    const statsLine = [];
    if (data.level) statsLine.push(`Nível ${data.level}`);
    if (data.totalPoints) statsLine.push(`${data.totalPoints} pontos`);
    if (data.streak) statsLine.push(`${data.streak} dias de streak`);
    if (data.longestStreak) statsLine.push(`Maior streak: ${data.longestStreak} dias`);
    
    pdf.addText(statsLine.join(' | '), 10);
    
    if (data.achievements && data.achievements.length > 0) {
      pdf.addSubSection('🏆 Conquistas Desbloqueadas');
      data.achievements.slice(0, 10).forEach(ach => {
        pdf.addListItem(ach.name, '🏅');
      });
    }
  }

  // Footer
  pdf.addFooter(data.userName);

  pdf.doc.save(`PDI_Completo_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
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
    longestStreak?: number;
    level?: number;
    totalPoints?: number;
  },
  moodStats?: { feliz: number; neutro: number; triste: number; total: number },
  recentMoods?: Array<{ date: string; mood: string; reflexao?: string }>,
  insight?: string
): void {
  const pdf = new PDFHelper();
  
  // Header
  pdf.addHeader(
    'Relatório de Progresso',
    `${userName} | Período: ${period}`,
    new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' }),
    [34, 197, 94]
  );

  // ==================== RESUMO EXECUTIVO ====================
  pdf.addSection('RESUMO EXECUTIVO', [34, 197, 94]);
  
  const taxaObjetivos = stats.objetivosTotal > 0 ? Math.round((stats.objetivosConcluidos / stats.objetivosTotal) * 100) : 0;
  const taxaMetas = stats.metasTotal > 0 ? Math.round((stats.metasConcluidas / stats.metasTotal) * 100) : 0;
  const taxaAcoes = stats.acoesTotal > 0 ? Math.round((stats.acoesConcluidas / stats.acoesTotal) * 100) : 0;
  const mediaGeral = Math.round((taxaObjetivos + taxaMetas + taxaAcoes) / 3);
  
  pdf.addText(`Taxa de Conclusão Geral: ${mediaGeral}%`, 12, 0, true);
  pdf.yPos += 5;

  // ==================== PROGRESSO POR CATEGORIA ====================
  pdf.addSection('PROGRESSO POR CATEGORIA', [59, 130, 246]);
  
  pdf.addProgressBar('Objetivos', stats.objetivosConcluidos, stats.objetivosTotal, [59, 130, 246]);
  pdf.addProgressBar('Metas', stats.metasConcluidas, stats.metasTotal, [16, 185, 129]);
  pdf.addProgressBar('Ações', stats.acoesConcluidas, stats.acoesTotal, [139, 92, 246]);

  // ==================== ENGAJAMENTO ====================
  pdf.addSection('ENGAJAMENTO E CONSISTÊNCIA', [249, 115, 22]);
  
  pdf.addKeyValue('Dias de Diário', `${stats.diasDiario} registros`);
  pdf.addKeyValue('Streak Atual', `${stats.streak} dias consecutivos`);
  if (stats.longestStreak) pdf.addKeyValue('Maior Streak', `${stats.longestStreak} dias`);
  if (stats.level) pdf.addKeyValue('Nível', `${stats.level}`);
  if (stats.totalPoints) pdf.addKeyValue('Pontos Totais', `${stats.totalPoints}`);

  // ==================== HISTÓRICO DE HUMOR ====================
  if (moodStats && moodStats.total > 0) {
    pdf.addSection('HISTÓRICO DE HUMOR', [250, 204, 21]);
    pdf.addMoodChart(moodStats);
    
    if (recentMoods && recentMoods.length > 0) {
      pdf.addSubSection('Últimos Registros');
      recentMoods.slice(0, 7).forEach(entry => {
        const moodEmoji = entry.mood === 'feliz' ? '😊' : entry.mood === 'neutro' ? '😐' : '😔';
        const dateStr = new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        pdf.addListItem(`${dateStr} ${moodEmoji}`, '');
      });
    }
  }

  // ==================== INSIGHT ====================
  if (insight) {
    pdf.addSection('INSIGHT PERSONALIZADO', [139, 92, 246]);
    pdf.addText(insight, 9, 5);
  }

  // ==================== RECOMENDAÇÕES ====================
  pdf.addSection('RECOMENDAÇÕES', [107, 114, 128]);
  
  const recommendations: string[] = [];
  
  if (taxaObjetivos < 50) {
    recommendations.push('Revise seus objetivos: considere dividir objetivos grandes em metas menores e mais alcançáveis.');
  }
  if (taxaMetas < 50) {
    recommendations.push('Foque nas metas: estabeleça prazos realistas e crie ações diárias para cada meta.');
  }
  if (stats.streak < 7) {
    recommendations.push('Aumente a consistência: tente registrar no diário todos os dias para criar o hábito.');
  }
  if (moodStats && moodStats.triste > moodStats.feliz) {
    recommendations.push('Atenção ao bem-estar: seus registros indicam muitos dias difíceis. Considere revisar sua rotina.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Excelente progresso! Continue mantendo a consistência e celebre suas conquistas.');
  }
  
  recommendations.forEach(rec => pdf.addListItem(rec, '💡'));

  // Footer
  pdf.addFooter(userName);

  pdf.doc.save(`Relatorio_Progresso_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
