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
  const calcularDias = (fechaIngreso: string): number => {
    const fecha = new Date(fechaIngreso);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fecha.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5EBF8] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#2B264F]">ANIMALES CON ALERTA</h3>
        <span className="text-xs font-bold text-red-600">{alertas.length} casos</span>
      </div>

      <div className="max-h-[280px] overflow-y-auto space-y-3">
        {alertas.map((alerta, idx) => {
          const config = NIVEL_COLORES[alerta.nivel_riesgo] || NIVEL_COLORES['Bajo'];
          const dias = calcularDias(alerta.fecha_primer_ingreso);
          return (
            <div key={`${alerta.id_alerta}-${idx}`} className="flex gap-3 items-start pt-3 pb-3 border-b border-[#E5EBF8] last:border-b-0">

              <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${config.badge} w-14 text-center`}>
                {alerta.nivel_riesgo}
              </span>
              
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#2B264F]">{alerta.animal}</p>
                <p className="text-xs text-[#666] mt-0.5">{alerta.tipo_alerta} — {alerta.estado_registro}</p>
              </div>
              
              <span className="text-xs font-semibold text-[#2B264F] whitespace-nowrap">{dias} días</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
