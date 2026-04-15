import axios from 'axios';

// Create an axios instance with a default backend URL
export const api = axios.create({
  baseURL: 'http://localhost:3000' 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});