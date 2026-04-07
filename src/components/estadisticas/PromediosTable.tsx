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
    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 w-full h-fit">
      <h2 className="text-sm sm:text-base font-semibold text-[#2B264F] text-center mb-6 sm:mb-8 uppercase tracking-wide">
        Promedios calculados del refugio
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tl-lg text-left">
                  Datos
                </th>
                <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                  Histórico
                </th>
                <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 text-center">
                  Actual
                </th>
                <th className="bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-tr-lg text-center">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {!indicadores.length ? (
                <tr>
                  <td colSpan={4} className="bg-[#F5F5F5] text-[#666] px-3 sm:px-6 py-8 text-center text-sm">
                    No hay datos de indicadores disponibles
                  </td>
                </tr>
              ) : indicadores.map((row, idx) => {
                const isLast = idx === indicadores.length - 1;
                return (
                  <tr key={row.datos}>
                    <td
                      className={`bg-[#3D5A80] text-white font-medium px-3 sm:px-6 py-3 sm:py-4 text-left${isLast ? ' rounded-bl-lg' : ''}`}
                    >
                      {row.datos}
                    </td>
                    <td className="bg-[#D6DCE4] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <HistoricoCell value={row.historico} />
                    </td>
                    <td className="bg-[#D6DCE4] text-[#2B264F] px-3 sm:px-6 py-3 sm:py-4 text-center">
                      {row.actual}
                    </td>
                    <td
                      className={`bg-[#D6DCE4] px-3 sm:px-6 py-3 sm:py-4 text-center${isLast ? ' rounded-br-lg' : ''}`}
                    >
                      <span className={`tracking-wide ${getColorResultado(row.resultado)}`}>
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
