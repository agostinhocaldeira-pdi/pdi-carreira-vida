// Hook for managing integrations state

import { useState, useEffect, useCallback } from 'react';
import { IntegrationType, IntegrationConfig, AVAILABLE_INTEGRATIONS } from '@/types/integrations';
import { getIntegrationService } from '@/services/integrations';

const STORAGE_KEY = 'pdi_integrations';

interface UseIntegrationsReturn {
  integrations: IntegrationConfig[];
  isLoading: boolean;
  connectIntegration: (type: IntegrationType) => Promise<boolean>;
  disconnectIntegration: (type: IntegrationType) => Promise<boolean>;
  getIntegration: (type: IntegrationType) => IntegrationConfig | undefined;
  isIntegrationConnected: (type: IntegrationType) => boolean;
  syncIntegration: (type: IntegrationType) => Promise<void>;
}

export function useIntegrations(): UseIntegrationsReturn {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load integrations from localStorage
  useEffect(() => {
    const loadIntegrations = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Merge stored data with available integrations
          const merged = AVAILABLE_INTEGRATIONS.map(available => {
            const storedConfig = parsed.find((s: IntegrationConfig) => s.id === available.id);
            return {
              ...available,
              isConnected: storedConfig?.isConnected || false,
              connectedAt: storedConfig?.connectedAt,
              lastSyncAt: storedConfig?.lastSyncAt,
              settings: storedConfig?.settings,
            };
          });
          setIntegrations(merged);
        } else {
          // Initialize with default (all disconnected)
          setIntegrations(
            AVAILABLE_INTEGRATIONS.map(i => ({ ...i, isConnected: false }))
          );
        }
      } catch (error) {
        console.error('[Integrations] Failed to load integrations:', error);
        setIntegrations(
          AVAILABLE_INTEGRATIONS.map(i => ({ ...i, isConnected: false }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, []);

  // Save integrations to localStorage
  const saveIntegrations = useCallback((newIntegrations: IntegrationConfig[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntegrations));
      setIntegrations(newIntegrations);
    } catch (error) {
      console.error('[Integrations] Failed to save integrations:', error);
    }
  }, []);

  const connectIntegration = useCallback(async (type: IntegrationType): Promise<boolean> => {
    const service = getIntegrationService(type);
    if (!service) {
      console.warn(`[Integrations] Service for ${type} not available`);
      return false;
    }

    try {
      // This will throw until properly implemented
      await service.connect();
      
      const updated = integrations.map(i =>
        i.id === type
          ? { ...i, isConnected: true, connectedAt: new Date().toISOString() }
          : i
      );
      saveIntegrations(updated);
      return true;
    } catch (error) {
      console.error(`[Integrations] Failed to connect ${type}:`, error);
      return false;
    }
  }, [integrations, saveIntegrations]);

  const disconnectIntegration = useCallback(async (type: IntegrationType): Promise<boolean> => {
    const service = getIntegrationService(type);
    if (service) {
      await service.disconnect();
    }

    const updated = integrations.map(i =>
      i.id === type
        ? { ...i, isConnected: false, connectedAt: undefined, lastSyncAt: undefined }
        : i
    );
    saveIntegrations(updated);
    return true;
  }, [integrations, saveIntegrations]);

  const getIntegration = useCallback((type: IntegrationType): IntegrationConfig | undefined => {
    return integrations.find(i => i.id === type);
  }, [integrations]);

  const isIntegrationConnected = useCallback((type: IntegrationType): boolean => {
    return integrations.find(i => i.id === type)?.isConnected || false;
  }, [integrations]);

  const syncIntegration = useCallback(async (type: IntegrationType): Promise<void> => {
    const service = getIntegrationService(type);
    if (!service) {
      throw new Error(`Service for ${type} not available`);
    }

    const result = await service.syncTasks();
    
    if (result.success) {
      const updated = integrations.map(i =>
        i.id === type
          ? { ...i, lastSyncAt: result.lastSyncAt }
          : i
      );
      saveIntegrations(updated);
    }
  }, [integrations, saveIntegrations]);

  return {
    integrations,
    isLoading,
    connectIntegration,
    disconnectIntegration,
    getIntegration,
    isIntegrationConnected,
    syncIntegration,
  };
}
