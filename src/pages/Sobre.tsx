import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Quote } from "lucide-react";
import Logo from "@/components/Logo";
import agostinhoImage from "@/assets/agostinho-caldeira-new.jpg";

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-24 sm:pt-28">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center lg:justify-start order-1 lg:order-2">
              <div className="relative">
                <div className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                  <img 
                    src={agostinhoImage} 
                    alt="Agostinho Caldeira" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-lg">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">Agostinho Caldeira</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                O criador do Método SEPP
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                Mais de uma década de experiência em desenvolvimento de pessoas e carreiras, agora estruturada em um método único e comprovado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6 sm:p-10">
              <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Sou <strong className="text-foreground">Agostinho</strong>, formado em Gestão pela FGV e com mais de dez anos dedicados ao desenvolvimento de pessoas, focado em vida e carreira.
                </p>
                <p>
                  Minha experiência pessoal também foi decisiva: no mesmo ano em que me tornei pai pela primeira vez, assumi minha primeira posição de liderança, com uma equipe de doze analistas sem experiência prévia em gestão. Os erros e desafios vividos me fizeram investir profundamente em aprendizado e desenvolvimento consciente.
                </p>
                <p>
                  A partir dessas experiências, desenvolvi o <strong className="text-foreground">Método SEPP</strong>, um sistema estruturado que transforma objetivos em ações consistentes, sustentando evolução pessoal e profissional. Com o avanço da Inteligência Artificial, adaptei o método para integrar tecnologia como ferramenta estratégica, mantendo o protagonismo humano.
                </p>
                <p>
                  Hoje, sou o criador do <strong className="text-primary">PDI – Carreira e Vida</strong>, sistema que reúne toda essa experiência, aprendizado e método, ajudando pessoas a evoluir com clareza, direção e continuidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Nosso compromisso com a evolução
            </h2>
          </div>
          
          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
            <CardContent className="p-6 sm:p-10">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Quote className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed text-center">
                <p>
                  <em>Evoluir não é fazer mais — é fazer melhor.</em> O SEPP nasceu da constatação de que pessoas não falham por falta de vontade, mas por ausência de estrutura. Nosso método organiza decisões, transforma intenções em ações e mantém a evolução contínua.
                </p>
                <p>
                  Não oferecemos atalhos ou promessas irreais. O SEPP é para quem busca um caminho estruturado e sustentável para crescer, integrando vida e carreira com clareza, consistência e protagonismo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Descubra como o PDI – Carreira e Vida pode transformar seus objetivos em ação.
          </h2>
          <Button 
            size="lg" 
            onClick={() => navigate("/signup")}
            className="text-base sm:text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          >
            Começar minha evolução
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDI – Carreira e Vida. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;
