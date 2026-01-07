import axios from 'axios';

const JSON_SERVER_URL = 'http://localhost:3001';
const MUSICBRAINZ_URL = 'https://musicbrainz.org/ws/2';

// API JSON Server (complete CRUD)
export const localBandsAPI = {
  getAll: () => axios.get(`${JSON_SERVER_URL}/bands`),
  getOne: (id) => axios.get(`${JSON_SERVER_URL}/bands/${id}`),
  create: (band) => axios.post(`${JSON_SERVER_URL}/bands`, band),
  update: (id, band) => axios.put(`${JSON_SERVER_URL}/bands/${id}`, band),
  delete: (id) => axios.delete(`${JSON_SERVER_URL}/bands/${id}`)
};

// API MusicBrainz (read seule)
export const musicBrainzAPI = {
  searchBands: (query, limit = 100, offset = 0) => {
    return axios.get(`${MUSICBRAINZ_URL}/artist`, {
      params: {
        query: query || 'tag:"hardcore punk" AND tag:"punk" AND type:group',
        fmt: 'json',
        limit,
        offset
      }
    });
  },
  getBandDetails: (artistId) => {
    return axios.get(`${MUSICBRAINZ_URL}/artist/${artistId}`, {
      params: {
        inc: 'release-groups+artist-rels',
        fmt: 'json'
      }
    });
  }
};

// Fonction pour combiner les deux sources
export const getAllBands = async () => {
  try {
    // 1. Récupérer VOS groupes (JSON Server)
    const localResponse = await localBandsAPI.getAll();
    const localBands = localResponse.data.map(band => ({
      ...band,
      source: 'local', // Marquer comme éditable
      editable: true
    }));

    // 2. Récupérer les groupes MusicBrainz
    const mbResponse = await musicBrainzAPI.searchBands();
    const mbBands = mbResponse.data.artists.map(band => ({
      ...band,
      source: 'musicbrainz', // Marquer comme non-éditable
      editable: false
    }));

    // 3. Combiner : VOS groupes EN PREMIER
    return [...localBands, ...mbBands];
  } catch (error) {
    console.error('Error fetching bands:', error);
    throw error;
  }
};
