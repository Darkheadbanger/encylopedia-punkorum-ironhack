import { makeBandPayload } from "../test/fixtures";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { localBandsAPI, APIFromMusicBrainz, getAllBands } from "./api";

// Replace axios with fake functions: no real HTTP call is made
vi.mock("axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const LOCAL = "http://localhost:3001";
// MusicBrainz is reached through our own backend, which adds the User-Agent header
const MUSICBRAINZ = `${LOCAL}/api/mb`;

describe("localBandsAPI", () => {
  it("getAll calls GET /bands", () => {
    localBandsAPI.getAll();
    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/bands`);
  });

  it("getOne calls GET /bands/:id", () => {
    localBandsAPI.getOne("42");
    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/bands/42`);
  });

  it("create calls POST /bands with the band", () => {
    const band = makeBandPayload({ name: "Crass" });
    localBandsAPI.create(band);
    expect(axios.post).toHaveBeenCalledWith(`${LOCAL}/bands`, band);
  });

  it("update calls PUT /bands/:id with the band", () => {
    const band = makeBandPayload({ name: "Crass" });
    localBandsAPI.update("42", band);
    expect(axios.put).toHaveBeenCalledWith(`${LOCAL}/bands/42`, band);
  });

  it("delete calls DELETE /bands/:id", () => {
    localBandsAPI.delete("42");
    expect(axios.delete).toHaveBeenCalledWith(`${LOCAL}/bands/42`);
  });
});

describe("APIFromMusicBrainz", () => {
  it("searchBands uses the punk query and default limit/offset", () => {
    APIFromMusicBrainz.searchBands();
    expect(axios.get).toHaveBeenCalledWith(`${MUSICBRAINZ}/artist`, {
      params: {
        query: 'tag:"hardcore punk" AND tag:"punk" AND type:group',
        fmt: "json",
        limit: 100,
        offset: 0,
      },
    });
  });

  it("searchBands accepts a custom query, limit and offset", () => {
    APIFromMusicBrainz.searchBands("ramones", 10, 20);
    expect(axios.get).toHaveBeenCalledWith(`${MUSICBRAINZ}/artist`, {
      params: { query: "ramones", fmt: "json", limit: 10, offset: 20 },
    });
  });

  it("getBandDetails asks for release groups and relations", () => {
    APIFromMusicBrainz.getBandDetails("mb-1");
    expect(axios.get).toHaveBeenCalledWith(`${MUSICBRAINZ}/artist/mb-1`, {
      params: { inc: "release-groups+artist-rels", fmt: "json" },
    });
  });
});

describe("getAllBands", () => {
  it("merges local and MusicBrainz bands, local ones first, with source and editable flags", async () => {
    vi.mocked(axios.get).mockImplementation((url) =>
      url.includes("/api/mb")
        ? Promise.resolve({ data: { artists: [{ id: "mb-1", name: "Ramones" }] } })
        : Promise.resolve({ data: [{ id: "local-1", name: "Sex Pistols" }] })
    );

    const result = await getAllBands();

    expect(result.bands).toEqual([
      { id: "local-1", name: "Sex Pistols", source: "local", editable: true },
      { id: "mb-1", name: "Ramones", source: "musicbrainz", editable: false },
    ]);
    expect(result.musicBrainzFailed).toBe(false);
  });

  it("still returns the local bands when MusicBrainz fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(axios.get).mockImplementation((url) =>
      url.includes("/api/mb")
        ? Promise.reject(new Error("MusicBrainz down"))
        : Promise.resolve({ data: [{ id: "local-1", name: "Sex Pistols" }] })
    );

    const result = await getAllBands();

    expect(result.bands).toEqual([
      { id: "local-1", name: "Sex Pistols", source: "local", editable: true },
    ]);
    // the caller needs to know, so it can warn the user
    expect(result.musicBrainzFailed).toBe(true);
  });

  it("throws when the local server fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

    await expect(getAllBands()).rejects.toThrow("Network error");
  });
});
