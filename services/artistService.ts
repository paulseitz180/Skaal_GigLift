import { database } from '@/services/database';
import { supabase } from '@/supabase/client';
import type { Artist, ArtistProfileInput } from '@/types/artist';

/** Comma-separated genres -> trimmed, de-duplicated tag array. */
function toGenreTags(genre: string): string[] {
  const tags = genre
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  return Array.from(new Set(tags));
}

/** Collect only the social handles that were actually filled in. */
function toSocialHandles(input: ArtistProfileInput): Record<string, string> {
  const entries: [string, string][] = [
    ['instagram', input.instagram.trim()],
    ['facebook', input.facebook.trim()],
    ['website', input.website.trim()],
  ];
  return Object.fromEntries(entries.filter(([, value]) => value.length > 0));
}

/**
 * Fetch the signed-in user's artist profile, or null if none exists yet
 * (or there is no active session).
 */
export async function getCurrentArtist(): Promise<Artist | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = session?.user;
  if (!user) {
    return null;
  }

  const { data, error } = await database
    .from('artists')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Artist | null) ?? null;
}

/**
 * Insert the current user's artist profile.
 *
 * The row id and email are taken from the authenticated session so the record
 * satisfies the ownership RLS policy (artists.id = auth.uid()).
 */
export async function createArtist(input: ArtistProfileInput): Promise<Artist> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = session?.user;
  if (!user) {
    throw new Error('You must be signed in to save your profile.');
  }
  if (!user.email) {
    throw new Error('No email is associated with your account.');
  }

  const { data, error } = await database
    .from('artists')
    .insert({
      id: user.id,
      email: user.email,
      name: input.name.trim(),
      bio: input.bio.trim() || null,
      genre_tags: toGenreTags(input.genre),
      social_handles: toSocialHandles(input),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Artist;
}
