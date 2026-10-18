import axios from 'axios';
import type { AuthUser, Band, Review, ReviewPayload, UpstreamCandidate } from '../types';

/** Where our API lives. Exported so the tests intercept the SAME address this
 *  file builds its URLs from: hard-coding it there made the whole suite fail
 *  the moment VITE_LOCAL_SERVER_URL pointed anywhere else. */
export const LOCAL_SERVER_URL =
  import.meta.env.VITE_LOCAL_SERVER_URL || 'http://localhost:3001';

// Every request carries the token, if there is one. Without this, the backend
// answers 401 to any write — and we would have to remember the header at each call.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (account: { email: string; password: string; username: string }) =>
    axios.post<AuthUser>(`${LOCAL_SERVER_URL}/auth/signup`, account),
  login: (credentials: { email: string; password: string }) =>
    axios.post<{ authToken: string }>(`${LOCAL_SERVER_URL}/auth/login`, credentials),
  /** Asks the server whether the stored token is still valid, and for whom. */
  verify: () => axios.get<AuthUser>(`${LOCAL_SERVER_URL}/auth/verify`),
};

/** What we send when creating or updating a band. The server owns the id and the
 *  provenance, and strips them from the body if they are sent anyway. */
export type BandPayload = Omit<Band, 'id' | 'source' | 'musicBrainzId'>;

// Our own API. Every band on the site comes from here — there is no second source.
export const bandsAPI = {
  getAll: () => axios.get<Band[]>(`${LOCAL_SERVER_URL}/bands`),
  getOne: (id: string) => axios.get<Band>(`${LOCAL_SERVER_URL}/bands/${id}`),
  create: (band: BandPayload) => axios.post<Band>(`${LOCAL_SERVER_URL}/bands`, band),
  update: (id: string, band: BandPayload) =>
    axios.put<Band>(`${LOCAL_SERVER_URL}/bands/${id}`, band),
  delete: (id: string) => axios.delete<void>(`${LOCAL_SERVER_URL}/bands/${id}`),
};

// Bringing a band in from MusicBrainz.
//
// The browser never talks to MusicBrainz: it cannot send the User-Agent header
// MusicBrainz requires, and more importantly nothing should be displayed from
// there. Our backend searches, translates and stores; the candidates below already
// have our own shape.
export const upstreamAPI = {
  search: (query: string) =>
    axios.get<UpstreamCandidate[]>(`${LOCAL_SERVER_URL}/bands/upstream`, {
      params: { q: query },
    }),
  /** Stores the band and returns it, from then on an ordinary band of the site. */
  import: (musicBrainzId: string) =>
    axios.post<Band>(`${LOCAL_SERVER_URL}/bands/import`, { musicBrainzId }),
};


// What members think of a band.
//
// Reading needs no account, like the bands. Writing does. Changing or deleting
// one needs to BE its author: the server compares the review to the token and
// answers 403 otherwise, so the page only ever offers those buttons on your own.
export const reviewsAPI = {
  /** One band's reviews, newest first. */
  forBand: (bandId: string) =>
    axios.get<Review[]>(`${LOCAL_SERVER_URL}/reviews`, { params: { band: bandId } }),
  /** Every review on the site, newest first. */
  getAll: () => axios.get<Review[]>(`${LOCAL_SERVER_URL}/reviews`),
  create: (review: ReviewPayload) =>
    axios.post<Review>(`${LOCAL_SERVER_URL}/reviews`, review),
  update: (id: string, review: Partial<ReviewPayload>) =>
    axios.put<Review>(`${LOCAL_SERVER_URL}/reviews/${id}`, review),
  delete: (id: string) => axios.delete<void>(`${LOCAL_SERVER_URL}/reviews/${id}`),
};
/** Every band in the encyclopedia, newest first. */
export const getAllBands = async (): Promise<Band[]> => {
  const { data } = await bandsAPI.getAll();
  return data;
};
