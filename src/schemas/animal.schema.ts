export interface Animal {
  id_animal?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string | number;
  peso: string | number;
  sexo: string;
  imagen?: string | null;
  tamano: string;
  enfermedad_no_tratable: boolean;
  discapacidad: boolean;
  es_agresivo: boolean;
  lugar: string;
  descripcion: string;
  usuario_id?: string;
  refugio_id?: string;
}
