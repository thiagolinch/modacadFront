import axios from 'axios';
import { LOCAL_STORAGE_KEY__ACCESS_TOKEN } from './auth';

const api = axios.create({
  //baseURL: 'http://localhost:5002/',
  baseURL: 'https://api-modacad-72uqj.ondigitalocean.app/',
  headers: {
    'Content-type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };
