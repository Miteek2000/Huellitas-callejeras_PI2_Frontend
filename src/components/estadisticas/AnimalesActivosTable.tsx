import React from 'react';
import type { AnimalActivoRow } from '@/schemas/estadisticas.schema';

interface AnimalesActivosTableProps {
  animales: AnimalActivoRow[];
  totalActivos: number;
}

export function AnimalesActivosTable({ animales, totalActivos }: AnimalesActivosTableProps) {
  if (!animales.length) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
        <p className="text-sm text-[#666] text-center py-4">No hay animales activos en este refugio.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B264F] mb-2">Animales Activos</h2>
        <p className="text-sm text-[#666]">Total: <span className="font-bold text-[#194566]">{totalActivos} animales</span></p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-0 text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tl-lg text-left">
                Nombre
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Especie
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Raza
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Días en Refugio
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tr-lg text-center">
                Probabilidad Adopción
              </th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal, idx) => {
              const isLast = idx === animales.length - 1;
              const probabilidad = Math.round(animal.probabilidad_adopcion * 100);
              const colorProbabilidad = 
                probabilidad >= 70 ? 'text-green-600 font-semibold' :
                probabilidad >= 40 ? 'text-yellow-600 font-semibold' :
                'text-red-600 font-semibold';

              return (
                <tr key={animal.id_animal}>
                  <td className={`bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-left font-medium${isLast ? ' rounded-bl-lg' : ''}`}>
                    {animal.nombre}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.especie}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.raza}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.dias_en_refugio}
                  </td>
                  <td className={`bg-[#F8F9FB] px-3 sm:px-6 py-3 sm:py-4 text-center${isLast ? ' rounded-br-lg' : ''}`}>
                    <span className={colorProbabilidad}>{probabilidad}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
