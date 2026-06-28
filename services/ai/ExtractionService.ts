import type { Show } from '@/types/show';

/**
 * Converts a spoken/typed transcript into a structured Show.
 *
 * Implementations are swappable: the prototype uses a mock, and production
 * will provide a Claude-backed implementation behind this same interface.
 */
export interface ExtractionService {
  extract(transcript: string): Promise<Show>;
}
