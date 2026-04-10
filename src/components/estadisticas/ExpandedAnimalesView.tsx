import React from 'react';
import Image from 'next/image';
import { AnimalesActivosTable } from './AnimalesActivosTable';
import type { AnimalActivoRow } from '@/schemas/estadisticas.schema';

interface ExpandedAnimalesViewProps {
  animales: AnimalActivoRow[];
  totalActivos: number;
  onBack: () => void;
}

export function ExpandedAnimalesView({
  animales,
  totalActivos,
  onBack,
}: ExpandedAnimalesViewProps) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] px-2 py-6 sm:px-4 md:px-8 lg:px-12 lg:py-10">
      <div className="flex items-center justify-end mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D7DDEA] bg-white text-[#194566] font-semibold hover:bg-[#F0F0F0] transition"
        >
          <Image src="/imagenes/flecha.svg" alt="Atrás" width={24} height={24} />
          Atrás
        </button>
      </div>
      <AnimalesActivosTable animales={animales} totalActivos={totalActivos} />
    </div>
  );
}
