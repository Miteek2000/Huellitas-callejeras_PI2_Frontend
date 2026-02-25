import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';

export interface CreateRefugioDTO {
  nombre: string;
  capacidad_max: number;
  estado: string;
  municipio: string;
  colonia: string;
  calle: string;
  num_exterior?: number;
  num_interior?: number;
}

export interface Refugio {
  id_refugio: string;
  nombre: string;
  capacidad_max: number;
  estado: string;
  municipio: string;
  colonia: string;
  calle: string;
  num_exterior?: number;
  num_interior?: number;
}

export const RefugiosService = {
  create: (data: CreateRefugioDTO): Promise<Refugio> =>
    apiFetch<Refugio>(ENDPOINTS.REFUGIOS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string): Promise<Refugio> =>
    apiFetch<Refugio>(`${ENDPOINTS.REFUGIOS}/${id}`),

  update: (id: string, data: Partial<CreateRefugioDTO>): Promise<Refugio> =>
    apiFetch<Refugio>(`${ENDPOINTS.REFUGIOS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiFetch<void>(`${ENDPOINTS.REFUGIOS}/${id}`, {
      method: 'DELETE',
    }),
};
