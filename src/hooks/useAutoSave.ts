import { useCallback, useEffect, useRef, useState } from 'react';
import { sessionsAPI } from '../lib/api';
import type { AutoSaveStatus } from '../types';

interface UseAutoSaveOptions {
  sessionId: string;
  data: any;
  enabled?: boolean;
  debounceMs?: number;
  intervalMs?: number;
}

export const useAutoSave = ({
  sessionId,
  data,
  enabled = true,
  debounceMs = 5000, // 5 seconds of inactivity
  intervalMs = 30000, // 30 seconds maximum interval
}: UseAutoSaveOptions) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>({
    status: 'idle',
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveDataRef = useRef<string | undefined>(undefined);
  const isComponentMountedRef = useRef(true);

  const saveData = useCallback(async () => {
    if (!enabled || !sessionId) return;

    const currentDataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentDataString === lastSaveDataRef.current) {
      return;
    }

    setAutoSaveStatus({ status: 'saving' });

    try {
      await sessionsAPI.autoSaveSession(sessionId, data);
      
      if (isComponentMountedRef.current) {
        lastSaveDataRef.current = currentDataString;
        setAutoSaveStatus({
          status: 'saved',
          lastSaved: new Date(),
        });

        // Reset to idle after 2 seconds
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            setAutoSaveStatus(prev => ({ ...prev, status: 'idle' }));
          }
        }, 2000);
      }
    } catch (error: any) {
      if (isComponentMountedRef.current) {
        setAutoSaveStatus({
          status: 'error',
          error: error.message || 'Auto-save failed',
        });
      }
    }
  }, [sessionId, data, enabled]);

  const triggerSave = useCallback(() => {
    if (!enabled) return;

    // Clear existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      saveData();
    }, debounceMs);
  }, [saveData, debounceMs, enabled]);

  const forceSave = useCallback(() => {
    // Clear any pending debounced saves
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    saveData();
  }, [saveData]);

  // Effect for debounced auto-save on data changes
  useEffect(() => {
    if (enabled && data) {
      triggerSave();
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, triggerSave, enabled]);

  // Effect for interval-based auto-save
  useEffect(() => {
    if (!enabled) return;

    const intervalSave = () => {
      const currentDataString = JSON.stringify(data);
      if (currentDataString !== lastSaveDataRef.current) {
        saveData();
      }
    };

    intervalTimeoutRef.current = setInterval(intervalSave, intervalMs);

    return () => {
      if (intervalTimeoutRef.current) {
        clearInterval(intervalTimeoutRef.current);
      }
    };
  }, [saveData, intervalMs, enabled, data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (intervalTimeoutRef.current) {
        clearInterval(intervalTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoSaveStatus,
    forceSave,
    triggerSave,
  };
};
