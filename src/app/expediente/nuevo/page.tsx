'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal } from '@/components/expedientes';
import type { Movimiento } from '@/schemas/movimiento.schema';
import type { Animal } from '@/schemas/animal.schema';
import { AnimalsService, type CreateAnimalDTO } from '@/app/services/animals.service';
import { MovementsService } from '@/app/services/movements.service';
import Image from 'next/image';

const REFUGIO_ID = 'd7195b56-5911-4c31-aedf-93f6da91f22a';
const USUARIO_ID = '903afe32-a10c-4e04-9ecd-dd3ea4e9695e';

export default function ExpedientePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [pendingMovimiento, setPendingMovimiento] = useState<  
    Omit<Movimiento, 'id_movimiento' | 'id_animal'> | null
  >(null);

  const handleSaveAnimal = async (data: Animal, fotoFile?: File | null) => {
  const formData = new FormData();

  formData.append('nombre', data.nombre);
  formData.append('estado', data.estado);
  formData.append('especie', data.especie);
  formData.append('raza', data.raza);
  formData.append('edad', String(data.edad));
  formData.append('peso', String(data.peso));
  formData.append('sexo', data.sexo);
  formData.append('tamano', data.tamano);
  formData.append('lugar', data.lugar);
  formData.append('descripcion', data.descripcion);
  formData.append('es_agresivo', String(data.es_agresivo));
  formData.append('enfermedad_no_tratable', String(data.enfermedad_no_tratable));
  formData.append('discapacidad', String(data.discapacidad));
  formData.append('refugio_id', REFUGIO_ID);
  formData.append('usuario_id', USUARIO_ID);

  if (fotoFile) {
    formData.append('imagen', fotoFile);
  }

  const animalCreado = await AnimalsService.createWithForm(formData);

  if (pendingMovimiento && animalCreado.id_animal) {
    await MovementsService.create({
      ...pendingMovimiento,
      id_animal: animalCreado.id_animal,
    });
  }

  router.push(`/expediente/${animalCreado.id_animal}`);
};

  const handleSaveMovimiento = (
    movimiento: Omit<Movimiento, 'id_movimiento' | 'id_animal'>
  ) => {
    setPendingMovimiento(movimiento); 

    setMovimientos(prev => [{ ...movimiento, id_animal: '' }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:text-gray-900">
              <Image src="/imagenes/flecha.svg" alt="Volver" width={34} height={34} />
            </button>
            <span className="ml-2 text-[#182F51]">Expediente del paciente</span>
          </div>
          <button type="button" className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/edit.svg" alt="Editar" width={34} height={34} />
          </button>
        </div>
      </div>

      <ExpedienteForm
        onOpenHistorial={() => setIsModalOpen(true)}
        onSaveMovimiento={handleSaveMovimiento}
        onSaveAnimal={handleSaveAnimal}
      />

      <HistorialMovimientosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movimientos={movimientos}
      />
    </div>
  );
}