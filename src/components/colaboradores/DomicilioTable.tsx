import React from 'react';
import type { Refugio } from '@/app/services/refugios.service';

interface DomicilioTableProps {
  refugio?: Refugio | null;
}

const DomicilioTable: React.FC<DomicilioTableProps> = ({ refugio }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-[#2B264F] mb-2 text-left">Datos del refugio</h3>
      <table className="w-full mb-2">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Municipio</th>
            <th className="px-4 py-2">Colonia</th>
            <th className="px-4 py-2">Calle</th>
            <th className="px-4 py-2">Numero interior</th>
            <th className="px-4 py-2">Numero exterior</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-300">
            <td className="px-4 py-2">{refugio?.estado ?? '-'}</td>
            <td className="px-4 py-2">{refugio?.municipio ?? '-'}</td>
            <td className="px-4 py-2">{refugio?.colonia ?? '-'}</td>
            <td className="px-4 py-2">{refugio?.calle ?? '-'}</td>
            <td className="px-4 py-2">{refugio?.num_interior ?? '-'}</td>
            <td className="px-4 py-2">{refugio?.num_exterior ?? '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DomicilioTable;
