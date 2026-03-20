'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getRefugioId } from '@/app/lib/auth';
import { RefugiosService } from '../../services/refugios.service';
import { StatisticsService } from '../../services/statistics.service';
import { OcupacionLineChart } from '@/components/estadisticas/OcupacionLineChart';
import { PeriodoSelector } from '@/components/estadisticas/PeriodoSelector';
import { PromediosTable } from '@/components/estadisticas/PromediosTable';
import type { GraficaRow, IndicadorRow } from '@/schemas/estadisticas.schema';

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
  const [capacidadMax, setCapacidadMax] = useState<number | null>(null);

  const rango = useMemo(() => buildRange(modo, fechaBase), [modo, fechaBase]);

  useEffect(() => {
    if (!refugioId) {
      setLoading(false);
      return;
    }

    Promise.all([
      StatisticsService.getIndicadores(refugioId).catch(() => []),
      RefugiosService.getById(refugioId).catch(() => null),
    ])
      .then(([indicadoresData, refugioData]) => {
        setIndicadores(Array.isArray(indicadoresData) ? indicadoresData : []);
        setCapacidadMax(typeof refugioData?.capacidad_max === 'number' ? refugioData.capacidad_max : null);
      })
      .finally(() => setLoading(false));
  }, [refugioId]);

  useEffect(() => {
    if (!refugioId) return;

    StatisticsService.getHistorial(refugioId, rango.fechaIni, rango.fechaFin, modo)
      .then((data) => setGraficaData(Array.isArray(data) ? data : []))
      .catch(() => setGraficaData([]));
  }, [refugioId, modo, rango.fechaIni, rango.fechaFin]);

  if (loading) {
    return <div className="min-h-screen bg-[#F0F0F0] p-10 text-[#2B264F]">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-12 py-10">
      <h1 className="text-3xl font-bold text-[#2B264F] text-center mb-16">
        Panel de Estadísticas
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        <PromediosTable indicadores={indicadores} />

        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <PeriodoSelector
            modo={modo}
            fechaBase={fechaBase}
            fechaIni={rango.fechaIni}
            fechaFin={rango.fechaFin}
            capacidadMax={capacidadMax}
            onModoChange={setModo}
            onFechaBaseChange={setFechaBase}
          />

          <OcupacionLineChart data={graficaData} modo={modo} />
        </div>
      </div>
    </div>
  );
}

