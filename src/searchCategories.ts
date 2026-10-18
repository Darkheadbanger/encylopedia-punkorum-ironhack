import type { Band } from "./types";

// What the dropdown beside the search box actually searches.
//
// It used to search nothing: the <select> set a placeholder and the submit
// handler threw the value away, so "Albums Title" and "Label" both searched band
// names. Eight options, one behaviour. Each one now names the fields it reads.
//
// "Songs Title" is gone: we hold no songs, and an option that can only ever
// return nothing is the same lie in a different place. Google is not a category
// at all — it leaves the site — so the Navbar handles it on its own.

/** Every field a category searches, as plain text, for one band. */
export const SEARCH_CATEGORIES = {
  // The default stays deliberately broad — name, genres and label together —
  // because that is what the search box did before, and narrowing it would make
  // a working search stop working. The other categories narrow; this one does not.
  bands: {
    label: "Bands",
    fields: (band: Band) => [band.name, band.label ?? "", ...band.genre],
  },
  genres: {
    label: "Music Genre",
    fields: (band: Band) => band.genre,
  },
  themes: {
    label: "Themes",
    fields: (band: Band) => [band.themes ?? ""],
  },
  albums: {
    label: "Albums Title",
    fields: (band: Band) => (band.albums ?? []).map((album) => album.title),
  },
  labels: {
    label: "Label",
    fields: (band: Band) => [band.label ?? ""],
  },
  artists: {
    label: "Artist",
    fields: (band: Band) => (band.members ?? []).map((member) => member.name),
  },
} as const;

export type SearchCategory = keyof typeof SEARCH_CATEGORIES;

export const DEFAULT_CATEGORY: SearchCategory = "bands";

/** Where Google is sent when someone picks it. Not a category: it leaves. */
export const GOOGLE = "google";

export const isSearchCategory = (value: string | null): value is SearchCategory =>
  value !== null && value in SEARCH_CATEGORIES;

/** Does this band match what was typed, in the fields that category covers? */
export const matchesIn = (band: Band, term: string, category: SearchCategory) =>
  SEARCH_CATEGORIES[category]
    .fields(band)
    .join(" ")
    .toLowerCase()
    .includes(term);
