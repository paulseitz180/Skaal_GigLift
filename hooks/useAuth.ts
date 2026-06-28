import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

/**
 * Primary entry point for consuming authentication in the UI.
 *
 * Exposes reactive auth state (from the Zustand store) alongside the action
 * methods from the auth service, so components have a single import for
 * everything auth-related.
 */
export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  return {
    session,
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signInWithEmail: authService.signInWithEmail,
    signUpWithEmail: authService.signUpWithEmail,
    signInWithApple: authService.signInWithApple,
    isAppleSignInAvailable: authService.isAppleSignInAvailable,
    signOut: authService.signOut,
  };
}
