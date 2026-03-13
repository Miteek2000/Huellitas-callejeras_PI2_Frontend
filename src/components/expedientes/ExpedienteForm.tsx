'use client';

import React from 'react';
import { Button, ConfirmModal, Input, Select, Checkbox, Textarea } from '@/components/ui';
import { ExpedienteActionButtons } from './ExpedienteActionButtons';
import { useExpedienteForm } from './useExpedienteForm';
import { MovimientoValidationError } from './MovimientoValidationError';
import {
  EXPEDIENTE_AGE_LIMITS,
  EXPEDIENTE_FIELD_ERROR_MESSAGES,
  type ExpedienteFieldErrorKey,
} from './expedienteValidation';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';
import Image from 'next/image';

interface ExpedienteFormProps {
  onOpenHistorial?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (animal: Animal, fotoFile?: File | null, movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => Promise<void>;
  onSaveSuccess?: () => void;
  initialData?: Partial<Animal>;
  initialPhotoUrl?: string;
  readOnly?: boolean;
  cancelMessage?: string;
  onCancelConfirmed?: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  onOpenHistorial,
  onSaveMovimiento,
  onSaveAnimal,
  onSaveSuccess,
  initialData,
  initialPhotoUrl,
  readOnly = false,
  cancelMessage = '¿Deseas cancelar este expediente?',
  onCancelConfirmed,
}) => {
  const {
    formData,
    setFormData,
    movimientoData,
    errors,
    especiesOptions,
    sexoOptions,
    tamanoOptions,
    tipoMovimientoOptions,
    motivoOptions,
    fileInputRef,
    fotoFile,
    fotoPreviewUrl,
    showCancelConfirm,
    handleInputChange,
    handleEstadoChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleFotoClick,
    handleFotoChange,
    setShowCancelConfirm,
  } = useExpedienteForm({
    initialData,
    initialPhotoUrl,
    onCancelConfirmed,
    onSaveMovimiento,
    onSaveAnimal,
    onSaveSuccess,
  });

  const handleToggle = (field: 'es_agresivo' | 'enfermedad_no_tratable' | 'discapacidad') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      setFormData(prev => ({ ...prev, [field]: !e.target.checked }));
    };

  const handleEdadKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePesoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const hasError = (field: string) => Boolean(errors[field]);

  const getFieldError = (field: ExpedienteFieldErrorKey) =>
    hasError(field) ? EXPEDIENTE_FIELD_ERROR_MESSAGES[field] : undefined;

  return (
    <div className="max-w-7xl mx-auto bg-[#E8E8E8] rounded-lg shadow-lg p-4 sm:p-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
          <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex-shrink-0">
            <div className="absolute inset-0 bg-[#5F7A91] rounded-full"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div
              className={`absolute inset-4 bg-[#2B5278] rounded-full overflow-hidden flex items-center justify-center ${
                hasError('foto') ? 'ring-2 ring-red-500' : ''
              } ${!readOnly ? 'cursor-pointer group' : ''}`}
              onClick={readOnly ? undefined : handleFotoClick}
            >
              {fotoPreviewUrl ? (
                <>
                  <img src={fotoPreviewUrl} alt="Foto del paciente" className="w-full h-full object-cover" />
                  {!readOnly && (
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <Image
                        src="/imagenes/agregarImagen.svg"
                        alt="Cambiar foto"
                        width={40}
                        height={40}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} />
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" disabled={readOnly} onChange={handleFotoChange} />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#194566] mb-4 text-center sm:text-left">Expediente de paciente</h1>
            <ExpedienteActionButtons
              onHistorialClick={onOpenHistorial}
              onStateChange={handleEstadoChange}
              currentState={initialData?.estado}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="text-[#2B264F] grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('nombre') ? 'border-red-500' : ''} error={getFieldError('nombre')} />
            <Select label="Especie" name="especie" value={formData.especie} onChange={handleInputChange} options={especiesOptions} disabled={readOnly} className={hasError('especie') ? 'border-red-500' : ''} error={getFieldError('especie')} />
            <Input label="Raza" name="raza" value={formData.raza} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('raza') ? 'border-red-500' : ''} error={getFieldError('raza')} />
            <Input
              label="Edad"
              name="edad"
              type="number"
              min={EXPEDIENTE_AGE_LIMITS.MIN}
              max={EXPEDIENTE_AGE_LIMITS.MAX}
              step={1}
              inputMode="numeric"
              value={formData.edad}
              onChange={handleInputChange}
              onKeyDown={handleEdadKeyDown}
              placeholder=""
              disabled={readOnly}
              className={hasError('edad') ? 'border-red-500' : ''}
              error={getFieldError('edad')}
            />
            <Select label="Sexo" name="sexo" value={formData.sexo} onChange={handleInputChange} options={sexoOptions} disabled={readOnly} className={hasError('sexo') ? 'border-red-500' : ''} error={getFieldError('sexo')} />
            <Input label="Peso" name="peso" type="number" min={0} value={formData.peso} onChange={handleInputChange} onKeyDown={handlePesoKeyDown} placeholder="" disabled={readOnly} className={hasError('peso') ? 'border-red-500' : ''} error={getFieldError('peso')} />
            <Select label="Tamaño" name="tamano" value={formData.tamano} onChange={handleInputChange} options={tamanoOptions} disabled={readOnly} className={hasError('tamano') ? 'border-red-500' : ''} error={getFieldError('tamano')} />

            <div className="mt-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Otros datos</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
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
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Registro de movimientos</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <Select label="Tipo de movimiento" name="tipo_movimiento" value={movimientoData.tipo_movimiento} onChange={handleInputChange} options={tipoMovimientoOptions} disabled={readOnly} className={hasError('tipo_movimiento') ? 'border-red-500' : ''} />
              <Input label="Fecha" name="fecha_movimiento" type="date" value={movimientoData.fecha_movimiento} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('fecha_movimiento') ? 'border-red-500' : ''} />
              <Select label="Motivo" name="motivo_movimiento" value={movimientoData.motivo} onChange={handleInputChange} options={motivoOptions} disabled={readOnly} className={hasError('motivo') ? 'border-red-500' : ''} />
              <MovimientoValidationError tipo_movimiento={movimientoData.tipo_movimiento} motivo={movimientoData.motivo} />
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Datos de rescate</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <Input label="Lugar" name="lugar" value={formData.lugar} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('lugar') ? 'border-red-500' : ''} error={getFieldError('lugar')} />
              <Textarea label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={4} placeholder="" disabled={readOnly} className={hasError('descripcion') ? 'border-red-500' : ''} error={getFieldError('descripcion')} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-16">
          <Button type="submit" variant="primary" disabled={readOnly} className="!bg-[#2B264F] !text-white hover:bg-[#7BB75A] w-full sm:w-auto sm:px-16 md:px-24 h-10 flex items-center justify-center font-semibold">
            Guardar
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} className="!bg-[#A7A7A7] !text-white w-full sm:w-auto sm:px-16 md:px-24 h-10 flex items-center justify-center font-semibold">
            Cancelar
          </Button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showCancelConfirm}
        message={cancelMessage}
        confirmLabel="aceptar"
        cancelLabel="cancelar"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};