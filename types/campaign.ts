/**
 * A generated promotion campaign for a show. This is the domain/UI shape used
 * by the prototype; content is produced by a CampaignService implementation.
 */
export type CampaignEmail = {
  /** Who this email targets (e.g., "Superfans", "Local list"). */
  audience: string;
  subject: string;
  body: string;
};

export type CampaignTimelineItem = {
  /** How many days before the show this action should happen. */
  daysBeforeShow: number;
  title: string;
  detail: string;
};

export type Campaign = {
  /** Exactly four ready-to-send emails. */
  emails: CampaignEmail[];
  instagramPost: string;
  facebookPost: string;
  xPost: string;
  pressRelease: string;
  timelineItems: CampaignTimelineItem[];
};
