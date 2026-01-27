import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, CheckCircle, Lightbulb, BookOpen } from "lucide-react";

interface TaskExternalizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskExternalizationModal = ({ open, onOpenChange }: TaskExternalizationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            A Técnica de Externalização de Tarefas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4 text-sm text-muted-foreground">
          {/* Introdução */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <p className="leading-relaxed">
              <strong className="text-foreground">Tirar da mente e colocar no papel</strong> é uma das técnicas mais 
              poderosas para reduzir ansiedade, aumentar foco e liberar espaço mental para o que realmente importa.
            </p>
          </div>

          {/* Por que funciona */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Por que isso funciona?
            </h3>
            <p className="leading-relaxed">
              Quando mantemos tarefas apenas na memória, nosso cérebro trabalha constantemente para não esquecê-las. 
              Esse "loop aberto" consome energia cognitiva e gera ansiedade, mesmo quando não estamos ativamente 
              pensando nas tarefas.
            </p>
            <p className="leading-relaxed">
              Ao registrar a tarefa em um sistema externo confiável, você sinaliza ao cérebro que a informação 
              está segura. Isso interrompe o ciclo de preocupação e libera recursos mentais.
            </p>
          </div>

          {/* Validação Científica */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Validação Científica
            </h3>
            
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">
                  Efeito Zeigarnik
                </p>
                <p className="text-xs leading-relaxed">
                  Bluma Zeigarnik (1927) descobriu que tarefas incompletas ocupam mais espaço mental que 
                  as concluídas. O simples ato de anotar uma tarefa reduz essa "tensão cognitiva".
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">
                  Getting Things Done (GTD)
                </p>
                <p className="text-xs leading-relaxed">
                  David Allen, em seu best-seller "A Arte de Fazer Acontecer", sistematizou a prática de 
                  capturar todas as tarefas em um sistema confiável como base para a produtividade sem estresse.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">
                  Carga Cognitiva
                </p>
                <p className="text-xs leading-relaxed">
                  Pesquisas em psicologia cognitiva (Sweller, 1988) mostram que nossa memória de trabalho é 
                  limitada. Externalizar informações libera capacidade para pensamento criativo e tomada de decisão.
                </p>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Benefícios Comprovados
            </h3>
            <ul className="space-y-2">
              {[
                "Redução da ansiedade e preocupação constante",
                "Maior clareza mental e capacidade de foco",
                "Melhor qualidade de sono (sem pendências rondando a mente)",
                "Aumento da sensação de controle sobre a vida",
                "Liberação de energia para atividades criativas"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-xs leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-4 border-l-2 border-primary">
            <p className="text-xs leading-relaxed text-foreground">
              <strong>Dica prática:</strong> Use esta área para registrar qualquer tarefa avulsa que surgir 
              durante o dia. Não julgue, apenas capture. Você pode organizar e priorizar depois.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
