import React from 'react';
import type { AlertaRow } from '@/schemas/estadisticas.schema';

interface AnimalesAlertaBoxProps {
  alertas: AlertaRow[];
}

const NIVEL_COLORES: Record<string, { bg: string; text: string; badge: string }> = {
  Alto: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    badge: 'bg-red-200 text-red-800',
  },
  Medio: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-200 text-yellow-800',
  },
  Bajo: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-200 text-green-800',
  },
};

export function AnimalesAlertaBox({ alertas }: AnimalesAlertaBoxProps) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5EBF8] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#2B264F]">ANIMALES CON ALERTA</h3>
          <span className="text-xs font-bold text-[#666]">0 casos</span>
        </div>
        <p className="text-xs text-[#999]">No hay alertas activas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5EBF8] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#2B264F]">ANIMALES CON ALERTA</h3>
        <span className="text-xs font-bold text-red-600">{alertas.length} casos</span>
      </div>

      <div className="space-y-2.5">
        {alertas.slice(0, 5).map((alerta) => {
          const config = NIVEL_COLORES[alerta.nivel_riesgo] || NIVEL_COLORES['Bajo'];
          return (
            <div key={alerta.id} className={`rounded-lg p-3 border-l-4 border-red-500`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#2B264F]">{alerta.titulo}</p>
                  <p className="text-xs text-[#666] mt-0.5">{alerta.descripcion}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${config.badge}`}>
                  {alerta.nivel_riesgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
