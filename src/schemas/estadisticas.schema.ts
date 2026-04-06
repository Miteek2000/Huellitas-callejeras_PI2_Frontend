export interface IndicadorRow {
  datos: string;
  historico: string;
  actual: string;
  resultado: string;
}

export interface AlertaRow {
  id: string;
  titulo: string;
  descripcion: string;
  nivel_riesgo: 'Alto' | 'Medio' | 'Bajo';
  refugio_id: string;
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
  dias_en_refugio: number;
  fecha_ingreso: string;
  probabilidad_adopcion: number;
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
