import React from 'react';
import Image from 'next/image';

interface EstadisticasHeaderProps {
  onViewAnimales: () => void;
}

export function EstadisticasHeader({ onViewAnimales }: EstadisticasHeaderProps) {
  return (
    <div className="flex items-center justify-center mb-8 sm:mb-12 lg:mb-16 relative">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2B264F]">
        Panel de Estadísticas
      </h1>
      <button
        onClick={onViewAnimales}
        className="absolute right-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D7DDEA] bg-white text-[#194566] font-semibold hover:bg-[#F0F0F0] transition"
      >
        <Image src="/imagenes/flecha.svg" alt="Ver Animales Activos" width={24} height={24} style={{ transform: 'rotate(180deg)' }} />
      </button>
    </div>
  );
}
