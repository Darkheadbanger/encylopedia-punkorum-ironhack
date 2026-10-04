// types.ts is mostly interfaces, which vanish at runtime and need no test. Two
// things in it are real values, though, and BandsId reads them to build the
// discography tabs: a typo there would silently empty a tab.

import { describe, it, expect } from "vitest";
import { RELEASE_TYPES, DISCOGRAPHY_FILTERS } from "./types";

describe("RELEASE_TYPES", () => {
  it("lists the release kinds an encyclopedia tracks", () => {
    expect(RELEASE_TYPES).toContain("Full-length");
    expect(RELEASE_TYPES).toContain("EP");
    expect(RELEASE_TYPES).toContain("Demo");
  });

  it("names each kind once", () => {
    expect(new Set(RELEASE_TYPES).size).toBe(RELEASE_TYPES.length);
  });
});

describe("DISCOGRAPHY_FILTERS", () => {
  it("starts with Complete, which shows everything", () => {
    expect(Object.keys(DISCOGRAPHY_FILTERS)[0]).toBe("Complete");
    expect(DISCOGRAPHY_FILTERS.Complete).toBeNull();
  });

  // A tab asking for a type that does not exist would always look empty, and
  // nothing else in the app would complain.
  it("only filters on types that exist", () => {
    for (const [tab, types] of Object.entries(DISCOGRAPHY_FILTERS)) {
      for (const type of types ?? []) {
        expect(RELEASE_TYPES, `${tab} tab`).toContain(type);
      }
    }
  });

  // Not the other way around: a release type may deliberately belong to no tab.
  it("places every release type in at least one tab", () => {
    const filtered = Object.values(DISCOGRAPHY_FILTERS).flatMap((types) => types ?? []);
    for (const type of RELEASE_TYPES) {
      expect(filtered, type).toContain(type);
    }
  });

  it("never shows the same type in two tabs", () => {
    const filtered = Object.values(DISCOGRAPHY_FILTERS).flatMap((types) => types ?? []);
    expect(new Set(filtered).size).toBe(filtered.length);
  });
});
