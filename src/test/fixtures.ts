import type { Band, Review, UpstreamCandidate } from "../types";

// Fake bands shared by the tests.
// Functions (not constants) so every test gets a fresh copy it can safely modify.
//
// There used to be two makers, one per band shape. MusicBrainz is ingested by the
// backend now, so there is a single shape — and a maker for a band that has been
// found upstream but not imported yet.

export const makeBand = (overrides: Partial<Band> = {}): Band => ({
  id: "band-1",
  source: "manual",
  name: "Sex Pistols",
  country: "GB",
  location: "London",
  status: "Split-up",
  formed: "1975",
  disbanded: "1978",
  genre: ["punk rock", "proto-punk"],
  disambiguation: "English punk rock band",
  image: "https://example.com/pistols.jpg",
  albums: [{ title: "Never Mind the Bollocks", year: "1977", type: "Full-length" }],
  members: [{ name: "Johnny Rotten", instrument: "vocals", period: "1975-1978" }],
  type: "Group",
  ...overrides,
});

/** A band that was ingested from MusicBrainz — editable all the same.
 *  Its data is what the mapper would really produce: no description, no label,
 *  no image, because MusicBrainz has none of those. */
export const makeIngestedBand = (overrides: Partial<Band> = {}): Band =>
  makeBand({
    id: "band-2",
    name: "Cro-Mags",
    source: "musicbrainz",
    musicBrainzId: "7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae",
    country: "US",
    location: "New York",
    status: "Active",
    formed: "1981",
    disbanded: null,
    genre: ["hardcore punk", "crossover thrash"],
    disambiguation: "New York hardcore band",
    image: null,
    albums: [{ title: "The Age of Quarrel", year: "1986", type: "Full-length" }],
    members: [{ name: "Harley Flanagan", instrument: "bass", period: "1981-" }],
    ...overrides,
  });

/** A search result: our shape already, with no id because nothing is stored yet. */
export const makeCandidate = (overrides: Partial<UpstreamCandidate> = {}): UpstreamCandidate => {
  const { id: unused, ...band } = makeIngestedBand();
  return { ...band, alreadyImported: false, ...overrides };
};

/** What the forms send to the API: a band without the fields the server owns. */
export const makeBandPayload = (
  overrides: Partial<Band> = {},
): Omit<Band, "id" | "source" | "musicBrainzId"> => {
  const { id: unusedId, source: unusedSource, musicBrainzId: unusedMb, ...payload } =
    makeBand(overrides);
  return payload;
};

/** A review of band-1, signed by the user that session(true) logs in — so a test
 *  gets the author's own view by default, and someone else's by overriding
 *  `author`. That distinction is the whole point of the model. */
export const makeReview = (overrides: Partial<Review> = {}): Review => ({
  id: "review-1",
  content: "Three chords and the truth, still the loudest record of 1977.",
  rating: 5,
  author: { id: "1", username: "joey" },
  band: "band-1",
  createdAt: "2026-10-17T10:00:00.000Z",
  updatedAt: "2026-10-17T10:00:00.000Z",
  ...overrides,
});
