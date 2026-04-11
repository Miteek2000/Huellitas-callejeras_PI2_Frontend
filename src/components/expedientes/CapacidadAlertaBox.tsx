'use client';

import React from 'react';

interface CapacidadAlertaBoxProps {
  espaciosEnUso: number;
  capacidadMax: number;
  limite_alcanzado: boolean;
}

export function CapacidadAlertaBox({
  espaciosEnUso,
  capacidadMax,
  limite_alcanzado,
}: CapacidadAlertaBoxProps) {
  if (!limite_alcanzado) {
    return null;
  }

  const porcentajeUso = Math.round((espaciosEnUso / capacidadMax) * 100);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex gap-3 items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
            <span className="text-xl font-bold text-red-600">✕</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-800 mb-1">
            Límite de Capacidad Alcanzado
          </h3>
          <p className="text-sm text-red-700 mb-2">
            Tu refugio ha alcanzado la capacidad máxima de expedientes activos. 
            Actualmente tienes <span className="font-semibold">{espaciosEnUso} de {capacidadMax}</span> espacios ocupados ({porcentajeUso}%).
          </p>
          <p className="text-sm text-red-600">
            Para crear nuevos expedientes, debes dar de baja a algunos animales activos.
          </p>
        </div>
      </div>
    </div>
  );
}
