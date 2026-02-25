const BASE_URL = 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
  },
  REFUGIOS: `${BASE_URL}/refugios`,
  ANIMALS: `${BASE_URL}/animals`,
  MOVEMENTS: `${BASE_URL}/movements`,
};