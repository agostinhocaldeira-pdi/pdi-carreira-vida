// Google Calendar integration service using Supabase OAuth

import { BaseIntegrationService } from './BaseIntegrationService';
import { IntegrationTask, IntegrationEvent, SyncResult } from '@/types/integrations';
import { supabase } from '@/integrations/supabase/client';

interface CalendarEvent {
  summary: string;
  description?: string;
  start: { date: string };
  end: { date: string };
}

export class GoogleCalendarService extends BaseIntegrationService {
  constructor() {
    super('google_calendar');
  }

  async connect(): Promise<boolean> {
    this.log('Initiating Google Calendar OAuth flow');
    
    try {
      // Use the current origin, but ensure it's not localhost
      let redirectUrl = window.location.origin;
      if (redirectUrl.includes('localhost')) {
        // Fallback to the preview URL
        redirectUrl = 'https://bd032101-4369-41f5-ab27-f3d841e82d1b.lovableproject.com';
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.events',
          redirectTo: `${redirectUrl}/integracoes`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        this.log('OAuth error:', error);
        throw error;
      }

      return true;
    } catch (error) {
      this.log('Failed to connect to Google Calendar:', error);
      throw error;
    }
  }

  async disconnect(): Promise<boolean> {
    this.log('Disconnecting Google Calendar');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_integrations')
          .update({ 
            is_connected: false, 
            access_token: null, 
            refresh_token: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('integration_type', 'google_calendar');
      }
    } catch (error) {
      this.log('Error disconnecting:', error);
    }
    this.isConnected = false;
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.provider_token) return false;
      
      // Check if the provider is Google and has calendar scope
      return session.user?.app_metadata?.provider === 'google';
    } catch {
      return false;
    }
  }

  private async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.provider_token || null;
  }

  private async createCalendarEvent(event: CalendarEvent): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      this.log('No access token available');
      return false;
    }

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.log('Failed to create event:', errorData);
        return false;
      }

      this.log('Event created successfully');
      return true;
    } catch (error) {
      this.log('Error creating calendar event:', error);
      return false;
    }
  }

  async syncTasks(): Promise<SyncResult> {
    this.log('Sync tasks called - Google Calendar uses events, not tasks');
    return {
      success: false,
      itemsSynced: 0,
      errors: ['Google Calendar uses events. Use syncEvents instead.'],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async syncEvents(): Promise<SyncResult> {
    this.log('Sync events called - fetching objectives and metas to export');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          itemsSynced: 0,
          errors: ['Usuário não autenticado'],
          lastSyncAt: new Date().toISOString(),
        };
      }

      // Fetch objectives with target dates
      const { data: objectives } = await supabase
        .from('user_objectives')
        .select('*')
        .eq('user_id', user.id)
        .not('data_alvo', 'is', null);

      // Fetch goals with target dates
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .not('data_alvo', 'is', null);

      const objectivesResult = await this.exportObjectives(objectives || []);
      const goalsResult = await this.exportMetas(goals || []);

      const totalSynced = objectivesResult.itemsSynced + goalsResult.itemsSynced;
      const allErrors = [...objectivesResult.errors, ...goalsResult.errors];

      return {
        success: allErrors.length === 0,
        itemsSynced: totalSynced,
        errors: allErrors,
        lastSyncAt: new Date().toISOString(),
      };
    } catch (error) {
      this.log('Error in syncEvents:', error);
      return {
        success: false,
        itemsSynced: 0,
        errors: ['Erro ao sincronizar eventos'],
        lastSyncAt: new Date().toISOString(),
      };
    }
  }

  async exportObjectives(objectives: unknown[]): Promise<SyncResult> {
    this.log('Export objectives called', { count: objectives.length });
    
    if (objectives.length === 0) {
      return {
        success: true,
        itemsSynced: 0,
        errors: [],
        lastSyncAt: new Date().toISOString(),
      };
    }

    let synced = 0;
    const errors: string[] = [];

    for (const obj of objectives as Array<{ texto: string; data_alvo: string; conexao_vvd?: string }>) {
      if (!obj.data_alvo) continue;

      const event: CalendarEvent = {
        summary: `🎯 Objetivo: ${obj.texto}`,
        description: obj.conexao_vvd ? `Conexão VVD: ${obj.conexao_vvd}` : undefined,
        start: { date: obj.data_alvo },
        end: { date: obj.data_alvo },
      };

      const success = await this.createCalendarEvent(event);
      if (success) {
        synced++;
      } else {
        errors.push(`Falha ao exportar objetivo: ${obj.texto}`);
      }
    }

    return {
      success: errors.length === 0,
      itemsSynced: synced,
      errors,
      lastSyncAt: new Date().toISOString(),
    };
  }

  async exportMetas(metas: unknown[]): Promise<SyncResult> {
    this.log('Export metas called', { count: metas.length });
    
    if (metas.length === 0) {
      return {
        success: true,
        itemsSynced: 0,
        errors: [],
        lastSyncAt: new Date().toISOString(),
      };
    }

    let synced = 0;
    const errors: string[] = [];

    for (const meta of metas as Array<{ texto: string; data_alvo: string }>) {
      if (!meta.data_alvo) continue;

      const event: CalendarEvent = {
        summary: `📊 Meta: ${meta.texto}`,
        start: { date: meta.data_alvo },
        end: { date: meta.data_alvo },
      };

      const success = await this.createCalendarEvent(event);
      if (success) {
        synced++;
      } else {
        errors.push(`Falha ao exportar meta: ${meta.texto}`);
      }
    }

    return {
      success: errors.length === 0,
      itemsSynced: synced,
      errors,
      lastSyncAt: new Date().toISOString(),
    };
  }

  async exportActions(actions: unknown[]): Promise<SyncResult> {
    this.log('Export actions called', { count: actions.length });
    return {
      success: false,
      itemsSynced: 0,
      errors: ['Export de ações não implementado'],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async importTasks(): Promise<IntegrationTask[]> {
    this.log('Import tasks called - not supported for Calendar');
    return [];
  }

  async importEvents(): Promise<IntegrationEvent[]> {
    this.log('Import events called - not implemented');
    return [];
  }
}
