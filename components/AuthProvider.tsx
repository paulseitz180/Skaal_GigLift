import { useEffect, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/supabase/client';

/**
 * Bootstraps the authentication layer for the app:
 *
 *  - restores any persisted session on mount,
 *  - subscribes to Supabase auth state changes and mirrors them into the store,
 *  - drives token auto-refresh based on app foreground/background state.
 *
 * Renders children unchanged (no UI of its own). Mount this near the root of
 * the app once login/onboarding screens are introduced.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    let isMounted = true;

    authService.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
      }
    });

    const { subscription } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession]);

  useEffect(() => {
    // Supabase only auto-refreshes while the app is in the foreground.
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => appStateSubscription.remove();
  }, []);

  return <>{children}</>;
}
