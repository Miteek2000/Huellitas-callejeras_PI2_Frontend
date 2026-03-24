'use client';

import React, { useState, useEffect } from 'react';
import { EtiquetasService } from '@/services/etiquetas.service';
import { getRefugioId } from '@/app/lib/auth';
import type { Etiqueta, EtiquetaAnimal } from '@/schemas/animal.schema';

interface EtiquetasAsignadasProps {
  animalId: string;
  etiquetasActuales?: EtiquetaAnimal[];
  onEtiquetasChange?: (etiquetas: EtiquetaAnimal[]) => void;
  readOnly?: boolean;
}

export const EtiquetasAsignadas: React.FC<EtiquetasAsignadasProps> = ({
  animalId,
  etiquetasActuales = [],
  onEtiquetasChange,
  readOnly = false,
}) => {
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<Etiqueta[]>([]);
  const [etiquetasAssignadas, setEtiquetasAssignadas] = useState<EtiquetaAnimal[]>(etiquetasActuales);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDisponibles, setIsLoadingDisponibles] = useState(true);

  useEffect(() => {
    setEtiquetasAssignadas(etiquetasActuales);
  }, [etiquetasActuales]);

  useEffect(() => {
    cargarEtiquetasDisponibles();
  }, []);

  const cargarEtiquetasDisponibles = async () => {
    try {
      setIsLoadingDisponibles(true);
      const refugioId = getRefugioId();
      const etiquetas = await EtiquetasService.findByRefugio(refugioId);
      setEtiquetasDisponibles(etiquetas);
    } catch (error) {
      console.error('Error cargando etiquetas disponibles:', error);
    } finally {
      setIsLoadingDisponibles(false);
    }
  };

  const handleAsignarEtiqueta = async (etiquetaId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await EtiquetasService.asignarAAnimal(animalId, etiquetaId);
      const etiqueta = etiquetasDisponibles.find(e => e.id_etiqueta === etiquetaId);
      if (etiqueta) {
        const nuevaEtiquetaAsignada: EtiquetaAnimal = {
          animal_id: animalId,
          etiqueta_id: etiquetaId,
          etiqueta,
        };
        setEtiquetasAssignadas(prev => [...prev, nuevaEtiquetaAsignada]);
        onEtiquetasChange?.([...etiquetasAssignadas, nuevaEtiquetaAsignada]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error asignando etiqueta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuitarEtiqueta = async (etiquetaId: string) => {
    if (isLoading || readOnly) return;
    
    setIsLoading(true);
    try {
      await EtiquetasService.quitarDeAnimal(animalId, etiquetaId);
      const nuevasEtiquetas = etiquetasAssignadas.filter(e => e.etiqueta_id !== etiquetaId);
      setEtiquetasAssignadas(nuevasEtiquetas);
      onEtiquetasChange?.(nuevasEtiquetas);
    } catch (error) {
      console.error('Error quitando etiqueta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const etiquetasNoAsignadas = etiquetasDisponibles.filter(
    e => !etiquetasAssignadas.some(ea => ea.etiqueta_id === e.id_etiqueta)
  );

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
          <h3 className="text-sm font-medium">Etiquetas</h3>
        </div>
        <div className="flex-1 h-1 bg-[#5A7A8F]" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-2 font-semibold">Etiquetas asignadas:</p>
          {etiquetasAssignadas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {etiquetasAssignadas.map(ea => (
                <div
                  key={ea.etiqueta_id}
                  className="flex items-center gap-2 bg-[#194566] text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  <span>{ea.etiqueta.nombre}</span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleQuitarEtiqueta(ea.etiqueta_id)}
                      disabled={isLoading}
                      className="ml-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors disabled:opacity-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">Sin etiquetas asignadas</p>
          )}
        </div>

        {!readOnly && etiquetasNoAsignadas.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
              className="bg-[#194566] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#153a52] transition-colors flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>Agregar Etiqueta</span>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div
            className="bg-[#C8D1D7] rounded-lg shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#194566] text-white px-6 py-4 relative">
              <h2 className="text-lg font-semibold text-center">Agregar Etiqueta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {isLoadingDisponibles ? (
                <p className="text-center text-gray-500">Cargando etiquetas...</p>
              ) : etiquetasNoAsignadas.length > 0 ? (
                etiquetasNoAsignadas.map(etiqueta => (
                  <button
                    key={etiqueta.id_etiqueta}
                    type="button"
                    onClick={() => handleAsignarEtiqueta(etiqueta.id_etiqueta)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 rounded-lg border border-[#194566] text-[#194566] hover:bg-[#194566] hover:text-white transition-colors disabled:opacity-50 font-medium"
                  >
                    {etiqueta.nombre}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay etiquetas disponibles</p>
              )}
            </div>

            <div className="flex gap-6 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="flex-1 py-2 rounded-full bg-[#9F9F9F] text-white text-sm hover:bg-[#888888] transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
