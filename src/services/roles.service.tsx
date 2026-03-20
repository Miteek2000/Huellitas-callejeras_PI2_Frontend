import { ENDPOINTS } from '../app/lib/endpoints';
import { apiFetch } from '../app/lib/interceptors';

export interface Rol {
  id_roles: string;
  nombre: string;
}

export const RolesService = {

  getByRefugio: (refugioId: string): Promise<Rol[]> =>
    apiFetch<Rol[]>(`${ENDPOINTS.ROLES}/refugio/${refugioId}`),

};
