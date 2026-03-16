export interface OcupacionTimelinePoint {
  fecha: string;
  ocupacion: number;
  capacidadMax: number;
  entradas: number;
  salidas: number;
}

export interface PromediosStats {
  edadPromedio: number;
  sexoMasculino: number;
  tamanoPromedio: string;
  discapacidadPorcentaje: number;
  agresividadPorcentaje: number;
  enfermedadPorcentaje: number;
}

export interface OcupacionLineChartProps {
  data: OcupacionTimelinePoint[];
}
