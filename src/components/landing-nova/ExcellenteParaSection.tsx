import { Target, Sprout, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ExcellenteParaSection = () => {
  return (
    <section className="py-12 sm:py-16 px-0 sm:px-4 bg-[#222222]">
      <div className="container mx-auto max-w-4xl px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
            O PDI é excelente para:
          </h2>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {/* Carreira */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={0}
            variants={fadeUp}
            className="bg-[#1a1a1a] sm:rounded-2xl p-5 sm:p-8 border-y sm:border border-[#d4a853]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4a853]/20 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-[#d4a853]" />
              </div>
              <h3 className="text-xl font-bold text-white">🎯 Carreira</h3>
            </div>
            <p className="text-gray-400 mb-5">
              Para quem sente que está estagnado, confuso ou trabalhando muito sem sair do lugar.
            </p>
            <p className="text-sm font-semibold text-white mb-3">Com o PDI, você consegue:</p>
            <ul className="space-y-3">
              {[
                "entender qual é o próximo passo real da sua carreira (de acordo com seus valores e momento de vida)",
                "descobrir o que é esperado de você para chegar nesse próximo nível",
                "enxergar com clareza seus pontos fortes e pontos a melhorar",
                "montar um plano estratégico simples para evoluir profissionalmente",
                "executar micro-passos diários, em vez de depender só de motivação",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#d4a853] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
            <p className="text-gray-400 mt-5 text-sm italic border-l-2 border-[#d4a853]/50 pl-4">
              Em vez de ficar reagindo à rotina, você passa a construir sua carreira com intenção.
            </p>
          </motion.div>

          {/* Objetivos de vida */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={1}
            variants={fadeUp}
            className="bg-[#1a1a1a] sm:rounded-2xl p-5 sm:p-8 border-y sm:border border-emerald-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Sprout className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">🌱 Objetivos de vida</h3>
            </div>
            <p className="text-gray-400 mb-5">
              Para quem tem sonhos, mas sente dificuldade em transformar isso em plano.
            </p>
            <p className="text-sm font-semibold text-white mb-3">O PDI te ajuda a organizar metas como:</p>
            <ul className="space-y-2.5 mb-5">
              {[
                "fazer viagens", "comprar um imóvel ou carro", "emagrecer com constância",
                "juntar dinheiro para a faculdade dos filhos", "sair do aperto financeiro",
                "ter mais tempo para a família", "mudar de área profissional"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-white mb-2">
              E o mais importante: não fica tudo solto na cabeça.
            </p>
            <p className="text-gray-400 text-sm mb-4">O sistema transforma esses desejos em:</p>
            <div className="space-y-2">
              {[
                "objetivos claros", "metas possíveis", "ações práticas", "pequenos passos que cabem na sua rotina"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-300 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Em resumo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={2}
            variants={fadeUp}
            className="bg-gradient-to-br from-[#d4a853]/15 via-[#d4a853]/5 to-[#1a1a1a] sm:rounded-2xl p-5 sm:p-8 border-y sm:border border-[#d4a853]/40"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-[#d4a853]" />
              <h3 className="text-xl font-bold text-white">✨ Em resumo</h3>
            </div>
            <p className="text-gray-400 mb-4">
              O PDI não serve para te dar mais coisas para fazer. Serve para:
            </p>
            <ul className="space-y-3">
              {[
                "tirar o excesso",
                "organizar prioridades",
                "clarear decisões",
                "mostrar o próximo passo, todos os dias"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#d4a853] flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExcellenteParaSection;
