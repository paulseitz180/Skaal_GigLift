import type { Show } from '@/types/show';

/**
 * Realistic show used as the result of (mock) voice extraction. Single source
 * of truth for the prototype's example show.
 */
export const MOCK_SHOW: Show = {
  venue: 'Bluebird Cafe',
  city: 'Nashville',
  date: 'August 15, 2026',
  time: '8:00 PM',
  ticketPrice: 20,
  ticketLink: 'https://tickets.example.com',
  openingActs: ['The Skyline Quartet'],
  genre: 'Jazz',
  notes: 'Acoustic evening performance.',
};

/**
 * Neutral placeholder show used when a downstream screen is reached without a
 * show available (e.g., via the campaign flow before extraction).
 */
export const FALLBACK_SHOW: Show = {
  venue: 'Your Venue',
  city: 'Your City',
  date: 'your show date',
  time: '8:00 PM',
  ticketPrice: 0,
  ticketLink: 'https://tickets.example.com',
  openingActs: [],
  genre: '',
  notes: '',
};
