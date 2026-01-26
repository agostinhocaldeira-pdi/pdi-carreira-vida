/**
 * HomeOperational - Modo Operacional
 * Exibido quando o usuário JÁ completou a Base Pessoal (Passo 1)
 * 
 * TODO (Fase 3):
 * - Hero Premium (Dark/Gold)
 * - Agenda Estratégica
 * - Cards de métricas
 * - Seções de progresso
 */

import { LayoutDashboard } from "lucide-react";

export const HomeOperational = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 max-w-md mx-4">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <LayoutDashboard className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Placeholder: Modo Operacional
        </h2>
        <p className="text-muted-foreground text-sm">
          Este componente será renderizado quando <code className="bg-muted px-1 rounded">hasCompletedBase = true</code>
        </p>
        <p className="text-xs text-muted-foreground mt-4 italic">
          Foco: Dashboard completo com agenda, métricas e ações
        </p>
      </div>
    </div>
  );
};

export default HomeOperational;
