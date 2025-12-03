import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translations = language === 'pt' ? ptTranslations : enTranslations;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Traduções em Português
const ptTranslations = {
  common: {
    save: 'Salvar',
    edit: 'Editar',
    delete: 'Remover',
    cancel: 'Cancelar',
    add: 'Adicionar',
    register: 'Cadastrar',
    update: 'Atualizar',
    actions: 'Ações',
    status: 'Status',
    date: 'Data',
    back: 'Voltar',
  },
  status: {
    pending: 'Pendente',
    inProgress: 'Em andamento',
    completed: 'Concluído',
    paused: 'Pausado',
    toStart: 'A iniciar',
    toDo: 'A fazer',
  },
  home: {
    title: 'Dashboard',
    welcomeBack: 'Bem-vindo de volta',
  },
  planoDeVida: {
    title: 'Plano de Vida',
    description: 'Construa sua visão e defina seus objetivos',
    whoAmI: 'Quem sou Eu',
    whereAmIGoing: 'Para onde vou',
    howToGetThere: 'Como chegar lá',
    myEssence: 'Minha Essência',
    vvd: 'Minha Visão de Vida Desejada',
    vvdPlaceholder: 'Descreva como você imagina sua vida ideal em todos os aspectos...',
    howToCreateVvd: 'Como criar seu VVD',
    myValues: 'Meus Valores',
    discoverValues: 'Descobrir meus valores',
    lifeAreas: 'Áreas da Vida',
    area: 'Área',
    currentScore: 'Nota Atual',
    desiredScore: 'Nota Desejada',
    editInWheel: 'Editar na Roda da Vida',
    insights: 'Insights',
    generateInsight: 'Gerar Insight',
    generatingInsight: 'Gerando insight...',
    generateNewInsight: 'Gerar novo insight',
    myObjectives: 'Meus Objetivos',
    registerNewObjective: '"Quem muito quer, pouco consegue"',
    registerNewObjectiveSubtitle: 'Sugestão: Tenha um único grande objetivo, quebrado em metas e ações!',
    objectiveInFocus: 'Objetivo em Foco',
    objectivePlaceholder: 'Descreva seu objetivo principal',
    targetDate: 'Data Alvo',
    connectionWithVvd: 'Conexão com o VVD',
    connectionPlaceholder: 'Como este objetivo se conecta com sua visão de vida?',
    registerObjective: 'Cadastrar Objetivo',
    registeredObjectives: 'Objetivos Cadastrados',
    objective: 'Objetivo',
    connection: 'Conexão VVD',
  },
  maoNaMassa: {
    title: 'Mão na Massa',
    description: 'Transforme seus objetivos em metas executáveis',
    myGoals: 'Minhas Metas',
    selectObjective: 'Selecione um objetivo',
    noObjectives: 'Nenhum objetivo cadastrado',
    goal: 'Meta',
    goalPlaceholder: 'Ex: Conquistar promoção para cargo de liderança',
    targetDate: 'Data Alvo',
    whenStart: 'Quando Começo',
    howToMeasure: 'Como vou medir',
    measurePlaceholder: 'Ex: Receber feedback positivo do gestor, assumir projeto importante',
    frequency: 'Periodicidade',
    selectFrequency: 'Selecione a frequência',
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    monthly: 'Mensalmente',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual',
    actions: 'Ações',
    newAction: 'Nova Ação',
    actionPlaceholder: 'Descreva a ação',
    addAction: 'Adicionar Ação',
    steps: 'Passos',
    stepPlaceholder: 'Descreva o passo',
    addMoreSteps: 'Cadastrar Mais Passos',
    registerGoal: 'Cadastrar Meta',
    updateGoal: 'Atualizar Meta',
    registeredGoals: 'Metas Cadastradas',
    step: 'Passo',
  },
  diario: {
    title: 'Diário',
    description: 'Registre suas reflexões e acompanhe sua evolução',
    registerYourDay: 'Registre seu dia',
    howDoYouFeel: 'Como você está se sentindo?',
    happy: 'Feliz',
    neutral: 'Neutro',
    sad: 'Triste',
    dayReflections: 'Reflexões do dia',
    reflectionPlaceholder: 'O que aconteceu hoje? Como você se sentiu?',
    completedGoals: 'O que você conseguiu realizar hoje?',
    goalsPlaceholder: 'Liste suas conquistas do dia',
    completedHabits: 'Hábitos concluídos',
    habitsPlaceholder: 'Quais hábitos você praticou hoje?',
    gratitude: 'Gratidão',
    gratitudePlaceholder: 'Pelo que você é grato hoje?',
    saveEntry: 'Salvar Registro',
  },
};

// Traduções em Inglês
const enTranslations = {
  common: {
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    add: 'Add',
    register: 'Register',
    update: 'Update',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    back: 'Back',
  },
  status: {
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    paused: 'Paused',
    toStart: 'To Start',
    toDo: 'To Do',
  },
  home: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
  },
  planoDeVida: {
    title: 'Life Plan',
    description: 'Build your vision and define your goals',
    whoAmI: 'Who I Am',
    whereAmIGoing: 'Where I\'m Going',
    howToGetThere: 'How to Get There',
    myEssence: 'My Essence',
    vvd: 'My Desired Life Vision',
    vvdPlaceholder: 'Describe how you imagine your ideal life in all aspects...',
    howToCreateVvd: 'How to create your DLV',
    myValues: 'My Values',
    discoverValues: 'Discover my values',
    lifeAreas: 'Life Areas',
    area: 'Area',
    currentScore: 'Current Score',
    desiredScore: 'Desired Score',
    editInWheel: 'Edit in Life Wheel',
    insights: 'Insights',
    generateInsight: 'Generate Insight',
    generatingInsight: 'Generating insight...',
    generateNewInsight: 'Generate new insight',
    myObjectives: 'My Objectives',
    registerNewObjective: '"He who wants too much, achieves little"',
    registerNewObjectiveSubtitle: 'Suggestion: Have a single big objective, broken down into goals and actions!',
    objectiveInFocus: 'Objective in Focus',
    objectivePlaceholder: 'Describe your main objective',
    targetDate: 'Target Date',
    connectionWithVvd: 'Connection with DLV',
    connectionPlaceholder: 'How does this objective connect with your life vision?',
    registerObjective: 'Register Objective',
    registeredObjectives: 'Registered Objectives',
    objective: 'Objective',
    connection: 'DLV Connection',
  },
  maoNaMassa: {
    title: 'Hands On',
    description: 'Transform your objectives into executable goals',
    myGoals: 'My Goals',
    selectObjective: 'Select an objective',
    noObjectives: 'No objectives registered',
    goal: 'Goal',
    goalPlaceholder: 'Ex: Get promotion to leadership position',
    targetDate: 'Target Date',
    whenStart: 'When to Start',
    howToMeasure: 'How to Measure',
    measurePlaceholder: 'Ex: Receive positive feedback from manager, take on important project',
    frequency: 'Frequency',
    selectFrequency: 'Select frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    semiannual: 'Semiannual',
    annual: 'Annual',
    actions: 'Actions',
    newAction: 'New Action',
    actionPlaceholder: 'Describe the action',
    addAction: 'Add Action',
    steps: 'Steps',
    stepPlaceholder: 'Describe the step',
    addMoreSteps: 'Add More Steps',
    registerGoal: 'Register Goal',
    updateGoal: 'Update Goal',
    registeredGoals: 'Registered Goals',
    step: 'Step',
  },
  diario: {
    title: 'Journal',
    description: 'Record your reflections and track your evolution',
    registerYourDay: 'Record your day',
    howDoYouFeel: 'How are you feeling?',
    happy: 'Happy',
    neutral: 'Neutral',
    sad: 'Sad',
    dayReflections: 'Day reflections',
    reflectionPlaceholder: 'What happened today? How did you feel?',
    completedGoals: 'What did you accomplish today?',
    goalsPlaceholder: 'List your achievements of the day',
    completedHabits: 'Completed habits',
    habitsPlaceholder: 'Which habits did you practice today?',
    gratitude: 'Gratitude',
    gratitudePlaceholder: 'What are you grateful for today?',
    saveEntry: 'Save Entry',
  },
};
