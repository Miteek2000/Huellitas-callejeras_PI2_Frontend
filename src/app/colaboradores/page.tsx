"use client";
import React, { useState, useEffect } from 'react';
import { ColaboradoresService } from '../services/colaboradores.service';
import ColaboradorModal from '../../components/colaboradores/ColaboradorModal';
import RolModal from '../../components/colaboradores/RolModal';
import ConfirmModal from '../../components/colaboradores/ConfirmModal';
import AdminTable from '../../components/colaboradores/AdminTable';
import DomicilioTable from '../../components/colaboradores/DomicilioTable';




export default function ColaboradoresPage() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<any>(null);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ColaboradoresService.findAll()
      .then((data) => setColaboradores(data))
      .finally(() => setLoading(false));
  }, []);

  // Simulación de permisos (esto se debe obtener del contexto de autenticación)
  // isAdmin: puede agregar/editar/eliminar, colaborador: solo observa su registro
  const user = { id: 1, rol: 'admin' }; // Simulación, reemplazar por contexto real
  const isAdmin = user.rol === 'admin';


  const handleSaveColaborador = async (data: any) => {
    if (selectedColaborador) {
      const updated = await ColaboradoresService.update(selectedColaborador.id_usuario, data);
      setColaboradores(colaboradores.map((col) => col.id_usuario === updated.id_usuario ? updated : col));
    } else {
      const nuevo = await ColaboradoresService.create(data);
      setColaboradores([...colaboradores, nuevo]);
    }
  };

  const handleDeleteColaborador = async () => {
    await ColaboradoresService.delete(selectedColaborador.id_usuario);
    setColaboradores(colaboradores.filter((col) => col.id_usuario !== selectedColaborador.id_usuario));
    setShowConfirmModal(false);
    setSelectedColaborador(null);
  };


  const visibleColaboradores = isAdmin ? colaboradores : colaboradores.filter((col) => col.id_usuario === user.id);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {showColaboradorModal && (
        <ColaboradorModal
          colaborador={selectedColaborador}
          onClose={() => setShowColaboradorModal(false)}
          onSave={handleSaveColaborador}
        />
      )}

              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-blue-900">Huellitas-callejeras</h1>
                <span className="text-blue-900 ml-4">Espacios maximos: 30</span>
                <span className="text-blue-900 ml-4">Espacios en uso: 14</span>
                {isAdmin && (
                  <button
                    className="bg-indigo-900 text-white px-6 py-2 rounded-full font-semibold"
                    onClick={() => setShowRolModal(true)}
                  >
                    Agregar rol
                  </button>
                )}
              </div>

              <AdminTable admin={{
                nombre: 'Dato',
                apellidoPaterno: 'Dato',
                apellidoMaterno: 'Dato',
                email: 'Dato',
                contrasena: 'Dato',
              }} />

              <DomicilioTable domicilio={{
                estado: 'Dato',
                municipio: 'Dato',
                colonia: 'Dato',
                calle: 'Dato',
                numeroInterior: 'Dato',
                numeroExterior: 'Dato',
              }} />

              <h2 className="text-xl font-bold text-blue-900 mb-4">Colaboradores</h2>
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
                  {visibleColaboradores.map((col) => (
                    <tr key={col.id_usuario} className="bg-gray-300">
                      <td className="px-4 py-2">{col.nombre}</td>
                      <td className="px-4 py-2">{col.apellido_p}</td>
                      <td className="px-4 py-2">{col.apellido_m}</td>
                      <td className="px-4 py-2">{col.email}</td>
                      <td className="px-4 py-2">{col.contrasena || '********'}</td>
                      {isAdmin && (
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="bg-indigo-900 text-white px-4 py-1 rounded-full"
                            onClick={() => {
                              setSelectedColaborador(col);
                              setShowColaboradorModal(true);
                            }}
                          >Editar</button>
                          <button
                            className="bg-gray-400 text-white px-4 py-1 rounded-full"
                            onClick={() => {
                              setSelectedColaborador(col);
                              setShowConfirmModal(true);
                            }}
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
                    onClick={() => {
                      setSelectedColaborador(null);
                      setShowColaboradorModal(true);
                    }}
                  >Agregar</button>
                  <button className="bg-blue-900 text-white px-6 py-2 rounded-full font-semibold">Editar</button>
                  <button className="bg-gray-400 text-white px-6 py-2 rounded-full font-semibold">Eliminar</button>
                </div>
              )}

              {showColaboradorModal && (
                <ColaboradorModal
                  colaborador={selectedColaborador}
                  onClose={() => setShowColaboradorModal(false)}
                  onSave={handleSaveColaborador}
                />
              )}
              {showRolModal && (
                <RolModal
                  onClose={() => setShowRolModal(false)}
                  onSave={(data) => {/* lógica para guardar rol */ setShowRolModal(false); }}
                />
              )}
              {showConfirmModal && (
                <ConfirmModal
                  message="¿Seguro que deseas eliminar este colaborador?"
                  onConfirm={handleDeleteColaborador}
                  onClose={() => setShowConfirmModal(false)}
                />
              )}
            </div>
          );}
