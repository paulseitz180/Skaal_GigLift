import { supabase } from '@/supabase/client';

/**
 * Central data-access layer.
 *
 * Feature-specific services will build their queries on top of this shared
 * client. No tables or queries are defined yet — this simply re-exports the
 * singleton client as the single entry point for database access.
 */
export const database = supabase;
