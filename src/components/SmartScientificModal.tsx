import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SmartScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SmartScientificModal = ({ open, onOpenChange }: SmartScientificModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            A importância de utilizar o método SMART para criar suas metas
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <section>
              <p className="mb-3">
                Ter objetivos é comum.<br />
                Alcançá-los de forma consistente não é.
              </p>
              <p className="mb-3">
                O principal motivo disso é simples: a maioria das metas é mal definida. São vagas, genéricas, irreais ou desconectadas da rotina e da vida real.
              </p>
              <p className="font-medium text-foreground">
                A ferramenta de Metas SMART existe para corrigir exatamente isso.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">O que são Metas SMART (na prática)</h3>
              <p className="mb-2">Uma meta SMART é estruturada para ser:</p>
              <ul className="list-none space-y-1 ml-2">
                <li><strong>S – Específica:</strong> deixa claro o que deve ser feito</li>
                <li><strong>M – Mensurável:</strong> permite acompanhar progresso e resultado</li>
                <li><strong>A – Atingível:</strong> respeita sua realidade atual</li>
                <li><strong>R – Relevante:</strong> faz sentido para sua vida e seus objetivos maiores</li>
                <li><strong>T – Temporal:</strong> tem prazo definido</li>
              </ul>
              <p className="mt-3">
                Na prática, isso transforma um desejo genérico em um compromisso claro com direção, critério e prazo.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Por que uma pessoa deve usar Metas SMART</h3>
              <p className="mb-2">Porque metas mal definidas geram:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Procrastinação</li>
                <li>Frustração constante</li>
                <li>Sensação de estar sempre recomeçando</li>
                <li>Muito esforço com pouco resultado</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">Metas SMART fazem o oposto.</p>
              <p className="mt-2">
                Elas tiram a meta do campo da intenção e colocam no campo da execução consciente.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Benefícios na vida pessoal</h3>
              <p className="mb-2">Ao usar Metas SMART na vida pessoal, você passa a:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ter clareza sobre o que realmente quer mudar ou conquistar</li>
                <li>Dividir grandes objetivos em metas possíveis de executar</li>
                <li>Acompanhar evolução real, não apenas esforço</li>
                <li>Reduzir culpa e autocrítica por "não conseguir manter o foco"</li>
                <li>Criar constância sem depender de motivação</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">
                Você deixa de "tentar melhorar" e passa a construir progresso mensurável.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Benefícios na vida profissional</h3>
              <p className="mb-2">No campo profissional, Metas SMART ajudam você a:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Priorizar o que realmente gera resultado</li>
                <li>Alinhar esforço diário com crescimento de carreira ou negócio</li>
                <li>Tomar decisões baseadas em dados, não em achismo</li>
                <li>Comunicar objetivos com clareza (com equipes, líderes ou parceiros)</li>
                <li>Avaliar desempenho de forma justa e objetiva</li>
              </ul>
              <p className="mt-3">
                Isso aumenta sua credibilidade, foco e capacidade de execução.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Conexão com o PDI – Carreira e Vida</h3>
              <p className="mb-3">No PDI, metas não existem de forma isolada.</p>
              <p className="mb-2">As Metas SMART:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Traduzem a Visão de Vida Desejada em objetivos concretos</li>
                <li>Servem como ponte entre intenção e ação</li>
                <li>Facilitam o acompanhamento contínuo da evolução</li>
                <li>Permitem ajustes conscientes, sem sensação de fracasso</li>
              </ul>
              <p className="mt-3 italic">
                Elas não são um fim.<br />
                São um meio estruturado para transformar visão em realidade.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Em resumo</h3>
              <p className="mb-3">
                Usar Metas SMART não é sobre rigidez ou cobrança excessiva. É sobre clareza, direção e respeito à sua própria realidade.
              </p>
              <p className="font-medium text-foreground">
                Quando suas metas são claras, o caminho fica mais leve. E o progresso deixa de ser uma promessa distante para se tornar algo visível e constante — na vida pessoal e na profissional.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SmartScientificModal;
