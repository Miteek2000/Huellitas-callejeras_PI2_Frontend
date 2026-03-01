import React from 'react';
import type { Usuario } from '@/schemas/auth.schema';

interface ColaboradoresTableProps {
  colaboradores: Usuario[];
  isAdmin: boolean;
  onEditar: (col: Usuario) => void;
  onEliminar: (col: Usuario) => void;
  onAgregar: () => void;
}

const ColaboradoresTable: React.FC<ColaboradoresTableProps> = ({
  colaboradores,
  isAdmin,
  onEditar,
  onEliminar,
  onAgregar,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-[#2B264F] mb-4 text-left">Colaboradores</h3>
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="px-4 py-2">Nombres</th>
            <th className="px-4 py-2">Apellido Paterno</th>
            <th className="px-4 py-2">Apellido Materno</th>
            <th className="px-4 py-2">email</th>
            <th className="px-4 py-2">Contraseña</th>
            {isAdmin && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((col) => (
            <tr key={col.id_usuario} className="bg-gray-300">
              <td className="px-4 py-2">{col.nombre}</td>
              <td className="px-4 py-2">{col.apellido_p}</td>
              <td className="px-4 py-2">{col.apellido_m}</td>
              <td className="px-4 py-2">{col.email}</td>
              <td className="px-4 py-2">{'********'}</td>
              {isAdmin && (
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-indigo-900 text-white px-4 py-1 rounded-full"
                    onClick={() => onEditar(col)}
                  >Editar</button>
                  <button
                    className="bg-gray-400 text-white px-4 py-1 rounded-full"
                    onClick={() => onEliminar(col)}
                  >Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isAdmin && (
        <div className="flex gap-4 mb-4">
          <button
            className="bg-indigo-900 text-white px-6 py-2 rounded-full font-semibold"
            onClick={onAgregar}
          >Agregar</button>
        </div>
      )}
    </div>
  );
};

export default ColaboradoresTable;
