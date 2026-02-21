'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal } from '@/components/expedientes';
import type { Movimiento } from '@/schemas/movimiento.schema';
import Image from 'next/image';

export default function ExpedientePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

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

      <ExpedienteForm onOpenHistorial={() => setIsModalOpen(true)} />
      
      <HistorialMovimientosModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movimientos={movimientos}
      />
    </div>
  );
}