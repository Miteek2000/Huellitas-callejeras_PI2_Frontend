import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';

export interface Rol {
  id_roles: string;
  nombre: string;
}

export const RolesService = {
  getAll: (): Promise<Rol[]> =>
    apiFetch<Rol[]>(ENDPOINTS.ROLES),

  getByRefugio: (refugioId: string): Promise<Rol[]> =>
    apiFetch<Rol[]>(`${ENDPOINTS.ROLES}/refugio/${refugioId}`),

  create: (data: { nombre: string; refugio_id?: string }): Promise<Rol> =>
    apiFetch<Rol>(ENDPOINTS.ROLES, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
