import { makeBandPayload, makeBand, makeCandidate, axiosResponse } from "../test/fixtures";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { bandsAPI, upstreamAPI, authAPI, getAllBands } from "./api";

// Replace axios with fake functions: no real HTTP call is made
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    // api.ts registers a request interceptor on import to attach the auth token
    interceptors: { request: { use: vi.fn() } },
  },
}));

const LOCAL = "http://localhost:3001";

describe("bandsAPI", () => {
  it("getAll calls GET /bands", () => {
    bandsAPI.getAll();
    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/bands`);
  });

  it("getOne calls GET /bands/:id", () => {
    bandsAPI.getOne("42");
    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/bands/42`);
  });

  it("create calls POST /bands with the band", () => {
    const band = makeBandPayload({ name: "Crass" });
    bandsAPI.create(band);
    expect(axios.post).toHaveBeenCalledWith(`${LOCAL}/bands`, band);
  });

  it("update calls PUT /bands/:id with the band", () => {
    const band = makeBandPayload({ name: "Crass" });
    bandsAPI.update("42", band);
    expect(axios.put).toHaveBeenCalledWith(`${LOCAL}/bands/42`, band);
  });

  it("delete calls DELETE /bands/:id", () => {
    bandsAPI.delete("42");
    expect(axios.delete).toHaveBeenCalledWith(`${LOCAL}/bands/42`);
  });
});

// The browser never calls MusicBrainz. It asks our own backend, which searches,
// translates and stores — so every URL here is on our server.
describe("upstreamAPI", () => {
  it("search calls our own /bands/upstream, not musicbrainz.org", () => {
    upstreamAPI.search("cro-mags");

    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/bands/upstream`, {
      params: { q: "cro-mags" },
    });
    expect(vi.mocked(axios.get).mock.calls.flat(2).join(" ")).not.toContain("musicbrainz.org");
  });

  it("import posts the MusicBrainz id to our own /bands/import", () => {
    upstreamAPI.import("7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae");

    expect(axios.post).toHaveBeenCalledWith(`${LOCAL}/bands/import`, {
      musicBrainzId: "7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae",
    });
  });

  it("returns candidates that already have our shape", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(axiosResponse([makeCandidate()]));

    const { data } = await upstreamAPI.search("cro-mags");

    expect(data[0]).toMatchObject({ name: "Cro-Mags", source: "musicbrainz", alreadyImported: false });
  });
});

describe("authAPI", () => {
  it("signup, login and verify all go to /auth", () => {
    authAPI.signup({ email: "joey@ramones.com", password: "hey-ho-lets-go", username: "joey" });
    authAPI.login({ email: "joey@ramones.com", password: "hey-ho-lets-go" });
    authAPI.verify();

    expect(axios.post).toHaveBeenCalledWith(`${LOCAL}/auth/signup`, expect.any(Object));
    expect(axios.post).toHaveBeenCalledWith(`${LOCAL}/auth/login`, expect.any(Object));
    expect(axios.get).toHaveBeenCalledWith(`${LOCAL}/auth/verify`);
  });
});

// This used to merge two sources and report whether MusicBrainz had answered.
// There is one source now: the database.
describe("getAllBands", () => {
  it("returns the bands our API sends, untouched", async () => {
    const stored = [makeBand(), makeBand({ id: "band-2", name: "Crass" })];
    vi.mocked(axios.get).mockResolvedValueOnce(axiosResponse(stored));

    expect(await getAllBands()).toEqual(stored);
  });

  it("makes a single request: no second source to merge", async () => {
    vi.mocked(axios.get).mockClear();
    vi.mocked(axios.get).mockResolvedValueOnce(axiosResponse([]));

    await getAllBands();

    expect(axios.get).toHaveBeenCalledOnce();
  });

  it("lets the failure through, so App can say the server is down", async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Network error"));
    await expect(getAllBands()).rejects.toThrow("Network error");
  });
});
