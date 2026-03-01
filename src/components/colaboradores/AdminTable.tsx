import React, { useState } from 'react';
import TableActionButtons from './TableActionButtons';

interface AdminTableProps {
  admin?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    contrasena: string;
  };
  isAdmin?: boolean;
  onEditar?: () => void;
  onEliminar?: () => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ admin, isAdmin, onEditar, onEliminar }) => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-[#2B264F] text-left">Propietario</h3>
        {isAdmin && (
          <TableActionButtons
            buttons={[
              { label: 'Editar', onClick: () => onEditar?.(), disabled: !selected },
            ]}
          />
        )}
      </div>
      <table className="w-full mb-2">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="px-4 py-2">Nombres</th>
            <th className="px-4 py-2">Apellido Paterno</th>
            <th className="px-4 py-2">Apellido Materno</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Contraseña</th>
          </tr>
        </thead>
        <tbody>
          <tr
            className={`cursor-pointer transition-colors ${
              selected ? 'bg-indigo-200' : 'bg-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setSelected((s) => !s)}
          >
            <td className="px-4 py-2 text-center">{admin?.nombre || '-'}</td>
            <td className="px-4 py-2 text-center">{admin?.apellidoPaterno || '-'}</td>
            <td className="px-4 py-2 text-center">{admin?.apellidoMaterno || '-'}</td>
            <td className="px-4 py-2 text-center">{admin?.email || '-'}</td>
            <td className="px-4 py-2 text-center">{admin?.contrasena || '********'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
