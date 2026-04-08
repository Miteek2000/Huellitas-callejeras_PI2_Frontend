import React, { useState } from 'react';
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
  const [hoveredAlerta, setHoveredAlerta] = useState<string | null>(null);

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
          const alertKey = `${alerta.id_alerta}-${idx}`;
          return (
            <div key={alertKey} className="flex gap-3 items-start pt-3 pb-3 border-b border-[#E5EBF8] last:border-b-0 relative">

              <div
                className="relative"
                onMouseEnter={() => setHoveredAlerta(alertKey)}
                onMouseLeave={() => setHoveredAlerta(null)}
              >
                <span 
                  className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${config.badge} w-14 text-center cursor-help block`}
                >
                  {alerta.nivel_riesgo}
                </span>

                {hoveredAlerta === alertKey && (
                  <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 px-3 py-2 bg-[#2B264F] text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                    Este estado cambiará al registrar el movimiento de {alerta.estado_registro.toLowerCase()}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-[#2B264F]"></div>
                  </div>
                )}
              </div>
              
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
