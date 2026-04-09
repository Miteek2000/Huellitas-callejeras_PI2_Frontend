const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  REFUGIOS: `${BASE_URL}/refugios`,
  ANIMALS: `${BASE_URL}/animals`,
  MOVEMENTS: `${BASE_URL}/movements`,
  ROLES: `${BASE_URL}/roles`,
  USERS: `${BASE_URL}/users`,
  ETIQUETAS: `${BASE_URL}/etiquetas`,
  STATISTICS: {
    INDICADORES: `${BASE_URL}/statistics/indicadores`,
    HISTORIAL: `${BASE_URL}/statistics/historial`,
    ANIMALES_ACTIVOS: `${BASE_URL}/statistics/animales-activos`,
  },
};

export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${path}`;
};