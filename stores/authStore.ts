import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  /** Current Supabase session, or null when signed out. */
  session: Session | null;
  /** Convenience accessor for the signed-in user. */
  user: User | null;
  /** Lifecycle status; starts as `loading` until the session is restored. */
  status: AuthStatus;
  /** Replace the session (and derived user/status). Pass null to sign out. */
  setSession: (session: Session | null) => void;
  /** Reset to the signed-out state. */
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  status: 'loading',
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session ? 'authenticated' : 'unauthenticated',
    }),
  clear: () => set({ session: null, user: null, status: 'unauthenticated' }),
}));
