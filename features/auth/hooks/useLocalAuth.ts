// Thin wrapper around Expo's Local Authentication API will live here.
// For now this is just a placeholder to establish project structure.

export interface LocalAuthResult {
  success: boolean;
  error?: string;
}

export function useLocalAuth() {
  // TODO: Implement local authentication flow using expo-local-authentication.
  const authenticate = async (): Promise<LocalAuthResult> => {
    return { success: false, error: 'Not implemented' };
  };

  return { authenticate };
}


