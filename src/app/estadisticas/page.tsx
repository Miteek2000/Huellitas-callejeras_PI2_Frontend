'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getRefugioId } from '@/app/lib/auth';
import { AnimalsService } from '@/app/services/animals.service';
import { RefugiosService } from '@/app/services/refugios.service';
import { OcupacionLineChart } from '@/components/estadisticas/OcupacionLineChart';
import { PromediosTable } from '@/components/estadisticas/PromediosTable';
import type { Animal } from '@/schemas/animal.schema';
import type { OcupacionTimelinePoint, PromediosStats } from '@/schemas/estadisticas.schema';

// Datos de simulación para probar la gráfica
const MOCK_TIMELINE: OcupacionTimelinePoint[] = [
  { fecha: '2026-03-01', ocupacion: 2, capacidadMax: 20, entradas: 2, salidas: 0 },
  { fecha: '2026-03-02', ocupacion: 3, capacidadMax: 20, entradas: 2, salidas: 1 },
  { fecha: '2026-03-03', ocupacion: 5, capacidadMax: 20, entradas: 3, salidas: 1 },
  { fecha: '2026-03-04', ocupacion: 8, capacidadMax: 20, entradas: 4, salidas: 1 },
  { fecha: '2026-03-05', ocupacion: 6, capacidadMax: 20, entradas: 1, salidas: 3 },
  { fecha: '2026-03-06', ocupacion: 9, capacidadMax: 20, entradas: 4, salidas: 1 },
  { fecha: '2026-03-07', ocupacion: 12, capacidadMax: 20, entradas: 5, salidas: 2 },
  { fecha: '2026-03-08', ocupacion: 10, capacidadMax: 20, entradas: 2, salidas: 4 },
  { fecha: '2026-03-09', ocupacion: 11, capacidadMax: 20, entradas: 3, salidas: 2 },
  { fecha: '2026-03-10', ocupacion: 15, capacidadMax: 20, entradas: 5, salidas: 1 },
];

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;

  if (value && typeof value === 'object') {
    const candidate = value as {
      data?: unknown;
      results?: unknown;
      items?: unknown;
    };

    if (Array.isArray(candidate.data)) return candidate.data as T[];
    if (Array.isArray(candidate.results)) return candidate.results as T[];
    if (Array.isArray(candidate.items)) return candidate.items as T[];
  }

  return [];
}

export default function EstadisticasPage() {
  const refugioId = getRefugioId();
  const [loading, setLoading] = useState(true);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [timeline, setTimeline] = useState<OcupacionTimelinePoint[]>(MOCK_TIMELINE);
  const [capacidadMax, setCapacidadMax] = useState(20);

  const promedios = useMemo((): PromediosStats => {
    if (!animales.length) {
      return {
        edadPromedio: 0,
        sexoMasculino: 0,
        tamanoPromedio: 'N/A',
        discapacidadPorcentaje: 0,
        agresividadPorcentaje: 0,
        enfermedadPorcentaje: 0,
      };
    }

    const edades = animales
      .map((a) => {
        const edad = typeof a.edad === 'string' ? parseInt(a.edad, 10) : a.edad;
        return Number.isNaN(edad) ? 0 : edad;
      })
      .filter((e) => e > 0);

    const edadPromedio =
      edades.length > 0 ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : 0;

    const sexoMasculino = animales.filter((a) => a.sexo?.toLowerCase() === 'macho').length;
    const sexoMasculinoPorcentaje = Math.round((sexoMasculino / animales.length) * 100);

    const tamaños = animales.map((a) => a.tamano).filter(Boolean);
    const tamanoMasFrequente = tamaños.length > 0 ? tamaños[0] : 'N/A';

    const discapacidadCount = animales.filter((a) => a.discapacidad).length;
    const discapacidadPorcentaje = Math.round((discapacidadCount / animales.length) * 100);

    const agresividadCount = animales.filter((a) => a.es_agresivo).length;
    const agresividadPorcentaje = Math.round((agresividadCount / animales.length) * 100);

    const enfermedadCount = animales.filter((a) => a.enfermedad_no_tratable).length;
    const enfermedadPorcentaje = Math.round((enfermedadCount / animales.length) * 100);

    return {
      edadPromedio,
      sexoMasculino: sexoMasculinoPorcentaje,
      tamanoPromedio: tamanoMasFrequente,
      discapacidadPorcentaje,
      agresividadPorcentaje,
      enfermedadPorcentaje,
    };
  }, [animales]);

  useEffect(() => {
    if (!refugioId) {
      setLoading(false);
      return;
    }

    Promise.all([
      AnimalsService.getAll(refugioId).catch(() => null),
      RefugiosService.getById(refugioId).catch(() => null),
    ])
      .then(([animalsResponse, refugioResponse]) => {
        const animals = normalizeArray<Animal>(animalsResponse);
        const maxCapacity = Number(refugioResponse?.capacidad_max ?? 20);

        setAnimales(animals);
        setCapacidadMax(maxCapacity);

        // Actualizar la gráfica con la capacidad real
        setTimeline(
          MOCK_TIMELINE.map((point) => ({
            ...point,
            capacidadMax: maxCapacity,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refugioId]);

  if (loading) {
    return <div className="min-h-screen bg-[#F0F0F0] p-10 text-[#2B264F]">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-12 py-10">
      <h1 className="text-3xl font-bold text-[#2B264F] text-center mb-16">
        Panel de Estadísticas
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        <PromediosTable promedios={promedios} />
        <OcupacionLineChart data={timeline} />
      </div>
    </div>
  );
}
