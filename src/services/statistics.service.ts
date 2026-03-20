import { ENDPOINTS } from '@/app/lib/endpoints';
import { apiFetch } from '@/app/lib/interceptors';
import type {
  GraficaRow,
  HistorialResponse,
  IndicadorRow,
  IndicadoresResponse,
} from '@/schemas/estadisticas.schema';

type Modo = 'semana' | 'mes';

function getFechaRango(modo: Modo): { fechaIni: string; fechaFin: string } {
  const hoy = new Date();
  const ini = new Date(hoy);

  if (modo === 'semana') {
    ini.setDate(hoy.getDate() - 10 * 7); // 10 semanas atras
  } else {
    ini.setFullYear(hoy.getFullYear() - 1); // 12 meses atras
  }

  const toISO = (d: Date) => d.toISOString().split('T')[0];
  return { fechaIni: toISO(ini), fechaFin: toISO(hoy) };
}

export const StatisticsService = {
  async getIndicadores(refugioId: string): Promise<IndicadorRow[]> {
    const response = await apiFetch<IndicadoresResponse>(
      `${ENDPOINTS.STATISTICS.INDICADORES}/${refugioId}`,
    );

    return Array.isArray(response.indicadores) ? response.indicadores : [];
  },

  async getHistorial(
    refugioId: string,
    fechaIni: string,
    fechaFin: string,
    modo: Modo,
  ): Promise<GraficaRow[]> {
    const params = new URLSearchParams({ fecha_ini: fechaIni, fecha_fin: fechaFin, modo });
    const response = await apiFetch<HistorialResponse>(
      `${ENDPOINTS.STATISTICS.HISTORIAL}/${refugioId}?${params}`,
    );

    return Array.isArray(response.datos) ? response.datos : [];
  },

  getHistorialPorModo(refugioId: string, modo: Modo): Promise<GraficaRow[]> {
    const { fechaIni, fechaFin } = getFechaRango(modo);
    return StatisticsService.getHistorial(refugioId, fechaIni, fechaFin, modo);
  },
};
