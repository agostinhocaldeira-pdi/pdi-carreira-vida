// Google Calendar integration service using Supabase OAuth

import { BaseIntegrationService } from './BaseIntegrationService';
import { IntegrationTask, IntegrationEvent, SyncResult } from '@/types/integrations';
import { supabase } from '@/integrations/supabase/client';

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
    // Clear the integration status in user_integrations table
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('user_integrations')
        .select('is_connected')
        .eq('user_id', user.id)
        .eq('integration_type', 'google_calendar')
        .single();

      return data?.is_connected || false;
    } catch {
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
    this.log('Sync events called');
    // TODO: Implement actual Google Calendar API calls
    return {
      success: true,
      itemsSynced: 0,
      errors: [],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async exportObjectives(objectives: unknown[]): Promise<SyncResult> {
    this.log('Export objectives called', { count: objectives.length });
    // TODO: Create calendar events for objectives with target dates
    return {
      success: false,
      itemsSynced: 0,
      errors: ['Export not implemented yet'],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async exportMetas(metas: unknown[]): Promise<SyncResult> {
    this.log('Export metas called', { count: metas.length });
    return {
      success: false,
      itemsSynced: 0,
      errors: ['Export not implemented yet'],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async exportActions(actions: unknown[]): Promise<SyncResult> {
    this.log('Export actions called', { count: actions.length });
    return {
      success: false,
      itemsSynced: 0,
      errors: ['Export not implemented yet'],
      lastSyncAt: new Date().toISOString(),
    };
  }

  async importTasks(): Promise<IntegrationTask[]> {
    this.log('Import tasks called - not supported for Calendar');
    return [];
  }

  async importEvents(): Promise<IntegrationEvent[]> {
    this.log('Import events called');
    // TODO: Implement Google Calendar event import
    return [];
  }
}
