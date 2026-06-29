import type { Campaign } from '@/types/campaign';
import type { TimelineStatus } from '@/types/timeline';

/** A campaign timeline item projected into the shape the Timeline screen renders. */
export type TimelineEntry = {
  id: string;
  title: string;
  date: string;
  detail: string;
  status: TimelineStatus;
};

/** Fixed status assignment so every badge color is represented (no scheduling). */
const TIMELINE_STATUS_SEQUENCE: TimelineStatus[] = [
  'completed',
  'completed',
  'approved',
  'skipped',
  'scheduled',
];

/** Fixed reference show date used purely to render mocked timeline dates. */
const TIMELINE_REFERENCE_DATE = new Date(2026, 7, 15);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Render a mocked calendar date for an item N days before the reference show date. */
function formatMockDate(daysBeforeShow: number): string {
  const date = new Date(TIMELINE_REFERENCE_DATE);
  date.setDate(date.getDate() - daysBeforeShow);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Build the ordered timeline entries (with mocked dates and statuses) for a campaign. */
export function buildTimelineEntries(campaign: Campaign): TimelineEntry[] {
  return campaign.timelineItems.map((item, index) => ({
    id: `timeline-${index}`,
    title: item.title,
    date: formatMockDate(item.daysBeforeShow),
    detail: item.detail,
    status: TIMELINE_STATUS_SEQUENCE[index % TIMELINE_STATUS_SEQUENCE.length] ?? 'scheduled',
  }));
}
