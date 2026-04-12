import React from 'react';
import { Button, ConfirmModal } from '@/components/ui';
import { ExpedienteActionButtons } from './ExpedienteActionButtons';
import { EtiquetasAsignadas } from './EtiquetasAsignadas';
import { useExpedienteForm } from './useExpedienteForm';
import { PhotoCircle } from './PhotoCircle';
import { AnimalDataFields } from './AnimalDataFields';
import { OtrosDatosSection } from './OtrosDatosSection';
import { MovimientoSection } from './MovimientoSection';
import { LugarDescripcionFields } from './LugarDescripcionFields';
import { FotoPackage } from './FotoPackage';
import { getImageUrl } from '@/app/lib/endpoints';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';

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
  const isCreacion = !initialData || !initialData.id_animal;

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

  const hasError = (field: string) => Boolean(errors[field]);

  const imagenActivaItem = todasParaCarrusel[imagenActiva];
  const imagenActivaSrc = imagenActivaItem
    ? imagenActivaItem.esExistente
      ? (getImageUrl(imagenActivaItem.src) ?? '/imagenes/galeria/default.png')
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

  return (
    <div className={`max-w-7xl mx-auto rounded-lg shadow-lg p-4 sm:p-8 transition-all ${readOnly ? 'bg-[#DCDCDC] opacity-85 saturate-50' : 'bg-[#E8E8E8]'}`}>
      <form onSubmit={handleSubmit} noValidate>


        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
          <PhotoCircle
            imagenActivaSrc={imagenActivaSrc}
            hasError={hasError('foto')}
            onClickPhoto={() => !readOnly && setShowFotoModal(true)}
            readOnly={readOnly}
            todasParaCarrusel={todasParaCarrusel}
            imagenActiva={imagenActiva}
            setImagenActiva={setImagenActiva}
            irAnterior={irAnterior}
            irSiguiente={irSiguiente}
          />

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
            <AnimalDataFields
              formData={formData}
              readOnly={readOnly}
              errors={errors}
              especiesOptions={especiesOptions}
              sexoOptions={sexoOptions}
              tamanoOptions={tamanoOptions}
              unidadEdadOptions={unidadEdadOptions}
              handleInputChange={handleInputChange}
            />
            <OtrosDatosSection
              formData={formData}
              readOnly={readOnly}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <MovimientoSection
              isCreacion={isCreacion}
              readOnly={readOnly}
              movimientoData={movimientoData}
              errors={errors}
              tipoMovimientoOptions={tipoMovimientoOptions}
              motivoOptions={motivoOptions}
              handleInputChange={handleInputChange}
            />
            <LugarDescripcionFields
              isCreacion={isCreacion}
              formData={formData}
              readOnly={readOnly}
              errors={errors}
              handleInputChange={handleInputChange}
            />
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
          <Button
            type="submit"
            variant="primary"
            disabled={readOnly || isSaving}
            className="!bg-[#2B264F] !text-white w-full sm:w-auto px-16 md:px-50 h-10 flex items-center justify-center font-semibold"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="!bg-[#A7A7A7] !text-white w-full sm:w-auto px-16 md:px-50 h-10 flex items-center justify-center font-semibold"
          >
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

      <FotoPackage
        showFotoModal={showFotoModal}
        setShowFotoModal={setShowFotoModal}
        todasParaCarrusel={todasParaCarrusel}
        imagenActiva={imagenActiva}
        setImagenActiva={setImagenActiva}
        imagenesExistentes={imagenesExistentes}
        fotosNuevas={fotosNuevas}
        handleDeleteImagen={handleDeleteImagen}
        handleQuitarFotoNueva={handleQuitarFotoNueva}
        handleFotoClick={handleFotoClick}
        irAnterior={irAnterior}
        irSiguiente={irSiguiente}
        imagenActivaItem={imagenActivaItem}
      />

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