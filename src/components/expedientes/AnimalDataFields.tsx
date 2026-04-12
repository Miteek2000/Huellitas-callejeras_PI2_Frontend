import React from 'react';
import { Input, Select } from '@/components/ui';
import { EXPEDIENTE_AGE_LIMITS, EXPEDIENTE_FIELD_ERROR_MESSAGES, type ExpedienteFieldErrorKey } from './expedienteValidation';
import type { Animal } from '@/schemas/animal.schema';

interface AnimalDataFieldsProps {
  formData: Animal;
  readOnly: boolean;
  errors: Record<string, boolean>;
  especiesOptions: Array<{ value: string; label: string }>;
  sexoOptions: Array<{ value: string; label: string }>;
  tamanoOptions: Array<{ value: string; label: string }>;
  unidadEdadOptions: Array<{ value: string; label: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const AnimalDataFields: React.FC<AnimalDataFieldsProps> = ({
  formData,
  readOnly,
  errors,
  especiesOptions,
  sexoOptions,
  tamanoOptions,
  unidadEdadOptions,
  handleInputChange,
}) => {
  const hasError = (field: string) => Boolean(errors[field]);
  const getFieldError = (field: ExpedienteFieldErrorKey) =>
    hasError(field) ? EXPEDIENTE_FIELD_ERROR_MESSAGES[field] : undefined;

  const handleEdadKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };
  const handlePesoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };
  const handleNumberWheel = (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

  const maxEdad = formData.unidad_edad === 'años'
    ? EXPEDIENTE_AGE_LIMITS.MAX_AÑOS
    : EXPEDIENTE_AGE_LIMITS.MAX_MESES;

  return (
    <div className="space-y-4">
      <Input
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        placeholder=""
        disabled={readOnly}
        className={hasError('nombre') ? 'border-red-500' : ''}
        error={getFieldError('nombre')}
      />
      <Select
        label="Especie"
        name="especie"
        value={formData.especie}
        onChange={handleInputChange}
        options={especiesOptions}
        disabled={readOnly}
        className={hasError('especie') ? 'border-red-500' : ''}
        error={getFieldError('especie')}
      />
      <Input
        label="Raza"
        name="raza"
        value={formData.raza}
        onChange={handleInputChange}
        placeholder=""
        disabled={readOnly}
        className={hasError('raza') ? 'border-red-500' : ''}
        error={getFieldError('raza')}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
        <div className="flex gap-2">
          <input
            name="edad"
            type="number"
            min={1}
            max={maxEdad}
            step={1}
            inputMode="numeric"
            value={formData.edad}
            onChange={handleInputChange}
            onKeyDown={handleEdadKeyDown}
            onWheel={handleNumberWheel}
            disabled={readOnly}
            className={`w-full px-4 py-2 rounded-lg bg-[#D9D9D9] border-none text-black focus:outline-none focus:border-[#194566] focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${hasError('edad') ? 'border-red-500 !border !border-solid' : ''}`}
          />
          <select
            name="unidad_edad"
            value={formData.unidad_edad ?? 'meses'}
            onChange={handleInputChange}
            disabled={readOnly}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#194566] focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {unidadEdadOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {hasError('edad') && <p className="mt-1 text-sm text-red-600">{getFieldError('edad')}</p>}
      </div>

      <Select
        label="Sexo"
        name="sexo"
        value={formData.sexo}
        onChange={handleInputChange}
        options={sexoOptions}
        disabled={readOnly}
        className={hasError('sexo') ? 'border-red-500' : ''}
        error={getFieldError('sexo')}
      />
      <Input
        label="Peso"
        name="peso"
        type="number"
        min={0}
        value={formData.peso}
        onChange={handleInputChange}
        onKeyDown={handlePesoKeyDown}
        onWheel={handleNumberWheel}
        placeholder=""
        disabled={readOnly}
        className={hasError('peso') ? 'border-red-500' : ''}
        error={getFieldError('peso')}
      />
      <Select
        label="Tamaño"
        name="tamano"
        value={formData.tamano}
        onChange={handleInputChange}
        options={tamanoOptions}
        disabled={readOnly}
        className={hasError('tamano') ? 'border-red-500' : ''}
        error={getFieldError('tamano')}
      />
    </div>
  );
};
