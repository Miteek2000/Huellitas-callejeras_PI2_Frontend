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
  recuperacion: '',
  adopcion: '',
  adoptado: 'Este estado cambiará al registrar el movimiento',
  defuncion: 'Este estado cambiará al registrar el movimiento',
  extraviado: 'Este estado cambiará al registrar el movimiento',
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
                <div
                  key={s}
                  className="relative"
                  onMouseEnter={() => setHoveredState(s)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <button
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
                  
                  {hoveredState === s && isBlocked && (
                    <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 px-3 py-2 bg-[#2B264F] text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                      {stateTooltips[s]}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-[#2B264F]"></div>
                    </div>
                  )}
                </div>
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