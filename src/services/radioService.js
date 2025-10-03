import axios from 'axios';

// Lista de servidores da Radio Browser API para failover
const API_SERVERS = [
  'https://de1.api.radio-browser.info/json',
  'https://nl1.api.radio-browser.info/json',
  'https://at1.api.radio-browser.info/json'
];

let currentServerIndex = 0;

const getApiUrl = () => API_SERVERS[currentServerIndex];

const makeRequest = async (endpoint, params = {}) => {
  for (let attempt = 0; attempt < API_SERVERS.length; attempt++) {
    try {
      const response = await axios.get(`${getApiUrl()}${endpoint}`, {
        params: {
          ...params,
          hidebroken: true,
        },
        timeout: 10000, // 10 segundos de timeout
      });
      return response.data;
    } catch (error) {
      console.warn(`Erro no servidor ${getApiUrl()}: ${error.message}`);
      currentServerIndex = (currentServerIndex + 1) % API_SERVERS.length;
      
      if (attempt === API_SERVERS.length - 1) {
        throw new Error('Todos os servidores da Radio Browser API estão indisponíveis');
      }
    }
  }
};

export const searchStations = async (query) => {
  return await makeRequest('/stations/search', {
    name: query,
    limit: 50,
    order: 'votes',
  });
};

export const getTopStations = async () => {
  return await makeRequest('/stations/topvote', {
    limit: 100,
    order: 'votes',
  });
};

export const getBrazilianStations = async () => {
  return await makeRequest('/stations/bycountry/brazil', {
    limit: 100,
    order: 'votes',
  });
};

export const getStationsByGenre = async (genre) => {
  return await makeRequest(`/stations/bytag/${encodeURIComponent(genre)}`, {
    limit: 50,
    order: 'votes',
  });
};

export const getPopularGenres = async () => {
  const data = await makeRequest('/tags', {
    limit: 100,
    order: 'stationcount',
  });
  
  // Filtrar gêneros populares e relevantes
  return data.filter(tag => 
    tag.stationcount > 10 && 
    tag.name.length > 2 && 
    tag.name.length < 20
  ).slice(0, 20);
};

export const getStationsByCountry = async (country = 'brazil') => {
  return await makeRequest(`/stations/bycountry/${country.toLowerCase()}`, {
    limit: 100,
    order: 'votes',
  });
};

export const getRandomStations = async () => {
  return await makeRequest('/stations', {
    limit: 20,
    order: 'random',
  });
};
