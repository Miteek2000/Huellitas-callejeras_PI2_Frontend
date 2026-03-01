import { ENDPOINTS } from '../lib/endpoints';
import { apiFetch } from '../lib/interceptors';
import type { RegisterDTO, Usuario } from '@/schemas/auth.schema';

export type { Usuario as ColaboradorResponse };

export const ColaboradoresService = {
  async findAll(refugioId: string): Promise<Usuario[]> {
    return apiFetch<Usuario[]>(`${ENDPOINTS.USERS}/refugio/${refugioId}`, {
      method: 'GET',
    });
  },

  async create(data: RegisterDTO): Promise<Usuario> {
    return apiFetch<Usuario>(ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<RegisterDTO>): Promise<Usuario> {
    return apiFetch<Usuario>(`${ENDPOINTS.USERS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>(`${ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE',
    });
  },
};
