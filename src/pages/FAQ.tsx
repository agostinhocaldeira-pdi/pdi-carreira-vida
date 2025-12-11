import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Home, MessagesSquare, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Export faqItems for use in other components
export const faqItems = [
  {
    category: "Primeiros Passos",
    questions: [
      {
        question: "Como faço para começar a usar o PDI?",
        answer: "Após criar sua conta e fazer login, você será direcionado ao onboarding onde poderá preencher suas informações pessoais e expectativas. Em seguida, acesse o Dashboard (/home) para começar a explorar as ferramentas e criar seu plano de desenvolvimento."
      },
      {
        question: "O que é o PDI - Carreira & Vida?",
        answer: "O PDI (Plano de Desenvolvimento Individual) é uma metodologia completa para desenvolvimento pessoal e profissional. Ele combina ferramentas de autoconhecimento, planejamento estratégico e acompanhamento de progresso para ajudar você a alcançar seus objetivos de vida e carreira."
      },
      {
        question: "Preciso preencher tudo de uma vez?",
        answer: "Não! Você pode preencher aos poucos, no seu ritmo. Recomendamos começar pelo Método VVD (Visão de Vida Desejada) e Valores, depois avançar para as outras ferramentas. O importante é manter consistência e visitar o diário regularmente."
      }
    ]
  },
  {
    category: "Dashboard e Navegação",
    questions: [
      {
        question: "O que são as seções do Dashboard?",
        answer: "O Dashboard possui 4 seções principais: 'Seu Progresso' (visualização de metas e ações), 'Diário' (registro diário de humor, reflexões e conquistas), 'Plano de Vida' (VVD, valores, objetivos e metas) e 'Recursos' (acesso às ferramentas e outras páginas)."
      },
      {
        question: "Como expandir e minimizar as seções?",
        answer: "Cada seção possui um botão de expandir/minimizar (seta para cima/baixo). Clique nele para alternar entre os estados. Por padrão, as seções iniciam minimizadas para facilitar a navegação."
      },
      {
        question: "O que são as abas do Plano de Vida?",
        answer: "'Quem sou eu' contém seu VVD, Valores e Áreas da Vida. 'Para onde vou' são seus Objetivos. 'Como chegar lá' inclui suas Metas, Ações, Skills e Análise de Forças/Fraquezas."
      }
    ]
  },
  {
    category: "Ferramentas",
    questions: [
      {
        question: "Qual a diferença entre Objetivo, Meta e Ação?",
        answer: "Objetivo é o resultado final desejado (ex: 'Ser fluente em inglês'). Meta é uma etapa mensurável para atingir o objetivo (ex: 'Completar curso B2 até dezembro'). Ação é uma tarefa específica e recorrente (ex: 'Estudar inglês 30min por dia')."
      },
      {
        question: "O que é o Método VVD?",
        answer: "VVD significa Visão de Vida Desejada. É um texto livre onde você descreve como seria sua vida ideal em todos os aspectos. A ferramenta de IA pode ajudar a sintetizar seu texto em um parágrafo e uma frase de impacto."
      },
      {
        question: "Como funciona a Roda da Vida?",
        answer: "A Roda da Vida avalia 10 áreas importantes da sua vida (saúde, finanças, relacionamentos, etc.). Você atribui uma nota de 0-10 para o estado atual e o estado desejado de cada área. O gráfico mostra visualmente onde estão os gaps a serem trabalhados."
      },
      {
        question: "O que é a ferramenta de Valores?",
        answer: "É um exercício de filtragem onde você seleciona de uma lista de 100 valores os 20 mais importantes, depois 10, e finalmente os 6 valores fundamentais que guiam suas decisões de vida."
      },
      {
        question: "Como usar a Matriz de Eisenhower?",
        answer: "Organize suas tarefas em 4 quadrantes: Urgente + Importante (fazer agora), Não Urgente + Importante (agendar), Urgente + Não Importante (delegar) e Não Urgente + Não Importante (eliminar). Arraste as tarefas entre quadrantes conforme necessário."
      },
      {
        question: "O que é o método SMART?",
        answer: "SMART é um acrônimo para criar metas bem definidas: Specific (Específica), Measurable (Mensurável), Achievable (Atingível), Relevant (Relevante) e Time-bound (Com prazo). A ferramenta guia você na criação de metas seguindo esses critérios."
      }
    ]
  },
  {
    category: "Diário",
    questions: [
      {
        question: "Com que frequência devo preencher o diário?",
        answer: "Idealmente todos os dias! O diário é fundamental para acompanhar seu progresso emocional, registrar reflexões e manter o foco nos seus objetivos. Mesmo que seja breve, o registro diário faz diferença."
      },
      {
        question: "Posso editar entradas de dias anteriores?",
        answer: "Não. Por design, você só pode criar e editar entradas do dia atual. Isso garante autenticidade nos registros e evita a tentação de 'reescrever a história'. Entradas anteriores podem ser visualizadas mas não editadas."
      },
      {
        question: "O que significam os emojis de humor?",
        answer: "😊 (Feliz) indica um dia positivo, 😐 (Neutro) um dia normal sem grandes emoções, e 😢 (Triste) um dia difícil. O gráfico de humor ao longo do tempo ajuda a identificar padrões emocionais."
      }
    ]
  },
  {
    category: "Perfis de Usuário",
    questions: [
      {
        question: "Quais são os tipos de usuário?",
        answer: "Existem 4 perfis: Usuário (individual), Empresa (administrador de empresa), Gestor (gerencia PDIs de funcionários) e Administrador (acesso total ao sistema)."
      },
      {
        question: "Sou Gestor, como vejo o progresso dos meus funcionários?",
        answer: "Acesse 'Gestão de PDIs' através do card nos Recursos ou pelo menu. Lá você verá a lista de funcionários vinculados a você e poderá clicar em 'Ver Progresso' para visualizar os dados de cada um."
      },
      {
        question: "Sou Funcionário, como me comunico com meu Gestor?",
        answer: "Na página de Suporte, alterne para a aba 'Conversa com o Gestor'. Você pode enviar mensagens diretamente ao seu gestor e visualizar as respostas."
      }
    ]
  },
  {
    category: "Empresas",
    questions: [
      {
        question: "Como cadastro minha empresa?",
        answer: "Na página inicial, clique em 'Cadastrar minha empresa'. Preencha os dados da empresa (razão social, CNPJ, endereço) e crie sua conta de administrador."
      },
      {
        question: "Como adiciono gestores e funcionários?",
        answer: "No Dashboard Empresa, use as abas 'Gestores' e 'Funcionários'. Clique em 'Adicionar' e preencha os dados. O sistema enviará um email com senha provisória para o novo usuário."
      },
      {
        question: "O que são OKRs?",
        answer: "OKRs (Objectives and Key Results) são objetivos estratégicos da empresa. Você pode criar OKRs e vincular funcionários a eles, permitindo que cada um alinhe seus objetivos pessoais com os objetivos corporativos."
      }
    ]
  },
  {
    category: "Gamificação e Badges",
    questions: [
      {
        question: "O que são os badges e como funcionam?",
        answer: "Badges são conquistas que você desbloqueia ao cumprir determinados critérios no PDI. Eles representam seu progresso e dedicação, além de conceder pontos que aumentam seu nível. Os badges são exibidos na seção 'Seu Progresso' do Dashboard."
      },
      {
        question: "Quais são os badges disponíveis?",
        answer: "Existem 17 badges divididos em categorias: Diário (Primeiro Passo, Semana Consistente, Mês de Reflexão), Objetivos (Visionário, Foco Total), Metas (Planejador, Estrategista), Ações (Executor, Máquina de Ação), Plano de Vida (Visão Clara, Valores Definidos), Ferramentas (Autoconhecimento, Analista, Metas SMART) e Nível (Aprendiz, Praticante, Mestre)."
      },
      {
        question: "Como desbloquear os badges de Diário?",
        answer: "📝 Primeiro Passo (10 pts): Registre seu primeiro dia no diário. 🔥 Semana Consistente (50 pts): Registre 7 dias consecutivos no diário. 🏆 Mês de Reflexão (200 pts): Registre 30 dias consecutivos no diário."
      },
      {
        question: "Como desbloquear os badges de Objetivos e Metas?",
        answer: "🎯 Visionário (10 pts): Crie seu primeiro objetivo. 🎯 Foco Total (30 pts): Tenha 3 objetivos ativos. 📊 Planejador (10 pts): Crie sua primeira meta. 📊 Estrategista (100 pts): Crie 10 metas no total."
      },
      {
        question: "Como desbloquear os badges de Ações?",
        answer: "⚡ Executor (10 pts): Complete sua primeira ação marcando-a como 'concluído'. ⚡ Máquina de Ação (200 pts): Complete 50 ações no total."
      },
      {
        question: "Como desbloquear os badges de Plano de Vida?",
        answer: "🌟 Visão Clara (50 pts): Defina e salve sua Visão de Vida Desejada (VVD). 💎 Valores Definidos (50 pts): Complete o exercício de Valores com pelo menos 6 valores selecionados."
      },
      {
        question: "Como desbloquear os badges de Ferramentas?",
        answer: "🎡 Autoconhecimento (30 pts): Complete a Roda da Vida com todas as 10 áreas preenchidas. 📋 Analista (30 pts): Complete a Análise SWOT com pelo menos um item. 🧠 Metas SMART (40 pts): Crie uma meta usando o método SMART na página de Ferramentas."
      },
      {
        question: "Como desbloquear os badges de Nível?",
        answer: "⭐ Aprendiz (100 pts): Alcance o nível 5. ⭐ Praticante (200 pts): Alcance o nível 10. 👑 Mestre (500 pts): Alcance o nível 25. Você ganha níveis acumulando pontos ao desbloquear outros badges."
      },
      {
        question: "Como funciona o sistema de níveis?",
        answer: "Cada badge desbloqueado concede pontos. Esses pontos acumulam e determinam seu nível atual. Os primeiros níveis exigem menos pontos, mas a quantidade necessária aumenta progressivamente. Por exemplo: Nível 2 = 50 pts, Nível 5 = 500 pts, Nível 10 = 2.250 pts, Nível 25 = 10.500 pts."
      },
      {
        question: "O que é o streak e como funciona?",
        answer: "O streak (sequência) conta quantos dias consecutivos você registrou atividades no diário. Se você pular um dia, o streak volta para 1. Seu maior streak (recorde) fica registrado. Manter streaks altos desbloqueia badges como 'Semana Consistente' e 'Mês de Reflexão'."
      }
    ]
  },
  {
    category: "Exportação e Relatórios",
    questions: [
      {
        question: "Como exporto meu PDI em PDF?",
        answer: "Na seção 'Seu Progresso' do Dashboard, clique no botão 'Exportar PDF'. Você pode escolher entre 'PDI Completo' (todos os dados) ou 'Relatório de Progresso' (resumo executivo com métricas)."
      },
      {
        question: "Posso exportar todos os meus dados?",
        answer: "Sim! Na página de Perfil, você encontra a opção de exportar todos os seus dados em formato JSON, conforme exigido pela LGPD."
      }
    ]
  },
  {
    category: "Assinatura e Pagamentos",
    questions: [
      {
        question: "Como cancelo minha assinatura?",
        answer: "Para cancelar sua assinatura, acesse a página de Perfil e clique no botão 'Gerenciar Assinatura' abaixo do seu plano atual. Você será direcionado ao portal do Stripe onde poderá cancelar, alterar forma de pagamento ou atualizar dados de cobrança."
      },
      {
        question: "Posso trocar de plano?",
        answer: "Sim! Acesse a página de Perfil e clique em 'Gerenciar Assinatura'. No portal, você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
      },
      {
        question: "Após cancelar, perco acesso imediatamente?",
        answer: "Não. Após cancelar, você mantém acesso até o final do período já pago. Por exemplo, se cancelar no dia 15 e seu ciclo termina no dia 30, você continua usando até o dia 30."
      },
      {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express, etc.) através da plataforma Stripe, que é segura e amplamente utilizada mundialmente."
      }
    ]
  },
  {
    category: "Problemas Técnicos",
    questions: [
      {
        question: "Esqueci minha senha, o que faço?",
        answer: "Na página de Login, clique em 'Esqueci minha senha'. Digite seu email e você receberá um link para redefinir a senha."
      },
      {
        question: "Meus dados não estão salvando, o que aconteceu?",
        answer: "Certifique-se de clicar no botão 'Salvar' após fazer alterações. Se o problema persistir, verifique sua conexão com a internet e tente recarregar a página. Se continuar, entre em contato pelo Suporte."
      },
      {
        question: "A página está em branco ou com erro",
        answer: "Tente recarregar a página (F5 ou Ctrl+R). Se persistir, limpe o cache do navegador ou tente em outro navegador. Caso o problema continue, reporte pelo Suporte com detalhes do erro."
      }
    ]
  }
];

const FAQ = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  const whatsappNumber = "5511995677999";
  const whatsappMessage = encodeURIComponent("Olá! Tenho uma dúvida sobre o PDI Carreira & Vida.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">FAQ - Perguntas Frequentes</h1>
            </div>
            {isLoggedIn && <LogoutButton />}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Encontre respostas para suas dúvidas</CardTitle>
            <p className="text-muted-foreground">
              Navegue pelas categorias abaixo ou use Ctrl+F para buscar um termo específico.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  {category.category}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, questionIndex) => (
                    <AccordionItem 
                      key={questionIndex} 
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border rounded-lg mb-2 px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20 shadow-medium">
          <CardContent className="py-8 text-center space-y-3">
            <h3 className="text-xl font-semibold">Não encontrou sua resposta?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isLoggedIn 
                ? "Entre em contato com nossa equipe de suporte ou volte ao dashboard."
                : "Tire suas dúvidas diretamente pelo WhatsApp com nossa equipe."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isLoggedIn ? (
                <>
                  <Link to="/home">
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <Home className="w-4 h-4" />
                      Voltar ao Dashboard
                    </Button>
                  </Link>
                  <Link to="/suporte">
                    <Button className="w-full sm:w-auto gap-2">
                      <MessagesSquare className="w-4 h-4" />
                      Falar com Suporte
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/">
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <Home className="w-4 h-4" />
                      Voltar ao Início
                    </Button>
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full sm:w-auto gap-2 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4" />
                      Tirar Dúvidas pelo WhatsApp
                    </Button>
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FAQ;
