// Types for external integrations

export type IntegrationType = 
  | 'google_calendar'
  | 'notion'
  | 'todoist'
  | 'trello'
  | 'asana'
  | 'microsoft_todo'
  | 'apple_reminders';

export interface IntegrationConfig {
  id: IntegrationType;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  settings?: Record<string, unknown>;
}

export interface IntegrationEvent {
  id: string;
  externalId?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  source: IntegrationType;
  syncedAt: string;
}

export interface IntegrationTask {
  id: string;
  externalId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  source: IntegrationType;
  syncedAt: string;
}

export interface SyncResult {
  success: boolean;
  itemsSynced: number;
  errors?: string[];
  lastSyncAt: string;
}

// Available integrations metadata
export const AVAILABLE_INTEGRATIONS: Omit<IntegrationConfig, 'isConnected'>[] = [
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sincronize seus objetivos e metas com o Google Calendar',
    icon: '📅',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Exporte e sincronize seu plano de vida com o Notion',
    icon: '📝',
  },
  {
    id: 'todoist',
    name: 'Todoist',
    description: 'Gerencie suas ações e tarefas no Todoist',
    icon: '✅',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Organize suas metas em quadros do Trello',
    icon: '📋',
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Sincronize projetos e tarefas com o Asana',
    icon: '🎯',
  },
  {
    id: 'microsoft_todo',
    name: 'Microsoft To Do',
    description: 'Integre suas tarefas com o Microsoft To Do',
    icon: '📌',
  },
  {
    id: 'apple_reminders',
    name: 'Apple Reminders',
    description: 'Sincronize lembretes com o Apple Reminders',
    icon: '🍎',
  },
];
