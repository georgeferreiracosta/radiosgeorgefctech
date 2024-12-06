import axios from 'axios';

const API_BASE_URL = 'https://de1.api.radio-browser.info/json';

export const searchStations = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/stations/search`, {
    params: {
      name: query,
      country: 'Brazil',
      limit: 100,
      hidebroken: true,
    },
  });
  return response.data;
};

export const getTopStations = async () => {
  const response = await axios.get(`${API_BASE_URL}/stations/bycountry/brazil`, {
    params: {
      limit: 100,
      hidebroken: true,
      order: 'votes',
    },
  });
  return response.data;
};

export const getStationsByGenre = async (genre) => {
  const response = await axios.get(`${API_BASE_URL}/stations/bytag/${genre}`, {
    params: {
      country: 'Brazil',
      limit: 100,
      hidebroken: true,
    },
  });
  return response.data;
};

export const getPopularGenres = async () => {
  const response = await axios.get(`${API_BASE_URL}/tags`);
  return response.data;
};