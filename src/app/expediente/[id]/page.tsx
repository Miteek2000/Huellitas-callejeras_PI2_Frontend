'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal } from '@/components/expedientes';
import { ConfirmModal, Spinner } from '@/components/ui';
import type { Movimiento } from '@/schemas/movimiento.schema';
import type { Animal, AnimalImagen } from '@/schemas/animal.schema';
import Image from 'next/image';
import { AnimalsService } from '../../../services/animals.service';
import { MovementsService } from '../../../services/movements.service';
import { getUserRole, ROLES } from '@/app/lib/auth';

export default function EditarExpedientePage() {
  const router = useRouter();
  const params = useParams();
  const animalId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [expediente, setExpediente] = useState<Animal | null>(null);
  const [imagenes, setImagenes] = useState<AnimalImagen[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isColaborador] = useState<boolean>(() => getUserRole() === ROLES.COLABORADOR);

  useEffect(() => {
    if (!animalId) return;
    loadData();
  }, [animalId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const animal = await AnimalsService.getById(animalId);
      const animalMovements = await MovementsService.getByAnimalId(animalId);
      setExpediente(animal);
      setImagenes(animal.imagenes ?? []);
      setMovimientos(animalMovements);
    } catch (error) {
      console.error('Error cargando expediente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnimal = async (
    data: Animal,
    fotoFile?: File | null,
    movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>,
  ) => {
    const { id_animal, refugio_id, imagen, imagenes: _imgs, createdAt, updatedAt, ...payload } = data;

    const formData = new FormData();
    if (fotoFile) formData.append('imagen', fotoFile);

    const booleanFields = ['es_agresivo', 'enfermedad_no_tratable', 'discapacidad'];
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, booleanFields.includes(key) ? (value ? '1' : '0') : String(value));
      }
    });

    await AnimalsService.updateWithForm(animalId, formData);

    if (movimiento) {
      const nuevoMovimiento = await MovementsService.create({
        ...movimiento,
        animal_id: animalId,
      });
      setMovimientos((prev) => [nuevoMovimiento, ...prev]);
    }

    await loadData();
    setIsEditing(false);
  };

  const handleDeleteImagen = async (imagenId: string) => {
    await AnimalsService.deleteImagen(imagenId);
    setImagenes((prev) => prev.filter((img) => img.id_animal_imagen !== imagenId));
  };

  const handleSaveSuccess = () => setShowSaveSuccess(true);

  const handleSaveMovimiento = async (
    movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>,
  ) => {
    try {
      const nuevoMovimiento = await MovementsService.create({
        ...movimiento,
        animal_id: animalId,
      });
      setMovimientos((prev) => [nuevoMovimiento, ...prev]);
    } catch (error) {
      console.error('Error guardando movimiento:', error);
    }
  };

  if (loading) return <Spinner message="Cargando expediente..." />;
  if (!expediente) return <div className="p-6">Expediente no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-2 py-4 sm:p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button
              onClick={() => router.push('/galeria')}
              className="flex items-center hover:text-gray-900"
            >
              <Image src="/imagenes/flecha.svg" alt="Volver" width={34} height={34} />
            </button>
            <span className="ml-2 text-[#182F51]">Editar expediente</span>
          </div>
          {!isColaborador && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={
                isEditing
                  ? 'hover:opacity-80 transition-opacity'
                  : 'rounded-full p-1 bg-[#D7E8CB] shadow-sm hover:bg-[#C7DDB6] transition-all'
              }
            >
              <Image src="/imagenes/edit.svg" alt="Editar" width={34} height={34} />
            </button>
          )}
        </div>
      </div>

      <ExpedienteForm
        initialData={expediente}
        initialImagenes={imagenes}
        readOnly={!isEditing}
        cancelMessage="¿Deseas cancelar los cambios?"
        onCancelConfirmed={() => router.push('/galeria')}
        onOpenHistorial={() => setShowHistorial(true)}
        onSaveMovimiento={handleSaveMovimiento}
        onSaveAnimal={handleUpdateAnimal}
        onSaveSuccess={handleSaveSuccess}
        onDeleteImagen={handleDeleteImagen}
      />

      <ConfirmModal
        isOpen={showSaveSuccess}
        message="Expediente guardado correctamente"
        confirmLabel="aceptar"
        onConfirm={() => setShowSaveSuccess(false)}
      />

      <HistorialMovimientosModal
        isOpen={showHistorial}
        onClose={() => setShowHistorial(false)}
        movimientos={movimientos}
        onMovimientosChange={setMovimientos}
      />
    </div>
  );
}