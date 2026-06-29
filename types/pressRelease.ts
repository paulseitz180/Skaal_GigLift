/**
 * A structured press release for the prototype. The campaign store holds a flat
 * press-release string; this richer shape lets the viewer lay out the standard
 * sections (headline, dateline, quote, etc.) with professional typography.
 */
export type PressReleaseDetail = { label: string; value: string };

export type PressRelease = {
  headline: string;
  subheadline: string;
  dateline: string;
  body: string;
  quote: string;
  showDetails: PressReleaseDetail[];
  bio: string;
  mediaContact: string;
};
