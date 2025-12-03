// Integration services barrel export

export { BaseIntegrationService } from './BaseIntegrationService';
export { GoogleCalendarService } from './GoogleCalendarService';
export { NotionService } from './NotionService';

import { IntegrationType } from '@/types/integrations';
import { BaseIntegrationService } from './BaseIntegrationService';
import { GoogleCalendarService } from './GoogleCalendarService';
import { NotionService } from './NotionService';

// Factory function to get the appropriate service
export function getIntegrationService(type: IntegrationType): BaseIntegrationService | null {
  switch (type) {
    case 'google_calendar':
      return new GoogleCalendarService();
    case 'notion':
      return new NotionService();
    // TODO: Add other services as they are implemented
    case 'todoist':
    case 'trello':
    case 'asana':
    case 'microsoft_todo':
    case 'apple_reminders':
      console.log(`[Integrations] Service for ${type} not yet implemented`);
      return null;
    default:
      return null;
  }
}
