import { DemoDataService } from '@/services/demo/DemoDataService';
import type { ExtractionService } from '@/services/ai/ExtractionService';
import type { Show } from '@/types/show';

/**
 * Prototype extraction service. Ignores the transcript and always returns the
 * shared demo Show. No networking, API keys, or backend are involved.
 *
 * Future production work will replace this with a Claude-backed implementation.
 */
export class MockExtractionService implements ExtractionService {
  extract(_transcript: string): Promise<Show> {
    return Promise.resolve({
      ...DemoDataService.primaryShow,
      openingActs: [...DemoDataService.primaryShow.openingActs],
    });
  }
}
