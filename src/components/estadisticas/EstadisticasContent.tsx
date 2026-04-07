import React, { useState } from 'react';
import { OcupacionLineChart } from './OcupacionLineChart';
import { PeriodoSelector } from './PeriodoSelector';
import { PromediosTable } from './PromediosTable';
import { VeredictoCard } from './VeredictoCard';
import { EstadoCapacidadCard } from './EstadoCapacidadCard';
import { AnimalesAlertaBox } from './AnimalesAlertaBox';
import { EstadisticasHeader } from './EstadisticasHeader';
import { ExpandedAnimalesView } from './ExpandedAnimalesView';
import type { GraficaRow, IndicadorRow, Veredicto, AnimalActivoRow, AlertaRow } from '@/schemas/estadisticas.schema';

export interface EstadisticasContentProps {
  modo: 'semana' | 'mes';
  fechaBase: string;
  rango: { fechaIni: string; fechaFin: string };
  indicadores: IndicadorRow[];
  graficaData: GraficaRow[];
  capacidadMax: number;
  veredicto: Veredicto | null;
  alertas: AlertaRow[];
  animalesActivos: AnimalActivoRow[];
  totalActivos: number;
  onModoChange: (modo: 'semana' | 'mes') => void;
  onFechaBaseChange: (fecha: string) => void;
}

export function EstadisticasContent({
  modo,
  fechaBase,
  rango,
  indicadores,
  graficaData,
  capacidadMax,
  veredicto,
  alertas,
  animalesActivos,
  totalActivos,
  onModoChange,
  onFechaBaseChange,
}: EstadisticasContentProps) {
  const [expandedTable, setExpandedTable] = useState<'animales' | null>(null);

  if (expandedTable === 'animales') {
    return (
      <ExpandedAnimalesView
        animales={animalesActivos}
        totalActivos={totalActivos}
        onBack={() => setExpandedTable(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] px-2 py-6 sm:px-4 md:px-8 lg:px-12 lg:py-10">
      <EstadisticasHeader onViewAnimales={() => setExpandedTable('animales')} />

      <div className="flex flex-col gap-6 lg:flex-row">

        <div className="flex-1 flex flex-col gap-6">
          <PromediosTable indicadores={indicadores} />
          {veredicto && <VeredictoCard veredicto={veredicto} />}
        </div>


        <div className="flex-1 flex flex-col gap-4">

          <EstadoCapacidadCard
            espaciosLibres={veredicto?.kpis.espacios_libres ?? 27}
            espaciosEnRiesgo={veredicto?.kpis.espacios_en_riesgo ?? 2}
            totalActivos={totalActivos}
            capacidadMax={capacidadMax}
          />

          <AnimalesAlertaBox alertas={alertas} />

          <PeriodoSelector
            modo={modo}
            fechaBase={fechaBase}
            fechaIni={rango.fechaIni}
            fechaFin={rango.fechaFin}
            onModoChange={onModoChange}
            onFechaBaseChange={onFechaBaseChange}
          />

          <div>
            <OcupacionLineChart data={graficaData} modo={modo} />
          </div>
        </div>
      </div>
    </div>
  );
}
