// The shapes of a band in this app.
//
// A band comes from one of two places, and the two shapes have nothing in common
// beyond id, name and country. Instead of one loose type with everything optional,
// `Band` is a UNION discriminated by `source`: once the code checks
// `band.source === 'local'`, TypeScript knows `band.albums` exists — and it refuses
// to let us read `band.albums` before that check. The gotcha becomes a compiler error.

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

/** A band we store ourselves, in db.json. Editable. */
export interface LocalBand {
  source: "local";
  editable: true;
  id: string;
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

/** An artist returned by MusicBrainz. Read-only, and named in their own style. */
export interface MusicBrainzBand {
  source: "musicbrainz";
  editable: false;
  id: string;
  name: string;
  country?: string;
  type?: string;
  disambiguation?: string;
  tags?: { name: string }[];
  // MusicBrainz sends `ended` as a boolean, or null when the band is still active
  "life-span"?: { begin?: string; end?: string; ended?: boolean | null };
  "begin-area"?: { name: string };
}

export type Band = LocalBand | MusicBrainzBand;

/** The extra data MusicBrainz returns for a single artist. */
export interface MusicBrainzDetails {
  relations?: {
    type: string;
    begin?: string | null;
    end?: string | null;
    attributes?: string[];
    artist?: { id?: string; name: string };
  }[];
  "release-groups"?: {
    id: string;
    title: string;
    "first-release-date"?: string;
    "primary-type"?: string;
    "secondary-types"?: string[];
  }[];
}

/** What the add/update forms keep in state: every field is a string, as in the inputs. */
export interface BandFormData {
  name: string;
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
