import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';
import type { RegisterDTO } from '@/schemas/auth.schema';

export interface ColaboradorResponse {
  id_usuario: string;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  email: string;
  activo: boolean;
  rol_id: string;
  refugio_id: string;
}

export const ColaboradoresService = {
  async findAll(): Promise<ColaboradorResponse[]> {
    return apiFetch<ColaboradorResponse[]>(`${ENDPOINTS.BASE_URL}/users`, {
      method: 'GET',
    });
  },

  async create(data: RegisterDTO): Promise<ColaboradorResponse> {
    return apiFetch<ColaboradorResponse>(`${ENDPOINTS.BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<RegisterDTO>): Promise<ColaboradorResponse> {
    return apiFetch<ColaboradorResponse>(`${ENDPOINTS.BASE_URL}/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>(`${ENDPOINTS.BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
  },
};
