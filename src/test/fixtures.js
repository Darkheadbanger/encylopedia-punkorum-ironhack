// Fake bands shared by the tests.
// Functions (not constants) so every test gets a fresh copy it can safely modify.

export const makeLocalBand = (overrides = {}) => ({
  id: "local-1",
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
  source: "local",
  editable: true,
  type: "Group",
  ...overrides,
});

// Same shape as an artist returned by the MusicBrainz search API
export const makeMusicBrainzBand = (overrides = {}) => ({
  id: "mb-1",
  name: "Ramones",
  country: "US",
  type: "Group",
  disambiguation: "",
  tags: [{ name: "punk" }, { name: "rock" }, { name: "hardcore punk" }],
  "life-span": { begin: "1974", ended: null },
  "begin-area": { name: "New York" },
  source: "musicbrainz",
  editable: false,
  ...overrides,
});
