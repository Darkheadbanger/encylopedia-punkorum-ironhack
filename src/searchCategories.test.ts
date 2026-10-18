import { describe, it, expect } from "vitest";
import { SEARCH_CATEGORIES, isSearchCategory, matchesIn } from "./searchCategories";
import { makeBand } from "./test/fixtures";

// The dropdown beside the search box used to be decoration: the submit handler
// threw the chosen value away, so "Albums Title" and "Label" both searched band
// names. These tests are what stop that coming back.

const crass = makeBand({
  name: "Crass",
  genre: ["anarcho-punk", "art punk"],
  themes: "anarchism, pacifism, feminism",
  label: "Crass Records",
  albums: [{ title: "Stations of the Crass", year: "1979", type: "Full-length" }],
  members: [{ name: "Steve Ignorant", instrument: "vocals", period: "1977-1984" }],
});

describe("matchesIn — each category reads its own fields", () => {
  it.each([
    ["bands", "crass"],
    ["genres", "anarcho"],
    ["themes", "pacifism"],
    ["albums", "stations"],
    ["labels", "records"],
    ["artists", "ignorant"],
  ] as const)("%s finds a band by %s", (category, term) => {
    expect(matchesIn(crass, term, category)).toBe(true);
  });

  // The point of the whole change: a category that does not hold the term says no.
  it("does not find a band name when searching labels", () => {
    expect(matchesIn(crass, "crass", "labels")).toBe(true); // the label IS "Crass Records"
    expect(matchesIn(crass, "ignorant", "labels")).toBe(false);
  });

  it("does not find a member when searching genres", () => {
    expect(matchesIn(crass, "ignorant", "genres")).toBe(false);
  });

  it("does not find an album title when searching band names", () => {
    expect(matchesIn(crass, "stations", "bands")).toBe(false);
  });

  // The default is the broad search the box always did: narrowing it would have
  // made a working search stop working.
  it.each(["crass", "anarcho", "records"])("the default still finds %s", (term) => {
    expect(matchesIn(crass, term, "bands")).toBe(true);
  });

  it("survives a band with no themes, label, albums or members", () => {
    const bare = makeBand({ themes: undefined, label: undefined, albums: undefined, members: undefined });
    for (const category of Object.keys(SEARCH_CATEGORIES)) {
      expect(() => matchesIn(bare, "x", category as never)).not.toThrow();
    }
  });
});

describe("isSearchCategory", () => {
  it.each(Object.keys(SEARCH_CATEGORIES))("accepts %s", (value) => {
    expect(isSearchCategory(value)).toBe(true);
  });

  // "songs" was an option that could only ever return nothing: we hold no songs.
  it.each(["songs", "google", "nonsense", null])("refuses %s", (value) => {
    expect(isSearchCategory(value as string | null)).toBe(false);
  });
});
