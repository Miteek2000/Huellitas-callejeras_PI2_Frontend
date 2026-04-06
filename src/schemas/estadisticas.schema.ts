export interface IndicadorRow {
  datos: string;
  historico: string;
  actual: string;
  resultado: string;
}

export interface AlertaRow {
  id_alerta: string;
  tipo_alerta: string;
  nivel_riesgo: 'Alto' | 'Medio' | 'Bajo';
  refugio_id: string;
  id_animal: string;
  animal: string;
  especie: string;
  estado_registro: string;
  fue_devuelto: boolean;
  veces_regresado: string;
  fecha_primer_ingreso: string;
  fecha_ultima_salida: string | null;
}

export interface VeredictoKPI {
  total_activos: number;
  espacios_libres: number;
  espacios_en_riesgo: number;
  pct_ocupacion: number;
  alertas_alto: number;
  alertas_medio: number;
}

export interface Veredicto {
  puede_recibir: boolean;
  tipo: 'positivo' | 'advertencia' | 'negativo';
  mensaje: string;
  kpis: VeredictoKPI;
}

export interface IndicadoresResponse {
  refugio_id: string;
  refugio_nombre: string;
  capacidad_max: number;
  indicadores: IndicadorRow[];
  veredicto: Veredicto;
  alertas: AlertaRow[];
}

export interface GraficaRow {
  periodo: string;
  fecha_punto: string;
  ocupacion_total: number;
  entradas_acum: number;
  salidas_adopcion: number;
  salidas_defuncion: number;
  salidas_extravio: number;
}

export interface HistorialResponse {
  refugio_id: string;
  modo: 'semana' | 'mes';
  fecha_ini: string;
  fecha_fin: string;
  datos: GraficaRow[];
}

export interface AnimalActivoRow {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  tamaño: string;
  edad: number;
  enfermedad_no_tratable: boolean;
  discapacidad: boolean;
  es_agresivo: boolean;
  estado: string;
  dias_en_refugio: number;
  fecha_ingreso: string;
  probabilidad_adopcion: number;
  nivel_adoptabilidad: string;
  nivel_confianza: string;
}

export interface AnimalesActivosResponse {
  refugio_id: string;
  refugio_nombre: string;
  total_activos: number;
  animales: AnimalActivoRow[];
}

export interface OcupacionLineChartProps {
  data: GraficaRow[];
  modo: 'semana' | 'mes';
}
