'use client';

import React, { useState } from 'react';
import { Button, ConfirmModal, Input, Select, Checkbox, Textarea } from '@/components/ui';
import { ExpedienteActionButtons } from './ExpedienteActionButtons';
import { EtiquetasAsignadas } from './EtiquetasAsignadas';
import { useExpedienteForm } from './useExpedienteForm';
import { MovimientoValidationError } from './MovimientoValidationError';
import {
  EXPEDIENTE_AGE_LIMITS,
  EXPEDIENTE_FIELD_ERROR_MESSAGES,
  type ExpedienteFieldErrorKey,
} from './expedienteValidation';
import { getImageUrl } from '@/app/lib/endpoints';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';
import Image from 'next/image';

const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

interface ExpedienteFormProps {
  onOpenHistorial?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (
    animal: Animal,
    fotosNuevas?: File[],
    movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>
  ) => Promise<void>;
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
    unidadEdadOptions,
    motivoOptions,
    fileInputRef,
    fotosNuevas,
    fotoPreviews,
    imagenesExistentes,
    imagenActiva,
    setImagenActiva,
    todasParaCarrusel,
    showCancelConfirm,
    showFotoModal,
    setShowFotoModal,
    handleInputChange,
    handleEstadoChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleFotoClick,
    handleFotosChange,
    handleDeleteImagen,
    handleQuitarFotoNueva,
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
  const handleNumberWheel = (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

  const hasError = (field: string) => Boolean(errors[field]);
  const getFieldError = (field: ExpedienteFieldErrorKey) =>
    hasError(field) ? EXPEDIENTE_FIELD_ERROR_MESSAGES[field] : undefined;

  const imagenActivaItem = todasParaCarrusel[imagenActiva];
  const imagenActivaSrc = imagenActivaItem
    ? imagenActivaItem.esExistente
      ? (getImageUrl(imagenActivaItem.src) ?? DEFAULT_IMAGE)
      : imagenActivaItem.src
    : null;

  const irAnterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagenActiva(i => (i - 1 + todasParaCarrusel.length) % todasParaCarrusel.length);
  };
  const irSiguiente = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagenActiva(i => (i + 1) % todasParaCarrusel.length);
  };

  const maxEdad = formData.unidad_edad === 'años'
    ? EXPEDIENTE_AGE_LIMITS.MAX_AÑOS
    : EXPEDIENTE_AGE_LIMITS.MAX_MESES;

  return (
    <div className={`max-w-7xl mx-auto rounded-lg shadow-lg p-4 sm:p-8 transition-all ${readOnly ? 'bg-[#DCDCDC] opacity-85 saturate-50' : 'bg-[#E8E8E8]'}`}>
      <form onSubmit={handleSubmit} noValidate>

        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-8">

          <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex-shrink-0">
            <div className="absolute inset-0 bg-[#5F7A91] rounded-full" />
            <div className="absolute inset-2 bg-white rounded-full" />

            <div
              className={`absolute inset-4 bg-[#2B5278] rounded-full overflow-hidden flex items-center justify-center group ${
                hasError('foto') ? 'ring-2 ring-red-500' : ''
              } ${!readOnly ? 'cursor-pointer' : ''}`}
              onClick={!readOnly ? () => setShowFotoModal(true) : undefined}
            >
              {imagenActivaSrc ? (
                <>
                  <img src={imagenActivaSrc} alt="Foto del paciente" className="w-full h-full object-cover" />
                  {!readOnly && (
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center rounded-full">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                        <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} className="brightness-0"
                          style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(50%) saturate(800%) hue-rotate(185deg) brightness(90%)' }} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} />
              )}
            </div>

            {todasParaCarrusel.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={irAnterior}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow z-10 text-lg leading-none"
                >‹</button>
                <button
                  type="button"
                  onClick={irSiguiente}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow z-10 text-lg leading-none"
                >›</button>
              </>
            )}

            {todasParaCarrusel.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                {todasParaCarrusel.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setImagenActiva(i)}
                    className={`block w-2 h-2 rounded-full cursor-pointer transition-colors ${
                      i === imagenActiva ? 'bg-[#194566]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={todasParaCarrusel.length > 1 ? 'mt-6 sm:mt-0' : ''}>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#194566] mb-4 text-center sm:text-left">
              Expediente de paciente
            </h1>
            <ExpedienteActionButtons
              onHistorialClick={onOpenHistorial}
              onStateChange={handleEstadoChange}
              currentState={initialData?.estado}
              disabled={readOnly}
            />
            {hasError('foto') && (
              <p className="text-red-600 text-sm mt-2">Agrega al menos una foto</p>
            )}
          </div>
        </div>

        <div className="text-[#2B264F] grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('nombre') ? 'border-red-500' : ''} error={getFieldError('nombre')} />
            <Select label="Especie" name="especie" value={formData.especie} onChange={handleInputChange} options={especiesOptions} disabled={readOnly} className={hasError('especie') ? 'border-red-500' : ''} error={getFieldError('especie')} />
            <Input label="Raza" name="raza" value={formData.raza} onChange={handleInputChange} placeholder="" disabled={readOnly} className={hasError('raza') ? 'border-red-500' : ''} error={getFieldError('raza')} />

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
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {hasError('edad') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('edad')}</p>
              )}
            </div>

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
              {hasError('primer_movimiento') && (
                <p className="text-red-600 text-sm mt-1">
                  {EXPEDIENTE_FIELD_ERROR_MESSAGES.primer_movimiento}
                </p>
              )}
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

        {initialData?.id_animal && (
          <EtiquetasAsignadas
            animalId={initialData.id_animal}
            etiquetasActuales={initialData.etiquetas}
            readOnly={readOnly}
          />
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-16">
          <Button type="submit" variant="primary" disabled={readOnly || isSaving} className="!bg-[#2B264F] !text-white w-full sm:w-auto px-16 md:px-50     h-10 flex items-center justify-center font-semibold">
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} className="!bg-[#A7A7A7] !text-white w-full sm:w-auto px-16 md:px-50 h-10 flex items-center justify-center font-semibold">
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

      {showFotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowFotoModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#194566] text-white px-5 py-4 flex items-center justify-between">
              <span className="font-semibold">Fotos del animal</span>
              <button
                type="button"
                onClick={() => setShowFotoModal(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {todasParaCarrusel.length > 0 ? (
                <div className="relative rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={
                      imagenActivaItem?.esExistente
                        ? (getImageUrl(imagenActivaItem.src) ?? DEFAULT_IMAGE)
                        : (imagenActivaItem?.src ?? DEFAULT_IMAGE)
                    }
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {!imagenActivaItem?.esExistente && (
                    <span className="absolute top-2 left-2 text-xs bg-[#194566] text-white px-2 py-0.5 rounded">
                      pendiente
                    </span>
                  )}
                  {todasParaCarrusel.length > 1 && (
                    <>
                      <button type="button" onClick={irAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white text-lg flex items-center justify-center">‹</button>
                      <button type="button" onClick={irSiguiente} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white text-lg flex items-center justify-center">›</button>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-100 flex items-center justify-center mb-3" style={{ aspectRatio: '4/3' }}>
                  <p className="text-sm text-gray-400">Sin fotos aún</p>
                </div>
              )}

              {todasParaCarrusel.length > 0 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">{imagenActiva + 1} / {todasParaCarrusel.length}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (imagenActivaItem?.esExistente) {
                        handleDeleteImagen(imagenActivaItem.id);
                      } else {
                        const idx = imagenActiva - imagenesExistentes.length;
                        handleQuitarFotoNueva(idx);
                      }
                    }}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    {imagenActivaItem?.esExistente ? 'Eliminar foto' : 'Quitar foto'}
                  </button>
                </div>
              )}

              {todasParaCarrusel.length > 0 && (
                <div className="grid grid-cols-5 gap-1.5 mb-4">
                  {todasParaCarrusel.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setImagenActiva(i)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                        i === imagenActiva ? 'border-[#194566]' : 'border-transparent'
                      } ${!img.esExistente ? 'opacity-70' : ''}`}
                    >
                      <img
                        src={img.esExistente ? (getImageUrl(img.src) ?? DEFAULT_IMAGE) : img.src}
                        alt={`foto ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleFotoClick}
                className="w-full py-2.5 border-2 border-dashed border-[#194566] text-[#194566] rounded-lg text-sm font-medium hover:bg-[#194566] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar fotos
              </button>

              {fotosNuevas.length > 0 && (
                <p className="text-xs text-[#194566] text-center mt-2">
                  {fotosNuevas.length} foto{fotosNuevas.length > 1 ? 's' : ''} pendiente{fotosNuevas.length > 1 ? 's' : ''} de guardar
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={readOnly}
        onChange={handleFotosChange}
      />
    </div>
  );
};