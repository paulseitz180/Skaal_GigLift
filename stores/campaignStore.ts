import { create } from 'zustand';

import type { Campaign } from '@/types/campaign';

type CampaignState = {
  /** The generated campaign currently being reviewed, or null when none. */
  campaign: Campaign | null;
  /** Replace the current campaign wholesale (e.g., after generation). */
  setCampaign: (campaign: Campaign) => void;
};

export const useCampaignStore = create<CampaignState>((set) => ({
  campaign: null,
  setCampaign: (campaign) => set({ campaign }),
}));
