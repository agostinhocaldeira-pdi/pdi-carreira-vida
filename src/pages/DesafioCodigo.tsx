import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, Zap, Sprout, Clapperboard, HelpCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const DesafioCodigo = () => {
  const [investigacao1, setInvestigacao1] = useState("");
  const [investigacao2, setInvestigacao2] = useState("");
  const [perguntaOuro, setPerguntaOuro] = useState("");
  const [compromisso, setCompromisso] = useState("");

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Textured Background Overlay */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header with Day Navigation */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#d4a853]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#b8912f] flex items-center justify-center">
                <span className="font-bold text-[#1a1a1a] text-sm">30</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#d4a853]">O Código do Essencial</h1>
                <p className="text-xs text-gray-400">Desafio de 30 Dias</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span>Por</span>
              <span className="text-[#d4a853] font-medium">Agostinho Caldeira</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Day Title */}
          <header className="text-center space-y-4 pb-8 border-b border-[#d4a853]/20">
            <span className="inline-block px-4 py-1 rounded-full bg-[#d4a853]/10 text-[#d4a853] text-sm font-medium">
              Semana 1 · Alicerces
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-white">DIA 1</span>
              <span className="text-[#d4a853]"> — </span>
              <span className="text-[#d4a853]">QUANDO TUDO PARECE IMPORTANTE AO MESMO TEMPO</span>
            </h1>
          </header>

          {/* Section: O que está pegando aqui? */}
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#d4a853]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-[#d4a853]">
                  🤔 O que está pegando aqui?
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  Quando muitas coisas pedem atenção ao mesmo tempo, a mente tenta abraçar o mundo. 
                  O resultado? O foco se divide e o avanço fica pequeno. O dia termina cheio, mas a 
                  sensação de progresso fica vazia.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Um filme que você talvez já tenha visto */}
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                <Clapperboard className="w-6 h-6 text-[#d4a853]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-[#d4a853]">
                  🎬 Um filme que você talvez já tenha visto
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  O dia mal começa, o celular vibra, mensagens chegam, tarefas brotam do chão. 
                  Uma pendência puxa a outra. O tempo voa. Quando você percebe, já é noite, 
                  o cansaço bate e sobra aquele sentimento incômodo de que o essencial ficou para amanhã.
                </p>
              </div>
            </div>
          </section>

          {/* Section: A conta invisível */}
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-[#d4a853]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-[#d4a853]">
                  📉 A conta invisível
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-3">
                  Viver nesse ritmo tem um custo alto:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-[#d4a853]"></span>
                    <span>Sua energia se espalha. 🔋</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-[#d4a853]"></span>
                    <span>Sua mente fica sobrecarregada. 🧠</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-[#d4a853]"></span>
                    <span>O esforço é alto, mas o resultado demora. 🏃</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: A virada de chave */}
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#d4a853]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-[#d4a853]">
                  💡 A virada de chave
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  Antes de sair fazendo, o segredo é escolher. Existe um princípio poderoso que diz: 
                  <span className="text-white font-medium italic"> "Resultados extraordinários surgem quando 
                  damos atenção extraordinária a uma única coisa."</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Essa ideia é o coração do livro <span className="text-[#d4a853] font-medium">A Única Coisa</span>¹. 📖
                </p>
              </div>
            </div>
          </section>

          {/* Section: Hora da verdade - Interactive */}
          <section className="space-y-6 bg-gradient-to-br from-[#d4a853]/10 to-transparent p-6 md:p-8 rounded-2xl border border-[#d4a853]/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4a853] to-[#b8912f] flex items-center justify-center shadow-lg shadow-[#d4a853]/20">
                <Zap className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#d4a853]">
                  ⚡ Hora da verdade
                </h2>
                <p className="text-gray-400 text-sm mt-1">Exercício prático do dia</p>
              </div>
            </div>

            {/* Exercise 1: Investigação rápida */}
            <div className="space-y-4 pl-0 md:pl-16">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4a853]/20 border border-[#d4a853]/40 flex items-center justify-center text-[#d4a853] font-bold text-sm">
                  1
                </span>
                <h3 className="text-lg font-semibold text-white">
                  🔍 Investigação rápida
                </h3>
              </div>
              
              <div className="space-y-3 ml-11">
                <label className="block text-gray-300 text-sm">
                  O que tem roubado a maior parte do meu tempo?
                </label>
                <Textarea
                  value={investigacao1}
                  onChange={(e) => setInvestigacao1(e.target.value)}
                  placeholder="Escreva aqui suas reflexões..."
                  className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] focus:ring-[#d4a853]/20 min-h-[80px] resize-none"
                />
                
                <label className="block text-gray-300 text-sm mt-4">
                  Dessas coisas, quais realmente constroem a vida que eu quero?
                </label>
                <Textarea
                  value={investigacao2}
                  onChange={(e) => setInvestigacao2(e.target.value)}
                  placeholder="Reflita e escreva..."
                  className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] focus:ring-[#d4a853]/20 min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Exercise 2: A Pergunta de Ouro */}
            <div className="space-y-4 pl-0 md:pl-16">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4a853]/20 border border-[#d4a853]/40 flex items-center justify-center text-[#d4a853] font-bold text-sm">
                  2
                </span>
                <h3 className="text-lg font-semibold text-white">
                  🎯 A Pergunta de Ouro
                </h3>
              </div>
              
              <div className="space-y-3 ml-11">
                <label className="block text-gray-300 text-sm">
                  "Se eu pudesse avançar em apenas <span className="text-[#d4a853] font-semibold">UMA</span> área da minha vida nos próximos 30 dias, qual traria mais impacto positivo?"
                </label>
                <Textarea
                  value={perguntaOuro}
                  onChange={(e) => setPerguntaOuro(e.target.value)}
                  placeholder="Qual é a sua única coisa?"
                  className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] focus:ring-[#d4a853]/20 min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Exercise 3: O Compromisso */}
            <div className="space-y-4 pl-0 md:pl-16">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4a853]/20 border border-[#d4a853]/40 flex items-center justify-center text-[#d4a853] font-bold text-sm">
                  3
                </span>
                <h3 className="text-lg font-semibold text-white">
                  ⬇️ O Compromisso
                </h3>
              </div>
              
              <div className="space-y-3 ml-11">
                <label className="block text-gray-300 text-sm">
                  Complete: "Nos próximos 30 dias, vou direcionar meu melhor tempo e energia para:"
                </label>
                <Input
                  value={compromisso}
                  onChange={(e) => setCompromisso(e.target.value)}
                  placeholder="Seu compromisso principal..."
                  className="bg-[#252525] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4a853] focus:ring-[#d4a853]/20 h-12"
                />
              </div>
            </div>
          </section>

          {/* Section: Para fechar */}
          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-green-400">
                  🌱 Para fechar
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg italic">
                  Hoje você não precisou fazer mil coisas. Você só precisou fazer a escolha certa.
                </p>
              </div>
            </div>
          </section>

          {/* Footnote */}
          <footer className="pt-8 border-t border-[#333] text-sm text-gray-500">
            <p>¹ A Única Coisa, de Gary Keller e Jay Papasan.</p>
          </footer>
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] bg-[#1a1a1a]/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            POR <span className="text-[#d4a853] font-medium">AGOSTINHO CALDEIRA</span> | PDI – CARREIRA & VIDA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DesafioCodigo;
