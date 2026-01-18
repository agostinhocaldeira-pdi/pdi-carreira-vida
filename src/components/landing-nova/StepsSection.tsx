import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lightbulb, Rocket, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

// Import step images
import maoNaMassaVideo from "@/assets/mao-na-massa-video.mp4";
import progressoImg from "@/assets/tutorial/progresso.jpg";

// Import gallery images for Planejar
import objetivosImg from "@/assets/landing/objetivos.png";
import vvdImg from "@/assets/landing/vvd.png";
import rodaDaVidaImg from "@/assets/landing/roda-da-vida.png";
import valoresImg from "@/assets/landing/valores.png";

const planejarGallery = [
  { src: rodaDaVidaImg, alt: "Roda da Vida" },
  { src: valoresImg, alt: "Descobrindo Seus Valores" },
  { src: vvdImg, alt: "Visão de Vida Desejada" },
  { src: objetivosImg, alt: "Definindo Objetivos" },
];

const steps = [
  {
    number: "1",
    title: "Planejar",
    subtitle: "Módulo de Clareza",
    description: "Entenda seu momento atual, prioridades e o que realmente importa agora, para definir objetivos e transformá-los em ações compatíveis com sua rotina real.",
    icon: Lightbulb,
    image: null, // Will use gallery instead
    color: "primary",
    hasGallery: true
  },
  {
    number: "2",
    title: "Agir",
    subtitle: "Módulo de Rotina",
    description: "O sistema transforma \"sonhos grandes\" em tarefas semanais. Você acorda na segunda-feira sabendo exatamente o que priorizar.",
    icon: Rocket,
    video: maoNaMassaVideo,
    color: "accent",
    hasGallery: false,
    hasVideo: true
  },
  {
    number: "3",
    title: "Evoluir",
    subtitle: "Módulo de IA",
    description: "Acompanhe seu progresso com gráficos e relatórios, e receba feedbacks da nossa Inteligência Artificial para corrigir a rota.",
    icon: TrendingUp,
    image: progressoImg,
    color: "success",
    hasGallery: false
  }
];

const ImageGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % planejarGallery.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + planejarGallery.length) % planejarGallery.length);
  }, []);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const openModal = (image: { src: string; alt: string }) => {
    setSelectedImage(image);
    setModalOpen(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setIsPaused(false);
  };

  return (
    <>
      <div 
        className="relative h-64 overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gallery Images */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {planejarGallery.map((image, idx) => (
            <div 
              key={idx} 
              className="min-w-full h-full cursor-pointer"
              onClick={() => openModal(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>


        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {planejarGallery.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-background/60 hover:bg-background/80'
              }`}
            />
          ))}
        </div>

        {/* Step number badge */}
        <div 
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg z-10"
          style={{ backgroundColor: `hsl(var(--primary))` }}
        >
          1
        </div>
      </div>

      {/* Modal for full image */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl w-[95vw] p-2" hideCloseButton>
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg"
              />
              <p className="text-center text-sm text-muted-foreground mt-2">
                {selectedImage.alt}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const StepsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Do Caos à Clareza em 3 Passos
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Um método simples e eficaz para transformar seus objetivos em realidade
        </p>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-t-4 hover:shadow-xl transition-all duration-300"
              style={{ borderTopColor: `hsl(var(--${step.color}))` }}
            >
              <CardContent className="p-0">
                {/* Image or Gallery */}
                {step.hasGallery ? (
                  <ImageGallery />
                ) : step.hasVideo ? (
                  <div className="relative aspect-video overflow-hidden">
                    <video 
                      src={step.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Step number badge */}
                    <div 
                      className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg z-10"
                      style={{ backgroundColor: `hsl(var(--${step.color}))` }}
                    >
                      {step.number}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={step.image!} 
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    
                    {/* Step number badge */}
                    <div 
                      className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: `hsl(var(--${step.color}))` }}
                    >
                      {step.number}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon 
                      className="w-6 h-6" 
                      style={{ color: `hsl(var(--${step.color}))` }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: `hsl(var(--${step.color}))` }}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
