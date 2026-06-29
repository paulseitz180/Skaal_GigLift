import type { Fan } from '@/types/fan';

export type FanFilterKey = 'local' | 'super' | 'newsletter' | 'recent';

export const FAN_FILTERS: { key: FanFilterKey; label: string }[] = [
  { key: 'local', label: 'Local' },
  { key: 'super', label: 'Super Fans' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'recent', label: 'Recent' },
];

const RECENT_THRESHOLD_DAYS = 7;

function matchesFilter(fan: Fan, filter: FanFilterKey): boolean {
  switch (filter) {
    case 'local':
      return fan.tags.includes('Local');
    case 'super':
      return fan.tags.includes('Super Fan');
    case 'newsletter':
      return fan.tags.includes('Newsletter');
    case 'recent':
      return fan.lastActiveDays <= RECENT_THRESHOLD_DAYS;
  }
}

/**
 * Local search + filter for the fan list. Matches the query against name, email,
 * and location, and requires every active filter chip to match (AND).
 */
export function filterFans(fans: Fan[], query: string, activeFilters: FanFilterKey[]): Fan[] {
  const normalized = query.trim().toLowerCase();

  return fans.filter((fan) => {
    const matchesQuery =
      normalized.length === 0 ||
      fan.name.toLowerCase().includes(normalized) ||
      fan.email.toLowerCase().includes(normalized) ||
      fan.location.toLowerCase().includes(normalized);

    const matchesFilters = activeFilters.every((filter) => matchesFilter(fan, filter));

    return matchesQuery && matchesFilters;
  });
}
