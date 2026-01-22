import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: "diary_reminder" | "goal_deadline" | "weekly_summary" | "custom";
  userId?: string;
  email?: string;
  name?: string;
  subject?: string;
  content?: string;
  data?: Record<string, any>;
}

const generateDiaryReminderHtml = (name: string, daysInactive: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a1a; margin: 0; padding: 20px; color: #e5e5e5; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #333; }
    .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d4a853; }
    .header h1 { margin: 0; font-size: 24px; color: #d4a853; }
    .header p { margin: 10px 0 0 0; color: #888; font-size: 14px; }
    .content { padding: 30px; }
    .content p { color: #e5e5e5; line-height: 1.8; margin-bottom: 18px; font-size: 15px; }
    .content strong { color: #ffffff; }
    .highlight { background: #1a1a1a; border-left: 4px solid #d4a853; padding: 18px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .highlight p { margin: 0; color: #d4a853; }
    .section-title { font-size: 18px; font-weight: bold; color: #d4a853; margin: 25px 0 15px 0; border-bottom: 1px solid #333; padding-bottom: 8px; }
    .benefit-item { background: #111; border-radius: 8px; padding: 15px 20px; margin: 12px 0; border-left: 3px solid #d4a853; }
    .benefit-item strong { color: #d4a853; display: block; margin-bottom: 8px; }
    .benefit-item p { margin: 0; font-size: 14px; color: #ccc; }
    .graph-section { background: #111; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
    .graph-section img { max-width: 100%; border-radius: 8px; }
    .cta-section { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8943f 100%); color: #000 !important; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 168, 83, 0.3); }
    .cta-note { color: #888; font-size: 13px; margin-top: 15px; }
    .link-text { color: #d4a853; text-decoration: underline; }
    .footer { background: #0a0a0a; padding: 25px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #333; }
    .footer a { color: #d4a853; text-decoration: none; }
    .gold-text { color: #d4a853; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📔 Diário Digital Inteligente</h1>
      <p>Por que registrar seu dia transforma sua clareza, foco e bem-estar</p>
    </div>
    
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      
      <p>Percebemos que você não preenche seu diário há <strong class="gold-text">${daysInactive} dias</strong>.</p>
      
      <p>Sabemos que a rotina é corrida, mas queremos te lembrar o <strong>porquê</strong> vale a pena dedicar 5 minutos ao seu diário:</p>
      
      <div class="highlight">
        <p>Em meio à rotina acelerada, excesso de informações e múltiplas responsabilidades, muitas pessoas sentem dificuldade em organizar pensamentos, compreender emoções e perceber avanços reais na própria vida e carreira.</p>
      </div>
      
      <p>O Diário Digital Inteligente do PDI foi concebido exatamente para responder a esse desafio: oferecer um <strong>espaço estruturado de reflexão diária</strong> que favorece clareza mental, autorregulação emocional e consciência de progresso.</p>
      
      <p>Essa funcionalidade não é intuitiva ou casual. Ela se apoia em fundamentos amplamente estudados pela Psicologia, especialmente pela <strong>Psicologia Cognitivo-Comportamental</strong> e pela <strong>Psicologia Positiva</strong>.</p>
      
      <div class="section-title">🧠 Por que funciona</div>
      
      <div class="benefit-item">
        <strong>📊 Registro de Humor</strong>
        <p>Aumenta a consciência emocional, pilar da Terapia Cognitivo-Comportamental (TCC).</p>
      </div>
      
      <div class="benefit-item">
        <strong>✍️ Reflexão Escrita</strong>
        <p>Organiza a mente e reduz a ruminação, conforme estudos de escrita expressiva.</p>
      </div>
      
      <div class="benefit-item">
        <strong>🏆 Registro de Conquistas</strong>
        <p>Reforça a autoeficácia, conceito fundamental de Albert Bandura.</p>
      </div>
      
      <div class="benefit-item">
        <strong>🙏 Prática de Gratidão</strong>
        <p>Melhora o bem-estar geral, comprovado pela Psicologia Positiva.</p>
      </div>
      
      <div class="section-title">📈 Visualize sua evolução</div>
      
      <p>Além de registrar seu dia, o Diário permite que você consulte todo o seu <strong>histórico por período de até um ano</strong>, revisitando anotações, conquistas e reflexões passadas.</p>
      
      <p>E para tornar sua jornada ainda mais clara, você tem acesso a um <strong>gráfico interativo</strong> que mostra o comparativo do seu humor dia a dia, permitindo identificar padrões emocionais, momentos de maior bem-estar e períodos que merecem atenção.</p>
      
      <div class="highlight">
        <p><strong>Essa visão ampliada transforma dados em autoconhecimento — e autoconhecimento em poder de decisão.</strong></p>
      </div>
      
      <p style="text-align: center; margin-top: 25px;">
        <a href="https://www.pdicarreiraevida.com.br/leadp2" class="link-text">🔬 Clique aqui: Conheça o embasamento científico validado por trás desta ferramenta</a>
      </p>
    </div>
    
    <div class="cta-section">
      <a href="https://www.pdicarreiraevida.com.br/home" class="cta-button">ACESSAR MEU DIÁRIO AGORA</a>
      <p class="cta-note">5 minutos hoje podem transformar sua semana toda.</p>
    </div>
    
    <div class="footer">
      <p>Com carinho,</p>
      <p><strong class="gold-text">Equipe PDI - Carreira & Vida</strong></p>
      <br>
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
      <p>Se não deseja mais receber lembretes, <a href="https://www.pdicarreiraevida.com.br/perfil">acesse suas configurações</a> de notificação.</p>
    </div>
  </div>
</body>
</html>
`;

const generateGoalDeadlineHtml = (name: string, goals: any[], isExpired: boolean = false): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: ${isExpired ? 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; }
    .goal-item { background: ${isExpired ? '#fff0f0' : '#fff5f5'}; border-left: 4px solid ${isExpired ? '#ff4b2b' : '#f5576c'}; padding: 12px 15px; margin: 10px 0; border-radius: 0 8px 8px 0; }
    .goal-item strong { color: ${isExpired ? '#ff4b2b' : '#f5576c'}; }
    .expired-badge { display: inline-block; background: #ff4b2b; color: white; font-size: 10px; padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
    .cta-button { display: inline-block; background: ${isExpired ? 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isExpired ? '🚨 Prazos Vencidos!' : '⏰ Prazos Próximos!'}</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>${isExpired ? 'Você tem objetivos e metas com <strong>prazo vencido</strong>:' : 'Você tem metas com prazo se aproximando:'}</p>
      ${goals.map(g => `
        <div class="goal-item">
          <strong>${g.type === 'objetivo' ? '🎯' : '📊'} ${g.texto}</strong>${isExpired ? '<span class="expired-badge">VENCIDO</span>' : ''}<br>
          <small>Prazo: ${new Date(g.data_alvo).toLocaleDateString('pt-BR')} ${isExpired ? '(vencido)' : ''}</small>
        </div>
      `).join('')}
      <p>${isExpired ? '<strong>⚠️ Atenção:</strong> Revise esses itens e atualize seus prazos ou marque como concluídos!' : 'Não deixe para a última hora! Revise seu progresso e ajuste suas ações se necessário.'}</p>
      <center>
        <a href="https://www.pdicarreiraevida.com.br/home" class="cta-button">${isExpired ? 'Revisar meus Prazos' : 'Ver minhas Metas'}</a>
      </center>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
      <p>Se não deseja mais receber lembretes, acesse suas configurações de notificação no aplicativo.</p>
    </div>
  </div>
</body>
</html>
`;

const generateWeeklySummaryHtml = (name: string, data: any): string => {
  const progress = data.progress || { objectives: { total: 0, completed: 0 }, goals: { total: 0, completed: 0 }, actions: { total: 0, completed: 0 } };
  const moodSummary = data.moodSummary || { feliz: 0, neutro: 0, triste: 0 };
  const totalMoodEntries = data.totalMoodEntries || 0;
  const newObjectives = data.newObjectivesThisWeek || [];
  const newGoals = data.newGoalsThisWeek || [];

  // Calculate percentages
  const objPercent = progress.objectives.total > 0 ? Math.round((progress.objectives.completed / progress.objectives.total) * 100) : 0;
  const goalPercent = progress.goals.total > 0 ? Math.round((progress.goals.completed / progress.goals.total) * 100) : 0;
  const actionPercent = progress.actions.total > 0 ? Math.round((progress.actions.completed / progress.actions.total) * 100) : 0;

  // Mood percentages
  const moodFelizPercent = totalMoodEntries > 0 ? Math.round((moodSummary.feliz / totalMoodEntries) * 100) : 0;
  const moodNeutroPercent = totalMoodEntries > 0 ? Math.round((moodSummary.neutro / totalMoodEntries) * 100) : 0;
  const moodTristePercent = totalMoodEntries > 0 ? Math.round((moodSummary.triste / totalMoodEntries) * 100) : 0;

  // Mood message
  let moodMessage = '';
  if (totalMoodEntries === 0) {
    moodMessage = 'Nenhum registro de humor esta semana. Que tal começar a registrar?';
  } else if (moodFelizPercent >= 60) {
    moodMessage = '🌟 Excelente semana! Você esteve predominantemente feliz. Continue cultivando o que te faz bem!';
  } else if (moodFelizPercent >= 40) {
    moodMessage = '👍 Semana equilibrada! Bons momentos intercalados com desafios. Faz parte da jornada!';
  } else if (moodTristePercent >= 50) {
    moodMessage = '💪 Semana desafiadora. Lembre-se: dias difíceis passam. Cuide-se e busque apoio se precisar.';
  } else {
    moodMessage = '📊 Semana com variações de humor. Observe os padrões para entender o que influencia seu bem-estar.';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { color: #333; line-height: 1.6; margin-bottom: 15px; }
    .section-title { font-size: 18px; font-weight: bold; color: #11998e; margin: 25px 0 15px 0; border-bottom: 2px solid #38ef7d; padding-bottom: 8px; }
    .stat-box { display: inline-block; background: #f0fff4; border: 1px solid #38ef7d; padding: 15px 20px; margin: 5px; border-radius: 8px; text-align: center; min-width: 100px; }
    .stat-number { font-size: 28px; font-weight: bold; color: #11998e; }
    .stat-label { font-size: 12px; color: #666; }
    .progress-section { background: #f8fffe; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .progress-row { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; }
    .progress-label { font-weight: 500; color: #333; flex: 1; }
    .progress-bar-container { flex: 2; background: #e0e0e0; border-radius: 10px; height: 20px; margin: 0 15px; overflow: hidden; }
    .progress-bar { height: 100%; border-radius: 10px; transition: width 0.3s; }
    .progress-bar.objectives { background: linear-gradient(90deg, #667eea, #764ba2); }
    .progress-bar.goals { background: linear-gradient(90deg, #f093fb, #f5576c); }
    .progress-bar.actions { background: linear-gradient(90deg, #11998e, #38ef7d); }
    .progress-value { font-weight: bold; color: #333; min-width: 80px; text-align: right; }
    .mood-section { background: #fff9f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .mood-bar-container { display: flex; height: 30px; border-radius: 8px; overflow: hidden; margin: 15px 0; }
    .mood-bar { display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; }
    .mood-feliz { background: #4ade80; }
    .mood-neutro { background: #facc15; }
    .mood-triste { background: #f87171; }
    .mood-legend { display: flex; justify-content: center; gap: 20px; margin-top: 10px; }
    .mood-legend-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #666; }
    .mood-dot { width: 12px; height: 12px; border-radius: 50%; }
    .mood-message { background: #fffbeb; border-left: 4px solid #facc15; padding: 12px 15px; margin: 15px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #666; }
    .new-items-section { background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .new-item { background: white; border-left: 4px solid #667eea; padding: 10px 15px; margin: 8px 0; border-radius: 0 8px 8px 0; }
    .new-item strong { color: #667eea; }
    .new-item small { color: #888; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 12px; }
    .streak-badge { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; margin: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Resumo Semanal</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Semana de ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} a ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Aqui está o resumo completo da sua semana no PDI - Carreira & Vida:</p>
      
      <!-- Resumo Rápido -->
      <center>
        <div class="stat-box">
          <div class="stat-number">${data.diaryEntries || 0}</div>
          <div class="stat-label">Dias registrados</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${data.actionsCompletedThisWeek || 0}</div>
          <div class="stat-label">Ações concluídas</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${data.currentStreak || 0}</div>
          <div class="stat-label">Dias de streak</div>
        </div>
      </center>

      ${data.currentStreak >= 7 ? `
      <center style="margin-top: 15px;">
        <span class="streak-badge">🔥 ${data.currentStreak} dias consecutivos!</span>
        ${data.longestStreak > data.currentStreak ? `<span class="streak-badge">🏆 Recorde: ${data.longestStreak} dias</span>` : ''}
      </center>
      ` : ''}

      <!-- Seu Progresso -->
      <div class="section-title">📈 Seu Progresso</div>
      <div class="progress-section">
        <div class="progress-row">
          <span class="progress-label">🎯 Objetivos</span>
          <div class="progress-bar-container">
            <div class="progress-bar objectives" style="width: ${objPercent}%"></div>
          </div>
          <span class="progress-value">${progress.objectives.completed}/${progress.objectives.total} (${objPercent}%)</span>
        </div>
        <div class="progress-row">
          <span class="progress-label">📊 Metas</span>
          <div class="progress-bar-container">
            <div class="progress-bar goals" style="width: ${goalPercent}%"></div>
          </div>
          <span class="progress-value">${progress.goals.completed}/${progress.goals.total} (${goalPercent}%)</span>
        </div>
        <div class="progress-row">
          <span class="progress-label">⚡ Ações</span>
          <div class="progress-bar-container">
            <div class="progress-bar actions" style="width: ${actionPercent}%"></div>
          </div>
          <span class="progress-value">${progress.actions.completed}/${progress.actions.total} (${actionPercent}%)</span>
        </div>
      </div>

      <!-- Resumo de Humor -->
      <div class="section-title">😊 Resumo de Humor da Semana</div>
      <div class="mood-section">
        ${totalMoodEntries > 0 ? `
        <div class="mood-bar-container">
          ${moodFelizPercent > 0 ? `<div class="mood-bar mood-feliz" style="width: ${moodFelizPercent}%">${moodFelizPercent}%</div>` : ''}
          ${moodNeutroPercent > 0 ? `<div class="mood-bar mood-neutro" style="width: ${moodNeutroPercent}%">${moodNeutroPercent}%</div>` : ''}
          ${moodTristePercent > 0 ? `<div class="mood-bar mood-triste" style="width: ${moodTristePercent}%">${moodTristePercent}%</div>` : ''}
        </div>
        <div class="mood-legend">
          <div class="mood-legend-item"><div class="mood-dot" style="background: #4ade80;"></div> Feliz (${moodSummary.feliz})</div>
          <div class="mood-legend-item"><div class="mood-dot" style="background: #facc15;"></div> Neutro (${moodSummary.neutro})</div>
          <div class="mood-legend-item"><div class="mood-dot" style="background: #f87171;"></div> Triste (${moodSummary.triste})</div>
        </div>
        ` : '<p style="text-align: center; color: #888;">Nenhum registro de humor esta semana</p>'}
        <div class="mood-message">${moodMessage}</div>
      </div>

      <!-- Novos Cadastros da Semana -->
      ${(newObjectives.length > 0 || newGoals.length > 0) ? `
      <div class="section-title">✨ Novos Cadastros da Semana</div>
      <div class="new-items-section">
        ${newObjectives.length > 0 ? `
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #667eea;">🎯 Novos Objetivos (${newObjectives.length})</p>
        ${newObjectives.map((o: any) => `
          <div class="new-item">
            <strong>${o.texto}</strong><br>
            <small>Prazo: ${o.data_alvo ? new Date(o.data_alvo).toLocaleDateString('pt-BR') : 'Não definido'}</small>
          </div>
        `).join('')}
        ` : ''}
        ${newGoals.length > 0 ? `
        <p style="margin: ${newObjectives.length > 0 ? '20px' : '0'} 0 10px 0; font-weight: bold; color: #f5576c;">📊 Novas Metas (${newGoals.length})</p>
        ${newGoals.map((g: any) => `
          <div class="new-item" style="border-color: #f5576c;">
            <strong style="color: #f5576c;">${g.texto}</strong><br>
            <small>Prazo: ${g.data_alvo ? new Date(g.data_alvo).toLocaleDateString('pt-BR') : 'Não definido'}</small>
          </div>
        `).join('')}
        ` : ''}
      </div>
      ` : ''}

      <!-- Mensagem Motivacional -->
      <div style="background: linear-gradient(135deg, #f0fff4 0%, #f0f7ff 100%); border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #333;">
          ${progress.actions.completed > 0 ? '🎉 Parabéns pelas ações concluídas! Cada passo conta para alcançar seus objetivos.' : '💡 Que tal começar a semana definindo pequenas ações para seus objetivos?'}
        </p>
      </div>

      <center>
        <a href="https://www.pdicarreiraevida.com.br/home" class="cta-button">Ver meu Progresso Completo</a>
      </center>
    </div>
    <div class="footer">
      <p>Este email foi enviado automaticamente pelo PDI - Carreira & Vida.</p>
      <p>Nível ${data.level || 1} • ${data.totalPoints || 0} pontos acumulados</p>
    </div>
  </div>
</body>
</html>
`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, email, name, subject, content, data }: NotificationEmailRequest = await req.json();

    console.log(`Processing ${type} notification for ${email || userId}`);

    let finalEmail = email;
    let finalName = name || "Usuário";
    let finalSubject = subject;
    let htmlContent = content;

    // If userId is provided, fetch user details from Supabase
    if (userId && !email) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
      if (error || !userData?.user?.email) {
        console.error("Error fetching user:", error);
        throw new Error("User not found");
      }
      finalEmail = userData.user.email;
      finalName = userData.user.user_metadata?.name || "Usuário";
    }

    if (!finalEmail) {
      throw new Error("Email is required");
    }

    // Generate email content based on type
    switch (type) {
      case "diary_reminder":
        finalSubject = finalSubject || "📔 Não esqueça do seu diário!";
        htmlContent = generateDiaryReminderHtml(finalName, data?.daysInactive || 3);
        break;
      case "goal_deadline":
        const isExpired = data?.isExpired || false;
        finalSubject = finalSubject || (isExpired ? "🚨 Você tem objetivos e metas vencidos!" : "⏰ Você tem metas com prazo próximo!");
        htmlContent = generateGoalDeadlineHtml(finalName, data?.goals || [], isExpired);
        break;
      case "weekly_summary":
        finalSubject = finalSubject || "📊 Seu resumo semanal do PDI";
        htmlContent = generateWeeklySummaryHtml(finalName, data || {});
        break;
      case "custom":
        if (!htmlContent) {
          htmlContent = `<p>${content}</p>`;
        }
        break;
    }

    // Send email using Resend API directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PDI - Carreira & Vida <notificacoes@pdicarreiraevida.com.br>",
        to: [finalEmail],
        subject: finalSubject || "Notificação do PDI",
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
