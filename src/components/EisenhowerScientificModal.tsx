import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EisenhowerScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EisenhowerScientificModal = ({ open, onOpenChange }: EisenhowerScientificModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Matriz de Eisenhower
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-base mb-2">
                Por que usar esta ferramenta e como ela melhora suas decisões diárias?
              </h3>
              <p className="text-muted-foreground">
                Grande parte do estresse, da sobrecarga e da sensação de falta de tempo não vem da quantidade de tarefas, mas da <strong>falta de critério para decidir o que fazer primeiro</strong>.
              </p>
              <p className="text-muted-foreground mt-2">
                A Matriz de Eisenhower existe para resolver exatamente esse problema.
              </p>
              <p className="text-muted-foreground mt-2">
                Ela ajuda você a separar <strong>urgência de importância</strong>, evitando que sua vida seja guiada apenas por pressões externas, interrupções e prazos artificiais.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">O que é a Matriz de Eisenhower (na prática)</h3>
              <p className="text-muted-foreground mb-2">
                A ferramenta organiza suas atividades em quatro quadrantes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li><strong>Importante e Urgente</strong> – o que precisa ser feito agora</li>
                <li><strong>Importante e Não Urgente</strong> – o que constrói resultados no médio e longo prazo</li>
                <li><strong>Não Importante e Urgente</strong> – o que pode ser delegado ou simplificado</li>
                <li><strong>Não Importante e Não Urgente</strong> – o que deve ser eliminado ou reduzido</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Essa classificação transforma uma lista caótica de tarefas em um <strong>mapa claro de prioridades</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Por que uma pessoa deve usar a Matriz de Eisenhower</h3>
              <p className="text-muted-foreground mb-2">
                Porque, sem esse filtro, acontece o seguinte:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Tudo parece urgente</li>
                <li>O dia termina sem sensação de avanço real</li>
                <li>O que é importante fica sempre para "quando sobrar tempo"</li>
                <li>A vida é consumida por apagamento de incêndios</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                A matriz <strong>devolve o controle da agenda para você</strong>.
                Ela permite decidir com consciência, não por pressão.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Benefícios na vida pessoal</h3>
              <p className="text-muted-foreground mb-2">
                Na vida pessoal, a Matriz de Eisenhower ajuda você a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Reduzir estresse e sensação de estar sempre atrasado</li>
                <li>Priorizar saúde, família e autocuidado (que quase nunca são urgentes, mas sempre são importantes)</li>
                <li>Criar espaço para o que realmente importa no longo prazo</li>
                <li>Dizer "não" com mais clareza e menos culpa</li>
                <li>Evitar gastar energia com tarefas que não agregam valor à sua vida</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Você passa a viver menos no modo reativo e mais no <strong>modo intencional</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Benefícios na vida profissional</h3>
              <p className="text-muted-foreground mb-2">
                No contexto profissional, a ferramenta permite:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Foco no que gera resultado real, não apenas ocupação</li>
                <li>Melhor gestão de tempo e prazos</li>
                <li>Redução de retrabalho e decisões apressadas</li>
                <li>Clareza sobre o que pode ser delegado ou automatizado</li>
                <li>Melhoria na produtividade sem aumento de carga de trabalho</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Isso aumenta sua eficiência, qualidade das entregas e percepção de valor profissional.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Conexão com o PDI – Carreira e Vida</h3>
              <p className="text-muted-foreground mb-2">
                No PDI, a Matriz de Eisenhower atua como um <strong>filtro diário de execução</strong>.
              </p>
              <p className="text-muted-foreground mb-2">
                Ela ajuda você a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Proteger o tempo dedicado às Metas SMART</li>
                <li>Garantir que sua rotina esteja alinhada à sua Visão de Vida Desejada</li>
                <li>Evitar que o urgente destrua o importante</li>
                <li>Tomar decisões coerentes com seus objetivos maiores</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Sem esse filtro, até boas metas acabam sendo engolidas pela rotina.
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-base mb-2">Em resumo</h3>
              <p className="text-muted-foreground">
                Usar a Matriz de Eisenhower não é sobre fazer mais coisas.
                É sobre <strong>fazer as coisas certas, no momento certo</strong>.
              </p>
              <p className="text-muted-foreground mt-2">
                Ela não elimina responsabilidades, mas elimina desperdício de energia.
                E transforma sua relação com o tempo — tanto na vida pessoal quanto na profissional — em algo mais consciente, estratégico e sustentável.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EisenhowerScientificModal;
