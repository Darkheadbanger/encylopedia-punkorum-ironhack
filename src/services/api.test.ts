import { describe, it, expect } from "vitest";
import { bandsAPI, upstreamAPI, authAPI, getAllBands } from "./api";
import { makeBandPayload, makeBand, makeCandidate } from "../test/fixtures";
import { API, server } from "../test/server";
import { http, HttpResponse } from "msw";

// This file used to replace axios with vi.fn()s and assert on the arguments it
// was handed. That proved api.ts called a function with a string — not that a
// request went anywhere, not that the URL was right, and above all not that the
// token interceptor attached anything.
//
// MSW answers the real request instead, so every test below reads what actually
// left the browser: method, path, query string, body, headers.

/** Records everything the browser sends to `path`, whatever the method. */
const recordAll = () => {
  const seen: { method: string; url: string; body: unknown; auth: string | null }[] = [];
  const capture = async ({ request }: { request: Request }) => {
    const body = ["POST", "PUT", "PATCH"].includes(request.method)
      ? await request.clone().json().catch(() => null)
      : null;
    seen.push({
      method: request.method,
      url: request.url,
      body,
      auth: request.headers.get("Authorization"),
    });
    return HttpResponse.json([]);
  };

  server.use(
    http.get(`${API}/*`, capture),
    http.post(`${API}/*`, capture),
    http.put(`${API}/*`, capture),
    http.delete(`${API}/*`, capture),
  );
  return seen;
};

describe("bandsAPI — where each call really goes", () => {
  it.each([
    ["getAll", () => bandsAPI.getAll(), "GET", "/bands"],
    ["getOne", () => bandsAPI.getOne("42"), "GET", "/bands/42"],
    ["delete", () => bandsAPI.delete("42"), "DELETE", "/bands/42"],
  ])("%s sends %s %s", async (_name, call, method, path) => {
    const seen = recordAll();

    await call();

    expect(seen[0].method).toBe(method);
    expect(seen[0].url).toBe(`${API}${path}`);
  });

  it("create posts the band to /bands", async () => {
    const seen = recordAll();
    const band = makeBandPayload({ name: "Crass" });

    await bandsAPI.create(band);

    expect(seen[0].method).toBe("POST");
    expect(seen[0].url).toBe(`${API}/bands`);
    expect(seen[0].body).toEqual(band);
  });

  it("update puts the band to /bands/:id", async () => {
    const seen = recordAll();
    const band = makeBandPayload({ name: "Crass" });

    await bandsAPI.update("42", band);

    expect(seen[0].method).toBe("PUT");
    expect(seen[0].url).toBe(`${API}/bands/42`);
    expect(seen[0].body).toEqual(band);
  });
});

// The interceptor is the reason to test at this level at all: a mocked axios
// never runs it, so nothing used to check that writes carry the token.
describe("the token interceptor", () => {
  it("attaches the stored token to every request", async () => {
    localStorage.setItem("authToken", "a-stored-token");
    const seen = recordAll();

    await bandsAPI.getAll();

    expect(seen[0].auth).toBe("Bearer a-stored-token");
  });

  it("sends no Authorization header when nobody is logged in", async () => {
    const seen = recordAll();

    await bandsAPI.getAll();

    expect(seen[0].auth).toBeNull();
  });
});

// The browser never calls MusicBrainz. It asks our own backend, which searches,
// translates and stores — so every URL here is on our server.
describe("upstreamAPI", () => {
  it("searches our own backend, never musicbrainz.org", async () => {
    const seen = recordAll();

    await upstreamAPI.search("cro-mags");

    expect(seen[0].url).toBe(`${API}/bands/upstream?q=cro-mags`);
    expect(seen[0].url).not.toContain("musicbrainz.org");
  });

  it("posts the MusicBrainz id to our own /bands/import", async () => {
    const seen = recordAll();

    await upstreamAPI.import("7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae");

    expect(seen[0].url).toBe(`${API}/bands/import`);
    expect(seen[0].body).toEqual({ musicBrainzId: "7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae" });
  });

  it("returns candidates that already have our shape", async () => {
    server.use(http.get(`${API}/bands/upstream`, () => HttpResponse.json([makeCandidate()])));

    const { data } = await upstreamAPI.search("cro-mags");

    expect(data[0]).toMatchObject({
      name: "Cro-Mags",
      source: "musicbrainz",
      alreadyImported: false,
    });
  });
});

describe("authAPI", () => {
  it("sends signup, login and verify to /auth", async () => {
    const seen = recordAll();

    await authAPI.signup({ email: "joey@ramones.com", password: "hey-ho-lets-go", username: "joey" });
    await authAPI.login({ email: "joey@ramones.com", password: "hey-ho-lets-go" });
    await authAPI.verify();

    expect(seen.map((call) => `${call.method} ${call.url}`)).toEqual([
      `POST ${API}/auth/signup`,
      `POST ${API}/auth/login`,
      `GET ${API}/auth/verify`,
    ]);
  });
});

// This used to merge two sources and report whether MusicBrainz had answered.
// There is one source now: the database.
describe("getAllBands", () => {
  it("returns the bands our API sends, untouched", async () => {
    const stored = [makeBand(), makeBand({ id: "band-2", name: "Crass" })];
    server.use(http.get(`${API}/bands`, () => HttpResponse.json(stored)));

    expect(await getAllBands()).toEqual(stored);
  });

  it("makes a single request: no second source to merge", async () => {
    const seen = recordAll();

    await getAllBands();

    expect(seen).toHaveLength(1);
  });

  it("lets the failure through, so App can say the server is down", async () => {
    server.use(http.get(`${API}/bands`, () => HttpResponse.error()));

    await expect(getAllBands()).rejects.toThrow();
  });
});
