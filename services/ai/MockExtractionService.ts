import { MOCK_SHOW } from '@/mock/show';
import type { ExtractionService } from '@/services/ai/ExtractionService';
import type { Show } from '@/types/show';

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
