import type { CampaignService } from '@/services/campaign/CampaignService';
import type { Campaign } from '@/types/campaign';
import type { Show } from '@/types/show';

/**
 * Prototype campaign generator. Builds static, realistic promotion content
 * from the provided Show. No AI, no networking, no APIs are involved.
 *
 * Future production work will replace this with a Claude-backed implementation.
 */
export class MockCampaignService implements CampaignService {
  generate(show: Show): Promise<Campaign> {
    const venue = show.venue || 'the venue';
    const city = show.city || 'town';
    const date = show.date || 'the show date';
    const time = show.time || 'showtime';
    const tickets = show.ticketLink || 'the link in our bio';
    const lineup = show.openingActs.length > 0 ? ` with ${show.openingActs.join(', ')}` : '';

    return Promise.resolve({
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
    });
  }
}
