import LessonContent from "./LessonContent";

const SwotLessonContent = () => {
  return (
    <LessonContent title="Análise SWOT">
      <div className="space-y-6 text-foreground/90">
        <p className="text-base leading-relaxed">
          A Análise SWOT ajuda a transformar autoconhecimento em estratégia. Em vez de apenas "se conhecer", a pessoa passa a entender como usar melhor suas forças, lidar com suas fraquezas e tomar decisões mais inteligentes diante das oportunidades e riscos do ambiente.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">O que é a Análise SWOT (aplicada à pessoa)</h3>
          <p className="mb-3">A SWOT analisa quatro dimensões:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li><strong>Forças (Strengths)</strong> – competências, talentos, recursos internos</li>
            <li><strong>Fraquezas (Weaknesses)</strong> – limitações, lacunas, comportamentos que prejudicam</li>
            <li><strong>Oportunidades (Opportunities)</strong> – fatores externos favoráveis</li>
            <li><strong>Ameaças (Threats)</strong> – riscos e obstáculos externos</li>
          </ul>
          <p className="italic text-muted-foreground">
            Ela responde à pergunta: "Como estou posicionado hoje para alcançar o que quero?"
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Por que usar a Análise SWOT</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary/90 mb-2">1. Autoconhecimento prático (não abstrato)</h4>
              <p className="mb-2">Muitas pessoas sabem "mais ou menos" no que são boas ou ruins. A SWOT:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>organiza essas percepções de forma clara</li>
                <li>evita exagerar defeitos ou romantizar qualidades</li>
                <li>traz uma visão mais realista e estratégica de si mesmo</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-primary/90 mb-2">2. Clareza sobre forças: usar melhor o que já funciona</h4>
              <p className="mb-2">Benefícios de reconhecer forças:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>mais confiança e segurança</li>
                <li>foco no que gera resultado</li>
                <li>melhor posicionamento pessoal e profissional</li>
                <li>menos comparação improdutiva com os outros</li>
              </ul>
              <p className="mt-2 text-muted-foreground italic">
                Na prática, pessoas que usam suas forças com consciência crescem mais rápido e com menos desgaste.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-primary/90 mb-2">3. Clareza sobre fraquezas: reduzir impacto e sofrimento</h4>
              <p className="mb-2">Ter clareza sobre fraquezas não é se criticar, é se proteger. Benefícios:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>evitar situações que drenam energia desnecessariamente</li>
                <li>desenvolver o que é estratégico (não tudo)</li>
                <li>criar compensações (processos, parcerias, apoio)</li>
                <li>reduzir erros repetidos</li>
              </ul>
              <p className="mt-2 text-muted-foreground italic">
                Ignorar fraquezas costuma custar mais caro do que reconhecê-las.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Benefícios na vida pessoal</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Relacionamentos mais saudáveis:</strong> entender seus padrões fortalece comunicação e empatia</li>
            <li><strong>Menos autossabotagem:</strong> reconhecer gatilhos e limites pessoais</li>
            <li><strong>Escolhas mais conscientes:</strong> ambientes, rotinas e compromissos mais compatíveis</li>
            <li><strong>Autoestima mais sólida:</strong> baseada em realidade, não em idealizações</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Benefícios na vida profissional</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Decisões de carreira mais estratégicas</li>
            <li>Melhor desempenho ao atuar em áreas alinhadas às forças</li>
            <li>Desenvolvimento direcionado (investir no que realmente importa)</li>
            <li>Maior empregabilidade e posicionamento profissional</li>
            <li>Preparação para mudanças (mercado, função, liderança)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">O diferencial da SWOT</h3>
          <p className="mb-2">Ela não olha só para "quem eu sou", mas para:</p>
          <p className="italic text-muted-foreground mb-3">"Quem eu sou em relação ao contexto em que estou."</p>
          <p className="mb-2">Isso permite criar estratégias como:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>usar forças para aproveitar oportunidades</li>
            <li>fortalecer ou contornar fraquezas diante de ameaças</li>
            <li>escolher ambientes onde você tem mais chance de prosperar</li>
          </ul>
        </div>

        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h3 className="text-lg font-semibold text-primary mb-3">Em resumo</h3>
          <p className="mb-2">
            <strong>Autoconhecimento sem estratégia</strong> gera reflexão.<br />
            <strong>Autoconhecimento com SWOT</strong> gera ação.
          </p>
          <p>
            Clareza sobre forças e fraquezas ajuda a pessoa a crescer com intenção, tanto na vida pessoal quanto profissional, reduzindo esforço desperdiçado e aumentando impacto.
          </p>
        </div>
      </div>
    </LessonContent>
  );
};

export default SwotLessonContent;
