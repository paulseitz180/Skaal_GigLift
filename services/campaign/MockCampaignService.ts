import { buildMockCampaign } from '@/mock/campaign';
import type { CampaignService } from '@/services/campaign/CampaignService';
import type { Campaign } from '@/types/campaign';
import type { Show } from '@/types/show';

/**
 * Prototype campaign generator. Returns static, realistic promotion content
 * sourced from the shared mock data. No AI, no networking, no APIs are involved.
 *
 * Future production work will replace this with a Claude-backed implementation.
 */
export class MockCampaignService implements CampaignService {
  generate(show: Show): Promise<Campaign> {
    return Promise.resolve(buildMockCampaign(show));
  }
}
