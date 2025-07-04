// lib/auth/client.ts
'use client';

import { useEffect, useState } from 'react';

import { checkIsLogin } from '@/lib/check-is-login';
import { User } from '@/types/databaseTypes';

// Custom type definitions

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useCheckIsLogin = () => {
  const [session, setSession] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setStatus('loading');
        const user = await checkIsLogin();
        if (user) {
          setSession(user);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return {
    session,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
