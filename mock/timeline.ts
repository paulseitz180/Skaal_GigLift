export type TimelineStatus = 'scheduled' | 'approved' | 'skipped' | 'completed';

/**
 * Mocked status assignment so every badge color is represented on the timeline.
 * Single source of truth for the prototype's timeline statuses.
 */
export const TIMELINE_STATUS_SEQUENCE: TimelineStatus[] = [
  'completed',
  'completed',
  'approved',
  'skipped',
  'scheduled',
];

/**
 * Fixed reference show date used purely to render mocked timeline dates
 * (no scheduling).
 */
export const TIMELINE_REFERENCE_DATE = new Date(2026, 7, 15);
