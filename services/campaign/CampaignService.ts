import type { Campaign } from '@/types/campaign';
import type { Show } from '@/types/show';

/**
 * Turns a structured Show into a full promotion campaign.
 *
 * Implementations are swappable: the prototype uses a mock, and production
 * will provide a Claude-backed implementation behind this same interface.
 */
export interface CampaignService {
  generate(show: Show): Promise<Campaign>;
}
