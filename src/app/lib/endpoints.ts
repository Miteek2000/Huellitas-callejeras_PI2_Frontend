const BASE_URL = 'http://localhost:3001';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
  },
  ANIMALS: `${BASE_URL}/animals`,
  MOVEMENTS: `${BASE_URL}/movements`,
};