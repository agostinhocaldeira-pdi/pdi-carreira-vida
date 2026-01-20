import { AlertTriangle, ArrowRight, ArrowDown, Brain, RefreshCw, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProblemSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Por que é tão difícil mudar sozinho?
        </h2>

        {/* Statistics */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div className="text-left">
              <p className="text-3xl sm:text-4xl font-bold text-destructive">92%</p>
              <p className="text-sm text-muted-foreground">das pessoas não alcançam os objetivos que definem</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            Estudos amplamente citados, como os da University of Scranton, mostram que apenas cerca de 8% conseguem sustentar metas ao longo do tempo.
          </p>
        </div>

        {/* Key problems */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-500" />
                O problema não é querer
              </h3>
              <p className="text-muted-foreground">
                É não ter um <span className="font-semibold text-foreground">sistema que sustente a ação</span>. 
                A maioria até começa… mas desiste nos primeiros meses.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3">Por que isso acontece?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  Metas ficam vagas ou genéricas
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  Não há prazos, indicadores ou etapas claras
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  A intenção não vira ação
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                  Maus hábitos vencem boas intenções
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* The cycle */}
        <Card className="mb-12 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <h3 className="font-bold text-xl text-foreground mb-6 text-center flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 text-destructive" />
              O ciclo da escassez
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
              {[
                "Começa",
                "Falha ou abandona",
                "Sente frustração e culpa",
                "Passa a duvidar de si",
                "Evita novas tentativas",
                "Perde oportunidades",
                "Confirma a crença de incapacidade"
              ].map((step, index, arr) => (
                <span key={index} className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="px-3 py-2 rounded-lg bg-destructive/10 text-foreground font-medium text-center">
                    {step}
                  </span>
                  {index < arr.length - 1 && (
                    <>
                      <ArrowDown className="w-4 h-4 text-muted-foreground sm:hidden" />
                      <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </>
                  )}
                </span>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-6">
              Esse ciclo se autoalimenta. Se mantido por anos, pode gerar:
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
                Estagnação profissional e financeira
              </span>
              <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
                Sensação de "vida não vivida"
              </span>
              <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
                Ansiedade e perda de propósito
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Positive note */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 sm:p-8 text-center">
            <Lightbulb className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">
              Um ponto essencial
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Esse padrão <span className="font-semibold text-foreground">não define quem você é</span>.
              Ele reflete processos aprendidos, crenças construídas e estratégias emocionais que um dia protegeram — mas que hoje não servem mais.
            </p>
            <p className="text-primary font-semibold mt-4 text-lg">
              👉 E tudo que foi aprendido pode ser reconstruído.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProblemSection;
