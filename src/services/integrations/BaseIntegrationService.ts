// Abstract base class for all integration services

import { IntegrationType, IntegrationTask, IntegrationEvent, SyncResult } from '@/types/integrations';

export abstract class BaseIntegrationService {
  protected type: IntegrationType;
  protected isConnected: boolean = false;

  constructor(type: IntegrationType) {
    this.type = type;
  }

  // Authentication methods - to be implemented by each integration
  abstract connect(credentials?: Record<string, string>): Promise<boolean>;
  abstract disconnect(): Promise<boolean>;
  abstract isAuthenticated(): Promise<boolean>;

  // Sync methods - to be implemented by each integration
  abstract syncTasks(): Promise<SyncResult>;
  abstract syncEvents(): Promise<SyncResult>;

  // Export methods - to be implemented by each integration
  abstract exportObjectives(objectives: unknown[]): Promise<SyncResult>;
  abstract exportMetas(metas: unknown[]): Promise<SyncResult>;
  abstract exportActions(actions: unknown[]): Promise<SyncResult>;

  // Import methods - to be implemented by each integration
  abstract importTasks(): Promise<IntegrationTask[]>;
  abstract importEvents(): Promise<IntegrationEvent[]>;

  // Utility methods
  getType(): IntegrationType {
    return this.type;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  protected log(message: string, data?: unknown): void {
    console.log(`[${this.type}] ${message}`, data || '');
  }

  protected logError(message: string, error?: unknown): void {
    console.error(`[${this.type}] ERROR: ${message}`, error || '');
  }
}
