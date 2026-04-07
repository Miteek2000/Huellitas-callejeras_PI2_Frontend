'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getRefugioId } from '@/app/lib/auth';
import { RefugiosService } from '../../services/refugios.service';
import { StatisticsService } from '../../services/statistics.service';
import { EstadisticasContent } from '@/components/estadisticas/EstadisticasContent';
import type { GraficaRow, IndicadorRow, IndicadoresResponse, Veredicto, AnimalActivoRow, AlertaRow } from '@/schemas/estadisticas.schema';
import { Spinner } from '@/components/ui/Spinner';

type Modo = 'semana' | 'mes';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function buildRange(modo: Modo, fechaBase: string): { fechaIni: string; fechaFin: string } {
  const base = parseLocalDate(fechaBase);

  if (modo === 'semana') {
    const end = new Date(base);
    end.setDate(base.getDate() + 6);
    return { fechaIni: formatLocalDate(base), fechaFin: formatLocalDate(end) };
  }

  const firstDay = new Date(base.getFullYear(), base.getMonth(), 1);
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return { fechaIni: formatLocalDate(firstDay), fechaFin: formatLocalDate(lastDay) };
}

export default function EstadisticasPage() {
  const refugioId = getRefugioId();
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState<Modo>('semana');
  const [fechaBase, setFechaBase] = useState<string>(() => formatLocalDate(new Date()));
  const [indicadores, setIndicadores] = useState<IndicadorRow[]>([]);
  const [graficaData, setGraficaData] = useState<GraficaRow[]>([]);
  const [capacidadMax, setCapacidadMax] = useState<number>(40);
  const [veredicto, setVeredicto] = useState<Veredicto | null>(null);
  const [alertas, setAlertas] = useState<AlertaRow[]>([]);
  const [animalesActivos, setAnimalesActivos] = useState<AnimalActivoRow[]>([]);
  const [totalActivos, setTotalActivos] = useState(13);

  const rango = useMemo(() => buildRange(modo, fechaBase), [modo, fechaBase]);

  useEffect(() => {
    if (!refugioId) {
      setLoading(false);
      return;
    }

    Promise.all([
      StatisticsService.getIndicadores(refugioId).catch(() => null),
      RefugiosService.getById(refugioId).catch(() => null),
      StatisticsService.getAnimalesActivos(refugioId).catch(() => null),
    ])
      .then(([indicadoresData, refugioData, animalesData]) => {
        if (indicadoresData) {
          setIndicadores(Array.isArray(indicadoresData.indicadores) ? indicadoresData.indicadores : []);
          setCapacidadMax(indicadoresData.capacidad_max ?? null);
          setAlertas(Array.isArray(indicadoresData.alertas) ? indicadoresData.alertas : []);
          setVeredicto(indicadoresData.veredicto ?? null);
        }
        if (animalesData) {
          setAnimalesActivos(Array.isArray(animalesData.animales) ? animalesData.animales : []);
          setTotalActivos(animalesData.total_activos ?? 0);
        }
      })
      .finally(() => setLoading(false));
  }, [refugioId]);

  useEffect(() => {
    if (!refugioId) return;

    StatisticsService.getHistorial(refugioId, rango.fechaIni, rango.fechaFin, modo)
      .then((data) => setGraficaData(Array.isArray(data) ? data : []))
      .catch(() => setGraficaData([]));
  }, [refugioId, modo, rango.fechaIni, rango.fechaFin]);

  if (loading) return <Spinner message="Cargando estadísticas..." />;

  return (
    <EstadisticasContent
      modo={modo}
      fechaBase={fechaBase}
      rango={rango}
      indicadores={indicadores}
      graficaData={graficaData}
      capacidadMax={capacidadMax}
      veredicto={veredicto}
      alertas={alertas}
      animalesActivos={animalesActivos}
      totalActivos={totalActivos}
      onModoChange={setModo}
      onFechaBaseChange={setFechaBase}
    />
  );
}

