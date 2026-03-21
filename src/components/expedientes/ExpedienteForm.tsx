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
import { getImageUrl } from '@/app/lib/endpoints';
import type { Animal, AnimalImagen } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';

const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

interface ExpedienteFormProps {
  onOpenHistorial?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (animal: Animal, fotoFile?: File | null, movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => Promise<void>;
  onSaveSuccess?: () => void;
  onDeleteImagen?: (imagenId: string) => Promise<void>;
  initialData?: Partial<Animal>;
  readOnly?: boolean;
  cancelMessage?: string;
  onCancelConfirmed?: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  onOpenHistorial,
  onSaveMovimiento,
  onSaveAnimal,
  onSaveSuccess,
  onDeleteImagen,
  initialData,
  readOnly = false,
  cancelMessage = '¿Deseas cancelar este expediente?',
  onCancelConfirmed,
}) => {
  const {
    formData,
    setFormData,
    movimientoData,
    errors,
    isSaving,
    especiesOptions,
    sexoOptions,
    tamanoOptions,
    tipoMovimientoOptions,
    motivoOptions,
    fileInputRef,
    fotoFile,
    fotoPreviewUrl,
    imagenesExistentes,
    imagenActiva,
    setImagenActiva,
    totalImagenes,
    showCancelConfirm,
    handleInputChange,
    handleEstadoChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleFotoClick,
    handleFotoChange,
    handleDeleteImagen,
    handleCancelPreview,
    setShowCancelConfirm,
  } = useExpedienteForm({
    initialData,
    onCancelConfirmed,
    onSaveMovimiento,
    onSaveAnimal,
    onSaveSuccess,
    onDeleteImagen,
  });

  const handleToggle = (field: 'es_agresivo' | 'enfermedad_no_tratable' | 'discapacidad') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      setFormData(prev => ({ ...prev, [field]: !e.target.checked }));
    };

  const handleEdadKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };
  const handlePesoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };
  const handleNumberWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const hasError = (field: string) => Boolean(errors[field]);
  const getFieldError = (field: ExpedienteFieldErrorKey) =>
    hasError(field) ? EXPEDIENTE_FIELD_ERROR_MESSAGES[field] : undefined;

  const todasLasImagenes: Array<{ id: string; src: string; esPendiente?: boolean }> = [
    ...imagenesExistentes.map(img => ({
      id: img.id_animal_imagen,
      src: getImageUrl(img.imagen) ?? DEFAULT_IMAGE,
    })),
    ...(fotoPreviewUrl
      ? [{ id: '__preview__', src: fotoPreviewUrl, esPendiente: true }]
      : []),
  ];

  const imagenActivaSrc = todasLasImagenes[imagenActiva]?.src ?? DEFAULT_IMAGE;
  const imagenActivaId = todasLasImagenes[imagenActiva]?.id;
  const imagenActivaEsPendiente = todasLasImagenes[imagenActiva]?.esPendiente ?? false;

  const irAnterior = () =>
    setImagenActiva(i => (i - 1 + todasLasImagenes.length) % todasLasImagenes.length);
  const irSiguiente = () =>
    setImagenActiva(i => (i + 1) % todasLasImagenes.length);

  return (
    <div className={`max-w-7xl mx-auto rounded-lg shadow-lg p-4 sm:p-8 transition-all ${readOnly ? 'bg-[#DCDCDC] opacity-85 saturate-50' : 'bg-[#E8E8E8]'}`}>
      <form onSubmit={handleSubmit} noValidate>

        <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-8">

          <div className={`flex-shrink-0 bg-white border rounded-xl overflow-hidden w-full sm:w-72 ${hasError('foto') ? 'border-red-500' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500">Fotos del animal</span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={handleFotoClick}
                  className="flex items-center gap-1 text-xs text-[#194566] border border-[#194566] rounded-md px-2 py-1 hover:bg-[#194566] hover:text-white transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Agregar foto
                </button>
              )}
            </div>

            <div className="relative bg-gray-100" style={{ aspectRatio: '4/3' }}>
              {todasLasImagenes.length > 0 ? (
                <img
                  src={imagenActivaSrc}
                  alt="Foto del animal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center gap-2 ${!readOnly ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''}`}
                  onClick={!readOnly ? handleFotoClick : undefined}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs text-gray-400">{readOnly ? 'Sin fotos' : 'Subir foto'}</span>
                </div>
              )}

              {todasLasImagenes.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={irAnterior}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors text-base"
                  >‹</button>
                  <button
                    type="button"
                    onClick={irSiguiente}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors text-base"
                  >›</button>
                </>
              )}

              {imagenActivaEsPendiente && (
                <span className="absolute top-2 left-2 text-xs bg-[#194566] text-white px-2 py-0.5 rounded">
                  pendiente
                </span>
              )}
            </div>

            {todasLasImagenes.length > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-400">{imagenActiva + 1} / {todasLasImagenes.length}</span>
                {!readOnly && imagenActivaId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (imagenActivaEsPendiente) {
                        handleCancelPreview();
                      } else {
                        handleDeleteImagen(imagenActivaId);
                      }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    {imagenActivaEsPendiente ? 'Cancelar' : 'Eliminar foto'}
                  </button>
                )}
              </div>
            )}

            {todasLasImagenes.length > 0 && (
              <div className="grid grid-cols-4 gap-1 p-2 border-t border-gray-100">
                {todasLasImagenes.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setImagenActiva(i)}
                    className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                      i === imagenActiva ? 'border-[#194566]' : 'border-transparent'
                    } ${img.esPendiente ? 'opacity-70' : ''}`}
                  >
                    <img src={img.src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}

                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleFotoClick}
                    className="aspect-square rounded border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {hasError('foto') && (
              <p className="text-xs text-red-600 px-3 pb-2">Agrega al menos una foto</p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={readOnly}
            onChange={handleFotoChange}
          />

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#194566] mb-4">
              Expediente de paciente
            </h1>
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
            <Input label="Edad" name="edad" type="number" min={EXPEDIENTE_AGE_LIMITS.MIN} max={EXPEDIENTE_AGE_LIMITS.MAX} step={1} inputMode="numeric" value={formData.edad} onChange={handleInputChange} onKeyDown={handleEdadKeyDown} onWheel={handleNumberWheel} placeholder="" disabled={readOnly} className={hasError('edad') ? 'border-red-500' : ''} error={getFieldError('edad')} />
            <Select label="Sexo" name="sexo" value={formData.sexo} onChange={handleInputChange} options={sexoOptions} disabled={readOnly} className={hasError('sexo') ? 'border-red-500' : ''} error={getFieldError('sexo')} />
            <Input label="Peso" name="peso" type="number" min={0} value={formData.peso} onChange={handleInputChange} onKeyDown={handlePesoKeyDown} onWheel={handleNumberWheel} placeholder="" disabled={readOnly} className={hasError('peso') ? 'border-red-500' : ''} error={getFieldError('peso')} />
            <Select label="Tamaño" name="tamano" value={formData.tamano} onChange={handleInputChange} options={tamanoOptions} disabled={readOnly} className={hasError('tamano') ? 'border-red-500' : ''} error={getFieldError('tamano')} />

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
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Registro de movimientos</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]" />
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
                <div className="flex-1 h-1 bg-[#5A7A8F]" />
              </div>
              <Input label="Lugar" name="lugar" value={formData.lugar} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('lugar') ? 'border-red-500' : ''} error={getFieldError('lugar')} />
              <Textarea label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={4} placeholder="" disabled={readOnly} className={hasError('descripcion') ? 'border-red-500' : ''} error={getFieldError('descripcion')} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-16">
          <Button type="submit" variant="primary" disabled={readOnly || isSaving} className="!bg-[#2B264F] !text-white w-full sm:w-auto sm:px-16 md:px-24 h-10 flex items-center justify-center font-semibold">
            {isSaving ? 'Guardando...' : 'Guardar'}
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