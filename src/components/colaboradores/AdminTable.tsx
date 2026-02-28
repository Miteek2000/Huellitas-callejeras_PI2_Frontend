import React from 'react';

interface AdminTableProps {
  admin?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    contrasena: string;
  };
}

const AdminTable: React.FC<AdminTableProps> = ({ admin }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-blue-900 mb-2">Administrador</h3>
      <table className="w-full mb-2">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="px-4 py-2">Nombres</th>
            <th className="px-4 py-2">Apellido Paterno</th>
            <th className="px-4 py-2">Apellido Materno</th>
            <th className="px-4 py-2">email</th>
            <th className="px-4 py-2">Contraseña</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-300">
            <td className="px-4 py-2">{admin?.nombre || 'Dato'}</td>
            <td className="px-4 py-2">{admin?.apellidoPaterno || 'Dato'}</td>
            <td className="px-4 py-2">{admin?.apellidoMaterno || 'Dato'}</td>
            <td className="px-4 py-2">{admin?.email || 'Dato'}</td>
            <td className="px-4 py-2">{admin?.contrasena || 'Dato'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
