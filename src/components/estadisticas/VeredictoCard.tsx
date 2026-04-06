import React from 'react';
import type { Veredicto } from '@/schemas/estadisticas.schema';

interface VeredictoCardProps {
  veredicto: Veredicto;
}

export function VeredictoCard({ veredicto }: VeredictoCardProps) {
  const tipoConfig = {
    positivo: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      icon: '✓',
      iconColor: 'text-green-600',
      titleColor: 'text-green-700',
    },
    advertencia: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: '⚠',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-700',
    },
    negativo: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: '✕',
      iconColor: 'text-red-600',
      titleColor: 'text-red-700',
    },
  };

  const config = tipoConfig[veredicto.tipo];

  return (
    <div className={`rounded-3xl shadow-lg p-6 sm:p-8 w-full border-2 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.bg} flex items-center justify-center`}>
          <span className={`text-2xl font-bold ${config.iconColor}`}>{config.icon}</span>
        </div>

        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.titleColor} mb-2`}>
            {veredicto.puede_recibir ? 'El refugio puede recibir animales' : 'El refugio NO puede recibir animales'}
          </h3>
          <p className="text-[#2B264F] text-sm mb-6 leading-relaxed">{veredicto.mensaje}</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">Activos</p>
              <p className="text-lg font-bold text-[#194566]">{veredicto.kpis.total_activos}</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">Espacios Libres</p>
              <p className="text-lg font-bold text-[#194566]">{veredicto.kpis.espacios_libres}</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">En Riesgo</p>
              <p className="text-lg font-bold text-[#DC2626]">{veredicto.kpis.espacios_en_riesgo}</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">% Ocupación</p>
              <p className="text-lg font-bold text-[#F97316]">{veredicto.kpis.pct_ocupacion}%</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">Alertas Altas</p>
              <p className="text-lg font-bold text-[#DC2626]">{veredicto.kpis.alertas_alto}</p>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-[#E5EBF8]">
              <p className="text-xs text-[#666] font-medium mb-1">Alertas Medias</p>
              <p className="text-lg font-bold text-[#FBBF24]">{veredicto.kpis.alertas_medio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
