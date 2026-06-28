// URL polyfill is required for @supabase/supabase-js to work in the
// React Native (Hermes) runtime. Must be imported before createClient.
import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and ' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file (see .env.example).',
  );
}

/**
 * Persists the Supabase auth session in the device keychain/keystore via
 * Expo Secure Store, so tokens are encrypted at rest rather than kept in
 * plaintext storage.
 *
 * NOTE: Secure Store warns for values larger than 2KB. Email/Apple sessions
 * are comfortably under that today; if sessions grow, migrate to a chunked or
 * AES-encrypted large-value adapter.
 */
const secureStorageAdapter: SupportedStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

/**
 * Shared, singleton Supabase client for the whole app.
 *
 * Sessions are persisted and auto-refreshed. `detectSessionInUrl` is disabled
 * because that flow is web-only and not used in this native app. This module
 * only constructs the client; it does not make any network calls on import.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorageAdapter,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
