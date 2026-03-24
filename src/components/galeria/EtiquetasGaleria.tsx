'use client';

import React, { useState } from 'react';
import { EtiquetaModal } from './EtiquetaModal';
import { EtiquetasService } from '@/services/etiquetas.service';
import { getRefugioId } from '@/app/lib/auth';

interface AgregarEtiquetaButtonProps {
  onRefresh?: () => void;
}

export const EtiquetasGaleria: React.FC<AgregarEtiquetaButtonProps> = ({ onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        className="bg-[#194566] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#153a52] transition-colors flex items-center justify-center gap-2 font-medium">
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
