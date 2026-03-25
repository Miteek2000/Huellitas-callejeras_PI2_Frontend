'use client';

import React, { useState, useEffect } from 'react';
import { EtiquetasService } from '@/services/etiquetas.service';
import { getRefugioId } from '@/app/lib/auth';
import { EditarEtiquetaModal } from './EditarEtiquetaModal';
import type { Etiqueta } from '@/schemas/animal.schema';

export const HistorialEtiquetas: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [etiquetaEditando, setEtiquetaEditando] = useState<Etiqueta | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    cargarEtiquetas();
  }, []);

  const cargarEtiquetas = async () => {
    try {
      setIsLoading(true);
      const refugioId = getRefugioId();
      const data = await EtiquetasService.findByRefugio(refugioId);
      setEtiquetas(data);
    } catch (error) {
      console.error('Error cargando etiquetas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarClick = (etiqueta: Etiqueta) => {
    setEtiquetaEditando(etiqueta);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async (nuevoNombre: string) => {
    if (!etiquetaEditando) return;

    try {
      setIsProcessing(true);
      await EtiquetasService.update(etiquetaEditando.id_etiqueta, {
        nombre: nuevoNombre,
      });
      await cargarEtiquetas();
      setEtiquetaEditando(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error editando etiqueta:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBorrar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas borrar esta etiqueta?')) {
      return;
    }

    try {
      setIsProcessing(true);
      await EtiquetasService.delete(id);
      await cargarEtiquetas();
    } catch (error) {
      console.error('Error borrando etiqueta:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-[#194566] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#153a52] transition-colors flex items-center justify-center gap-2 font-medium">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Historial</span>
      </button>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div
            className="bg-[#C8D1D7] rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#194566] text-white px-6 py-4 sticky top-0 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Historial de Etiquetas</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-[#194566] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : etiquetas.length > 0 ? (
                <div className="space-y-2">
                  {etiquetas.map((etiqueta) => (
                    <div
                      key={etiqueta.id_etiqueta}
                      className="flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-white hover:bg-[#f3f6f8] transition-all">
                      <div className="flex-1">
                        <span className="text-[#194566] text-base">{etiqueta.nombre}</span>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          type="button"
                          onClick={() => handleEditarClick(etiqueta)}
                          disabled={isProcessing}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#194566] text-white text-sm hover:bg-[#153a52] transition-colors disabled:opacity-50 font-medium">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBorrar(etiqueta.id_etiqueta)}
                          disabled={isProcessing}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-50 font-medium">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No hay etiquetas creadas aún</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {etiquetaEditando && (
        <EditarEtiquetaModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEtiquetaEditando(null);
          }}
          onSave={handleGuardarEdicion}
          nombreInicial={etiquetaEditando.nombre}
          isLoading={isProcessing}
        />
      )}
    </>
  );
};
