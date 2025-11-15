import { act, renderHook } from '@testing-library/react-native';

import { resetLocalAuthSession, useLocalAuth } from '@/features/auth/hooks/useLocalAuth';

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

describe('useLocalAuth', () => {
  beforeEach(() => {
    resetLocalAuthSession();
  });

  it('authenticates successfully on first call', async () => {
    const { result } = renderHook(() => useLocalAuth());

    let response;
    await act(async () => {
      response = await result.current.authenticate();
    });

    expect(response).toEqual({ success: true });
    expect(result.current.status).toBe('authenticated');
  });

  it('skips system prompt after successful session auth', async () => {
    const { result } = renderHook(() => useLocalAuth());

    await act(async () => {
      await result.current.authenticate();
    });

    // Change the mock to fail; we expect authenticate() to still succeed
    // because the session flag is set.
    const LocalAuth = require('expo-local-authentication');
    LocalAuth.authenticateAsync.mockResolvedValueOnce({ success: false, error: 'unknown' });

    let response;
    await act(async () => {
      response = await result.current.authenticate();
    });

    expect(response).toEqual({ success: true });
  });
});



