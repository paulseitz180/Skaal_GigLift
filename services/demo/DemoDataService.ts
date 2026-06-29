import type { Artist } from '@/types/artist';
import type { Campaign } from '@/types/campaign';
import type { Fan } from '@/types/fan';
import type { PressRelease } from '@/types/pressRelease';
import type { Show } from '@/types/show';
import { buildTimelineEntries, type TimelineEntry } from '@/utils/timeline';

/** A single dashboard metric tile. */
export type DashboardMetric = {
  key: string;
  label: string;
  value: number;
  /** Render as a full-width hero card instead of a half-width tile. */
  wide?: boolean;
};

/** A third-party integration shown on the Settings screen. */
export type ConnectedAccount = {
  key: string;
  name: string;
  connected: boolean;
};

/** The artist's current plan, shown in Settings. */
export type Subscription = {
  plan: string;
  status: string;
  renews: string;
};

/**
 * The one place the prototype's realistic demo data lives. Everything is static
 * and deterministic (no random generation), so the same artist, shows, fans,
 * campaign, emails, and timeline appear everywhere across the app.
 */

const FAN_COUNT = 1240;

const artist: Artist = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Jordan Quartet',
  email: 'jordan@example.com',
  bio: 'Genre-bending live act blending jazz and soul.',
  genre_tags: ['Jazz', 'Soul'],
  tone_keywords: [],
  social_handles: { instagram: '@jordanquartet' },
  created_at: '2026-01-01T00:00:00.000Z',
};

/** Realistic show used as the result of (mock) voice extraction. */
const primaryShow: Show = {
  venue: 'Bluebird Cafe',
  city: 'Nashville',
  date: 'August 15, 2026',
  time: '8:00 PM',
  ticketPrice: 20,
  ticketLink: 'https://tickets.example.com',
  openingActs: ['The Skyline Quartet'],
  genre: 'Jazz',
  notes: 'Acoustic evening performance.',
};

/** Neutral show used when a downstream screen is reached without one available. */
const fallbackShow: Show = {
  venue: 'Your Venue',
  city: 'Your City',
  date: 'your show date',
  time: '8:00 PM',
  ticketPrice: 0,
  ticketLink: 'https://tickets.example.com',
  openingActs: [],
  genre: '',
  notes: '',
};

const fans: Fan[] = [
  {
    id: 'fan-1',
    name: 'Maya Thompson',
    email: 'maya.thompson@example.com',
    location: 'Nashville, TN',
    engagementScore: 94,
    tags: ['Local', 'Super Fan', 'Newsletter'],
    lastActiveDays: 1,
  },
  {
    id: 'fan-2',
    name: 'Daniel Reyes',
    email: 'daniel.reyes@example.com',
    location: 'Austin, TX',
    engagementScore: 88,
    tags: ['Super Fan', 'Newsletter'],
    lastActiveDays: 3,
  },
  {
    id: 'fan-3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    location: 'Nashville, TN',
    engagementScore: 72,
    tags: ['Local', 'Newsletter'],
    lastActiveDays: 12,
  },
  {
    id: 'fan-4',
    name: 'Liam O’Connor',
    email: 'liam.oconnor@example.com',
    location: 'Chicago, IL',
    engagementScore: 61,
    tags: ['Newsletter'],
    lastActiveDays: 5,
  },
  {
    id: 'fan-5',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    location: 'Nashville, TN',
    engagementScore: 83,
    tags: ['Local', 'Super Fan'],
    lastActiveDays: 2,
  },
  {
    id: 'fan-6',
    name: 'Marcus Lee',
    email: 'marcus.lee@example.com',
    location: 'Seattle, WA',
    engagementScore: 45,
    tags: ['New'],
    lastActiveDays: 4,
  },
  {
    id: 'fan-7',
    name: 'Hannah Schmidt',
    email: 'hannah.schmidt@example.com',
    location: 'Denver, CO',
    engagementScore: 67,
    tags: ['Newsletter'],
    lastActiveDays: 21,
  },
  {
    id: 'fan-8',
    name: 'Jordan Brooks',
    email: 'jordan.brooks@example.com',
    location: 'Nashville, TN',
    engagementScore: 90,
    tags: ['Local', 'Super Fan', 'Newsletter'],
    lastActiveDays: 6,
  },
  {
    id: 'fan-9',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    location: 'Portland, OR',
    engagementScore: 38,
    tags: ['New'],
    lastActiveDays: 30,
  },
  {
    id: 'fan-10',
    name: 'Ethan Carter',
    email: 'ethan.carter@example.com',
    location: 'Memphis, TN',
    engagementScore: 76,
    tags: ['Super Fan'],
    lastActiveDays: 9,
  },
];

const dashboardMetrics: DashboardMetric[] = [
  { key: 'fans', label: 'Fans', value: FAN_COUNT, wide: true },
  { key: 'shows', label: 'Upcoming Shows', value: 3 },
  { key: 'emails', label: 'Emails Generated', value: 48 },
  { key: 'social', label: 'Social Posts', value: 36 },
  { key: 'campaigns', label: 'Campaigns Completed', value: 12 },
];

const connectedAccounts: ConnectedAccount[] = [
  { key: 'instagram', name: 'Instagram', connected: true },
  { key: 'facebook', name: 'Facebook', connected: false },
  { key: 'mailchimp', name: 'Mailchimp', connected: false },
  { key: 'sendgrid', name: 'SendGrid', connected: true },
];

const subscription: Subscription = {
  plan: 'GigLift Pro',
  status: 'Active',
  renews: 'August 1, 2026',
};

/** Build the static, realistic promotion campaign for a show. */
function buildCampaign(show: Show): Campaign {
  const venue = show.venue || 'the venue';
  const city = show.city || 'town';
  const date = show.date || 'the show date';
  const time = show.time || 'showtime';
  const tickets = show.ticketLink || 'the link in our bio';
  const lineup = show.openingActs.length > 0 ? ` with ${show.openingActs.join(', ')}` : '';

  return {
    emails: [
      {
        audience: 'Superfans',
        subject: `You're invited first: live at ${venue}`,
        body: `Hey there,\n\nBefore I tell anyone else — I'm playing ${venue} in ${city} on ${date} at ${time}${lineup}. You've been with me from the start, so you get the first shot at tickets.\n\nGrab yours here: ${tickets}\n\nCan't wait to see you up front.`,
      },
      {
        audience: 'Full mailing list',
        subject: `New show announced — ${city}, ${date}`,
        body: `Big news: I'm bringing the live set to ${venue} in ${city} on ${date} at ${time}${lineup}.\n\nThese rooms fill up fast, so don't wait. Tickets are on sale now: ${tickets}\n\nForward this to a friend who needs a night out.`,
      },
      {
        audience: 'One-week reminder',
        subject: `One week out: ${venue} is almost here`,
        body: `Just one week until ${venue} in ${city}!\n\nDoors are ${time} on ${date}. A handful of tickets are still left — lock yours in before they're gone: ${tickets}\n\nSee you very soon.`,
      },
      {
        audience: 'Last call',
        subject: `Tonight-ish: last chance for ${venue}`,
        body: `This is it — ${venue} in ${city} is ${date} at ${time}${lineup}.\n\nIf you've been on the fence, this is your last call. Final tickets here: ${tickets}\n\nBring your people. Let's make it loud.`,
      },
    ],
    instagramPost: `🎤 LIVE at ${venue} in ${city}!\n\n${date} • ${time}${lineup}\n\nTickets are moving fast — link in bio. Tag who you're bringing. 👇\n\n#livemusic #${city.replace(/\s+/g, '')} #ontour`,
    facebookPost: `I'm playing ${venue} in ${city} on ${date} at ${time}${lineup}! This is going to be a special one. Tickets are on sale now — grab them here: ${tickets}. Share this with a friend and let's pack the room. 🎶`,
    xPost: `Just announced 🚨 ${venue} — ${city} — ${date}, ${time}. Tickets: ${tickets} #livemusic`,
    pressRelease: `FOR IMMEDIATE RELEASE\n\nLive Performance Announced at ${venue}, ${city}\n\n${city} — A headline live performance has been announced for ${venue} on ${date}, with doors at ${time}${lineup}. The evening promises an intimate, high-energy set in one of ${city}'s favorite rooms.\n\nTickets are available now at ${tickets}. Press and media inquiries are welcome; limited guest list and photo passes are available upon request.\n\n###`,
    timelineItems: [
      {
        daysBeforeShow: 21,
        title: 'Announce the show',
        detail: `Post the announcement to Instagram, Facebook, and X, and send the superfan email for ${venue}.`,
      },
      {
        daysBeforeShow: 14,
        title: 'Email the full list',
        detail: `Send the on-sale announcement to your full mailing list with the ticket link.`,
      },
      {
        daysBeforeShow: 7,
        title: 'One-week push',
        detail: `Send the one-week reminder email and re-share the Instagram post to stories.`,
      },
      {
        daysBeforeShow: 3,
        title: 'Press outreach',
        detail: `Send the press release to local ${city} outlets and music blogs.`,
      },
      {
        daysBeforeShow: 1,
        title: 'Last call',
        detail: `Send the last-call email and post the X reminder. Hype the day-of on stories.`,
      },
    ],
  };
}

/** Build a structured, realistic press release for a show using the demo artist. */
function buildPressRelease(show: Show): PressRelease {
  const name = artist.name;
  const venue = show.venue || 'the venue';
  const city = show.city || 'town';
  const date = show.date || 'the show date';
  const time = show.time || 'showtime';
  const tickets = show.ticketLink || "the artist's website";
  const genre = show.genre || artist.genre_tags.join(' / ') || 'live music';
  const lineup = show.openingActs.length > 0 ? show.openingActs.join(', ') : 'special guests';

  return {
    headline: `${name} Announces Live Performance at ${venue}`,
    subheadline: `${genre} act brings a headline set to ${city} on ${date}`,
    dateline: `${city.toUpperCase()} —`,
    body: `${name} will take the stage at ${venue} in ${city} on ${date}, with doors at ${time}. The evening promises an intimate, high-energy ${genre.toLowerCase()} set in one of ${city}'s favorite rooms, joined by ${lineup}.\n\nTickets are on sale now at ${tickets}. With limited capacity, early reservations are encouraged.`,
    quote: `"${city} has always shown up for live music, and this room is the perfect place to share these songs. We can't wait to play for everyone." — ${name}`,
    showDetails: [
      { label: 'Artist', value: name },
      { label: 'Venue', value: venue },
      { label: 'City', value: city },
      { label: 'Date', value: date },
      { label: 'Doors', value: time },
      { label: 'Tickets', value: tickets },
    ],
    bio: `${artist.bio} ${name} has built a reputation for memorable, high-energy ${genre.toLowerCase()} performances across ${city} and beyond.`,
    mediaContact: `Press inquiries: ${artist.email}\nManagement: GigLift Artist Relations`,
  };
}

const campaign = buildCampaign(primaryShow);
const pressRelease = buildPressRelease(primaryShow);
const timeline: TimelineEntry[] = buildTimelineEntries(campaign);

export const DemoDataService = {
  artist,
  shows: [primaryShow],
  primaryShow,
  fallbackShow,
  fans,
  fanCount: FAN_COUNT,
  dashboardMetrics,
  connectedAccounts,
  subscription,
  campaign,
  emails: campaign.emails,
  pressRelease,
  timeline,
  buildCampaign,
  buildPressRelease,
};
