import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ActionType = 
  | 'diary' 
  | 'objective' 
  | 'goal' 
  | 'action' 
  | 'step' 
  | 'tool_vvd' 
  | 'tool_valores' 
  | 'tool_roda' 
  | 'tool_swot' 
  | 'tool_smart' 
  | 'tool_eisenhower' 
  | 'tool_crencas'
  | 'tool_autoavaliacao'
  | 'stoic_reflection';

interface ActionCelebrationContextType {
  celebrateAction: (actionType: ActionType, actionName?: string) => void;
  sessionActionCount: number;
  showProgressMirror: boolean;
  dismissProgressMirror: () => void;
  lastCelebration: { type: ActionType; name?: string } | null;
  showCongratulation: boolean;
  dismissCongratulation: () => void;
}

const ActionCelebrationContext = createContext<ActionCelebrationContextType | undefined>(undefined);

const progressMirrorMessages = [
  "Hoje você não resolveu tudo, mas clareou um ponto importante que estava travando suas decisões.",
  "Você deu passos firmes hoje. Cada ação que você toma é uma prova de que está no caminho certo.",
  "Você se comprometeu consigo mesmo mais uma vez. Isso é raro e valioso.",
  "Nem todo progresso é visível, mas o que você fez hoje preparou o terreno para conquistas maiores.",
  "Você está construindo algo maior do que imagina. Cada registro, cada reflexão, conta.",
  "A consistência que você mostrou hoje é o que separa quem sonha de quem realiza.",
  "Você escolheu agir quando poderia ter adiado. Isso diz muito sobre quem você está se tornando."
];

export function ActionCelebrationProvider({ children }: { children: ReactNode }) {
  const [sessionActionCount, setSessionActionCount] = useState(0);
  const [showProgressMirror, setShowProgressMirror] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [lastCelebration, setLastCelebration] = useState<{ type: ActionType; name?: string } | null>(null);
  const [progressMirrorMessage, setProgressMirrorMessage] = useState('');

  const celebrateAction = useCallback((actionType: ActionType, actionName?: string) => {
    const newCount = sessionActionCount + 1;
    setSessionActionCount(newCount);
    setLastCelebration({ type: actionType, name: actionName });
    
    // Always show congratulation toast
    setShowCongratulation(true);
    
    // After 3+ actions, show Progress Mirror
    if (newCount >= 3 && newCount % 3 === 0) {
      const randomMessage = progressMirrorMessages[Math.floor(Math.random() * progressMirrorMessages.length)];
      setProgressMirrorMessage(randomMessage);
      // Delay showing progress mirror so it comes after the congratulation
      setTimeout(() => {
        setShowProgressMirror(true);
      }, 2500);
    }
  }, [sessionActionCount]);

  const dismissProgressMirror = useCallback(() => {
    setShowProgressMirror(false);
  }, []);

  const dismissCongratulation = useCallback(() => {
    setShowCongratulation(false);
  }, []);

  return (
    <ActionCelebrationContext.Provider
      value={{
        celebrateAction,
        sessionActionCount,
        showProgressMirror,
        dismissProgressMirror,
        lastCelebration,
        showCongratulation,
        dismissCongratulation,
      }}
    >
      {children}
      {showProgressMirror && (
        <ProgressMirrorModal 
          message={progressMirrorMessage} 
          onClose={dismissProgressMirror} 
        />
      )}
      {showCongratulation && lastCelebration && (
        <CongratulationToast 
          actionType={lastCelebration.type}
          actionName={lastCelebration.name}
          onClose={dismissCongratulation} 
        />
      )}
    </ActionCelebrationContext.Provider>
  );
}

export function useActionCelebration() {
  const context = useContext(ActionCelebrationContext);
  if (!context) {
    throw new Error('useActionCelebration must be used within ActionCelebrationProvider');
  }
  return context;
}

// Action type labels for display
const actionTypeLabels: Record<ActionType, string> = {
  diary: 'registro no diário',
  objective: 'objetivo',
  goal: 'meta',
  action: 'ação',
  step: 'passo',
  tool_vvd: 'Visão de Vida Desejada',
  tool_valores: 'Meus Valores',
  tool_roda: 'Roda da Vida',
  tool_swot: 'Análise SWOT',
  tool_smart: 'Meta SMART',
  tool_eisenhower: 'Matriz de Eisenhower',
  tool_crencas: 'Crenças',
  tool_autoavaliacao: 'Autoavaliação 360°',
  stoic_reflection: 'reflexão estóica',
};

// Congratulation Toast Component
function CongratulationToast({ 
  actionType, 
  actionName, 
  onClose 
}: { 
  actionType: ActionType; 
  actionName?: string;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const label = actionName || actionTypeLabels[actionType];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-xl shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎉</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">Parabéns!</p>
            <p className="text-sm opacity-90">
              Você completou: <span className="font-medium">{label}</span>
            </p>
            <p className="text-sm font-bold mt-1">Continue firme!</p>
          </div>
          <button 
            onClick={onClose}
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Progress Mirror Modal Component
function ProgressMirrorModal({ 
  message, 
  onClose 
}: { 
  message: string; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">🪞</span>
          </div>
          
          <h2 className="text-xl font-bold text-foreground">
            Espelho de Progresso
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            {message}
          </p>
          
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue firme! 💪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
