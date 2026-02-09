/**
 * HomeInitiation - Modo Iniciação
 * Exibido quando o usuário ainda NÃO completou a Base Pessoal (Passo 1)
 * 
 * Layout:
 * - Hero Section (Educativa)
 * - Estrutura do Sistema (3 Cards: 1 ativo, 2 bloqueados)
 * - Agenda (Bloqueada por padrão, habilitada após "Fazer depois" ou se tiver tarefas)
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Target, Rocket, Lock, Compass, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Agenda } from "@/components/agenda";
import { supabase } from "@/integrations/supabase/client";
import StoicReflectionCard from "./StoicReflectionCard";
import HomeDiarySection from "./HomeDiarySection";

interface HomeInitiationProps {
  showAgenda?: boolean;
}

export const HomeInitiation = ({ showAgenda = false }: HomeInitiationProps) => {
  const [hasAgendaEvents, setHasAgendaEvents] = useState(false);
  
  // Verificar se usuário tem eventos na agenda (persiste após refresh)
  useEffect(() => {
    const checkAgendaEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: events } = await supabase
          .from('agenda_events')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (events && events.length > 0) {
          setHasAgendaEvents(true);
        }
      }
    };
    
    checkAgendaEvents();
  }, []);
  
  // Mostrar agenda se prop indica OU se já tem eventos no banco
  const shouldShowAgenda = showAgenda || hasAgendaEvents;
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section - Educativa */}
      <Card className="bg-white border border-border/50 shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              A construção começa pela base.
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      {/* Estrutura do Sistema */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Estrutura do Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* CARD 1: Base Pessoal - ATIVO/DESTAQUE */}
          <Card className="bg-[#1A1A1A] border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-white">
                Base Pessoal
              </CardTitle>
              <CardDescription className="text-gray-400">
                Identidade, Valores e Roda da Vida
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link to="/plano-vida/quem-sou">
                <Button 
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-[#1A1A1A] font-semibold group-hover:scale-[1.02] transition-transform"
                >
                  Iniciar Mapeamento
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* CARD 2: Direção & Objetivos - BLOQUEADO */}
          <Card className="bg-muted/50 border border-border/30 opacity-60 cursor-not-allowed">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Target className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <Lock className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-muted-foreground/70">
                Direção & Objetivos
              </CardTitle>
              <CardDescription className="text-muted-foreground/50">
                VVD, Objetivos e Metas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="w-full py-2.5 px-4 bg-muted rounded-md text-center text-sm text-muted-foreground/50">
                Requer Base Pessoal
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: Plano de Execução - BLOQUEADO */}
          <Card className="bg-muted/50 border border-border/30 opacity-60 cursor-not-allowed">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <Lock className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-muted-foreground/70">
                Plano de Execução
              </CardTitle>
              <CardDescription className="text-muted-foreground/50">
                Ações, Rotinas e Passos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="w-full py-2.5 px-4 bg-muted rounded-md text-center text-sm text-muted-foreground/50">
                Requer Direção definida
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Agenda - Condicional */}
      {shouldShowAgenda ? (
        <Agenda />
      ) : (
        <Card className="bg-muted/30 border border-dashed border-border/50">
          <CardContent className="py-10 sm:py-14">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center">
                <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-base sm:text-lg font-semibold text-muted-foreground/70">
                  Agenda Estratégica
                </h3>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                  O módulo de Agenda Estratégica será ativado assim que sua Base Pessoal estiver definida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reflexão Estóica do Dia */}
      <StoicReflectionCard />

      {/* Diário */}
      <HomeDiarySection />
    </div>
  );
};

