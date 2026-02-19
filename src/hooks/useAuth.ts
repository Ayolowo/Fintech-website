'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const {
    user,
    authenticated,
    ready,
    getAccessToken,
    login,
    logout: privyLogout,
  } = usePrivy();

  const router = useRouter();

  const getAuthToken = useCallback(async () => {
    if (!authenticated) {
      throw new Error('User not authenticated');
    }
    return await getAccessToken();
  }, [authenticated, getAccessToken]);

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  const handleLogout = useCallback(async () => {
    await privyLogout();
    router.push('/business/login');
  }, [privyLogout, router]);

  return {
    user,
    authenticated,
    ready,
    isLoading: !ready,
    getAuthToken,
    login: handleLogin,
    logout: handleLogout,
  };
}
