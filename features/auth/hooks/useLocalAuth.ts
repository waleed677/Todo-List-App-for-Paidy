import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

// Thin wrapper around Expo's Local Authentication API.
// This hook centralizes how we authenticate a user before sensitive actions.

export type LocalAuthStatus = 'idle' | 'pending' | 'authenticated' | 'error';

export interface LocalAuthResult {
  success: boolean;
  error?: string;
}

export function useLocalAuth() {
  const [status, setStatus] = useState<LocalAuthStatus>('idle');
  const [lastError, setLastError] = useState<string | undefined>();

  const authenticate = useCallback(async (): Promise<LocalAuthResult> => {
    setStatus('pending');
    setLastError(undefined);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        const error = 'This device does not support local authentication.';
        setStatus('error');
        setLastError(error);
        Alert.alert('Authentication unavailable', error);
        return { success: false, error };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        const error = 'No biometric or passcode enrolled on this device.';
        setStatus('error');
        setLastError(error);
        Alert.alert('Authentication unavailable', error);
        return { success: false, error };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to modify your TODOs',
        fallbackLabel: 'Use device passcode',
        cancelLabel: 'Cancel',
      });

      if (!result.success) {
        const error =
          result.error === 'user_cancel'
            ? 'Authentication was cancelled.'
            : 'Authentication was not successful.';
        setStatus('error');
        setLastError(error);
        // We only show an alert for non-cancel cases to avoid spamming.
        if (result.error !== 'user_cancel') {
          Alert.alert('Authentication failed', error);
        }
        return { success: false, error };
      }

      setStatus('authenticated');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown authentication error.';
      setStatus('error');
      setLastError(message);
      Alert.alert('Authentication error', message);
      return { success: false, error: message };
    } finally {
      if (status !== 'authenticated') {
        // Reset back to idle when not authenticated so we can retry.
        setStatus((current) => (current === 'authenticated' ? current : 'idle'));
      }
    }
  }, [status]);

  return {
    authenticate,
    status,
    lastError,
  };
}



