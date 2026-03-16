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
import type { OcupacionTimelinePoint } from '@/schemas/estadisticas.schema';

interface OcupacionLineChartProps {
  data: OcupacionTimelinePoint[];
}

export function OcupacionLineChart({ data }: OcupacionLineChartProps) {
  if (!data.length) {
    return (
      <div className="h-[420px] w-full lg:w-[420px] rounded-3xl bg-white p-6 shadow-lg">
        <p className="text-sm text-[#2B264F]">No hay movimientos suficientes para dibujar la grafica.</p>
      </div>
    );
  }

  const maxY = Math.max(
    ...data.map((point) => Math.max(point.ocupacion, point.capacidadMax)),
    1
  );

  return (
    <div className="h-[420px] w-full lg:w-[420px] rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-base font-semibold text-[#2B264F] text-center">Ocupacion del refugio en el tiempo</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E6E6E6" strokeDasharray="4 4" />
          <XAxis dataKey="fecha" tick={{ fill: '#1C3557', fontSize: 12 }} />
          <YAxis
            domain={[0, Math.ceil(maxY * 1.1)]}
            allowDecimals={false}
            tick={{ fill: '#1C3557', fontSize: 12 }}
          />
          <Tooltip labelFormatter={(label) => `Fecha: ${label}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="capacidadMax"
            stroke="#D97706"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
            name="capacidadMax"
          />
          <Line
            type="monotone"
            dataKey="ocupacion"
            stroke="#1D4ED8"
            strokeWidth={3}
            dot={{ r: 3, fill: '#1D4ED8' }}
            activeDot={{ r: 5 }}
            name="ocupacion"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
