import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import type { Animal } from '@/schemas/animal.schema';

export type CreateAnimalDTO = Omit<Animal, 'id_animal'>;
export type UpdateAnimalDTO = Partial<CreateAnimalDTO>;

export const AnimalsService = {

  getAll: (): Promise<Animal[]> =>
    apiFetch<Animal[]>(ENDPOINTS.ANIMALS),

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

  update: (id: string, data: UpdateAnimalDTO): Promise<Animal> =>
    apiFetch<Animal>(`${ENDPOINTS.ANIMALS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiFetch<void>(`${ENDPOINTS.ANIMALS}/${id}`, {
      method: 'DELETE',
    }),

};