import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ValuesScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ValuesScientificModal = ({ open, onOpenChange }: ValuesScientificModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-primary">
            A importância de conhecer seus valores
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground pr-4">
            <p>
              Muitos dos nossos comportamentos, escolhas e conflitos vêm de valores que atuam no "piloto automático", sem que a gente tenha consciência deles. Tornar esses valores claros traz benefícios profundos tanto na vida pessoal quanto na profissional.
            </p>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">O que são valores, na prática</h3>
              <p className="mb-3">
                Valores são critérios internos que orientam decisões, definem o que é importante, aceitável ou inegociável para alguém. Eles influenciam:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>o que motiva ou desmotiva</li>
                <li>como a pessoa reage a conflitos</li>
                <li>que tipo de ambiente gera bem-estar ou sofrimento</li>
                <li>quando ela diz "sim" ou "não"</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Benefícios na vida pessoal</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">1. Decisões mais coerentes e menos arrependimento</h4>
                  <p className="mb-2">Quando a pessoa conhece seus valores, ela escolhe com mais clareza:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>relacionamentos</li>
                    <li>prioridades de vida</li>
                    <li>limites pessoais</li>
                  </ul>
                  <p className="mt-2">Isso reduz a sensação de "fiz tudo certo, mas algo está errado".</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">2. Menos conflitos internos</h4>
                  <p>Muita ansiedade vem de viver contra os próprios valores (ex.: valorizar liberdade, mas viver preso a expectativas externas). A clareza ajuda a alinhar vida real e identidade.</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">3. Relacionamentos mais saudáveis</h4>
                  <p className="mb-2">Quem conhece seus valores:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>comunica limites com mais segurança</li>
                    <li>entende melhor por que certos comportamentos do outro incomodam</li>
                    <li>evita relações incompatíveis a longo prazo</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">4. Maior senso de propósito</h4>
                  <p>Valores dão direção. A vida deixa de ser só reação a demandas externas e passa a ter um "porquê" claro.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Benefícios na vida profissional</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">1. Escolhas de carreira mais alinhadas</h4>
                  <p className="mb-2">Clareza de valores ajuda a responder perguntas como:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Esse trabalho combina com o que é importante para mim?</li>
                    <li>O problema é a função, a empresa ou a falta de alinhamento de valores?</li>
                  </ul>
                  <p className="mt-2">Isso evita trocar de emprego repetidamente sem entender o motivo do desconforto.</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">2. Aumento de motivação e engajamento</h4>
                  <p>Quando o trabalho respeita valores centrais (ex.: autonomia, impacto social, aprendizado), a energia vem com menos esforço.</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">3. Tomada de decisão mais rápida e segura</h4>
                  <p className="mb-2">Valores funcionam como um filtro:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>aceitar ou recusar oportunidades</li>
                    <li>negociar propostas</li>
                    <li>definir prioridades em ambientes de pressão</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-1">4. Liderança e comunicação mais autênticas</h4>
                  <p className="mb-2">Profissionais que conhecem seus valores:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>lideram com mais consistência</li>
                    <li>transmitem confiança</li>
                    <li>tomam decisões que fazem sentido mesmo sob crítica</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Por que usar a ferramenta, e não só "pensar sobre isso"?</h3>
              <p className="mb-2">Ferramentas ajudam porque:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>tiram os valores do nível abstrato</li>
                <li>revelam conflitos entre valores (ex.: segurança vs. liberdade)</li>
                <li>diferenciam valores reais de valores "aprendidos" ou impostos</li>
                <li>evitam vieses e autoengano</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">
                Elas aceleram um processo que, sozinho, pode levar anos.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ValuesScientificModal;
