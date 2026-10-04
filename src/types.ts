// The shape of a band in this app. There is only one.
//
// This used to be a union discriminated by `source`, because a band could come
// straight from MusicBrainz with a completely different shape. It no longer can:
// MusicBrainz is now ingested by the backend, which stores the band in MongoDB
// before anyone sees it. The browser reads bands from our API and nowhere else,
// so every band on screen has been through our own schema.

/** The kinds of release an encyclopedia tracks, as on Encyclopaedia Metallum. */
export const RELEASE_TYPES = [
  "Full-length",
  "EP",
  "Single",
  "Demo",
  "Live album",
  "Compilation",
  "Split",
  "Video",
  "Boxed set",
  "Bootleg",
] as const;

export type ReleaseType = (typeof RELEASE_TYPES)[number];

/** The tabs of the discography, and which release types each one shows.
 *  "Complete" shows everything, so it has no list. */
export const DISCOGRAPHY_FILTERS = {
  Complete: null,
  Main: ["Full-length", "EP"],
  Lives: ["Live album", "Bootleg"],
  Demos: ["Demo"],
  Misc: ["Single", "Compilation", "Split", "Video", "Boxed set"],
} satisfies Record<string, readonly ReleaseType[] | null>;

export type DiscographyFilter = keyof typeof DISCOGRAPHY_FILTERS;

export interface Album {
  title: string;
  year: string;
  /** Older entries used free text ("Album"), so this stays a plain string. */
  type: string;
}

export interface Member {
  name: string;
  instrument: string;
  period: string;
  /** Other bands this musician played in — shown under their name. */
  otherBands?: string[];
}

/** Where a band's data came from. A credit, not a permission: both are editable. */
export type BandSource = "manual" | "musicbrainz";

/** A band, as our API returns it. Every one of them is editable. */
export interface Band {
  id: string;
  source: BandSource;
  /** Set only on an ingested band, so the page can credit MusicBrainz. */
  musicBrainzId?: string;
  name: string;
  country: string;
  location: string;
  status: string;
  formed: string;
  disbanded: string | null;
  genre: string[];
  disambiguation: string;
  image: string | null;
  albums?: Album[];
  members?: Member[];
  type: string;
  /** The band's history, in a few paragraphs. Optional: older entries do not have it. */
  description?: string;
  /** Lyrical themes, as Encyclopaedia Metallum lists them. */
  themes?: string;
  /** Current record label. */
  label?: string;
}

/** A band found on MusicBrainz and not yet in the encyclopedia.
 *
 *  Our backend does the searching and the translating, so a candidate already has
 *  our own shape — it simply has no id yet, because nothing has been stored. */
export interface UpstreamCandidate extends Omit<Band, "id"> {
  /** True when we already hold this band: the page offers no Import button then. */
  alreadyImported: boolean;
}

/** What the add/update forms keep in state: every field is a string, as in the
 *  inputs — including `image`, which the form sends as "" and the API stores as null. */
export interface BandFormData {
  name: string;
  image: string;
  country: string;
  location: string;
  status: string;
  formed: string;
  disbanded: string;
  genre: string;
  type: string;
  disambiguation: string;
  description: string;
  themes: string;
  label: string;
}

/** `setBands` as React types it, so children can update the list. */
export type SetBands = React.Dispatch<React.SetStateAction<Band[]>>;

/** A logged-in account, as /auth/verify describes it. Never holds the password. */
export interface AuthUser {
  id: string;
  email: string;
  username: string;
}
