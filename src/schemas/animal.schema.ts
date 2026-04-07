export interface AnimalImagen {
  id_animal_imagen: string;
  imagen: string;
  animal_id: string;
}

export interface Etiqueta {
  id_etiqueta: string;
  nombre: string;
}

export interface EtiquetaAnimal {
  animal_id: string;
  etiqueta_id: string;
  etiqueta: Etiqueta;
}

export interface Animal {
  id_animal?: string;
  nombre: string;
  estado: string;
  especie: string;
  raza: string;
  edad: string | number;
  unidad_edad?: 'meses' | 'años';
  peso: string | number;
  sexo: string;
  imagenes?: AnimalImagen[];
  etiquetas?: EtiquetaAnimal[];
  tamano: string;
  enfermedad_no_tratable: boolean;
  discapacidad: boolean;
  es_agresivo: boolean;
  lugar: string;
  descripcion: string;
  usuario_id?: string;
  refugio_id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}