'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal } from '@/components/expedientes';
import Image from 'next/image';

export default function EditarExpedientePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);

   /*datos de ejemplito. remplazar mock por fetch*/
  const mockExpediente = {
    nombre: 'Luna',
    especie: 'perro',
    raza: 'Mestizo',
    edad: '3',
    sexo: 'hembra',
    peso: '12',
    tamano: 'mediano',
    tipoMovimiento: 'rescate',
    fecha: '2026-02-20',
    motivo: 'Rescate en la calle',
    lugar: 'Parque Central',
    descripcion: 'Se encontro con desnutricion leve.',
    comportamientoAgresivo: false,
    enfermedadDegenerativa: false,
    discapacidades: false,
  };
  const mockMovimientos = [
    {
      fecha: '2026-02-20',
      tipoMovimiento: 'rescate',
      motivo: 'Encontrado en el Parque Central con signos de desnutrición',
    },
    {
      fecha: '2026-02-18',
      tipoMovimiento: 'retorno',
      motivo: 'Regreso del veterinario después de chequeo general',
    },
    {
      fecha: '2026-02-15',
      tipoMovimiento: 'rescate',
      motivo: 'Primera llegada al refugio',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:text-gray-900"
            >
              <Image src="/imagenes/flecha.svg" alt="Volver" width={34} height={34} />
            </button>
            <span className="ml-2 text-[#182F51]">Editar expediente</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="hover:opacity-80 transition-opacity"
          >
            <Image src="/imagenes/edit.svg" alt="Editar" width={34} height={34} />
          </button>
        </div>
      </div>

      <ExpedienteForm
        initialData={mockExpediente}
        initialPhotoUrl="/imagenes/yo-prueba.jpg"
        readOnly={!isEditing}
        cancelMessage="¿Deseas cancelar los cambios?"
        onCancelConfirmed={() => router.push('/')}
        onOpenHistorial={() => setShowHistorial(true)}
      />

      <HistorialMovimientosModal
        isOpen={showHistorial}
        onClose={() => setShowHistorial(false)}
        movimientos={mockMovimientos}
      />
    </div>
  );
}
