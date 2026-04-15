import React from 'react';
import { Input, Select } from '@/components/ui';
import { MovimientoValidationError } from './MovimientoValidationError';
import type { Movimiento } from '@/schemas/movimiento.schema';

interface MovimientoSectionProps {
  isCreacion: boolean;
  readOnly: boolean;
  movimientoData: Omit<Movimiento, 'id_movimiento' | 'animal_id'>;
  errors: Record<string, boolean>;
  tipoMovimientoOptions: Array<{ value: string; label: string }>;
  motivoOptions: Array<{ value: string; label: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  backendError?: string;
  setBackendError?: (error: string) => void;
}

export const MovimientoSection: React.FC<MovimientoSectionProps> = ({
  isCreacion,
  readOnly,
  movimientoData,
  errors,
  tipoMovimientoOptions,
  motivoOptions,
  handleInputChange,
  backendError = '',
  setBackendError,
}) => {
  const hasError = (field: string) => Boolean(errors[field]);

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
          <h3 className="text-sm font-medium">{isCreacion ? 'Entrada' : 'Registro de movimientos'}</h3>
        </div>
        <div className="flex-1 h-1 bg-[#5A7A8F]" />
      </div>

      {isCreacion ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de movimiento</label>
            <div className="px-4 py-2 rounded-lg bg-[#D9D9D9] border border-gray-300 text-black">Entrada</div>
          </div>
          <Input
            label="Fecha de entrada"
            name="fecha_movimiento"
            type="date"
            value={movimientoData.fecha_movimiento}
            onChange={handleInputChange}
            placeholder=""
            disabled={readOnly}
            className={hasError('fecha_movimiento') ? 'border-red-500' : ''}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de rescate</label>
            <div className="px-4 py-2 rounded-lg bg-[#D9D9D9] border border-gray-300 text-black">Rescate</div>
          </div>
          {hasError('primer_movimiento') && (
            <p className="text-red-600 text-sm mt-1">Completa la fecha y motivo de la entrada al refugio</p>
          )}
        </>
      ) : (
        <>
          <Select
            label="Tipo de movimiento"
            name="tipo_movimiento"
            value={movimientoData.tipo_movimiento}
            onChange={handleInputChange}
            options={tipoMovimientoOptions}
            disabled={readOnly}
            className={hasError('tipo_movimiento') ? 'border-red-500' : ''}
          />
          <Input
            label="Fecha"
            name="fecha_movimiento"
            type="date"
            value={movimientoData.fecha_movimiento}
            onChange={handleInputChange}
            placeholder=""
            disabled={readOnly}
            className={hasError('fecha_movimiento') ? 'border-red-500' : ''}
          />
          <Select
            label="Motivo"
            name="motivo_movimiento"
            value={movimientoData.motivo}
            onChange={handleInputChange}
            options={motivoOptions}
            disabled={readOnly}
            className={hasError('motivo') ? 'border-red-500' : ''}
          />
          <MovimientoValidationError tipo_movimiento={movimientoData.tipo_movimiento} motivo={movimientoData.motivo} />
          {backendError && (
            <p className="text-red-600 text-sm mt-1">{backendError}</p>
          )}
        </>
      )}
    </div>
  );
};
