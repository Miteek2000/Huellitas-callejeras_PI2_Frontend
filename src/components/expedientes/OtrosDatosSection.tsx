import React from 'react';
import { Checkbox } from '@/components/ui';
import type { Animal } from '@/schemas/animal.schema';

interface OtrosDatosSectionProps {
  formData: Animal;
  readOnly: boolean;
  setFormData: React.Dispatch<React.SetStateAction<Animal>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const OtrosDatosSection: React.FC<OtrosDatosSectionProps> = ({
  formData,
  readOnly,
  setFormData,
  handleInputChange,
}) => {
  const handleToggle = (field: 'es_agresivo' | 'enfermedad_no_tratable' | 'discapacidad') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      setFormData(prev => ({ ...prev, [field]: !e.target.checked }));
    };

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
          <h3 className="text-sm font-medium">Otros datos</h3>
        </div>
        <div className="flex-1 h-1 bg-[#5A7A8F]" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-700 mb-2">¿Presenta comportamientos agresivos?</p>
          <div className="flex space-x-4">
            <Checkbox label="Si" name="es_agresivo" checked={formData.es_agresivo} disabled={readOnly} onChange={handleInputChange} />
            <Checkbox label="No" name="es_agresivo" checked={!formData.es_agresivo} disabled={readOnly} onChange={handleToggle('es_agresivo')} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-700 mb-2">¿Presenta alguna enfermedad degenerativa o sin cura?</p>
          <div className="flex space-x-4">
            <Checkbox label="Si" name="enfermedad_no_tratable" checked={formData.enfermedad_no_tratable} disabled={readOnly} onChange={handleInputChange} />
            <Checkbox label="No" name="enfermedad_no_tratable" checked={!formData.enfermedad_no_tratable} disabled={readOnly} onChange={handleToggle('enfermedad_no_tratable')} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-700 mb-2">¿Presenta discapacidades?</p>
          <div className="flex space-x-4">
            <Checkbox label="Si" name="discapacidad" checked={formData.discapacidad} disabled={readOnly} onChange={handleInputChange} />
            <Checkbox label="No" name="discapacidad" checked={!formData.discapacidad} disabled={readOnly} onChange={handleToggle('discapacidad')} />
          </div>
        </div>
      </div>
    </div>
  );
};
