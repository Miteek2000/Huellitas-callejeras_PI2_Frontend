export interface IndicadorRow {
  datos: string;
  historico: string;
  actual: string;
  resultado: string;
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

export interface IndicadoresResponse {
  refugio_id: string;
  indicadores: IndicadorRow[];
}

export interface HistorialResponse {
  refugio_id: string;
  modo: 'semana' | 'mes';
  fecha_ini: string;
  fecha_fin: string;
  datos: GraficaRow[];
}

export interface OcupacionLineChartProps {
  data: GraficaRow[];
  modo: 'semana' | 'mes';
}
