'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { generalTextSchema } from '@/schemas/inputSchema';

interface EditarEtiquetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nombre: string) => Promise<void>;
  nombreInicial?: string;
  isLoading?: boolean;
}

export const EditarEtiquetaModal: React.FC<EditarEtiquetaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nombreInicial = '',
  isLoading = false,
}) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNombre(nombreInicial);
      setError('');
    }
  }, [isOpen, nombreInicial]);

  const handleClose = () => {
    setNombre('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = generalTextSchema
      .min(1, 'El nombre de la etiqueta no puede estar vacio')
      .safeParse(nombre);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Entrada invalida');
      return;
    }

    if (result.data === nombreInicial) {
      handleClose();
      return;
    }

    try {
      await onSave(result.data);
      setNombre('');
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la etiqueta');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div
        className="bg-[#C8D1D7] rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#194566] text-white px-6 py-4 relative">
          <h2 className="text-lg font-semibold text-center">Editar Etiqueta</h2>
          <button
            onClick={handleClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nombre de la etiqueta"
            placeholder="Ej: Vacunado, Cita médica, etc."
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError('');
            }}
            error={error}
            disabled={isLoading}
            autoFocus
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-2 rounded-full bg-[#9F9F9F] text-white text-sm hover:bg-[#888888] transition-colors disabled:opacity-50 font-medium">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-full bg-[#194566] text-white text-sm hover:bg-[#153a52] transition-colors disabled:opacity-50 font-medium">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
