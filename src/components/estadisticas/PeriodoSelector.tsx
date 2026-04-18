'use client';

import React from 'react';
import { sanitizeInput } from '@/utils/sanitize';

type Modo = 'semana' | 'mes';

interface PeriodoSelectorProps {
  modo: Modo;
  fechaBase: string;
  fechaIni: string;
  fechaFin: string;
  onModoChange: (modo: Modo) => void;
  onFechaBaseChange: (fecha: string) => void;
}

export function PeriodoSelector({
  modo,
  fechaBase,
  fechaIni,
  fechaFin,
  onModoChange,
  onFechaBaseChange,
}: PeriodoSelectorProps) {
  return (
    <div className="rounded-xl border border-[#D7DDEA] bg-white shadow-sm p-4 space-y-2.5">
      <div className="rounded-lg border border-[#D7DDEA]/50 px-3 py-2.5 space-y-2">
        <span className="text-xs text-[#44506A] font-medium block">Ver por:</span>
        
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onModoChange('semana')}
            className={`w-full px-4 py-1.5 rounded-md text-xs font-semibold border transition-all text-center ${
              modo === 'semana'
                ? 'bg-[#194566] text-white border-[#2855CF]'
                : 'bg-white text-[#44506A] border-[#D7DDEA] hover:border-[#2855CF]'
            }`}>
            Semana
          </button>
          <button
            onClick={() => onModoChange('mes')}
            className={`w-full px-4 py-1.5 rounded-md text-xs font-semibold border transition-all text-center ${
              modo === 'mes'
                ? 'bg-[#194566] text-white border-[#2855CF]'
                : 'bg-white text-[#44506A] border-[#D7DDEA] hover:border-[#2855CF]'
            }`}>
            Mes
          </button>
        </div>

        <label className="flex flex-col text-xs text-[#44506A] gap-1 mt-1.5 pt-1.5 border-t border-[#E5EBF8]">
          <span className="font-medium text-xs">{modo === 'semana' ? 'Inicio de semana' : 'Fecha del mes'}</span>
          <input
            type="date"
            value={fechaBase}
            onChange={(e) => onFechaBaseChange(sanitizeInput(e.target.value))}
            className="rounded-md border border-[#C9D3E7] bg-white px-3 py-1.5 text-xs text-[#1F2A56] font-medium focus:outline-none focus:border-[#2855CF] focus:ring-1 focus:ring-[#2855CF]/10 transition-all"
          />
        </label>
      </div>

      <div className="bg-gradient-to-r from-[#F6F8FC] to-[#ECEEF8] rounded-lg px-3 py-2 border border-[#D7DDEA]/50">
        <p className="text-xs text-[#44506A] font-medium">Rango: <span className="font-bold text-[#1F2A56]">{fechaIni} a {fechaFin}</span></p>
      </div>
    </div>
  );
}
