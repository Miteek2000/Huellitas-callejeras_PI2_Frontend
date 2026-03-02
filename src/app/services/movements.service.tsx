import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import { Movimiento } from '@/schemas/movimiento.schema';

export const MovementsService = {

  async getAll(): Promise<Movimiento[]> {
    return await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);
  },

  async getByAnimalId(animalId: string): Promise<Movimiento[]> {
    const movements = await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);
    return movements.filter(
      (m) => String(m.animal_id) === String(animalId)
    );
  },

  async create(data: Omit<Movimiento, 'id_movimiento'>): Promise<Movimiento> {
    return await apiFetch<Movimiento>(ENDPOINTS.MOVEMENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch<void>(`${ENDPOINTS.MOVEMENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};