import type { Show } from '@/types/show';

/** A single editable Show field, prepared for display/editing in the UI. */
export type EditableField = {
  key: string;
  label: string;
  value: string;
  required: boolean;
  multiline?: boolean;
};

/** Project a Show into the ordered list of editable fields the UI renders. */
export function toFields(show: Show): EditableField[] {
  return [
    { key: 'venue', label: 'Venue', value: show.venue, required: true },
    { key: 'city', label: 'City', value: show.city, required: false },
    { key: 'date', label: 'Date', value: show.date, required: true },
    { key: 'time', label: 'Time', value: show.time, required: true },
    { key: 'ticketPrice', label: 'Ticket Price', value: String(show.ticketPrice), required: false },
    { key: 'ticketLink', label: 'Ticket Link', value: show.ticketLink, required: false },
    {
      key: 'openingActs',
      label: 'Opening Acts',
      value: show.openingActs.join(', '),
      required: false,
    },
    { key: 'genre', label: 'Genre', value: show.genre, required: false },
    { key: 'notes', label: 'Notes', value: show.notes, required: false, multiline: true },
  ];
}

/** Convert an edited string back into the typed Show field it represents. */
export function fieldToPartial(key: string, value: string): Partial<Show> {
  switch (key) {
    case 'ticketPrice': {
      const parsed = Number(value);
      return { ticketPrice: Number.isNaN(parsed) ? 0 : parsed };
    }
    case 'openingActs':
      return {
        openingActs: value
          .split(',')
          .map((act) => act.trim())
          .filter((act) => act.length > 0),
      };
    case 'venue':
      return { venue: value };
    case 'city':
      return { city: value };
    case 'date':
      return { date: value };
    case 'time':
      return { time: value };
    case 'ticketLink':
      return { ticketLink: value };
    case 'genre':
      return { genre: value };
    case 'notes':
      return { notes: value };
    default:
      return {};
  }
}
