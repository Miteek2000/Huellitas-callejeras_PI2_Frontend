import React from 'react';
import type { IndicadorRow } from '@/schemas/estadisticas.schema';
import { HistoricoCell } from './HistoricoCell';

interface PromediosTableProps {
  indicadores: IndicadorRow[];
}

type Nivel = 'Alto' | 'Mediano' | 'Bajo';

const RESULTADO_COLORES: Record<string, string> = {
  alto: 'text-red-600 font-semibold',
  mediano: 'text-yellow-700 font-semibold',
  bajo: 'text-green-700 font-semibold',
};

function getColorResultado(resultado: string): string {
  return RESULTADO_COLORES[resultado.trim().toLowerCase()] ?? 'text-[#2B264F] font-semibold';
}

export function PromediosTable({ indicadores }: PromediosTableProps) {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[540px]">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full h-fit">
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
            {!indicadores.length ? (
              <tr>
              </tr>
            ) : indicadores.map((row, idx) => {
              const isLast = idx === indicadores.length - 1;
              return (
                <tr key={row.datos}>
                  <td
                    className={`bg-[#3D5A80] text-white text-sm font-medium px-6 py-4 text-left${isLast ? ' rounded-bl-lg' : ''}`}
                  >
                    {row.datos}
                  </td>
                  <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
                    <HistoricoCell value={row.historico} />
                  </td>
                  <td className="bg-[#D6DCE4] text-[#2B264F] text-sm px-6 py-4 text-center">
                    {row.actual}
                  </td>
                  <td
                    className={`bg-[#D6DCE4] text-sm px-6 py-4 text-center${isLast ? ' rounded-br-lg' : ''}`}
                  >
                    <span className={`text-sm tracking-wide ${getColorResultado(row.resultado)}`}>
                      {row.resultado}
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
