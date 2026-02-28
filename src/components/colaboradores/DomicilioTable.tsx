import React from 'react';

interface DomicilioTableProps {
  domicilio?: {
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    numeroInterior: string;
    numeroExterior: string;
  };
}

const DomicilioTable: React.FC<DomicilioTableProps> = ({ domicilio }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-blue-900 mb-2">Datos del refugio</h3>
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
            <td className="px-4 py-2">{domicilio?.estado || 'Dato'}</td>
            <td className="px-4 py-2">{domicilio?.municipio || 'Dato'}</td>
            <td className="px-4 py-2">{domicilio?.colonia || 'Dato'}</td>
            <td className="px-4 py-2">{domicilio?.calle || 'Dato'}</td>
            <td className="px-4 py-2">{domicilio?.numeroInterior || 'Dato'}</td>
            <td className="px-4 py-2">{domicilio?.numeroExterior || 'Dato'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DomicilioTable;
