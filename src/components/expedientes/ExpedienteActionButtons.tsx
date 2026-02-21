'use client';

import React, { useState } from 'react';
import { Button, ConfirmModal } from '@/components/ui';
import Image from 'next/image';

type RecupercacionState = 'recuperacion' | 'adopcion' | 'adoptado' | 'defuncion';

const stateLabels: Record<RecupercacionState, string> = {
  recuperacion: 'Recuperación',
  adopcion: 'En adopción',
  adoptado: 'Adoptado',
  defuncion: 'Defunción',
};

const stateOrder: RecupercacionState[] = ['recuperacion', 'adopcion', 'adoptado', 'defuncion'];

interface ExpedienteActionButtonsProps {
  onHistorialClick?: () => void;
}

export const ExpedienteActionButtons: React.FC<ExpedienteActionButtonsProps> = ({ onHistorialClick }) => {
  const [state, setState] = useState<RecupercacionState>('recuperacion');
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmChange, setShowConfirmChange] = useState(false);
  const [pendingState, setPendingState] = useState<RecupercacionState | null>(null);

  const handleStateSelect = (newState: RecupercacionState) => {
    setPendingState(newState);
    setIsOpen(false);
    setShowConfirmChange(true);
  };

  const handleConfirmStateChange = () => {
    if (pendingState) {
      setState(pendingState);
    }
    setShowConfirmChange(false);
    setPendingState(null);
  };

  const handleCancelStateChange = () => {
    setShowConfirmChange(false);
    setPendingState(null);
  };

  return (
    <div className="flex space-x-4">
      <div className="relative">
        <Button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 pl-3"
        >
          <span>
              <Image src="/imagenes/estado.svg" alt="Estado" width={30} height={30} />
          </span>
          <span>{stateLabels[state]}</span>
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {stateOrder.map((s) => (
              <button
                key={s}
                onClick={() => handleStateSelect(s)}
                className={`w-full text-left px-4 py-2 hover:bg-[#194566] hover:text-white transition-colors ${
                  state === s ? 'bg-[#194566] text-white' : 'text-gray-800'
                }`}
              >
                {stateLabels[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button type="button" onClick={onHistorialClick}>
        Historial de Movimientos
      </Button>

      <ConfirmModal
        isOpen={showConfirmChange}
        message="¿Estás seguro de cambiar este estado?"
        confirmLabel="Cambiar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmStateChange}
        onCancel={handleCancelStateChange}
      />
    </div>
  );
};
