import React, { useState } from 'react';
import TableActionButtons from './TableActionButtons';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCol = colaboradores.find((c) => c.id_usuario === selectedId) ?? null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#2B264F] text-left">Colaboradores</h3>
        {isAdmin && (
          <TableActionButtons
            buttons={[
              { label: 'Agregar', onClick: onAgregar },
              { label: 'Editar', onClick: () => selectedCol && onEditar(selectedCol), disabled: !selectedCol },
              { label: 'Eliminar', onClick: () => selectedCol && onEliminar(selectedCol), disabled: !selectedCol, variant: 'danger' },
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
            <th className="px-4 py-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-400">Sin colaboradores registrados</td>
            </tr>
          ) : (
            colaboradores.map((col) => (
              <tr
                key={col.id_usuario}
                className={`cursor-pointer transition-colors ${
                  selectedId === col.id_usuario ? 'bg-indigo-200' : 'bg-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedId(selectedId === col.id_usuario ? null : col.id_usuario)}
              >
                <td className="px-4 py-2 text-center">{col.nombre}</td>
                <td className="px-4 py-2 text-center">{col.apellido_p}</td>
                <td className="px-4 py-2 text-center">{col.apellido_m}</td>
                <td className="px-4 py-2 text-center">{col.email}</td>
                <td className="px-4 py-2 text-center">{'********'}</td>
                <td className="px-4 py-2 text-center">{col.rol?.nombre ?? col.rol_id ?? '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ColaboradoresTable;
