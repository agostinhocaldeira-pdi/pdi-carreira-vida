/**
 * HomeInitiation - Modo Iniciação
 * Exibido quando o usuário ainda NÃO completou a Base Pessoal (Passo 1)
 * 
 * TODO (Fase 2):
 * - Hero Educativo
 * - Estrutura do Sistema com destaque no Passo 1
 * - Agenda Bloqueada com mensagem de orientação
 */

import { Rocket } from "lucide-react";

export const HomeInitiation = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 max-w-md mx-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Placeholder: Modo Iniciação
        </h2>
        <p className="text-muted-foreground text-sm">
          Este componente será renderizado quando <code className="bg-muted px-1 rounded">hasCompletedBase = false</code>
        </p>
        <p className="text-xs text-muted-foreground mt-4 italic">
          Foco: Guiar o usuário a completar a Base Pessoal
        </p>
      </div>
    </div>
  );
};

export default HomeInitiation;
