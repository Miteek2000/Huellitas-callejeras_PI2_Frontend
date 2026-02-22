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
  const [pendingMovimiento, setPendingMovimiento] = useState<Omit<Movimiento, 'id_movimiento' | 'animal_id'> | null>(null);

  const handleSaveAnimal = async (data: Animal, fotoFile?: File | null) => {
    const form = new FormData();
    form.append('nombre', data.nombre);
    form.append('estado', data.estado);
    form.append('especie', data.especie);
    form.append('raza', data.raza);
    form.append('edad', String(data.edad));
    form.append('peso', String(data.peso));
    form.append('sexo', data.sexo);
    form.append('tamano', data.tamano);
    form.append('lugar', data.lugar);
    form.append('descripcion', data.descripcion);
    form.append('es_agresivo', String(data.es_agresivo));
    form.append('enfermedad_no_tratable', String(data.enfermedad_no_tratable));
    form.append('discapacidad', String(data.discapacidad));
    form.append('refugio_id', REFUGIO_ID);
    form.append('usuario_id', USUARIO_ID);

    if (fotoFile) {
      form.append('imagen', fotoFile);
    }

    const animalCreado = await AnimalsService.createWithForm(form);

    if (pendingMovimiento && animalCreado.id_animal) {
      await MovementsService.create({
        ...pendingMovimiento,
        animal_id: animalCreado.id_animal, 
      });
    }

    router.push(`/expediente/${animalCreado.id_animal}`);
  };

  const handleSaveMovimiento = (
    movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>
  ) => {
    setPendingMovimiento(movimiento);
    setMovimientos(prev => [{ ...movimiento, animal_id: '' }, ...prev]); 
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button onClick={() => router.back()} className="flex items-center hover:text-gray-900">
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