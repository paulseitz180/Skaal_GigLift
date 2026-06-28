import type { Artist } from '@/services/artistService';

/**
 * Example artist profile for the prototype. Single source of truth for sample
 * artist data used in mocked/offline scenarios.
 */
export const MOCK_ARTIST: Artist = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Jordan Quartet',
  email: 'jordan@example.com',
  bio: 'Genre-bending live act blending jazz and soul.',
  genre_tags: ['Jazz', 'Soul'],
  tone_keywords: [],
  social_handles: { instagram: '@jordanquartet' },
  created_at: '2026-01-01T00:00:00.000Z',
};
