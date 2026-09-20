import axios from 'axios';
import type {
  Band,
  LocalBand,
  MusicBrainzBand,
  MusicBrainzDetails,
} from '../types';

const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL || 'http://localhost:3001';
// MusicBrainz now goes through our own backend: a browser cannot send the
// User-Agent header that MusicBrainz requires, but a server can.
const MUSICBRAINZ_URL = `${LOCAL_SERVER_URL}/api/mb`;

/** What we send when creating or updating a band: everything but the id, which the
 *  server owns. */
export type BandPayload = Omit<LocalBand, 'id'>;

/** A band as it is stored, before we add `source` and `editable`. */
type StoredBand = Omit<LocalBand, 'source' | 'editable'>;

/** An artist as MusicBrainz returns it, before we add `source` and `editable`. */
type SearchedArtist = Omit<MusicBrainzBand, 'source' | 'editable'>;

// API local pour gérer nos groupes
export const localBandsAPI = {
  getAll: () => axios.get<StoredBand[]>(`${LOCAL_SERVER_URL}/bands`),
  getOne: (id: string) => axios.get<StoredBand>(`${LOCAL_SERVER_URL}/bands/${id}`),
  create: (band: BandPayload) => axios.post<StoredBand>(`${LOCAL_SERVER_URL}/bands`, band),
  update: (id: string, band: BandPayload) =>
    axios.put<StoredBand>(`${LOCAL_SERVER_URL}/bands/${id}`, band),
  delete: (id: string) => axios.delete<void>(`${LOCAL_SERVER_URL}/bands/${id}`),
};

// API MusicBrainz pour avoir plus de groupes
const limitTheMusicBrainzAPI = 100;
const musicBrainzOffset = 0;

export const APIFromMusicBrainz = {
  searchBands: (
    query?: string,
    limit: number = limitTheMusicBrainzAPI,
    offset: number = musicBrainzOffset,
  ) => {
    return axios.get<{ artists: SearchedArtist[] }>(`${MUSICBRAINZ_URL}/artist`, {
      params: {
        query: query || 'tag:"hardcore punk" AND tag:"punk" AND type:group',
        fmt: 'json', // Format
        limit,
        offset,
      },
    });
  },
  getBandDetails: (bandId: string) => {
    return axios.get<MusicBrainzDetails>(`${MUSICBRAINZ_URL}/artist/${bandId}`, {
      params: {
        inc: 'release-groups+artist-rels',
        fmt: 'json',
      },
    });
  },
};

/** What getAllBands returns: the bands, plus whether MusicBrainz answered. */
export interface AllBandsResult {
  bands: Band[];
  musicBrainzFailed: boolean;
}

// Récupérer tous les groupes des deux APIs
export const getAllBands = async (): Promise<AllBandsResult> => {
  // Our own bands are the core of the app: if this fails, there is nothing to show.
  const responseFromLocalDB = await localBandsAPI.getAll();
  const localDbBands: LocalBand[] = responseFromLocalDB.data.map((band) => ({
    ...band,
    source: 'local',
    editable: true,
  }));

  // MusicBrainz is a bonus. If it is down, we still show the local bands — but we say
  // so, instead of silently showing a shorter list.
  let bandsFromMusicBrainz: MusicBrainzBand[] = [];
  let musicBrainzFailed = false;
  try {
    const responseMusicBrainzAPI = await APIFromMusicBrainz.searchBands();
    bandsFromMusicBrainz = responseMusicBrainzAPI.data.artists.map((band) => ({
      ...band,
      source: 'musicbrainz',
      editable: false,
    }));
  } catch (error) {
    musicBrainzFailed = true;
    console.error('MusicBrainz is unavailable, showing local bands only:', error);
  }

  // On met les locaux en premier
  return { bands: [...localDbBands, ...bandsFromMusicBrainz], musicBrainzFailed };
};
