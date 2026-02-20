import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriberLanding = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/signup?redirect=/jornada");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-5 pt-16 pb-12 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
          Crie uma meta que você realmente consegue realizar e comece a obter resultados reais em sua vida.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
          Se a meta nasce errada, o abandono é inevitável.
          <br />
          O <strong>Plano Mestre – PDI</strong> corrige a estrutura antes da execução.
        </p>

        {/* Video */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-8 bg-black">
          <iframe
            src="https://www.youtube-nocookie.com/embed/NZR6TC17FNw?rel=0&modestbranding=1"
            title="Plano Mestre – PDI"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <button
          onClick={handleCTA}
          className="w-full py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          Criar minha meta
        </button>
      </section>

      {/* Separador */}
      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* Identificação (Dor) */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-6">
          <p>
            Você começa motivado.
            <br />
            Organiza ideias.
            <br />
            Promete que agora será diferente.
          </p>
          <p>
            Algumas semanas depois:
          </p>
          <p>
            A rotina aperta.
            <br />
            As prioridades se misturam.
            <br />
            A meta perde força.
          </p>
          <p>
            E mais um plano fica pelo caminho.
          </p>
          <p>
            Até que um dia, você desiste de criar metas.
          </p>
          <p>
            Não por falta de capacidade.
            <br />
            Mas por falta de <strong>método</strong>.
          </p>
        </div>
        <p className="mt-10 text-xl sm:text-2xl font-bold text-center">
          Quão comprometido você está com sua vida?
        </p>
      </section>

      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* Quebra de Crença */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          O problema nunca foi você.
        </h2>
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
          <p>Mas a forma como você cria metas.</p>
          <p>
            Metas vagas não geram ação.
            <br />
            Metas exageradas geram frustração.
            <br />
            Metas desconectadas da sua rotina geram abandono.
          </p>
        </div>
      </section>

      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* O Mecanismo */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Como o Plano Mestre funciona
        </h2>
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            Não é curso.
            <br />
            Não são aulas gravadas.
          </p>
          <p>
            É uma <strong>ferramenta prática</strong>, guiada, passo a passo.
          </p>
          <ol className="space-y-3 mt-6 pl-0">
            {[
              "Define o que realmente quer",
              "Esclarece por que isso importa",
              "Ajusta a meta à sua realidade",
              "Constrói um plano executável",
              "Sai com o primeiro passo definido",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            Você não sai motivado.
            <br />
            <strong>Você sai com direção.</strong>
          </p>
        </div>
      </section>

      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* O Que Você Recebe */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          O que você recebe
        </h2>
        <ul className="space-y-3 text-base sm:text-lg text-gray-700">
          {[
            "Ferramenta guiada passo a passo",
            "Meta clara e estruturada",
            "Plano ajustado à sua rotina",
            "Etapas organizadas",
            "Primeiro passo definido",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* Custo da Inação */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            Se você não estruturar sua próxima meta corretamente,
            <br />
            provavelmente acontecerá o mesmo de sempre.
          </p>
          <p>
            Entusiasmo inicial.
            <br />
            Interrupção.
            <br />
            Abandono.
          </p>
          <p>
            <strong>A ferramenta não é cobrada, mas você tem um custo invisível de continuar repetindo o mesmo ciclo.</strong>
          </p>
        </div>
      </section>

      <div className="w-16 h-px bg-gray-300 mx-auto" />

      {/* Decisão Final */}
      <section className="px-5 py-16 max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl font-bold mb-8">
          Quanto você está comprometido em criar metas para sua vida melhorar?
        </p>
        <button
          onClick={handleCTA}
          className="w-full max-w-md mx-auto py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          Começar
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">Ferramenta Grátis – Aproveite!</p>
      </section>

      {/* Footer mínimo */}
      <footer className="px-5 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} PDI – Carreira e Vida
      </footer>
    </div>
  );
};

export default SubscriberLanding;
