import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import type { Etiqueta, Animal } from '@/schemas/animal.schema';

export interface CreateEtiquetaDTO {
  nombre: string;
  refugio_id: string;
}

export interface UpdateEtiquetaDTO {
  nombre?: string;
}

export interface AsignarEtiquetaDTO {
  etiqueta_id: string;
}

export interface DeleteResponseDTO {
  message: string;
  id?: string;
  animalId?: string;
  etiquetaId?: string;
}

export const EtiquetasService = {
  getAll: (): Promise<Etiqueta[]> =>
    apiFetch<Etiqueta[]>(`${ENDPOINTS.ETIQUETAS}`),

  findByRefugio: (refugioId: string): Promise<Etiqueta[]> =>
    apiFetch<Etiqueta[]>(`${ENDPOINTS.ETIQUETAS}/refugio/${refugioId}`),

  findOne: (id: string): Promise<Etiqueta> =>
    apiFetch<Etiqueta>(`${ENDPOINTS.ETIQUETAS}/${id}`),

  create: (data: CreateEtiquetaDTO): Promise<Etiqueta> =>
    apiFetch<Etiqueta>(`${ENDPOINTS.ETIQUETAS}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateEtiquetaDTO): Promise<Etiqueta> =>
    apiFetch<Etiqueta>(`${ENDPOINTS.ETIQUETAS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<DeleteResponseDTO> =>
    apiFetch<DeleteResponseDTO>(`${ENDPOINTS.ETIQUETAS}/${id}`, {
      method: 'DELETE',
    }),

  asignarAAnimal: (animalId: string, etiquetaId: string): Promise<Animal> =>
    apiFetch<Animal>(`${ENDPOINTS.ETIQUETAS}/animal/${animalId}`, {
      method: 'POST',
      body: JSON.stringify({ etiqueta_id: etiquetaId }),
    }),

  quitarDeAnimal: (animalId: string, etiquetaId: string): Promise<DeleteResponseDTO> =>
    apiFetch<DeleteResponseDTO>(`${ENDPOINTS.ETIQUETAS}/animal/${animalId}/${etiquetaId}`, {
      method: 'DELETE',
    }),
};
