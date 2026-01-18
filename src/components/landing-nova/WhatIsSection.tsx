import { XCircle, CheckCircle2 } from "lucide-react";

const WhatIsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          O que é o PDI – Carreira e Vida?
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* O que NÃO é */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
              <span className="text-foreground font-medium">Não é um curso.</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
              <span className="text-foreground font-medium">Não é um PDF.</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
              <span className="text-foreground font-medium">Não é uma planilha solta.</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-4 sm:p-6 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 sm:w-8 h-6 sm:h-8 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground text-sm sm:text-lg leading-relaxed">
                  É uma <span className="font-bold text-primary">plataforma digital interativa</span>, 
                  com um sistema guiado baseado em Método e ferramentas validadas, para transformar 
                  objetivos pessoais e profissionais em <span className="font-bold">planos práticos</span>, 
                  compatíveis com sua rotina real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
