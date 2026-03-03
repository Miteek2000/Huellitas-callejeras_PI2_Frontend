'use client';

import React from 'react';

const filas = [
  { label: 'Edad' },
  { label: 'Sexo' },
  { label: 'Tamaño' },
  { label: 'Discapacidad' },
  { label: 'Agresividad' },
  { label: 'Enfermedades' },
];

// Datos visuales estáticos para las barras del gráfico (pares histórico/actual)
const barData = [
  { historico: 72, actual: 100 },
  { historico: 55, actual: 40  },
  { historico: 85, actual: 70  },
  { historico: 100, actual: 95 },
];

export default function EstadisticasPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] px-12 py-10">
      <h1 className="text-2xl font-bold text-[#2B264F] text-center mb-10">
        Panel Estadistico
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

        {/* Tabla de promedios */}
        <div className="bg-white rounded-2xl shadow-md p-8 min-w-[460px]">
          <h2 className="text-base font-semibold text-[#2B264F] text-center mb-6">
            Promedios calculados del refugio
          </h2>

          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="bg-[#3D5A80] text-white text-sm font-medium px-5 py-2 rounded-tl-md">Datos</th>
                <th className="bg-[#3D5A80] text-white text-sm font-medium px-5 py-2">Historico</th>
                <th className="bg-[#3D5A80] text-white text-sm font-medium px-5 py-2">Actual</th>
                <th className="bg-[#3D5A80] text-white text-sm font-medium px-5 py-2 rounded-tr-md">Resultados</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={fila.label}>
                  <td
                    className={`bg-[#3D5A80] text-white text-sm font-medium px-5 py-3 text-center ${
                      i === filas.length - 1 ? 'rounded-bl-md' : ''
                    }`}
                  >
                    {fila.label}
                  </td>
                  <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-5 py-3 text-center">Dato</td>
                  <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-5 py-3 text-center">Dato</td>
                  <td
                    className={`bg-[#D6DCE4] text-[#2B264F] text-sm px-5 py-3 text-center ${
                      i === filas.length - 1 ? 'rounded-br-md' : ''
                    }`}
                  >
                    Dato
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-8 text-sm italic text-[#2B264F] text-left">
            La probabilidad de liberar espacio es mayor a la media
          </p>
        </div>

        {/* Gráfico de barras visual */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-end justify-center gap-4"
          style={{ minWidth: '380px', height: '420px' }}>
          {barData.map((bar, i) => (
            <div key={i} className="flex items-end gap-2">
              <div
                className="w-12 rounded-t-sm"
                style={{
                  height: `${bar.historico * 3}px`,
                  backgroundColor: '#B0BEC5',
                }}
              />
              <div
                className="w-12 rounded-t-sm"
                style={{
                  height: `${bar.actual * 3}px`,
                  backgroundColor: '#2B264F',
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
