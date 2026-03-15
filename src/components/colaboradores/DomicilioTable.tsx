import React from 'react';
import TableActionButtons from './TableActionButtons';
import type { Refugio } from '@/app/services/refugios.service';

interface DomicilioTableProps {
  refugio?: Refugio | null;
  isAdmin?: boolean;
  onEditar?: () => void;
}

const DomicilioTable: React.FC<DomicilioTableProps> = ({ refugio, isAdmin, onEditar }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-[#2B264F] text-left">Datos del refugio</h3>
        {isAdmin && (
          <TableActionButtons
            buttons={[
              { label: 'Editar', onClick: () => onEditar?.() },
            ]}
          />
        )}
      </div>
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
