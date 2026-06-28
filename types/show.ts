/**
 * A show as understood by the app's domain/UI layer (the result of extracting
 * structured data from a transcript). Date and time are human-readable strings
 * at this stage; they are normalized when persisted to the database.
 */
export type Show = {
  venue: string;
  city: string;
  date: string;
  time: string;
  ticketPrice: number;
  ticketLink: string;
  openingActs: string[];
  genre: string;
  notes: string;
};
