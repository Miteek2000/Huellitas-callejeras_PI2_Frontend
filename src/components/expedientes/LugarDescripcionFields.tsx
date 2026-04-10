import React from 'react';
import { Input, Textarea } from '@/components/ui';
import { EXPEDIENTE_FIELD_ERROR_MESSAGES, type ExpedienteFieldErrorKey } from './expedienteValidation';
import type { Animal } from '@/schemas/animal.schema';

interface LugarDescripcionFieldsProps {
  isCreacion: boolean;
  formData: Animal;
  readOnly: boolean;
  errors: Record<string, boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const LugarDescripcionFields: React.FC<LugarDescripcionFieldsProps> = ({
  isCreacion,
  formData,
  readOnly,
  errors,
  handleInputChange,
}) => {
  const hasError = (field: string) => Boolean(errors[field]);
  const getFieldError = (field: ExpedienteFieldErrorKey) =>
    hasError(field) ? EXPEDIENTE_FIELD_ERROR_MESSAGES[field] : undefined;

  return (
    <div className="mt-4">
      <div className="flex items-center mb-4">
        <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
          <h3 className="text-sm font-medium">{isCreacion ? 'Información de la entrada' : 'Información del paciente'}</h3>
        </div>
        <div className="flex-1 h-1 bg-[#5A7A8F]" />
      </div>
      <Input
        label={isCreacion ? 'Lugar de entrada' : 'Lugar'}
        name="lugar"
        value={formData.lugar}
        onChange={handleInputChange}
        placeholder=""
        disabled={readOnly}
        className={hasError('lugar') ? 'border-red-500' : ''}
        error={getFieldError('lugar')}
      />
      <Textarea
        label={isCreacion ? 'Detalles de la entrada' : 'Descripción'}
        name="descripcion"
        value={formData.descripcion}
        onChange={handleInputChange}
        rows={4}
        placeholder=""
        disabled={readOnly}
        className={hasError('descripcion') ? 'border-red-500' : ''}
        error={getFieldError('descripcion')}
      />
    </div>
  );
};
