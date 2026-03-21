import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import type { Animal } from '@/schemas/animal.schema';

export type CreateAnimalDTO = Omit<Animal, 'id_animal'>;
export type UpdateAnimalDTO = Partial<CreateAnimalDTO>;

export interface PaginatedAnimals {
  data: Animal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const AnimalsService = {

  getAll: (refugioId: string, page = 1, limit = 12): Promise<PaginatedAnimals> =>
    apiFetch<PaginatedAnimals>(
      `${ENDPOINTS.ANIMALS}/refugio/${refugioId}?page=${page}&limit=${limit}`,
    ),

  getById: (id: string): Promise<Animal> =>
    apiFetch<Animal>(`${ENDPOINTS.ANIMALS}/${id}`),

  create: (data: CreateAnimalDTO): Promise<Animal> =>
    apiFetch<Animal>(ENDPOINTS.ANIMALS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createWithForm: (formData: FormData): Promise<Animal> =>
    apiFetch<Animal>(ENDPOINTS.ANIMALS, {
      method: 'POST',
      body: formData,
    }),

  updateWithForm: (id: string, formData: FormData): Promise<Animal> =>
    apiFetch<Animal>(`${ENDPOINTS.ANIMALS}/${id}`, {
      method: 'PATCH',
      body: formData,
    }),

  deleteImagen: (imagenId: string): Promise<{ message: string; id: string }> =>
    apiFetch<{ message: string; id: string }>(
      `${ENDPOINTS.ANIMALS}/imagen/${imagenId}`,
      { method: 'DELETE' },
    ),

  delete: (id: string): Promise<void> =>
    apiFetch<void>(`${ENDPOINTS.ANIMALS}/${id}`, {
      method: 'DELETE',
    }),
};