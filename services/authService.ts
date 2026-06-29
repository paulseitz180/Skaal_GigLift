import * as AppleAuthentication from 'expo-apple-authentication';
import type {
  AuthChangeEvent,
  AuthResponse,
  AuthTokenResponse,
  AuthTokenResponsePassword,
  Session,
  Subscription,
} from '@supabase/supabase-js';

import { supabase } from '@/supabase/client';

/**
 * Authentication service. Thin, UI-agnostic wrapper around Supabase Auth that
 * exposes the flows the app supports: email/password and Apple Sign In.
 *
 * This module performs no rendering; screens call into it later.
 */
export const authService = {
  /** Returns the currently persisted session, if any. */
  getSession: () => supabase.auth.getSession(),

  /** Sign in with email and password. */
  signInWithEmail: (email: string, password: string): Promise<AuthTokenResponsePassword> =>
    supabase.auth.signInWithPassword({ email, password }),

  /** Create a new account with email and password. */
  signUpWithEmail: (email: string, password: string): Promise<AuthResponse> =>
    supabase.auth.signUp({ email, password }),

  /** Whether Apple Sign In is available on this device (iOS 13+). */
  isAppleSignInAvailable: (): Promise<boolean> => AppleAuthentication.isAvailableAsync(),

  /**
   * Run the native Apple Sign In flow and exchange the returned identity token
   * for a Supabase session.
   */
  signInWithApple: async (): Promise<AuthTokenResponse> => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign In failed: no identity token was returned.');
    }

    return supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
  },

  /** Sign the current user out and clear the persisted session. */
  signOut: () => supabase.auth.signOut(),

  /** Subscribe to auth state changes. Returns the subscription to unsubscribe. */
  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ): { subscription: Subscription } => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return { subscription };
  },
};

export type AuthService = typeof authService;
