import axios from 'axios';

const LOCAL_SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL || 'http://localhost:3001';
const MUSICBRAINZ_URL = 'https://musicbrainz.org/ws/2';

// API local pour gérer nos groupes
export const localBandsAPI = {
  getAll: () => axios.get(`${LOCAL_SERVER_URL}/bands`),
  getOne: (id) => axios.get(`${LOCAL_SERVER_URL}/bands/${id}`),
  create: (band) => axios.post(`${LOCAL_SERVER_URL}/bands`, band),
  update: (id, band) => axios.put(`${LOCAL_SERVER_URL}/bands/${id}`, band),
  delete: (id) => axios.delete(`${LOCAL_SERVER_URL}/bands/${id}`)
};

// API MusicBrainz pour avoir plus de groupes
const limitTheMusicBrainzAPI = 100;
const musicBrainzOffset = 0;
export const APIFromMusicBrainz = {
  searchBands: (query, limit = limitTheMusicBrainzAPI, offset = musicBrainzOffset) => {
    return axios.get(`${MUSICBRAINZ_URL}/artist`, {
      params: {
        query: query || 'tag:"hardcore punk" AND tag:"punk" AND type:group',
        fmt: 'json', // Format
        limit,
        offset
      }
    });
  },
  getBandDetails: (bandId) => {
    return axios.get(`${MUSICBRAINZ_URL}/artist/${bandId}`, {
      params: {
        inc: 'release-groups+artist-rels',
        fmt: 'json'
      }
    });
  }
};

// Récupérer tous les groupes des deux APIs
export const getAllBands = async () => {
  try {
    // Groupes depuis notre serveur local
    const responseFromLocalDB = await localBandsAPI.getAll();
    const localDbBands = responseFromLocalDB.data.map((band) => ({
      ...band,
      source: 'local',
      editable: true
    }));

    // Groupes depuis MusicBrainz
    const responseMusicBrainzAPI = await APIFromMusicBrainz.searchBands();
    const badnFromMusicBrainz = responseMusicBrainzAPI.data.artists.map(band => ({
      ...band,
      source: 'musicbrainz',
      editable: false
    }));

    // On met les locaux en premier
    return [...localDbBands, ...badnFromMusicBrainz];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
