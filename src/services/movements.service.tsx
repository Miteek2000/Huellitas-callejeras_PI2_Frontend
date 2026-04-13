import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import { Movimiento } from '@/schemas/movimiento.schema';

function buildFechaConHoraLocal(fechaStr: string): string {
  if (fechaStr.includes('T')) return fechaStr;

  const ahora = new Date();
  const hh = String(ahora.getHours()).padStart(2, '0');
  const mm = String(ahora.getMinutes()).padStart(2, '0');
  const ss = String(ahora.getSeconds()).padStart(2, '0');

  const offsetMinutos = ahora.getTimezoneOffset();
  const signo = offsetMinutos <= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMinutos);
  const offsetHH = String(Math.floor(absMin / 60)).padStart(2, '0');
  const offsetMM = String(absMin % 60).padStart(2, '0');
  const offset = `${signo}${offsetHH}:${offsetMM}`;

  return `${fechaStr}T${hh}:${mm}:${ss}${offset}`;
}

export const MovementsService = {

  async getAll(): Promise<Movimiento[]> {
    const data = await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);
    return data ?? [];
  },

  async getByAnimalId(animalId: string): Promise<Movimiento[]> {
    const movements = await apiFetch<Movimiento[]>(ENDPOINTS.MOVEMENTS);
    return (movements ?? []).filter(
      (m) => String(m.animal_id) === String(animalId)
    );
  },

  async create(data: Omit<Movimiento, 'id_movimiento'>): Promise<Movimiento> {
    const payload = { ...data };

    if (payload.fecha_movimiento) {
      payload.fecha_movimiento = buildFechaConHoraLocal(payload.fecha_movimiento);
    }

    return await apiFetch<Movimiento>(ENDPOINTS.MOVEMENTS, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch<void>(`${ENDPOINTS.MOVEMENTS}/${id}`, {
      method: 'DELETE',
    });
  },
};