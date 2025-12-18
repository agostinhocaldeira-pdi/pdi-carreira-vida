import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LifeWheelScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeWheelScientificModal({ open, onOpenChange }: LifeWheelScientificModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            A importância de conhecer suas áreas da vida
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              A ferramenta da Roda da Vida permite visualizar, de forma simples e concreta, como estão as diferentes áreas da vida e o quanto elas estão alinhadas com os próprios valores. É uma ferramenta poderosa de consciência, priorização e tomada de decisão.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">O que é a Roda da Vida</h3>
              <p className="mb-3">
                A Roda da Vida é um modelo que divide a vida em áreas essenciais (por exemplo: carreira, finanças, saúde, relacionamentos, desenvolvimento pessoal, lazer, espiritualidade). A pessoa avalia seu nível de satisfação em cada área e cria um "mapa" visual da sua vida naquele momento.
              </p>
              <p>
                Ela responde, de forma prática, à pergunta:
              </p>
              <p className="italic text-foreground font-medium mt-2">
                "Onde estou agora e o que realmente precisa de atenção?"
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Por que usar a Roda da Vida</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">1. Clareza e consciência realista</h4>
                  <p className="mb-2">Muitas pessoas vivem no modo automático. A Roda da Vida:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>revela desequilíbrios invisíveis no dia a dia</li>
                    <li>mostra áreas negligenciadas que impactam o todo</li>
                    <li>diferencia sensação momentânea de realidade consistente</li>
                  </ul>
                  <p className="mt-2">Ver a roda "torta" costuma gerar mais impacto do que apenas refletir mentalmente.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">2. Priorização mais inteligente</h4>
                  <p className="mb-2">Nem tudo precisa ser resolvido ao mesmo tempo. A ferramenta ajuda a:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>identificar quais áreas têm maior impacto na qualidade de vida</li>
                    <li>escolher onde investir energia primeiro</li>
                    <li>evitar dispersão e sobrecarga</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">3. Conexão direta com valores pessoais</h4>
                  <p className="mb-2">A Roda da Vida ganha profundidade quando conectada aos valores. Ela ajuda a responder:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Por que essa área baixa me incomoda tanto?</li>
                    <li>Essa área está baixa porque não é um valor para mim ou porque estou vivendo contra meus valores?</li>
                  </ul>
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground mb-1">Exemplo:</p>
                    <p>Se família é um valor central, uma nota baixa nessa área gera frustração profunda.</p>
                    <p>Se status não é um valor real, uma nota baixa em reconhecimento externo pode não ser um problema.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Benefícios da clareza de valores (conectados à Roda da Vida)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Na vida pessoal</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Menos culpa:</strong> a pessoa entende o que realmente importa para ela</li>
                    <li><strong>Mais coerência:</strong> decisões alinhadas com quem ela é, não com expectativas externas</li>
                    <li><strong>Relacionamentos mais saudáveis:</strong> limites mais claros e escolhas mais conscientes</li>
                    <li><strong>Senso de propósito:</strong> a vida deixa de ser apenas "dar conta de tudo"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Na vida profissional</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Direção de carreira:</strong> clareza sobre o tipo de trabalho, ambiente e ritmo que fazem sentido</li>
                    <li><strong>Motivação sustentável:</strong> energia vem do alinhamento, não só de recompensas externas</li>
                    <li><strong>Decisões mais seguras:</strong> aceitar ou recusar oportunidades com menos dúvida</li>
                    <li><strong>Prevenção de burnout:</strong> identificar áreas críticas antes que o desgaste vire colapso</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Por que a Roda da Vida funciona tão bem</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>É visual e rápida</li>
                <li>Traduz aspectos subjetivos em algo concreto</li>
                <li>Facilita conversas profundas (coaching, terapia, liderança)</li>
                <li>Mostra evolução ao longo do tempo</li>
              </ul>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-3">Em resumo</h3>
              <p className="mb-2">
                <strong>A Roda da Vida mostra como a vida está.</strong>
              </p>
              <p className="mb-2">
                <strong>Os valores explicam por que isso importa.</strong>
              </p>
              <p>
                Juntas, essas duas coisas ajudam a pessoa a sair do automático e construir uma vida mais consciente, equilibrada e alinhada — pessoal e profissionalmente.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
