/**
 * A fan in the artist's audience. Prototype/UI shape — populated from mock data,
 * never persisted. `tags` drive the Local / Super Fan / Newsletter filters and
 * `lastActiveDays` powers the Recent filter.
 */
export type Fan = {
  id: string;
  name: string;
  email: string;
  location: string;
  /** Engagement score from 0–100. */
  engagementScore: number;
  tags: string[];
  /** Days since the fan last engaged, used by the Recent filter. */
  lastActiveDays: number;
};
