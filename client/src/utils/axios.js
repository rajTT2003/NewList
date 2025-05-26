// src/utils/axios.js
import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true, // ensures cookies/session are sent
});

export default api;
