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
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.bg} flex items-center justify-center`}>
          <span className={`text-2xl font-bold ${config.iconColor}`}>{config.icon}</span>
        </div>

        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.titleColor} mb-2`}>
            {veredicto.puede_recibir ? 'El refugio puede recibir animales' : 'El refugio NO puede recibir animales'}
          </h3>
          <p className="text-[#2B264F] text-sm leading-relaxed">{veredicto.mensaje}</p>
        </div>
      </div>
    </div>
  );
}
