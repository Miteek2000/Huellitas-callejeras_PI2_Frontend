import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';

export interface Rol {
  id_roles: string;
  nombre: string;
}

export const RolesService = {

  getByRefugio: (refugioId: string): Promise<Rol[]> =>
    apiFetch<Rol[]>(`${ENDPOINTS.ROLES}/refugio/${refugioId}`),

};
