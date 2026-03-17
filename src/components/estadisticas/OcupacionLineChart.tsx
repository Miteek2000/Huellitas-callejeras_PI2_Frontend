import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GraficaRow, OcupacionLineChartProps } from '@/schemas/estadisticas.schema';

export function OcupacionLineChart({ data, modo }: OcupacionLineChartProps) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-auto lg:min-w-[620px] h-fit">
        <p className="text-sm text-[#2B264F]">No hay movimientos suficientes para dibujar la grafica.</p>
      </div>
    );
  }

  const maxY = Math.max(...data.map((p) => p.ocupacion_total), 1);

  const tickFormatter = (value: string) => {
    return value.split(' ').slice(0, 2).join(' ');
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-auto lg:min-w-[620px] h-fit border border-[#E8ECF3]">
      <h2 className="mb-1 text-lg font-semibold text-[#1F2A56] text-center">Ocupacion del refugio</h2>
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 14, left: 2, bottom: 0 }}>
            <CartesianGrid stroke="#E9EDF5" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="periodo"
              tick={{ fill: '#44506A', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#D4DCEB' }}
              tickFormatter={tickFormatter}
            />
            <YAxis
              domain={[0, Math.ceil(maxY * 1.1)]}
              allowDecimals={false}
              tick={{ fill: '#44506A', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#D4DCEB' }}
            />
            <Tooltip
              labelFormatter={(label) => `Periodo: ${label}`}
              contentStyle={{ borderRadius: 12, border: '1px solid #D9E1EF', boxShadow: '0 8px 20px rgba(27, 45, 94, 0.12)' }}
            />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            <Line
              type="monotone"
              dataKey="ocupacion_total"
              stroke="#2855CF"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2855CF', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#2855CF', stroke: '#FFFFFF', strokeWidth: 2 }}
              name="Ocupacion"
            />
            <Line
              type="monotone"
              dataKey="entradas_acum"
              stroke="#16A34A"
              strokeWidth={2}
              dot={false}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="salidas_adopcion"
              stroke="#7C3AED"
              strokeWidth={2}
              dot={false}
              name="Adopciones"
            />
            <Line
              type="monotone"
              dataKey="salidas_defuncion"
              stroke="#DC2626"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 3"
              name="Defunciones"
            />
            <Line
              type="monotone"
              dataKey="salidas_extravio"
              stroke="#D97706"
              strokeWidth={2}
              dot={false}
              strokeDasharray="6 4"
              name="Extravios"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export type { GraficaRow };

