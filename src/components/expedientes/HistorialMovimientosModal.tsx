'use client';

import React from 'react';
import Image from 'next/image';
import type { Movimiento } from '@/schemas/movimiento.schema';

interface HistorialMovimientosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
}

export const HistorialMovimientosModal: React.FC<HistorialMovimientosModalProps> = ({
  isOpen,
  onClose,
  movimientos,
}) => {
  if (!isOpen) return null;

  const getTipoRegistro = (tipo_movimiento: string) => {
    if (tipo_movimiento === 'rescate' || tipo_movimiento === 'retorno') {
      return 'Entrada';
    }
    if (tipo_movimiento === 'defuncion' || tipo_movimiento === 'adopcion') {
      return 'Salida';
    }
    return '—';
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#194566] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-lg font-semibold">Entradas/salidas</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {movimientos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay movimientos registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#194566] text-white">
                    <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Entrada/Salida</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tipo de movimiento</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm text-gray-800">{mov.fecha_movimiento}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{getTipoRegistro(mov.tipo_movimiento)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{mov.tipo_movimiento}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{mov.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
