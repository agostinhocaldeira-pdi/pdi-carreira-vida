import { motion } from "framer-motion";
import { Printer, Download, Crown, Star, ArrowLeft, Trophy, Rocket, ExternalLink, CalendarCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Props {
  onBack: () => void;
  smartActionData?: { especifica: string; mensuravel: string; alcancavel: string; relevante: string; temporal: string; primeiraAcao: string; diaHora: string } | null;
}

export default function JornadaFinal({ onBack, smartActionData }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-7xl"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">
            Parabéns! Você concluiu!
          </h1>
          <p className="text-slate-500">
            Você acabou de dar um passo enorme em direção à vida que deseja.
            Agora escolha o que fazer com seu plano:
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Seu Resumo
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <span><strong>5 valores</strong> definidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span><strong>8 áreas</strong> da vida avaliadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span><strong>Vida dos sonhos</strong> descrita</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span><strong>1 meta SMART</strong> criada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sua Primeira Ação */}
        {smartActionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Sua Meta SMART + Primeira Ação
                </h3>
                <div className="space-y-3">
                  {[
                    { letter: "S", label: "Específica", value: smartActionData.especifica, color: "text-red-500" },
                    { letter: "M", label: "Mensurável", value: smartActionData.mensuravel, color: "text-orange-500" },
                    { letter: "A", label: "Alcançável", value: smartActionData.alcancavel, color: "text-amber-500" },
                    { letter: "R", label: "Relevante", value: smartActionData.relevante, color: "text-green-500" },
                    { letter: "T", label: "Temporal", value: smartActionData.temporal, color: "text-blue-500" },
                  ].map((item) => (
                    <div key={item.letter} className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        <span className={`font-black ${item.color}`}>{item.letter}</span> — {item.label}
                      </p>
                      <p className="text-sm text-slate-700">{item.value}</p>
                    </div>
                  ))}
                  <div className="border-t border-purple-200 pt-3" />
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-medium text-purple-600 mb-1">🔥 O que vou fazer nos próximos 7 dias:</p>
                    <p className="text-sm text-slate-700">{smartActionData.primeiraAcao}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-medium text-purple-600 mb-1 flex items-center gap-1">
                      <CalendarCheck className="w-3 h-3" /> Dia e hora agendados:
                    </p>
                    <p className="text-sm text-slate-700">{smartActionData.diaHora}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-3 text-left"
              onClick={() => window.print()}
            >
              <Printer className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Imprimir meu plano</p>
                <p className="text-xs text-slate-400">Gere um PDF com tudo que você preencheu</p>
              </div>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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

        {/* Upgrade options */}
        <div className="space-y-6">
          <p className="text-center text-sm font-semibold text-slate-600">
            Quer ir além? 🚀
          </p>

          {/* Acesso Completo */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
            <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-blue-950 aspect-video flex items-center justify-center">
              <div className="text-center text-blue-300 space-y-2">
                <ExternalLink className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-sm font-medium">Vídeo: Acesso Completo</p>
                <p className="text-xs opacity-60">Espaço reservado para vídeo explicativo</p>
              </div>
            </div>
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">PDI Acesso Completo</h3>
                      <span className="text-blue-600 font-bold">R$ 67<span className="text-xs font-normal">/ano</span></span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Diário, agenda, relatórios, IA, progresso e todas as ferramentas desbloqueadas.
                    </p>
                    <Button size="sm" className="mt-3 bg-blue-500 hover:bg-blue-600 w-full">
                      Assinar Acesso Completo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Black */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-3">
            <div className="rounded-xl overflow-hidden border-2 border-amber-300 bg-amber-950 aspect-video flex items-center justify-center">
              <div className="text-center text-amber-300 space-y-2">
                <ExternalLink className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-sm font-medium">Vídeo: Premium Black</p>
                <p className="text-xs opacity-60">Espaço reservado para vídeo explicativo</p>
              </div>
            </div>
            <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 cursor-pointer hover:shadow-lg transition-shadow">
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
                    <Button size="sm" className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 w-full">
                      Assinar Premium Black
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Button variant="ghost" className="w-full text-slate-400" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar e revisar
        </Button>
      </div>
    </div>
  );
}
