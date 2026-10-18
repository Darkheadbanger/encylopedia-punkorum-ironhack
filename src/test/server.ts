// A stand-in for the backend, at the HTTP boundary.
//
// The tests used to replace src/services/api.ts with vi.fn()s. That faked too
// much: axios never ran, the interceptor that attaches the token never ran, and
// api.ts itself — the URLs, the params, the shapes — was never exercised. A test
// could pass while the real request went to the wrong address.
//
// MSW intercepts the request instead, one layer lower. Everything above it is the
// real thing; only the server's answer is ours. A test that wants a 400 asks for a
// 400, the way the real backend would send one.

import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { JsonBodyType } from "msw";
import type { Band, Review } from "../types";
import { makeBand } from "./fixtures";
import { LOCAL_SERVER_URL } from "../services/api";

/** The very address api.ts builds its URLs from — imported, not repeated, so a
 *  different VITE_LOCAL_SERVER_URL moves the tests with the app instead of
 *  leaving every request unhandled. */
export const API = LOCAL_SERVER_URL;

/** What every file gets unless it says otherwise: one band, no reviews. */
const defaults = [
  http.get(`${API}/bands`, () => HttpResponse.json([makeBand()])),
  http.get(`${API}/reviews`, () => HttpResponse.json([])),
];

export const server = setupServer(...defaults);

// --- the shorthands tests reach for ---------------------------------------
//
// Named for what the SERVER does, not for what the test asserts: `answers`,
// `refuses`, `isDown`. A test reads as a conversation with a backend.

/** The server answers this GET with `body`. */
export const answers = (path: string, body: JsonBodyType) =>
  server.use(http.get(`${API}${path}`, () => HttpResponse.json(body)));

/** The server accepts this POST and answers with `body` (201, like ours). */
export const accepts = (path: string, body: JsonBodyType) =>
  server.use(http.post(`${API}${path}`, () => HttpResponse.json(body, { status: 201 })));

/** The server refuses, with its own message — which is what the forms show. */
export const refuses = (
  method: "get" | "post" | "put" | "delete",
  path: string,
  error: string,
  status = 400,
) => server.use(http[method](`${API}${path}`, () => HttpResponse.json({ error }, { status })));

/** The server is unreachable: no response at all, as when it is not running. */
export const isDown = (method: "get" | "post" | "put" | "delete", path: string) =>
  server.use(http[method](`${API}${path}`, () => HttpResponse.error()));

/** Records what a write actually sent, so a test can assert on the real body. */
export const captures = (
  method: "post" | "put",
  path: string,
  answer: JsonBodyType,
  status = method === "post" ? 201 : 200,
) => {
  const sent: unknown[] = [];
  server.use(
    http[method](`${API}${path}`, async ({ request }) => {
      sent.push(await request.json());
      return HttpResponse.json(answer, { status });
    })
  );
  return sent;
};

/** The band and review lists the site reads on startup. */
export const holds = (bands: Band[], reviews: Review[] = []) =>
  server.use(
    http.get(`${API}/bands`, () => HttpResponse.json(bands)),
    http.get(`${API}/reviews`, () => HttpResponse.json(reviews)),
  );

/** Records the URLs a GET actually went to, so a test can assert on the query
 *  string the real api.ts built — which a module mock could never check. */
export const watches = (path: string, body: JsonBodyType) => {
  const urls: string[] = [];
  server.use(
    http.get(`${API}${path}`, ({ request }) => {
      urls.push(request.url);
      return HttpResponse.json(body);
    })
  );
  return urls;
};

/** The server accepts this DELETE, with the 204 ours answers. */
export const deletes = (path: string) =>
  server.use(http.delete(`${API}${path}`, () => new HttpResponse(null, { status: 204 })));

/** Records the DELETEs sent to `path`, so "nothing was deleted" is a recorded
 *  fact rather than an assumption. An unhandled request fails the REQUEST, not
 *  the test — the component swallows it — so absence has to be measured. */
export const watchesDelete = (path: string) => {
  const urls: string[] = [];
  server.use(
    http.delete(`${API}${path}`, ({ request }) => {
      urls.push(request.url);
      return new HttpResponse(null, { status: 204 });
    })
  );
  return urls;
};
