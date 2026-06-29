import type { Campaign, ItemStatus } from '@/types/campaign';

export type EmailField = 'subject' | 'body';
export type SocialField = 'instagramPost' | 'facebookPost' | 'xPost';
export type TimelineItemField = 'title' | 'detail';

/** Deep copy a campaign so edits never mutate the shared store object. */
export function cloneCampaign(campaign: Campaign): Campaign {
  return JSON.parse(JSON.stringify(campaign)) as Campaign;
}

/** Return a new campaign with one email's field updated. */
export function updateEmailField(
  campaign: Campaign,
  index: number,
  field: EmailField,
  value: string,
): Campaign {
  return {
    ...campaign,
    emails: campaign.emails.map((email, i) => (i === index ? { ...email, [field]: value } : email)),
  };
}

/** Return a new campaign with a top-level social post updated. */
export function updateSocialField(campaign: Campaign, field: SocialField, value: string): Campaign {
  return { ...campaign, [field]: value };
}

/** Return a new campaign with the press release updated. */
export function updatePressReleaseField(campaign: Campaign, value: string): Campaign {
  return { ...campaign, pressRelease: value };
}

/** Return a new campaign with one timeline item's field updated. */
export function updateTimelineItemField(
  campaign: Campaign,
  index: number,
  field: TimelineItemField,
  value: string,
): Campaign {
  return {
    ...campaign,
    timelineItems: campaign.timelineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    ),
  };
}

export type SocialPostParts = { caption: string; hashtags: string[] };

/**
 * Split a social post into its caption and hashtag list for display. Hashtags
 * are pulled out wherever they appear; the remaining text is the caption.
 */
export function splitSocialPost(post: string): SocialPostParts {
  const hashtags = post.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  const caption = post
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { caption, hashtags };
}

export type StatusSummary = { approved: number; skipped: number };

/** Count how many review items are approved vs skipped. */
export function summarizeStatuses(statuses: Record<string, ItemStatus>): StatusSummary {
  const values = Object.values(statuses);
  return {
    approved: values.filter((status) => status === 'approved').length,
    skipped: values.filter((status) => status === 'skipped').length,
  };
}
