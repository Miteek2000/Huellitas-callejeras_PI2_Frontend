'use client';

import React from 'react';

interface ConfirmarBorradoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje?: string;
  isLoading?: boolean;
}

export const ConfirmarBorradoModal: React.FC<ConfirmarBorradoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mensaje = '¿Estás seguro de que deseas borrar esta etiqueta?',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-gray-800 mb-6 text-sm">{mensaje}</p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-[#9F9F9F] text-white text-sm hover:bg-[#888888] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-[#2B264F] text-white text-sm hover:bg-[#1F1B3D] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};