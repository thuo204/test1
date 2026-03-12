'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setUser, setLoading]);

  return <>{children}</>;
}
