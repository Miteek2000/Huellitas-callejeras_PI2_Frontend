const BASE_URL = process.env.NEXT_PUBLIC_API_URL 

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
  },
  REFUGIOS: `${BASE_URL}/refugios`,
  ANIMALS: `${BASE_URL}/animals`,
  MOVEMENTS: `${BASE_URL}/movements`,
  ROLES: `${BASE_URL}/roles`
};

export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path}`;
};