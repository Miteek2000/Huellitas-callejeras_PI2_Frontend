'use client';

import React, { useState } from 'react';
import type { Movimiento } from '@/schemas/movimiento.schema';
import { MovementsService } from '@/app/services/movements.service';

interface HistorialMovimientosModalProps {
  isOpen: boolean;
  onClose: () => void;
  movimientos: Movimiento[];
  onMovimientosChange: (movimientos: Movimiento[]) => void;
}

export const HistorialMovimientosModal: React.FC<HistorialMovimientosModalProps> = ({
  isOpen,
  onClose,
  movimientos,
  onMovimientosChange,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleEliminar = async () => {
    if (!selectedId) return;
    await MovementsService.delete(selectedId);
    onMovimientosChange(movimientos.filter((m) => m.id_movimiento !== selectedId));
    setConfirmDelete(false);
    setSelectedId(null);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div
        className="bg-[#C8D1D7] rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#194566] text-white px-6 py-4 rounded-t-lg relative">
          <h2 className="text-lg font-semibold text-center">Entradas/salidas</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-end gap-2 mb-3">
            <button
              disabled={!selectedId}
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-1 rounded-full bg-gray-500 text-white text-sm font-semibold disabled:opacity-40">
              Eliminar
            </button>
          </div>

          {movimientos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay movimientos registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#194566] text-white">
                    <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Entrada/Salida</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov) => (
                    <tr
                      key={mov.id_movimiento}
                      onClick={() => setSelectedId(selectedId === mov.id_movimiento ? null : (mov.id_movimiento ?? null))}
                      className={`cursor-pointer transition-colors ${
                        selectedId === mov.id_movimiento ? 'bg-indigo-200' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">{mov.fecha_movimiento}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 capitalize">{mov.tipo_movimiento}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 capitalize">{mov.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-60" onClick={() => setConfirmDelete(false)} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#194566] mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">¿Seguro que deseas eliminar este movimiento?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(false)} className="px-6 py-2 rounded-full bg-gray-400 text-white font-semibold">Cancelar</button>
              <button onClick={handleEliminar} className="px-6 py-2 rounded-full bg-[#194566] text-white font-semibold">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};