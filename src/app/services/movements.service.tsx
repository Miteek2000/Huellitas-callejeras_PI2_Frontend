import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import { Movimiento } from '@/schemas/movimiento.schema';

export const MovementsService = {

  async getAll(): Promise<Movimiento[]> {
    return await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);
  },

  async getById(id: string | number): Promise<Movimiento> {
    return await apiFetch<Movimiento>(`${ENDPOINTS.MOVEMENTS}/${id}`);
  },

  async getByAnimalId(animalId: string | number): Promise<Movimiento[]> {

    const movements = await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);

    return movements.filter(
      (movement) =>
        String(movement.id_animal) === String(animalId)
    );
  },

  async create(
    data: Omit<Movimiento, 'id_movimiento'>
  ): Promise<Movimiento> {

    return await apiFetch<Movimiento>(ENDPOINTS.MOVEMENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });

  },

  async update(
    id: string | number,
    data: Partial<Movimiento>
  ): Promise<Movimiento> {

    return await apiFetch<Movimiento>(`${ENDPOINTS.MOVEMENTS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

  },

  async delete(id: string | number): Promise<void> {

    await apiFetch<void>(`${ENDPOINTS.MOVEMENTS}/${id}`, {
      method: 'DELETE',
    });

  },

};