// The genre taxonomy is data, not code, and it is big: 14 families, dozens of
// cards, hundreds of labels. These tests guard the shape, not the opinions — a
// card with no bands or a label listed twice is a mistake, not a debate.

import { describe, it, expect } from "vitest";
import { FAMILIES } from "./genres";

const allGenres = FAMILIES.flatMap((family) => family.genres);
const allRelated = FAMILIES.flatMap((family) => family.related);

const duplicates = (values: string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

describe("genre families", () => {
  it("covers the whole punk tree, from the roots to the internet era", () => {
    expect(FAMILIES.length).toBeGreaterThanOrEqual(14);
    expect(FAMILIES.map((family) => family.name)).toContain("Roots & Proto-Punk");
    expect(FAMILIES.map((family) => family.name)).toContain("Internet-Era Microgenres");
  });

  it("names every family once", () => {
    expect(duplicates(FAMILIES.map((family) => family.name))).toEqual([]);
  });

  it("gives every family a summary and at least one genre card", () => {
    for (const family of FAMILIES) {
      expect(family.summary.length, family.name).toBeGreaterThan(20);
      expect(family.genres.length, family.name).toBeGreaterThan(0);
    }
  });
});

describe("genre cards", () => {
  it("fills every field: a half-empty card is worse than no card", () => {
    for (const genre of allGenres) {
      expect(genre.name, genre.name).not.toBe("");
      expect(genre.years, genre.name).toMatch(/\d{4}/);
      expect(genre.origin, genre.name).not.toBe("");
      expect(genre.description.length, genre.name).toBeGreaterThan(20);
      expect(genre.bands.length, genre.name).toBeGreaterThanOrEqual(2);
    }
  });

  it("names every genre once across all families", () => {
    expect(duplicates(allGenres.map((genre) => genre.name))).toEqual([]);
  });

  it("names no band twice inside the same card", () => {
    for (const genre of allGenres) {
      expect(duplicates(genre.bands), genre.name).toEqual([]);
    }
  });
});

describe("related labels", () => {
  it("holds the long tail: hundreds of labels without a card", () => {
    expect(allRelated.length).toBeGreaterThan(300);
  });

  it("lists no label twice, in the same family or across families", () => {
    expect(duplicates(allRelated)).toEqual([]);
  });

  // A label with a card does not belong in the "related" list as well: the page
  // would show it both as a card and as a tag.
  it("never repeats a label that already has a card", () => {
    const named = new Set(allGenres.map((genre) => genre.name.toLowerCase()));
    const both = allRelated.filter((label) => named.has(label.toLowerCase()));

    expect(both).toEqual([]);
  });

  it("has no empty or untrimmed label", () => {
    for (const label of allRelated) {
      expect(label).toBe(label.trim());
      expect(label).not.toBe("");
    }
  });
});
