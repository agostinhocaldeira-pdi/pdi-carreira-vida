import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Loader2, Target, CheckCircle2, Sparkles, Bot } from "lucide-react";
import { useSmartExplanationAudio } from "@/hooks/useSmartExplanationAudio";

interface SmartScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SmartScientificModal = ({ open, onOpenChange }: SmartScientificModalProps) => {
  const { isPlaying: audioPlaying, isLoading: audioLoading, toggleAudio } = useSmartExplanationAudio();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Entenda melhor a SMART
          </DialogTitle>
          
          {/* Audio button below title */}
          <button
            onClick={toggleAudio}
            disabled={audioLoading}
            className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50 mt-4 mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {audioLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : audioPlaying ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </div>
            <span className="text-xs">
              {audioLoading ? "Carregando..." : audioPlaying ? "Clique para parar" : "Clique para ouvir"}
            </span>
          </button>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            
            {/* Section: Objetivo vs Meta */}
            <section className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                Objetivo vs Meta
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Objetivo
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    É o seu sonho, sua direção geral. Mais amplo e genérico.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">Exemplo:</Badge>
                    <p className="text-sm italic">"Ser fluente em inglês"</p>
                    <p className="text-sm italic">"Ter uma carreira de sucesso"</p>
                    <p className="text-sm italic">"Ser mais saudável"</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Meta SMART
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    É o passo concreto e mensurável para alcançar seu objetivo.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">Exemplo:</Badge>
                    <p className="text-sm italic">"Obter certificado TOEFL com 100 pontos até dezembro"</p>
                    <p className="text-sm italic">"Ser promovido a gerente até junho de 2026"</p>
                    <p className="text-sm italic">"Perder 10kg em 6 meses praticando 4x/semana"</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: O que é SMART */}
            <section className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                O que é SMART?
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                SMART é um método para criar metas eficazes através de 5 critérios:
              </p>
              <div className="grid sm:grid-cols-5 gap-2 mb-4">
                {["Específico", "Mensurável", "Atingível", "Relevante", "Temporal"].map((item, i) => (
                  <Badge key={i} className="justify-center">{item}</Badge>
                ))}
              </div>
              <ul className="list-none space-y-1 ml-2 text-sm">
                <li><strong>S – Específica:</strong> deixa claro o que deve ser feito</li>
                <li><strong>M – Mensurável:</strong> permite acompanhar progresso e resultado</li>
                <li><strong>A – Atingível:</strong> respeita sua realidade atual</li>
                <li><strong>R – Relevante:</strong> faz sentido para sua vida e seus objetivos maiores</li>
                <li><strong>T – Temporal:</strong> tem prazo definido</li>
              </ul>
            </section>

            {/* Section: Mentoria IA */}
            <section className="p-4 bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-600" />
                Mentoria IA Integrada
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Em cada passo do método SMART, você pode solicitar <strong>1 feedback gratuito</strong> do mentor IA 
                que avalia a consistência, profundidade e alinhamento do seu texto com o objetivo e sua Visão de Vida Desejada.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>1 uso por passo</strong> • Aproveite para refinar cada etapa da sua meta
              </p>
            </section>

            {/* Section: Por que usar */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">Por que usar Metas SMART</h3>
              <p className="mb-2">Metas mal definidas geram:</p>
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

            {/* Section: Benefícios vida pessoal */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">Benefícios na vida pessoal</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ter clareza sobre o que realmente quer mudar ou conquistar</li>
                <li>Dividir grandes objetivos em metas possíveis de executar</li>
                <li>Acompanhar evolução real, não apenas esforço</li>
                <li>Reduzir culpa e autocrítica por "não conseguir manter o foco"</li>
                <li>Criar constância sem depender de motivação</li>
              </ul>
            </section>

            {/* Section: Benefícios vida profissional */}
            <section>
              <h3 className="font-semibold text-foreground mb-2">Benefícios na vida profissional</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Priorizar o que realmente gera resultado</li>
                <li>Alinhar esforço diário com crescimento de carreira ou negócio</li>
                <li>Tomar decisões baseadas em dados, não em achismo</li>
                <li>Comunicar objetivos com clareza (com equipes, líderes ou parceiros)</li>
                <li>Avaliar desempenho de forma justa e objetiva</li>
              </ul>
            </section>

            {/* Section: Conexão com PDI */}
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
                Elas não são um fim. São um meio estruturado para transformar visão em realidade.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Em resumo</h3>
              <p className="mb-3">
                Usar Metas SMART não é sobre rigidez ou cobrança excessiva. É sobre clareza, direção e respeito à sua própria realidade.
              </p>
              <p className="font-medium text-foreground">
                Quando suas metas são claras, o caminho fica mais leve. E o progresso deixa de ser uma promessa distante para se tornar algo visível e constante.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SmartScientificModal;
