import { Card, CardContent } from "@/components/ui/card";
import { Play, Linkedin } from "lucide-react";

// Import testimonial images
import ericImg from "@/assets/testimonials/eric-pereira.jpg";
import gabrieleImg from "@/assets/testimonials/gabriele-campos.jpg";
import larissaImg from "@/assets/testimonials/larissa-schuartz.jpg";
import lucasImg from "@/assets/testimonials/lucas-sa.jpg";

const testimonials = [
  {
    name: "Eric Pereira",
    image: ericImg,
    quote: "O PDI me ajudou a organizar minha rotina de forma que eu nunca tinha conseguido antes. Hoje tenho clareza do que preciso fazer cada semana.",
    videoUrl: "https://www.youtube.com/embed/i1VgEBOW4PI",
    linkedinUrl: "https://linkedin.com",
    note: null
  },
  {
    name: "Gabriele Campos",
    image: gabrieleImg,
    quote: "Finalmente consegui sair do ciclo de procrastinação. O sistema guiado faz toda a diferença.",
    videoUrl: "https://www.youtube.com/embed/NjEA4WBiUvA",
    linkedinUrl: "https://linkedin.com",
    note: "(após PDI, ela conseguiu ser promovida em 3 meses)"
  },
  {
    name: "Larissa Schuartz",
    image: larissaImg,
    quote: "A inteligência artificial do PDI me dá insights que eu não teria sozinha. É como ter um coach disponível 24h.",
    videoUrl: "https://www.youtube.com/embed/Tpz2mmxUYHc",
    linkedinUrl: "https://linkedin.com",
    note: null
  },
  {
    name: "Lucas Sá",
    image: lucasImg,
    quote: "Em 3 meses usando o PDI, consegui uma promoção que vinha buscando há 2 anos. O método funciona.",
    videoUrl: null,
    linkedinUrl: "https://linkedin.com",
    note: null
  }
];

interface TestimonialsSectionProps {
  onOpenVideo: (url: string) => void;
}

const TestimonialsSection = ({ onOpenVideo }: TestimonialsSectionProps) => {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Pessoas reais. Rotinas organizadas. Resultados atingidos.
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Veja como o PDI está transformando a vida de pessoas comuns
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Image with video play button */}
                <div className="relative">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full aspect-square object-cover"
                  />
                  {testimonial.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => onOpenVideo(testimonial.videoUrl!)}
                        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                    </div>
                    <a 
                      href={testimonial.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  {testimonial.note && (
                    <p className="text-xs text-primary mt-2 font-medium">
                      {testimonial.note}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
