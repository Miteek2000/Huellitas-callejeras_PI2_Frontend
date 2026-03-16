import React from 'react';
import type { PromediosStats } from '@/schemas/estadisticas.schema';

interface PromediosTableProps {
  promedios: PromediosStats;
}

type Nivel = 'Alto' | 'Mediano' | 'Bajo';

function getNivelDesdePorcentaje(actual: number, historico: number): Nivel {
  if (actual >= historico + 8) return 'Alto';
  if (actual <= historico - 8) return 'Bajo';
  return 'Mediano';
}

function getNivelTamano(tamano: string): Nivel {
  const value = tamano.toLowerCase();
  if (value.includes('grande')) return 'Alto';
  if (value.includes('pequ')) return 'Bajo';
  return 'Mediano';
}

export function PromediosTable({ promedios }: PromediosTableProps) {
  const nivelEdad = getNivelDesdePorcentaje(promedios.edadPromedio, 2);
  const nivelSexo = getNivelDesdePorcentaje(promedios.sexoMasculino, 45);
  const nivelTamano = getNivelTamano(promedios.tamanoPromedio);
  const nivelDiscapacidad = getNivelDesdePorcentaje(promedios.discapacidadPorcentaje, 20);
  const nivelAgresividad = getNivelDesdePorcentaje(promedios.agresividadPorcentaje, 15);
  const nivelEnfermedades = getNivelDesdePorcentaje(promedios.enfermedadPorcentaje, 10);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-auto lg:min-w-[540px] h-fit">
      <h2 className="text-lg font-semibold text-[#2B264F] text-center mb-8">
        Promedios calculados del refugio
      </h2>

      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-3 rounded-tl-lg text-left">
              Datos
            </th>
            <th className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-3 text-center">
              Histórico
            </th>
            <th className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-3 text-center">
              Actual
            </th>
            <th className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-3 rounded-tr-lg text-center">
              Resultado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left">
              Edad
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">2 años</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.edadPromedio} años
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelEdad}</span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left">
              Sexo
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">45%</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.sexoMasculino}%
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelSexo}</span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left">
              Tamaño
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">Mediano</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.tamanoPromedio}
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelTamano}</span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left">
              Discapacidad
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">20%</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.discapacidadPorcentaje}%
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelDiscapacidad}</span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left">
              Agresividad
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">15%</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.agresividadPorcentaje}%
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelAgresividad}</span>
            </td>
          </tr>
          <tr>
            <td className="bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 rounded-bl-lg text-left">
              Enfermedades
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">10%</td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
              {promedios.enfermedadPorcentaje}%
            </td>
            <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 rounded-br-lg text-center">
              <span className="text-sm font-semibold tracking-wide text-[#2B264F]">{nivelEnfermedades}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 rounded-xl border border-[#D7DDEA] bg-[#F6F8FC] px-4 py-3">
        <p className="text-sm italic text-[#2B264F]">
          La probabilidad de liberar espacio es mayor a la media
        </p>
      </div>
    </div>
  );
}
