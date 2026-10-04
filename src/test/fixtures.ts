import type { AxiosResponse } from "axios";
import type { Band, UpstreamCandidate } from "../types";

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
  albums: [{ title: "Never Mind the Bollocks", year: "1977", type: "Album" }],
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

// A mocked axios call only ever needs `data`. Building a full AxiosResponse in every
// test would be noise, so the cast lives here once, clearly labelled.
export const axiosResponse = <T>(data: T) =>
  ({ data }) as AxiosResponse<T>;

/** What the forms send to the API: a band without the fields the server owns. */
export const makeBandPayload = (
  overrides: Partial<Band> = {},
): Omit<Band, "id" | "source" | "musicBrainzId"> => {
  const { id: unusedId, source: unusedSource, musicBrainzId: unusedMb, ...payload } =
    makeBand(overrides);
  return payload;
};
