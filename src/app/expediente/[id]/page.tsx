'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal } from '@/components/expedientes';
import type { Movimiento } from '@/schemas/movimiento.schema';
import { Animal } from '@/schemas/animal.schema';
import Image from 'next/image';
import { AnimalsService } from '@/app/services/animals.service';
import { MovementsService } from '@/app/services/movements.service';
import { getImageUrl } from '@/app/lib/endpoints';


const REFUGIO_ID = 'a732ec74-e803-4b85-aa1f-74d9d30ea827';
const USUARIO_ID = '6f390bb9-91c2-4448-8808-dac6c2a2db6b';

export default function EditarExpedientePage() {
  const router = useRouter();
  const params = useParams();
  const animalId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [expediente, setExpediente] = useState<Animal | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

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
      setMovimientos(animalMovements);
    } catch (error) {
      console.error('Error cargando expediente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnimal = async (data: Animal, fotoFile?: File | null, movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => {
    try {
      const { id_animal, usuario_id, refugio_id, imagen, ...payload } = data;
      await AnimalsService.update(animalId, {
        ...payload,
        refugio_id: REFUGIO_ID,
        usuario_id: USUARIO_ID,
      });
    if (movimiento) {
      const nuevoMovimiento = await MovementsService.create({
        ...movimiento,
        animal_id: animalId,
      });
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
    }
    
      await loadData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error actualizando animal:', error);
    }
  };

  const handleSaveMovimiento = async (
    movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>
  ) => {
    try {
      const nuevoMovimiento = await MovementsService.create({
        ...movimiento,
        animal_id: animalId, 
      });
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
    } catch (error) {
      console.error('Error guardando movimiento:', error);
    }
  };

  if (loading) return <div className="p-6">Cargando expediente...</div>;
  if (!expediente) return <div className="p-6">Expediente no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button onClick={() => router.back()} className="flex items-center hover:text-gray-900">
              <Image src="/imagenes/flecha.svg" alt="Volver" width={34} height={34} />
            </button>
            <span className="ml-2 text-[#182F51]">Editar expediente</span>
          </div>
          <button type="button" onClick={() => setIsEditing(true)} className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/edit.svg" alt="Editar" width={34} height={34} />
          </button>
        </div>
      </div>

      <ExpedienteForm
        initialData={expediente}
        initialPhotoUrl={getImageUrl(expediente.imagen)}
        readOnly={!isEditing}
        cancelMessage="¿Deseas cancelar los cambios?"
        onCancelConfirmed={() => router.push('/')}
        onOpenHistorial={() => setShowHistorial(true)}
        onSaveMovimiento={handleSaveMovimiento}
        onSaveAnimal={handleUpdateAnimal}
      />

      <HistorialMovimientosModal
        isOpen={showHistorial}
        onClose={() => setShowHistorial(false)}
        movimientos={movimientos}
      />
    </div>
  );
}