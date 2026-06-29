/** Shape of the artist profile collected from the setup form. */
export type ArtistProfileInput = {
  name: string;
  genre: string;
  bio: string;
  instagram: string;
  facebook: string;
  website: string;
};

/** An artist row as stored in the `artists` table. */
export type Artist = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  genre_tags: string[];
  tone_keywords: string[];
  social_handles: Record<string, string>;
  created_at: string;
};
