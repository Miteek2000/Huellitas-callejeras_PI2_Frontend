"use client";
import React, { useState, useEffect } from 'react';
import { ColaboradoresService } from '../services/colaboradores.service';
import { RefugiosService, type Refugio } from '../services/refugios.service';
import { AnimalsService } from '../services/animals.service';
import { RolesService } from '../services/roles.service';
import { getRefugioId, getUsuarioId } from '../lib/auth';
import ColaboradorModal from '../../components/colaboradores/ColaboradorModal';
import RolModal from '../../components/colaboradores/RolModal';
import ConfirmModal from '../../components/colaboradores/ConfirmModal';
import AdminTable from '../../components/colaboradores/AdminTable';
import DomicilioTable from '../../components/colaboradores/DomicilioTable';
import ColaboradoresTable from '../../components/colaboradores/ColaboradoresTable';

export default function ColaboradoresPage() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<any>(null);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [adminData, setAdminData] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refugio, setRefugio] = useState<Refugio | null>(null);
  const [espaciosEnUso, setEspaciosEnUso] = useState<number>(0);

  const cargarRoles = async () => {
    const refugioId = getRefugioId();
    if (refugioId) {
      const data = await RolesService.getByRefugio(refugioId).catch(() => []);
      setRoles(data);
    }
  };

  useEffect(() => {
    const refugioId = getRefugioId();
    const usuarioId = getUsuarioId();

    Promise.all([
      ColaboradoresService.findAll(),
      refugioId ? RefugiosService.getById(refugioId) : Promise.resolve(null),
      AnimalsService.getAll(),
    ]).then(([todosUsuarios, refugioData, animalesData]) => {
      const admin = todosUsuarios.find((u: any) => u.id_usuario === usuarioId) ?? null;
      const soloColaboradores = todosUsuarios.filter((u: any) => u.id_usuario !== usuarioId);
      setAdminData(admin);
      setColaboradores(soloColaboradores);
      if (refugioData) setRefugio(refugioData);
      const enUso = animalesData.filter((a) => a.refugio_id === refugioId).length;
      setEspaciosEnUso(enUso);
    }).finally(() => setLoading(false));

    cargarRoles();
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


  const visibleColaboradores = colaboradores;

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-[#000000] text-center">

      {showColaboradorModal && (
        <ColaboradorModal
          colaborador={selectedColaborador}
          roles={roles}
          onClose={() => setShowColaboradorModal(false)}
          onSave={handleSaveColaborador}
        />
      )}

              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-[#194566]">{refugio?.nombre ?? 'Cargando...'}</h1>
                <span className="text-[#194566] ml-4 font-bold">Espacios maximos: {refugio?.capacidad_max ?? '-'}</span>
                <span className="text-[#194566] ml-4 font-bold">Espacios en uso: {espaciosEnUso}</span>
                {isAdmin && (
                  <button
                    className="bg-[#2B264F] text-white px-6 py-2 rounded-full font-semibold"
                    onClick={() => setShowRolModal(true)}
                  >
                    Agregar rol
                  </button>
                )}
              </div>

              <AdminTable admin={adminData ? {
                nombre: adminData.nombre,
                apellidoPaterno: adminData.apellido_p,
                apellidoMaterno: adminData.apellido_m,
                email: adminData.email,
                contrasena: '********',
              } : undefined} />

              <DomicilioTable refugio={refugio} />

              <ColaboradoresTable
                colaboradores={visibleColaboradores}
                isAdmin={isAdmin}
                onEditar={(col) => { setSelectedColaborador(col); setShowColaboradorModal(true); }}
                onEliminar={(col) => { setSelectedColaborador(col); setShowConfirmModal(true); }}
                onAgregar={() => { setSelectedColaborador(null); setShowColaboradorModal(true); }}
              />

              {showColaboradorModal && (
                <ColaboradorModal
                  colaborador={selectedColaborador}
                  roles={roles}
                  onClose={() => setShowColaboradorModal(false)}
                  onSave={handleSaveColaborador}
                />
              )}
              {showRolModal && (
                <RolModal
                  onClose={() => setShowRolModal(false)}
                  onSave={async (data) => {
                    const refugioId = getRefugioId();
                    await RolesService.create({ ...data, refugio_id: refugioId });
                    await cargarRoles();
                    setShowRolModal(false);
                  }}
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