import type { ExtractionService } from '@/services/ai/ExtractionService';
import type { Show } from '@/types/show';

const MOCK_SHOW: Show = {
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
 * Prototype extraction service. Ignores the transcript and always returns the
 * same fixed Show. No networking, API keys, or backend are involved.
 *
 * Future production work will replace this with a Claude-backed implementation.
 */
export class MockExtractionService implements ExtractionService {
  extract(_transcript: string): Promise<Show> {
    return Promise.resolve({
      ...MOCK_SHOW,
      openingActs: [...MOCK_SHOW.openingActs],
    });
  }
}
