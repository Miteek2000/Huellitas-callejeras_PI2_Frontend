import React from 'react';

type Modo = 'semana' | 'mes';

interface PeriodoSelectorProps {
  modo: Modo;
  fechaBase: string;
  fechaIni: string;
  fechaFin: string;
  capacidadMax: number | null;
  onModoChange: (modo: Modo) => void;
  onFechaBaseChange: (fecha: string) => void;
}

export function PeriodoSelector({
  modo,
  fechaBase,
  fechaIni,
  fechaFin,
  capacidadMax,
  onModoChange,
  onFechaBaseChange,
}: PeriodoSelectorProps) {
  return (
    <div className="flex flex-wrap items-end justify-end gap-3">
      <div className="rounded-xl border border-[#D7DDEA] bg-white px-3 py-2">
        <p className="text-xs text-[#44506A]">Capacidad del refugio</p>
        <p className="text-sm font-semibold text-[#1F2A56]">
          {capacidadMax ?? 'N/A'} espacios
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-[#44506A] font-medium mr-1">Ver por:</span>
        <button
          onClick={() => onModoChange('semana')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            modo === 'semana'
              ? 'bg-[#2855CF] text-white border-[#2855CF]'
              : 'bg-white text-[#2855CF] border-[#2855CF] hover:bg-[#EEF1FB]'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => onModoChange('mes')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            modo === 'mes'
              ? 'bg-[#2855CF] text-white border-[#2855CF]'
              : 'bg-white text-[#2855CF] border-[#2855CF] hover:bg-[#EEF1FB]'
          }`}
        >
          Mes
        </button>
      </div>

      <label className="flex flex-col text-xs text-[#44506A] min-w-[190px]">
        {modo === 'semana' ? 'Inicio de semana' : 'Fecha del mes'}
        <input
          type="date"
          value={fechaBase}
          onChange={(e) => onFechaBaseChange(e.target.value)}
          className="mt-1 rounded-lg border border-[#C9D3E7] bg-white px-3 py-2 text-sm text-[#1F2A56]"
        />
      </label>

      <div className="rounded-xl border border-[#D7DDEA] bg-[#F6F8FC] px-3 py-2 min-w-[220px]">
        <p className="text-xs text-[#44506A]">Rango aplicado</p>
        <p className="text-sm font-semibold text-[#1F2A56]">
          {fechaIni} a {fechaFin}
        </p>
      </div>
    </div>
  );
}
