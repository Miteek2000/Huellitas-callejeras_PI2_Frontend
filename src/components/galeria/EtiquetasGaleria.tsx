'use client';

import React, { useState } from 'react';
import { EtiquetaModal } from './EtiquetaModal';
import { EtiquetasService } from '@/services/etiquetas.service';
import { getRefugioId } from '@/app/lib/auth';

interface AgregarEtiquetaButtonProps {
  onRefresh?: () => void;
  readOnly?: boolean;
}

export const EtiquetasGaleria: React.FC<AgregarEtiquetaButtonProps> = ({ onRefresh, readOnly = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (readOnly) {
    return null;
  }

  const handleAddEtiqueta = async (nombre: string) => {
    setIsLoading(true);
    try {
      const refugioId = getRefugioId();
      await EtiquetasService.create({ 
        nombre,
        refugio_id: refugioId,
      });
      onRefresh?.();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear la etiqueta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-[#194566] text-white px-5 sm:px-8 py-2 rounded-full hover:bg-[#153a52] transition-colors flex items-center justify-center gap-2 font-medium">
        <span>Agregar Etiqueta</span>
      </button>

      <EtiquetaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddEtiqueta}
        isLoading={isLoading}
      />
    </>
  );
};
