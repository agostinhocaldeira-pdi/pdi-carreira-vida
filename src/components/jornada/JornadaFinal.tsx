import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Crown, Star, ArrowLeft, Flame, ExternalLink, Play, Check, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import JornadaUpgradeModal from "@/components/jornada/JornadaUpgradeModal";
interface SmartData {
  especifica: string;
  mensuravel: string;
  alcancavel: string;
  relevante: string;
  temporal: string;
  aprender: string;
  sabotador: string;
  antiSabotagem: string;
  primeiraAcao: string;
  diaHora: string;
  smartEvaluation?: string;
}

interface Props {
  onBack: () => void;
  smartActionData?: SmartData | null;
  vvdAnswers?: string[];
  vidaNaoQueroAnswers?: string[];
  autoReflexaoData?: {
    valores: string[];
    rodaScores: Record<string, number>;
    crencas: string[];
  } | null;
}

export default function JornadaFinal({ onBack, smartActionData, vvdAnswers = [], vidaNaoQueroAnswers = [], autoReflexaoData }: Props) {
  const navigate = useNavigate();
  const valores = autoReflexaoData?.valores || [];
  const crenca1 = autoReflexaoData?.crencas?.[0] || "";
  const s = smartActionData;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showPdfUpgradeModal, setShowPdfUpgradeModal] = useState(false);

  // Record completion on mount
  useEffect(() => {
    const recordCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase
          .from('user_jornada_completions')
          .upsert({ user_id: user.id, completed_at: new Date().toISOString() }, { onConflict: 'user_id' });
      } catch (err) {
        console.error('Error recording jornada completion:', err);
      }
    };
    recordCompletion();
  }, []);

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoadingPlan(planName);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { price_id: priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleGeneratePDF = () => {
    // PDF generation requires payment
    setShowPdfUpgradeModal(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const mg = 20;
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const mw = pw - 2 * mg;
    let y = 0;

    const accent: [number, number, number] = [59, 130, 246];
    const dark: [number, number, number] = [30, 41, 59];
    const muted: [number, number, number] = [100, 116, 139];
    const divider: [number, number, number] = [226, 232, 240];

    const ck = (n = 12) => { if (y + n > ph - 25) { doc.addPage(); y = 25; } };

    const label = (t: string) => {
      ck(8);
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(...muted);
      const l = doc.splitTextToSize(t, mw);
      doc.text(l, mg, y); y += l.length * 5;
    };

    const answer = (t?: string) => {
      ck(8);
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...dark);
      const l = doc.splitTextToSize(t || "—", mw);
      l.forEach((ln: string) => { ck(5); doc.text(ln, mg, y); y += 5; });
      y += 4;
    };

    const sectionTitle = (title: string, color: [number, number, number]) => {
      ck(20);
      y += 4;
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(mg, y - 5, mw, 12, 2, 2, "F");
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text(title, mg + 5, y + 3);
      y += 14;
    };

    const sp = () => { y += 2; ck(); doc.setDrawColor(...divider); doc.line(mg, y, pw - mg, y); y += 6; };

    // Cover / Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pw, 55, "F");
    doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("Minha Jornada PDI", mg, 30);
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    doc.text("Plano de Desenvolvimento Individual", mg, 40);
    const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(today, pw - mg - doc.getTextWidth(today), 40);
    y = 70;

    // Section 1
    sectionTitle("Minha vida dos sonhos", [139, 92, 246]);
    label("Para atingir minha vida dos sonhos, preciso mudar:"); answer(vvdAnswers[0]);
    label("Para conquistar, preciso superar esses desafios:"); answer(vvdAnswers[1]);
    label("Com essas mudanças, minha vida ficaria assim:"); answer(vvdAnswers[2]);
    sp();

    // Section 2
    sectionTitle("Nao quero para minha vida", [239, 68, 68]);
    label("Hoje tenho certeza que NÃO quero para minha vida:"); answer("Continuar fazendo " + (vidaNaoQueroAnswers[0] || ""));
    label("Para não acontecer isso, preciso mudar os hábitos de:"); answer(vidaNaoQueroAnswers[1]);
    label("Pois me assusta pensar que:"); answer(vidaNaoQueroAnswers[2]);
    sp();

    // Section 3
    sectionTitle("Meu Objetivo", [59, 130, 246]);
    label("Minha meta tem o objetivo de me aproximar da vida dos sonhos, e me afastar da vida que não quero viver.");
    y += 2;
    label("Minha meta precisa estar alinhada com meus valores:"); answer(valores.join(", ") || "—");
    label("Para atingir minha meta, preciso mudar minha crença sobre:"); answer(crenca1);
    sp();

    // Section 4
    sectionTitle("Minha Meta", [249, 115, 22]);
    label("Alinhado com meu objetivo, minha meta é:"); answer(s?.especifica);
    label("Essa meta é forte e vou conseguir realizá-la, porque:");
    answer([s?.mensuravel, s?.alcancavel, s?.relevante, s?.temporal].filter(Boolean).join("; "));
    label("Para conquistar minha meta vou precisar aprender:"); answer(s?.aprender);
    label("Vou tomar cuidado com:"); answer(s?.sabotador);
    label("Para evitar os sabotadores, eu vou:"); answer(s?.antiSabotagem);
    sp();

    // Section 5 - Table
    sectionTitle("Plano de Acao", [20, 184, 166]);
    ck(35);
    // Table header
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(mg, y - 3, mw, 30, 2, 2, "F");
    doc.setDrawColor(153, 246, 228);
    doc.roundedRect(mg, y - 3, mw, 30, 2, 2, "S");
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 118, 110);
    doc.text("META", mg + 4, y + 3);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...dark);
    const metaLines = doc.splitTextToSize(s?.especifica || "—", mw - 8);
    doc.text(metaLines, mg + 4, y + 9);
    y += 34;

    ck(25);
    const colW = mw / 2;
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(mg, y - 3, mw, 22, 2, 2, "F");
    doc.setDrawColor(153, 246, 228);
    doc.roundedRect(mg, y - 3, colW, 22, 2, 2, "S");
    doc.roundedRect(mg + colW, y - 3, colW, 22, 2, 2, "S");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 118, 110);
    doc.text("AÇÃO", mg + 4, y + 3);
    doc.text("DATA E HORÁRIO", mg + colW + 4, y + 3);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...dark); doc.setFontSize(9);
    const acaoLines = doc.splitTextToSize(s?.primeiraAcao || "—", colW - 8);
    doc.text(acaoLines, mg + 4, y + 9);
    doc.text(s?.diaHora || "—", mg + colW + 4, y + 9);
    y += 28;
    sp();

    // Section 6 - AI
    if (s?.smartEvaluation) {
      sectionTitle("Avaliacao", [99, 102, 241]);
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(...dark);
      const evalLines = doc.splitTextToSize(s.smartEvaluation, mw);
      evalLines.forEach((ln: string) => { ck(5); doc.text(ln, mg, y); y += 5; });
      y += 4;
      sp();
    }

    // Section 7 - Final
    sectionTitle("Mensagem Final", [245, 158, 11]);
    doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(...dark);
    const finalTexts = [
      "A vida só premia o movimento.",
      "",
      "Você já fez a parte teórica da coisa. Agora, a distância entre a vida que você tem e a vida que você sonha chama-se atitude.",
      "",
      "Não espere pelas condições perfeitas; elas não existem. O que existe é a sua decisão de não aceitar mais o que te limita."
    ];
    finalTexts.forEach(t => {
      if (t === "") { y += 3; return; }
      const l = doc.splitTextToSize(t, mw);
      l.forEach((ln: string) => { ck(5); doc.text(ln, mg, y); y += 5; });
    });

    // Footer on every page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...muted);
      doc.text("PDI Carreira e Vida — pdicarreiraevida.lovable.app", mg, ph - 10);
      doc.text(`${i}/${totalPages}`, pw - mg - 10, ph - 10);
    }

    doc.save("minha-jornada-pdi.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Você acabou de dar um passo enorme em direção à vida que deseja.
          </h1>
        </motion.div>

        {/* Quadro 1 – Vida dos Sonhos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-base">✨ Minha vida dos sonhos</h3>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>Para atingir minha vida dos sonhos, preciso mudar: <strong>{vvdAnswers[0] || "—"}</strong></p>
                <p>Para conquistar minha vida dos sonhos, preciso superar esses desafios: <strong>{vvdAnswers[1] || "—"}</strong></p>
                <p>Com essas mudanças, minha vida ficaria assim: <strong>{vvdAnswers[2] || "—"}</strong></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quadro 2 – Não quero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-base">🚫 Não quero para minha vida</h3>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>Hoje tenho certeza que NÃO quero para minha vida: <strong>Continuar fazendo {vidaNaoQueroAnswers[0] || "—"}</strong></p>
                <p>Para não acontecer isso, preciso mudar os hábitos de: <strong>{vidaNaoQueroAnswers[1] || "—"}</strong></p>
                <p>Pois me assusta pensar que: <strong>{vidaNaoQueroAnswers[2] || "—"}</strong></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quadro 3 – Meu Objetivo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-base">🎯 Meu Objetivo</h3>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>Minha meta tem o objetivo de <strong>me aproximar da vida dos sonhos</strong>, e me <strong>afastar da vida que não quero viver.</strong></p>
                <p>Minha meta precisa estar alinhada com meus valores: <strong>{valores.length > 0 ? valores.join(", ") : "—"}</strong></p>
                <p>E para atingir minha meta, preciso mudar minha crença sobre: <strong>{crenca1 || "—"}</strong></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quadro 4 – Minha Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-base">🚀 Minha Meta</h3>
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>Alinhado com meu objetivo, minha meta é: <strong>{s?.especifica || "—"}</strong></p>
                <p>Essa meta é forte e vou conseguir realizá-la, porque: <strong>{[s?.mensuravel, s?.alcancavel, s?.relevante, s?.temporal].filter(Boolean).join("; ") || "—"}</strong></p>
                <p>Eu sei que para conquistar minha meta eu vou precisar aprender: <strong>{s?.aprender || "—"}</strong></p>
                <p>Eu sei que para conquistar minha meta eu vou tomar cuidado com: <strong>{s?.sabotador || "—"}</strong></p>
                <p>E para evitar que os sabotadores impeçam que eu conquiste minha meta, eu vou: <strong>{s?.antiSabotagem || "—"}</strong></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quadro 5 – Tabela */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2 border-teal-200 bg-teal-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 text-base">📋 Plano de Ação</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b-2 border-teal-200">
                      <td colSpan={2} className="py-3">
                        <span className="font-bold text-teal-700">META</span>
                        <p className="text-slate-700 mt-1">{s?.especifica || "—"}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-3 border-r border-teal-200 w-1/2 align-top">
                        <span className="font-bold text-teal-700 text-xs">Ação</span>
                        <p className="text-slate-700 mt-1">{s?.primeiraAcao || "—"}</p>
                      </td>
                      <td className="py-3 pl-3 w-1/2 align-top">
                        <span className="font-bold text-teal-700 text-xs">Data e Horário</span>
                        <p className="text-slate-700 mt-1">{s?.diaHora || "—"}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quadro 6 – Avaliação IA */}
        {s?.smartEvaluation && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="border-2 border-indigo-200 bg-indigo-50/50">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-slate-800 text-base">🤖 Avaliação</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{s.smartEvaluation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quadro 7 – Texto Final */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-slate-800 text-base">💫 Mensagem Final</h3>
              <div className="text-sm text-slate-700 leading-relaxed italic space-y-3">
                <p>A vida só premia o movimento.</p>
                <p>Você já fez a parte teórica da coisa. Agora, a distância entre a vida que você tem e a vida que você sonha chama-se atitude.</p>
                <p>Não espere pelas condições perfeitas; elas não existem. O que existe é a sua decisão de não aceitar mais o que te limita.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 text-left"
              onClick={handleGeneratePDF}
            >
              <FileText className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Gerar relatório em PDF</p>
                <p className="text-xs text-slate-400">Baixe um PDF com tudo que você preencheu</p>
              </div>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 text-left"
              onClick={() => {}}
            >
              <Download className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Salvar e sair</p>
                <p className="text-xs text-slate-400">Seus dados ficam salvos para continuar depois</p>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Antes de sair */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card className="border-2 border-slate-200 bg-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-800">💫 Antes de você sair…</h3>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>Você acabou de organizar sua visão, seus valores, sua meta e seu plano inicial.</p>
                <p><strong>Isso é clareza.</strong></p>
                <p>Mas clareza não garante constância.<br />E constância é o que transforma intenção em resultado.</p>
                <p>O Plano Mestre define o norte.<br />Ele não acompanha sua execução.<br />Não mede sua evolução.<br />Não ajusta sua rota quando você oscila.</p>
                <p><strong>E você vai oscilar.</strong></p>
                <p>A diferença entre quem sonha e quem constrói não está na meta.<br />Está no acompanhamento.</p>
                <p>Se você parar aqui, terá um plano.<br /><strong>Se continuar, terá um sistema.</strong></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quer ir além? */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="text-center text-3xl font-extrabold text-slate-800 py-2">
              Quer ir além? <span role="img" aria-label="foguete">🚀</span>
            </h2>
          </motion.div>

          {/* Acesso Completo */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-3">
            <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-blue-950 aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/NGiQsTByXu0?rel=0&modestbranding=1"
                title="Vídeo: PDI Plano Básico"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Sistema PDI</h3>
                      <span className="text-blue-600 font-bold">R$ 67<span className="text-xs font-normal">/ano</span></span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Diário, agenda, relatórios, IA, progresso e todas as ferramentas desbloqueadas.
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-blue-500 hover:bg-blue-600 w-full"
                      onClick={() => handleSubscribe("price_1Sjo293aJLvyiewRDW1gCi39", "completo")}
                      disabled={loadingPlan === "completo"}
                    >
                      {loadingPlan === "completo" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Assinar plano PDI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Black */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="space-y-3 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-lg shadow-amber-200/50 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3 h-3 mr-1" /> Melhor custo-benefício
              </Badge>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-amber-300 bg-amber-950 aspect-video flex items-center justify-center">
              <div className="text-center text-amber-300 space-y-2">
                <ExternalLink className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-sm font-medium">Vídeo: Premium Black</p>
                <p className="text-xs opacity-60">Espaço reservado para vídeo explicativo</p>
              </div>
            </div>
            <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 cursor-pointer hover:shadow-lg transition-shadow ring-2 ring-amber-300/50 ring-offset-2">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">PDI Premium Black</h3>
                      <span className="text-amber-600 font-bold">R$ 297<span className="text-xs font-normal">/ano</span></span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Tudo do Completo + Desafio 30 Dias, IA ilimitada, WhatsApp diário.
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 w-full shadow-md shadow-amber-200"
                      onClick={() => handleSubscribe("price_1SzMoi3aJLvyiewRtfFcNYju", "black")}
                      disabled={loadingPlan === "black"}
                    >
                      {loadingPlan === "black" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Assinar Premium Black
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mentoria 1:1 */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-3">
            <div className="rounded-xl overflow-hidden border-2 border-emerald-300 bg-emerald-950 aspect-video flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative text-center text-emerald-300 space-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-emerald-300 ml-1" />
                </div>
                <p className="text-sm font-medium">Vídeo: Mentoria 1:1</p>
                <p className="text-xs opacity-60">Conheça como funciona o acompanhamento individual</p>
              </div>
            </div>

            <Card className="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">Mentoria 1:1</h3>
                    <p className="text-xs text-emerald-600 font-medium">Acompanhamento individual e personalizado</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Eu vou te acompanhar pessoalmente durante <strong>3 meses</strong>, com reuniões semanais de <strong>1 hora</strong>, guiando você na construção do seu sonho — passo a passo, sem atalhos.
                </p>

                <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2.5">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">O que está incluso:</p>
                  {[
                    "12 sessões individuais de 1 hora (semanais)",
                    "Plano de ação personalizado para sua realidade",
                    "Acompanhamento contínuo entre sessões",
                    "Acesso direto via WhatsApp para dúvidas",
                    "Acesso Premium Black incluso durante a mentoria",
                    "Suporte para destravar crenças e sabotadores",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-900 rounded-xl p-4 text-center space-y-1">
                  <p className="text-emerald-300 text-xs font-medium">Investimento único</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-white text-3xl font-bold">R$ 997</span>
                    <span className="text-emerald-300 text-sm">,00</span>
                  </div>
                  <p className="text-emerald-400 text-xs">ou em até 12x no cartão</p>
                </div>

                <a
                  href={`https://wa.me/5511995677999?text=${encodeURIComponent("gostaria de contratar a mentoria 1:1")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full h-12 text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200">
                    Consultar Disponibilidade
                  </Button>
                </a>

                <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <p className="text-[11px] text-red-600 font-semibold">
                    Apenas 2 vagas por mês · Início imediato após a confirmação
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Button variant="ghost" className="w-full text-slate-400" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar e revisar
        </Button>
      </div>

      <JornadaUpgradeModal
        open={showPdfUpgradeModal}
        onOpenChange={setShowPdfUpgradeModal}
        title="Relatório em PDF"
        description="O download do relatório em PDF está disponível para assinantes ou mediante pagamento avulso."
      />
    </div>
  );
}
