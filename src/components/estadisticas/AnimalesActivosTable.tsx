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
        <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tl-lg text-left">
                Nombre
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Especie
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Sexo
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Tamaño
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Edad
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Estado
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Días en refugio
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Fecha ingreso
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Adoptabilidad
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Confianza
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Discap.
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                Agresivo
              </th>
              <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tr-lg text-center">
                Enferm.
              </th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal, idx) => {
              const isLast = idx === animales.length - 1;
              
              const getAdoptabilidadStyle = (nivel: string) => {
                switch(nivel?.toLowerCase()) {
                  case 'fácil': return 'bg-green-100 text-green-700 font-medium';
                  case 'moderada': return 'bg-yellow-100 text-yellow-700 font-medium';
                  case 'difícil': return 'bg-red-100 text-red-700 font-medium';
                  default: return 'bg-gray-100 text-gray-700 font-medium';
                }
              };

              const formatDate = (dateString: string) => {
                try {
                  const date = new Date(dateString);
                  return date.toISOString().split('T')[0];
                } catch {
                  return dateString;
                }
              };

              return (
                <tr key={animal.id_animal}>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-left font-medium">
                    {animal.animal}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.especie}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.sexo}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {animal.tamano || '-'}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center font-medium">
                    {animal.edad}
                  </td>
                  <td className={`bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-left font-medium${isLast ? ' rounded-bl-lg' : ''}`}>
                    {animal.estado}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center font-medium">
                    {animal.dias_en_refugio}
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    {formatDate(animal.fecha_ingreso)}
                  </td>
                  <td className="bg-[#F8F9FB] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getAdoptabilidadStyle(animal.nivel_adoptabilidad)}`}>
                      {animal.nivel_adoptabilidad}
                    </span>
                  </td>
                  <td className="bg-[#F8F9FB] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {animal.nivel_confianza}
                    </span>
                  </td>
                  <td className="bg-[#F8F9FB] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <span className={`inline-flex items-center gap-1 font-medium text-xs ${animal.discapacidad ? 'text-red-600' : 'text-green-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${animal.discapacidad ? 'bg-red-600' : 'bg-green-600'}`}></span>
                      {animal.discapacidad ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="bg-[#F8F9FB] px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <span className={`inline-flex items-center gap-1 font-medium text-xs ${animal.es_agresivo ? 'text-red-600' : 'text-green-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${animal.es_agresivo ? 'bg-red-600' : 'bg-green-600'}`}></span>
                      {animal.es_agresivo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className={`bg-[#F8F9FB] px-3 sm:px-6 py-3 sm:py-4 text-center${isLast ? ' rounded-br-lg' : ''}`}>
                    <span className={`inline-flex items-center gap-1 font-medium text-xs ${animal.enfermedad_no_tratable ? 'text-red-600' : 'text-green-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${animal.enfermedad_no_tratable ? 'bg-red-600' : 'bg-green-600'}`}></span>
                      {animal.enfermedad_no_tratable ? 'Sí' : 'No'}
                    </span>
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
