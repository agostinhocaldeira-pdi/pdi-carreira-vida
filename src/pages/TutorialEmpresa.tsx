import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Download, Building2, Users, UserCog, CreditCard, BarChart3, Target, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Logo from "@/components/Logo";

const TutorialEmpresa = () => {
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const sections = [
    {
      id: "cadastro",
      icon: Building2,
      title: "1. Cadastro e Configuração da Empresa",
      content: [
        {
          subtitle: "Criando a conta da empresa",
          text: "Acesse a página de cadastro de empresas através do botão 'Sou Empresa' na página inicial. Preencha os dados da empresa: Razão Social, CNPJ, E-mail corporativo e Telefone (opcional). Estes dados serão usados para identificação e faturamento."
        },
        {
          subtitle: "Dados do representante",
          text: "Informe os dados do representante principal da empresa (você). Este será o administrador inicial com acesso total ao dashboard da empresa. Você poderá adicionar outros representantes posteriormente."
        },
        {
          subtitle: "Endereço da empresa",
          text: "Preencha o endereço completo da empresa. Utilize o auto-preenchimento pelo CEP para agilizar o cadastro. Inclua também a Inscrição Estadual, se aplicável."
        },
        {
          subtitle: "Definindo a senha",
          text: "Crie uma senha segura para acessar o dashboard. Após o cadastro, você será direcionado automaticamente para o Dashboard da Empresa."
        }
      ]
    },
    {
      id: "dashboard",
      icon: Users,
      title: "2. Dashboard da Empresa",
      content: [
        {
          subtitle: "Visão geral",
          text: "O dashboard exibe cards de resumo com o total de gestores, funcionários e usuários ativos. Navegue entre as abas para gerenciar diferentes aspectos: Gestores, Funcionários, Faturamento, Relatórios e OKRs."
        },
        {
          subtitle: "Navegação entre empresas (Admin)",
          text: "Administradores do sistema podem visualizar e gerenciar múltiplas empresas através do seletor no topo do dashboard. Usuários de empresa comum visualizam apenas sua própria empresa."
        }
      ]
    },
    {
      id: "gestores",
      icon: UserCog,
      title: "3. Gerenciando Gestores",
      content: [
        {
          subtitle: "Adicionando gestores",
          text: "Clique em 'Adicionar Gestor' para cadastrar um novo gestor. Informe nome, e-mail e telefone (opcional). O gestor receberá um e-mail com link para configurar sua senha e acessar o sistema."
        },
        {
          subtitle: "Funções do gestor",
          text: "Gestores têm duas opções ao fazer login: 'Meu PDI' para desenvolver seu próprio plano de desenvolvimento, ou 'Gestão de PDIs' para acompanhar o progresso dos funcionários vinculados a ele."
        },
        {
          subtitle: "Removendo gestores",
          text: "Para remover um gestor, clique no ícone de lixeira na linha correspondente. Confirme a exclusão no modal de confirmação. Os funcionários vinculados a este gestor ficarão sem gestor atribuído."
        },
        {
          subtitle: "Reenviar convite",
          text: "Se o gestor não recebeu o e-mail ou o link expirou, use o botão de reenvio para gerar um novo convite de acesso."
        }
      ]
    },
    {
      id: "funcionarios",
      icon: Users,
      title: "4. Gerenciando Funcionários",
      content: [
        {
          subtitle: "Adicionando funcionários",
          text: "Na aba 'Funcionários', clique em 'Adicionar Funcionário'. Informe nome, e-mail e telefone. O funcionário receberá um e-mail com link para configurar sua senha e iniciar o onboarding personalizado."
        },
        {
          subtitle: "Vinculando a gestores",
          text: "Selecione um ou mais funcionários usando os checkboxes e clique em 'Atribuir Gestor'. Escolha o gestor responsável no modal. O gestor poderá então acompanhar o PDI destes funcionários."
        },
        {
          subtitle: "Visualizando progresso",
          text: "Clique em 'Ver Progresso' para abrir um modal com os dados do PDI do funcionário: objetivos, metas, ações e estatísticas de engajamento. Isso permite acompanhamento sem acessar a conta do funcionário."
        },
        {
          subtitle: "Removendo funcionários",
          text: "Para remover um funcionário, clique no ícone de lixeira. Confirme a exclusão. Os dados do PDI do funcionário serão mantidos, mas ele perderá acesso à plataforma."
        }
      ]
    },
    {
      id: "faturamento",
      icon: CreditCard,
      title: "5. Faturamento",
      content: [
        {
          subtitle: "Modelo de precificação",
          text: "O faturamento é baseado no número de funcionários ativos: 1-10 funcionários = R$ 300/mês, 11-50 funcionários = R$ 600/mês, 51+ funcionários = R$ 900/mês. Gestores não são contabilizados."
        },
        {
          subtitle: "Visualizando custos",
          text: "A aba 'Faturamento' exibe o número atual de funcionários ativos e o valor mensal correspondente. Use esta informação para planejar a expansão do uso da plataforma."
        },
        {
          subtitle: "Pagamento",
          text: "O sistema de pagamento será integrado em breve. Por enquanto, entre em contato com o suporte para configurar a forma de pagamento da sua empresa."
        }
      ]
    },
    {
      id: "relatorios",
      icon: BarChart3,
      title: "6. Relatórios",
      content: [
        {
          subtitle: "Relatório consolidado",
          text: "A aba 'Relatórios' apresenta métricas consolidadas de todos os funcionários: média de progresso em objetivos, metas e ações, ranking de performance e engajamento geral."
        },
        {
          subtitle: "Filtros de período",
          text: "Filtre os dados por período: última semana, último mês, último trimestre ou todo o período. Isso permite análises temporais e identificação de tendências."
        },
        {
          subtitle: "Exportação em PDF",
          text: "Exporte o relatório consolidado em PDF para apresentações, reuniões de liderança ou documentação. O PDF inclui todos os gráficos e métricas visíveis."
        },
        {
          subtitle: "Alinhamento com OKRs",
          text: "Visualize a porcentagem de funcionários com objetivos alinhados aos OKRs da empresa, permitindo medir a aderência estratégica da equipe."
        }
      ]
    },
    {
      id: "okrs",
      icon: Target,
      title: "7. OKRs da Empresa",
      content: [
        {
          subtitle: "Criando OKRs",
          text: "OKRs (Objectives and Key Results) são os objetivos estratégicos da empresa. Crie OKRs com título, descrição, período de vigência e resultados-chave mensuráveis."
        },
        {
          subtitle: "Resultados-chave",
          text: "Para cada OKR, defina resultados-chave com valores alvo e atuais. Exemplo: 'Aumentar vendas em 20%' com meta de R$ 1.000.000 e atual de R$ 750.000 (75% de progresso)."
        },
        {
          subtitle: "Vinculando funcionários",
          text: "Selecione quais funcionários devem contribuir para cada OKR. Isso permite que funcionários vejam os OKRs relevantes e vinculem seus objetivos pessoais a eles."
        },
        {
          subtitle: "Cascateamento de objetivos",
          text: "Funcionários podem vincular seus objetivos pessoais aos OKRs da empresa, criando alinhamento estratégico. O relatório mostra a porcentagem de funcionários com objetivos alinhados."
        }
      ]
    }
  ];

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Helper function to add new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Title page
      pdf.setFillColor(34, 197, 94);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("Tutorial PDI Carreira & Vida", pageWidth / 2, 35, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Guia Completo para Empresas", pageWidth / 2, 48, { align: "center" });

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
      sections.forEach((section) => {
        checkNewPage(40);

        // Section header
        pdf.setFillColor(34, 197, 94);
        pdf.rect(margin, yPos, contentWidth, 12, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(section.title, margin + 5, yPos + 8);
        
        yPos += 20;
        pdf.setTextColor(0, 0, 0);

        section.content.forEach((item) => {
          checkNewPage(30);

          // Subtitle
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(item.subtitle, margin, yPos);
          yPos += 8;

          // Text content
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
      });

      // Footer on last page
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} - PDI Carreira & Vida`, pageWidth / 2, pageHeight - 10, { align: "center" });

      pdf.save("tutorial-pdi-empresa.pdf");
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
          <Button onClick={generatePDF} disabled={isGeneratingPDF} className="gap-2 bg-green-600 hover:bg-green-700">
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
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Para Empresas
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tutorial para Empresas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda a gerenciar gestores, funcionários, faturamento e OKRs para maximizar o desenvolvimento da sua equipe.
          </p>
        </div>

        {/* Sections */}
        <Accordion type="multiple" defaultValue={["cadastro"]} className="space-y-4">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg bg-card px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <section.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-left">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-6 pt-2">
                  {section.content.map((item, index) => (
                    <div key={index} className="border-l-2 border-green-500/30 pl-4">
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
        <Card className="mt-12 bg-green-500/5 border-green-500/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Pronto para começar?</h3>
            <p className="text-muted-foreground mb-4">
              Agora que você conhece todas as funcionalidades, comece a gerenciar sua equipe!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/dashboard-empresa")} className="bg-green-600 hover:bg-green-700">
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

export default TutorialEmpresa;
