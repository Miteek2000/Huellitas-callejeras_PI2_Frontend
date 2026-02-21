'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, ConfirmModal, Input, Select, Checkbox, Textarea } from '@/components/ui';
import { ExpedienteActionButtons } from './ExpedienteActionButtons';
import { useExpedienteForm } from './useExpedienteForm';
import type { Animal } from '@/schemas/animal.schema';
import Image from 'next/image';

interface ExpedienteFormProps {
  onOpenHistorial?: () => void;
  initialData?: Partial<Animal>;
  initialPhotoUrl?: string;
  readOnly?: boolean;
  cancelMessage?: string;
  onCancelConfirmed?: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  onOpenHistorial,
  initialData,
  initialPhotoUrl,
  readOnly = false,
  cancelMessage = '¿Deseas cancelar este expediente?',
  onCancelConfirmed,
}) => {
  const router = useRouter();
  const {
    formData,
    setFormData,
    errors,
    especiesOptions,
    sexoOptions,
    fileInputRef,
    fotoPreviewUrl,
    showCancelConfirm,
    showSaveSuccess,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleCloseSaveSuccess,
    handleFotoClick,
    handleFotoChange,
    setShowCancelConfirm,
  } = useExpedienteForm({
    onCancelConfirmed: onCancelConfirmed ?? (() => router.back()),
    initialData,
    initialPhotoUrl,
  });

  const handleToggle = (field: 'es_agresivo' | 'enfermedad_no_tratable' | 'discapacidad') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      setFormData(prev => ({ ...prev, [field]: !e.target.checked }));
    };

  return (
    <div className="max-w-7xl mx-auto bg-[#E8E8E8] rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-60 h-60 flex-shrink-0">
            <div className="absolute inset-0 bg-[#5F7A91] rounded-full"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div
              className={`absolute inset-4 bg-[#2B5278] rounded-full overflow-hidden flex items-center justify-center ${
                errors.foto ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {fotoPreviewUrl ? (
                <img
                  src={fotoPreviewUrl}
                  alt="Foto del paciente"
                  className="w-full h-full object-cover"/>
              ) : (
                <button
                  type="button"
                  onClick={readOnly ? undefined : handleFotoClick}
                  disabled={readOnly}
                  className="hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={readOnly}
                onChange={handleFotoChange}
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#194566] mb-4">Expediente de paciente</h1>
            <ExpedienteActionButtons onHistorialClick={onOpenHistorial} />
          </div>
        </div>

        <div className="text-[#2B264F] grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder=""
              disabled={readOnly}
              className={errors.nombre ? 'border-red-500' : ''}
            />

            <Select
              label="Especie"
              name="especie"
              value={formData.especie}
              onChange={handleInputChange}
              options={especiesOptions}
              disabled={readOnly}
              className={errors.especie ? 'border-red-500' : ''}
            />

            <Input
              label="Raza"
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              placeholder=""
              disabled={readOnly}
              className={errors.raza ? 'border-red-500' : ''}
            />

            <Input
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleInputChange}
              placeholder=""
              disabled={readOnly}
              className={errors.edad ? 'border-red-500' : ''}
            />

            <Select
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              options={sexoOptions}
              disabled={readOnly}
              className={errors.sexo ? 'border-red-500' : ''}
            />

            <Input
              label="Peso"
              name="peso"
              type="number"
              value={formData.peso}
              onChange={handleInputChange}
              placeholder=""
              disabled={readOnly}
              className={errors.peso ? 'border-red-500' : ''}
            />

            <Input
              label="Tamaño"
              name="tamano"
              value={formData.tamano}
              onChange={handleInputChange}
              placeholder=""
              disabled={readOnly}
              className={errors.tamano ? 'border-red-500' : ''}
            />

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
                    <Checkbox 
                      label="Si"
                      name="es_agresivo"
                      checked={formData.es_agresivo}
                      disabled={readOnly}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="es_agresivo"
                      checked={!formData.es_agresivo}
                      disabled={readOnly}
                      onChange={handleToggle('es_agresivo')}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-2">¿Presenta alguna enfermedad degenerativa o sin cura?</p>
                  <div className="flex space-x-4">
                    <Checkbox 
                      label="Si"
                      name="enfermedad_no_tratable"
                      checked={formData.enfermedad_no_tratable}
                      disabled={readOnly}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="enfermedad_no_tratable"
                      checked={!formData.enfermedad_no_tratable}
                      disabled={readOnly}
                      onChange={handleToggle('enfermedad_no_tratable')}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-2">¿Presenta discapacidades?</p>
                  <div className="flex space-x-4">
                    <Checkbox 
                      label="Si"
                      name="discapacidad"
                      checked={formData.discapacidad}
                      disabled={readOnly}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="discapacidad"
                      checked={!formData.discapacidad}
                      disabled={readOnly}
                      onChange={handleToggle('discapacidad')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">

            <div className="mt-4">
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Datos de rescate</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <Input
                label="Lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleInputChange}
                placeholder=""
                disabled={readOnly}
                className={errors.lugar ? 'border-red-500' : ''}/>

              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder=""
                disabled={readOnly}
                className={errors.descripcion ? 'border-red-500' : ''}/>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-16">
          <Button
            type="submit"
            variant="primary"
            disabled={readOnly}
            className="!bg-[#2B264F] !text-white hover:bg-[#7BB75A] px-54 h-10 flex items-center justify-center font-semibold">
            Guardar
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} className=" !bg-[#A7A7A7] !text-white px-54 h-10 flex items-center justify-center font-semibold">
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
        onCancel={() => setShowCancelConfirm(false)}/>

      <ConfirmModal
        isOpen={showSaveSuccess}
        message="Expediente guardado correctamente"
        confirmLabel="aceptar"
        onConfirm={handleCloseSaveSuccess}/>
    </div>
  );
};