'use client';

import React, { useState } from 'react';
import { Button, ConfirmModal } from '@/components/ui';
import Image from 'next/image';

type RecupercacionState = 'recuperacion' | 'adopcion' | 'adoptado' | 'defuncion' | 'extraviado';

const stateLabels: Record<RecupercacionState, string> = {
  recuperacion: 'Recuperación',
  adopcion: 'En adopción',
  adoptado: 'Adoptado',
  defuncion: 'Defunción',
  extraviado: 'Extraviado',
};

const stateTooltips: Record<RecupercacionState, string> = {
  recuperacion: 'este estado cambiará al registrar el movimiento de recuperación',
  adopcion: 'este estado cambiará al registrar el movimiento de adopción',
  adoptado: 'este estado cambiará al registrar el movimiento de adoptado',
  defuncion: 'este estado cambiará al registrar el movimiento de defunción',
  extraviado: 'este estado cambiará al registrar el movimiento de extraviado',
};

const stateApiValues: Record<RecupercacionState, string> = {
  recuperacion: 'recuperacion',
  adopcion: 'adopcion',
  adoptado: 'adoptado',
  defuncion: 'defuncion',
  extraviado: 'extraviado',
};

const apiToState: Record<string, RecupercacionState> = {
  recuperacion: 'recuperacion',
  adopcion: 'adopcion',
  adoptado: 'adoptado',
  defuncion: 'defuncion',
  extraviado: 'extraviado',
};

const stateOrder: RecupercacionState[] = ['recuperacion', 'adopcion', 'adoptado', 'defuncion', 'extraviado'];

const blockedStates: RecupercacionState[] = ['adoptado', 'defuncion', 'extraviado'];

interface ExpedienteActionButtonsProps {
  onHistorialClick?: () => void;
  onStateChange?: (apiValue: string) => void;  
  currentState?: string;                       
  disabled?: boolean;
}

export const ExpedienteActionButtons: React.FC<ExpedienteActionButtonsProps> = ({
  onHistorialClick,
  onStateChange,
  currentState,
  disabled = false,
}) => {
  const [state, setState] = useState<RecupercacionState>(
    apiToState[currentState ?? ''] ?? 'recuperacion'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmChange, setShowConfirmChange] = useState(false);
  const [pendingState, setPendingState] = useState<RecupercacionState | null>(null);
  const [hoveredState, setHoveredState] = useState<RecupercacionState | null>(null);

  const handleStateSelect = (newState: RecupercacionState) => {
    if (blockedStates.includes(newState)) {
      return;
    }
    setPendingState(newState);
    setIsOpen(false);
    setShowConfirmChange(true);
  };

  const handleConfirmStateChange = () => {
    if (pendingState) {
      setState(pendingState);
      onStateChange?.(stateApiValues[pendingState]); 
    }
    setShowConfirmChange(false);
    setPendingState(null);
  };

  const handleCancelStateChange = () => {
    setShowConfirmChange(false);
    setPendingState(null);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <Button
          type="button"
          onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 pl-3${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}>
          <span>
            <Image src="/imagenes/estado.svg" alt="Estado" width={30} height={30} />
          </span>
          <span>{stateLabels[state]}</span>
        </Button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {stateOrder.map((s) => {
              const isBlocked = blockedStates.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => handleStateSelect(s)}
                  disabled={isBlocked}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    isBlocked
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : `hover:bg-[#194566] hover:text-white ${
                          state === s ? 'bg-[#194566] text-white' : 'text-gray-800'
                        }`
                  }`}
                >
                  {stateLabels[s]}
                </button>
              );
            })}
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