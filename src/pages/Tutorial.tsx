import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Download, BookOpen, Target, CheckSquare, Calendar, Wrench, TrendingUp, Link2, User, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Logo from "@/components/Logo";

// Import tutorial images
import onboardingImg from "@/assets/tutorial/1-onboarding.png";
import planoVidaImg from "@/assets/tutorial/2-plano-vida.png";
import maoNaMassaImg from "@/assets/tutorial/3-mao-na-massa.png";
import diarioImg from "@/assets/tutorial/4-diario.png";
import ferramentasImg from "@/assets/tutorial/5-ferramentas.png";
import progressoImg from "@/assets/tutorial/6-progresso.png";
import integracoesImg from "@/assets/tutorial/7-integracoes.png";
import perfilImg from "@/assets/tutorial/8-perfil.png";

const Tutorial = () => {
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const sections = [
    {
      id: "onboarding",
      icon: BookOpen,
      title: "1. Onboarding e Configuração Inicial",
      image: onboardingImg,
      imageAlt: "Tela inicial do PDI Carreira & Vida",
      flowSteps: ["Acesse a landing page", "Clique em 'Começar minha jornada'", "Preencha seus dados pessoais", "Complete o endereço com CEP", "Escolha seu plano", "Finalize o cadastro"],
      content: [
        {
          subtitle: "Criando sua conta",
          text: "Ao acessar o PDI Carreira & Vida pela primeira vez, você será guiado por um processo de onboarding personalizado. Preencha seus dados pessoais, endereço e expectativas para que possamos personalizar sua experiência."
        },
        {
          subtitle: "Escolhendo seu plano",
          text: "Após completar o cadastro, escolha entre os planos disponíveis: Gratuito (com recursos limitados), Básico (R$ 14,90/mês com recursos completos) ou Completo (em breve). O plano Básico está em promoção de lançamento com todos os recursos do plano Completo."
        },
        {
          subtitle: "Pesquisa de perfil",
          text: "Complete a pesquisa de perfil para que possamos gerar insights personalizados baseados nos seus hábitos, objetivos e estilo de aprendizagem."
        }
      ]
    },
    {
      id: "plano-vida",
      icon: Target,
      title: "2. Plano de Vida",
      image: planoVidaImg,
      imageAlt: "Interface do Plano de Vida com VVD e valores",
      flowSteps: ["Menu lateral → Plano de Vida", "Preencha seu VVD", "Defina seus 12 valores", "Cadastre até 3 objetivos", "Conecte objetivos ao VVD"],
      content: [
        {
          subtitle: "VVD - Visão de Vida Desejada",
          text: "O VVD é o coração do seu PDI. Descreva em detalhes como você deseja que sua vida seja. Esta visão guiará todos os seus objetivos e ações. Clique em 'Entenda como criar seu VVD' para acessar a ferramenta de construção guiada."
        },
        {
          subtitle: "Meus Valores",
          text: "Identifique seus 12 valores fundamentais. Estes valores são a bússola que orientará suas decisões e prioridades. Preencha os campos com os valores que mais representam quem você é."
        },
        {
          subtitle: "Meus Objetivos",
          text: "Cadastre até 3 objetivos principais (recomendamos focar em apenas 1 grande objetivo). Cada objetivo deve ter: texto descritivo, data alvo, conexão com seu VVD e status de acompanhamento. Lembre-se: 'Quem muito quer, pouco consegue'."
        }
      ]
    },
    {
      id: "mao-na-massa",
      icon: CheckSquare,
      title: "3. Mão na Massa",
      image: maoNaMassaImg,
      imageAlt: "Tabela de metas cadastradas",
      flowSteps: ["Acesse Mão na Massa", "Selecione um objetivo", "Cadastre uma nova meta", "Defina data alvo e status", "Adicione ações à meta", "Acompanhe na tabela"],
      content: [
        {
          subtitle: "Cadastrando Metas",
          text: "Para cada objetivo, crie metas específicas e mensuráveis. Selecione o objetivo relacionado no dropdown, defina a meta, data alvo e status. A meta deve ser um marco intermediário para alcançar seu objetivo maior."
        },
        {
          subtitle: "Definindo Ações",
          text: "Cada meta pode ter múltiplas ações. Ações são tarefas concretas com periodicidade (diária, semanal, mensal) e status. Use a tabela interativa para adicionar, editar e acompanhar suas ações."
        },
        {
          subtitle: "Passos Detalhados",
          text: "Quebre suas ações em passos menores quando necessário. Isso facilita o acompanhamento e mantém você motivado ao ver progresso constante."
        }
      ]
    },
    {
      id: "diario",
      icon: Calendar,
      title: "4. Diário",
      image: diarioImg,
      imageAlt: "Interface do diário com registro de humor e reflexões",
      flowSteps: ["Acesse o Diário", "Selecione 'Registro de Hoje'", "Escolha seu humor do dia", "Escreva reflexões e gratidão", "Marque hábitos concluídos", "Salve o registro"],
      content: [
        {
          subtitle: "Registro de Hoje",
          text: "Registre diariamente suas reflexões, conquistas, gratidão e humor. O diário só pode ser preenchido para o dia atual, garantindo autenticidade e responsabilidade no registro."
        },
        {
          subtitle: "Histórico de Humor",
          text: "Visualize seu histórico de humor em gráficos interativos. Passe o mouse sobre os pontos para ver detalhes do dia, incluindo reflexões e hábitos completados."
        },
        {
          subtitle: "Hábitos Diários",
          text: "Marque os hábitos que você completou no dia. Isso ajuda a construir consistência e é considerado no cálculo de streaks e gamificação."
        }
      ]
    },
    {
      id: "ferramentas",
      icon: Wrench,
      title: "5. Ferramentas de Autoconhecimento",
      image: ferramentasImg,
      imageAlt: "Página de ferramentas de autodesenvolvimento",
      flowSteps: ["Menu → Ferramentas", "Escolha uma ferramenta", "Complete o exercício guiado", "Salve seus resultados", "Volte quando quiser revisar"],
      content: [
        {
          subtitle: "Roda da Vida",
          text: "Avalie 8 áreas da sua vida de 0 a 10 (atual e desejado). O gráfico radar mostra visualmente onde você está e onde quer chegar, ajudando a identificar áreas que precisam de mais atenção."
        },
        {
          subtitle: "Análise SWOT Pessoal",
          text: "Identifique suas Forças, Fraquezas, Oportunidades e Ameaças. Esta ferramenta estratégica ajuda você a entender seu posicionamento atual e planejar melhorias."
        },
        {
          subtitle: "Método VVD",
          text: "Construa sua Visão de Vida Desejada de forma guiada, respondendo perguntas que ajudam a clarificar o que você realmente quer para sua vida."
        },
        {
          subtitle: "Método SMART",
          text: "Transforme ideias vagas em metas Específicas, Mensuráveis, Alcançáveis, Relevantes e Temporais. As metas criadas aqui podem ser importadas diretamente para seu Plano de Vida."
        },
        {
          subtitle: "Matriz de Eisenhower",
          text: "Organize suas tarefas em 4 quadrantes baseados em urgência e importância. Isso ajuda a priorizar o que realmente importa e eliminar distrações."
        },
        {
          subtitle: "Crenças Limitantes",
          text: "Identifique crenças que estão te impedindo de progredir e transforme-as em crenças potencializadoras através de um processo guiado de questionamento."
        },
        {
          subtitle: "Autoavaliação 360°",
          text: "Faça uma avaliação completa de suas competências e receba feedback estruturado. A ferramenta inclui análise de IA para insights personalizados."
        }
      ]
    },
    {
      id: "progresso",
      icon: TrendingUp,
      title: "6. Progresso e Insights",
      image: progressoImg,
      imageAlt: "Dashboard de progresso com gamificação e insights",
      flowSteps: ["Acesse o Dashboard", "Veja barras de progresso", "Confira itens pendentes", "Gere insights de IA", "Acompanhe gamificação", "Exporte relatórios PDF"],
      content: [
        {
          subtitle: "Dashboard de Progresso",
          text: "Acompanhe o progresso de objetivos, metas e ações em barras visuais. Veja itens pendentes ou com prazo expirado em destaque para ação imediata."
        },
        {
          subtitle: "Insights de IA",
          text: "Gere insights personalizados baseados em seus dados (VVD, valores, áreas da vida, pesquisa de perfil). Usuários do plano Básico podem gerar 1 insight por mês; administradores têm acesso ilimitado."
        },
        {
          subtitle: "Gamificação",
          text: "Acompanhe seu nível, pontos e conquistas. O sistema de streaks recompensa a consistência diária, incentivando o uso regular da plataforma."
        },
        {
          subtitle: "Relatórios em PDF",
          text: "Exporte seu PDI completo ou relatório de progresso em PDF para compartilhar com mentores, coaches ou para seu próprio arquivo."
        }
      ]
    },
    {
      id: "integracoes",
      icon: Link2,
      title: "7. Integrações",
      image: integracoesImg,
      imageAlt: "Página de integrações com Google Calendar conectado",
      flowSteps: ["Menu → Integrações", "Clique em Conectar", "Autorize com Google", "Sincronize metas", "Eventos criados automaticamente"],
      content: [
        {
          subtitle: "Google Calendar",
          text: "Conecte sua conta Google para sincronizar metas e ações com seu calendário. Eventos são criados automaticamente com as datas alvo definidas no PDI."
        },
        {
          subtitle: "Outras Integrações",
          text: "Novas integrações estão sendo desenvolvidas e serão disponibilizadas em breve, incluindo Notion e outras ferramentas de produtividade."
        }
      ]
    },
    {
      id: "perfil",
      icon: User,
      title: "8. Perfil e Assinatura",
      image: perfilImg,
      imageAlt: "Página de notificações e lembretes",
      flowSteps: ["Clique em Perfil no header", "Visualize seus dados", "Edite informações", "Gerencie assinatura", "Configure notificações"],
      content: [
        {
          subtitle: "Dados Pessoais",
          text: "Visualize e edite suas informações pessoais, incluindo nome, e-mail e telefone. Se você está vinculado a uma empresa, as informações da empresa também são exibidas."
        },
        {
          subtitle: "Gerenciar Assinatura",
          text: "Acesse o portal de pagamento para gerenciar sua assinatura, atualizar método de pagamento ou cancelar o plano. O acesso continua até o fim do período pago."
        },
        {
          subtitle: "Notificações",
          text: "Configure suas preferências de notificação por e-mail: lembretes do diário, alertas de prazo de metas e resumo semanal de progresso."
        }
      ]
    }
  ];

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Pre-load all images
      const imagePromises = sections.map(section => 
        section.image ? loadImage(section.image).catch(() => null) : Promise.resolve(null)
      );
      const loadedImages = await Promise.all(imagePromises);

      // Title page
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("Tutorial PDI Carreira & Vida", pageWidth / 2, 35, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Guia Completo para Pessoa Física", pageWidth / 2, 48, { align: "center" });

      yPos = 80;
      pdf.setTextColor(0, 0, 0);

      // Table of contents
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Índice", margin, yPos);
      yPos += 15;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      sections.forEach((section) => {
        pdf.text(`${section.title}`, margin, yPos);
        yPos += 8;
      });

      pdf.addPage();
      yPos = margin;

      // Content sections
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionImage = loadedImages[i];

        // Calculate space needed for header + image together
        let headerAndImageHeight = 20; // header height
        if (sectionImage) {
          const imgWidth = contentWidth;
          const imgHeight = (sectionImage.height / sectionImage.width) * imgWidth;
          const maxImgHeight = 55;
          const finalImgHeight = Math.min(imgHeight, maxImgHeight);
          headerAndImageHeight += finalImgHeight + 10;
        }
        
        // Check if we need a new page for header+image together
        checkNewPage(headerAndImageHeight);

        // Section header
        pdf.setFillColor(59, 130, 246);
        pdf.rect(margin, yPos, contentWidth, 12, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(section.title, margin + 5, yPos + 8);
        
        yPos += 18;
        pdf.setTextColor(0, 0, 0);

        // Add image if loaded (now guaranteed to be on same page as header)
        if (sectionImage) {
          const imgWidth = contentWidth;
          const imgHeight = (sectionImage.height / sectionImage.width) * imgWidth;
          const maxImgHeight = 55;
          const finalImgHeight = Math.min(imgHeight, maxImgHeight);
          const finalImgWidth = (finalImgHeight / imgHeight) * imgWidth;
          
          try {
            pdf.addImage(sectionImage, 'PNG', margin + (contentWidth - finalImgWidth) / 2, yPos, finalImgWidth, finalImgHeight);
            yPos += finalImgHeight + 6;
          } catch (e) {
            console.warn("Erro ao adicionar imagem:", e);
          }
        }

        // Flow steps - with proper margin calculation
        if (section.flowSteps) {
          checkNewPage(20);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("Fluxo de navegação:", margin, yPos);
          yPos += 6;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          const flowText = section.flowSteps.join(" → ");
          const flowLines = pdf.splitTextToSize(flowText, contentWidth - 10);
          flowLines.forEach((line: string) => {
            checkNewPage(5);
            pdf.text(line, margin + 5, yPos);
            yPos += 4;
          });
          yPos += 5;
        }

        section.content.forEach((item) => {
          checkNewPage(30);

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(item.subtitle, margin, yPos);
          yPos += 8;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          const lines = pdf.splitTextToSize(item.text, contentWidth);
          
          lines.forEach((line: string) => {
            checkNewPage(8);
            pdf.text(line, margin, yPos);
            yPos += 6;
          });

          yPos += 8;
        });

        yPos += 10;
      }

      // Footer on all pages
      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} - PDI Carreira & Vida`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      pdf.save("tutorial-pdi-pessoa-fisica.pdf");
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          <Button onClick={generatePDF} disabled={isGeneratingPDF} className="gap-2">
            {isGeneratingPDF ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Baixar PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tutorial Completo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda a utilizar todas as funcionalidades do PDI Carreira & Vida para transformar sua vida pessoal e profissional.
          </p>
        </div>

        {/* Sections */}
        <Accordion type="multiple" defaultValue={["onboarding"]} className="space-y-4">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-left">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-6 pt-2">
                  {/* Image */}
                  {section.image && (
                    <div className="rounded-lg overflow-hidden border shadow-sm">
                      <img 
                        src={section.image} 
                        alt={section.imageAlt} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Flow Steps */}
                  {section.flowSteps && (
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-primary mb-3 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4" />
                        Fluxo de Navegação
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {section.flowSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="bg-background px-3 py-1.5 rounded-full border text-foreground">
                              {step}
                            </span>
                            {index < section.flowSteps.length - 1 && (
                              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {section.content.map((item, index) => (
                    <div key={index} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-medium text-foreground mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Pronto para começar?</h3>
            <p className="text-muted-foreground mb-4">
              Agora que você conhece todas as funcionalidades, comece a construir seu PDI!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/home")}>
                Ir para o Dashboard
              </Button>
              <Button variant="outline" onClick={generatePDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Baixar Tutorial em PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Tutorial;