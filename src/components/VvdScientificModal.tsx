import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, Loader2, VolumeX } from "lucide-react";
import { useVvdExplanationAudio } from "@/hooks/useVvdExplanationAudio";

interface VvdScientificModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VvdScientificModal = ({ open, onOpenChange }: VvdScientificModalProps) => {
  const { isLoading, isPlaying, toggleAudio } = useVvdExplanationAudio();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            A importância de saber claramente o que você quer para sua vida
          </DialogTitle>
        </DialogHeader>
        
        {/* Audio Player Button */}
        <div className="flex justify-center py-2">
          <button
            onClick={toggleAudio}
            disabled={isLoading}
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="w-6 h-6 text-primary" />
              ) : (
                <Volume2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <span className="text-xs font-medium">
              {isLoading ? "Carregando..." : isPlaying ? "Clique para parar" : "Clique para ouvir"}
            </span>
          </button>
        </div>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            {/* Intro Section - How to write your VVD */}
            <section className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 text-base">Como você deseja que sua vida seja?</h3>
              <p className="mb-4">
                Escreva livremente sobre a vida que você sonha viver, baseado em seus valores e nas áreas que mais importam para você.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <p className="text-xs font-medium text-foreground mb-1">Exemplo de VVD:</p>
                <p className="italic text-xs leading-relaxed">
                  "Quero viver com integridade, ser uma pessoa honesta, responsável e compassiva, buscando sempre o crescimento pessoal e profissional. Eu valorizo a importância da família e dos amigos, e me esforço para cultivar relacionamentos saudáveis e significativos..."
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Por que este exercício é essencial</h3>
              <p className="mb-3">
                A maioria das pessoas vive resolvendo urgências, cumprindo tarefas e reagindo às circunstâncias, sem nunca ter parado para definir com clareza que vida deseja construir.
              </p>
              <p className="mb-3">
                Sem essa definição, qualquer objetivo parece confuso, qualquer meta perde força e qualquer esforço corre o risco de não levar ao lugar certo.
              </p>
              <p className="mb-3 font-medium text-foreground">
                A VVD – Visão de Vida Desejada existe para romper esse ciclo.
              </p>
              <p>
                Este exercício não é sobre sonhar de forma vaga ou criar fantasias irreais. Ele é sobre <strong>clareza estratégica</strong>.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">O que a VVD faz por você</h3>
              <p className="mb-2">Ao construir sua Visão de Vida Desejada, você:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Define como quer viver, não apenas o que quer conquistar</li>
                <li>Dá sentido às decisões de carreira, dinheiro, rotina, relacionamentos e crescimento pessoal</li>
                <li>Cria um norte claro para todas as metas e ações futuras</li>
                <li>Reduz conflitos internos, indecisão e sensação de estar "perdido"</li>
                <li>Passa a avaliar escolhas com base em alinhamento, não apenas em oportunidade</li>
              </ul>
              <p className="mt-3 italic">
                Sem uma visão clara, metas viram obrigações.<br />
                Com uma visão clara, metas passam a ser meios.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Por que a VVD vem antes de metas e ações</h3>
              <p className="mb-3">
                No sistema PDI, nada começa por tarefas ou listas de objetivos isolados.
              </p>
              <p className="mb-2">A lógica é simples:</p>
              <p className="font-medium text-foreground mb-3 italic">
                "Ações corretas só existem quando a direção está clara."
              </p>
              <p className="mb-2">A VVD é a base sobre a qual todo o seu PDI será construído. Ela orienta:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Quais objetivos fazem sentido para você</li>
                <li>Quais metas devem ser priorizadas</li>
                <li>Quais esforços valem a pena</li>
                <li>O que deve ser evitado, mesmo que pareça "uma boa oportunidade"</li>
              </ul>
              <p className="mt-3 font-medium text-foreground">
                Sem a VVD, você pode até avançar — mas corre o risco de avançar na direção errada.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Como encarar este exercício</h3>
              <p className="mb-3">
                Faça a VVD com calma, honestidade e profundidade.
              </p>
              <p className="mb-3">
                Não escreva o que "fica bonito", nem o que os outros esperam de você. Escreva o que realmente representa a vida que você quer viver — na prática, no dia a dia.
              </p>
              <p className="font-medium text-foreground">
                Este não é um exercício para agradar ninguém. É um exercício para alinhar sua vida com quem você é e com o que você quer construir.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Lembre-se</h3>
              <p className="mb-3">
                A VVD não engessa sua vida. <strong>Ela organiza.</strong>
              </p>
              <p className="mb-3">
                Ela não tira liberdade. <strong>Ela aumenta sua consciência sobre as escolhas que você faz.</strong>
              </p>
              <p className="font-medium text-foreground">
                Tudo o que você construir daqui para frente no PDI parte daqui. Quanto mais clara for sua Visão de Vida Desejada, mais consistente, leve e eficaz será sua jornada.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VvdScientificModal;
