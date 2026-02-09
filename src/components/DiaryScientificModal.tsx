import { Volume2, Square, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExplanationAudio } from "@/hooks/useExplanationAudio";

interface DiaryScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DiaryScientificModal = ({ open, onOpenChange }: DiaryScientificModalProps) => {
  const { isPlaying, isLoading, toggleAudio } = useExplanationAudio("diario");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl text-center pr-8">
            O que é um Diário Digital Inteligente no PDI
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-2 flex-shrink-0">
          <button
            onClick={toggleAudio}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Square className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isLoading ? "Carregando..." : isPlaying ? "Clique para parar" : "Clique para ouvir"}
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 -mr-2 text-sm sm:text-base text-muted-foreground leading-relaxed space-y-6">
          <div>
            <p className="mb-3">
              No PDI, o Diário não é apenas um espaço livre de anotações. Ele convida o usuário a registrar, de forma simples e objetiva:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>seu humor no dia;</li>
              <li>pensamentos relevantes;</li>
              <li>conquistas ou avanços, mesmo que pequenos;</li>
              <li>uma gratidão diária.</li>
            </ul>
            <p>
              Essa estrutura orientada transforma o ato de escrever em um processo consciente de organização interna.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              1. Registrar o humor aumenta a consciência emocional
            </h3>
            <p className="mb-3">
              A prática de identificar e registrar o humor diário é amplamente utilizada em abordagens terapêuticas baseadas em evidências.
            </p>
            <p className="mb-2">Ao nomear emoções, a pessoa:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>desenvolve maior consciência sobre seus estados internos;</li>
              <li>identifica padrões emocionais ao longo do tempo;</li>
              <li>reduz a sensação de confusão ou sobrecarga difusa.</li>
            </ul>
            <p>
              Esse processo favorece a autorregulação emocional, permitindo decisões mais alinhadas com objetivos pessoais e profissionais.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              2. Escrever pensamentos organiza a mente e reduz carga emocional
            </h3>
            <p className="mb-3">
              A escrita reflexiva, também conhecida como <em>expressive writing</em>, é um recurso estudado há décadas.
            </p>
            <p className="mb-2">Registrar pensamentos:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>ajuda a externalizar preocupações;</li>
              <li>organiza experiências internas;</li>
              <li>reduz ruminação mental.</li>
            </ul>
            <p>
              Ao colocar ideias no papel (ou na tela), o cérebro deixa de gastar energia apenas "segurando" informações e passa a processá-las de forma mais clara e estruturada.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              3. Registrar conquistas fortalece a autoconfiança e a motivação
            </h3>
            <p className="mb-3">
              Um dos maiores bloqueios no desenvolvimento de carreira e vida é a sensação de estagnação — muitas vezes causada por não perceber o próprio progresso.
            </p>
            <p className="mb-2">Ao registrar conquistas diárias, mesmo pequenas:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>a percepção de avanço se torna mais concreta;</li>
              <li>a autoconfiança é reforçada;</li>
              <li>a motivação tende a se sustentar no longo prazo.</li>
            </ul>
            <p>
              Esse princípio está diretamente relacionado ao conceito de <strong className="text-foreground">autoeficácia</strong>, que descreve a crença na própria capacidade de agir e evoluir.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              4. Praticar gratidão melhora bem-estar e perspectiva
            </h3>
            <p className="mb-3">
              A gratidão não elimina desafios, mas altera a forma como eles são percebidos.
            </p>
            <p className="mb-2">Estudos mostram que o registro regular de gratidão está associado a:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>maior bem-estar subjetivo;</li>
              <li>mais emoções positivas no cotidiano;</li>
              <li>melhor equilíbrio emocional diante de dificuldades.</li>
            </ul>
            <p>
              No contexto do PDI, a gratidão ajuda o usuário a manter uma visão mais ampla da própria trajetória, sem negar problemas, mas sem ser dominado por eles.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              O diferencial está na combinação estruturada
            </h3>
            <p className="mb-3">
              O verdadeiro valor do Diário Digital Inteligente não está em um único elemento isolado, mas na integração consciente de todos eles:
            </p>
            <ul className="list-none space-y-2 mb-3">
              <li><strong className="text-foreground">Humor</strong> → consciência emocional</li>
              <li><strong className="text-foreground">Pensamentos</strong> → clareza cognitiva</li>
              <li><strong className="text-foreground">Conquistas</strong> → reforço de progresso</li>
              <li><strong className="text-foreground">Gratidão</strong> → equilíbrio emocional</li>
            </ul>
            <p>
              Essa combinação cria um ciclo diário de organização interna, alinhado ao propósito maior do PDI: ajudar a pessoa a sair do modo reativo e assumir uma postura mais estratégica sobre a própria vida e carreira.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Um recurso simples, com impacto consistente ao longo do tempo
            </h3>
            <p className="mb-3">
              O Diário do PDI não promete soluções instantâneas nem resultados mágicos. Seu valor está na prática contínua.
            </p>
            <p className="mb-2">Com o uso regular, o usuário tende a desenvolver:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>mais clareza sobre si mesmo;</li>
              <li>maior senso de direção;</li>
              <li>melhor relação com suas metas e decisões;</li>
              <li>mais consciência do próprio processo de evolução.</li>
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Conclusão
            </h3>
            <p className="mb-3">
              O <strong className="text-foreground">Diário Digital Inteligente do PDI – Carreira e Vida</strong> é uma ferramenta prática, fundamentada e acessível, criada para apoiar quem deseja mais organização interna, foco e consciência no dia a dia.
            </p>
            <p className="italic text-foreground">
              Registrar o dia não é apenas escrever sobre o que aconteceu.<br />
              É construir, aos poucos, uma visão mais clara de quem você é, onde está e para onde quer ir.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiaryScientificModal;
