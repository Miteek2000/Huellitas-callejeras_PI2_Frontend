"use client";
import React, { useState, useEffect } from 'react';
import { ColaboradoresService } from '../services/colaboradores.service';
import { RefugiosService, type Refugio } from '../services/refugios.service';
import { AnimalsService } from '../services/animals.service';
import { RolesService } from '../services/roles.service';
import { getRefugioId, getUsuarioId, getTokenPayload } from '../lib/auth';
import ColaboradorModal from '../../components/colaboradores/ColaboradorModal';
import DomicilioModal from '../../components/colaboradores/DomicilioModal';
import ConfirmModal from '../../components/colaboradores/ConfirmModal';
import AdminTable from '../../components/colaboradores/AdminTable';
import DomicilioTable from '../../components/colaboradores/DomicilioTable';
import ColaboradoresTable from '../../components/colaboradores/ColaboradoresTable';
import type { Usuario } from '@/schemas/auth.schema';
import type { Rol } from '../services/roles.service';
import type { Animal } from '@/schemas/animal.schema';

export default function ColaboradoresPage() {
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showDomicilioModal, setShowDomicilioModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [esPropietario, setEsPropietario] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState<Usuario | null>(null);
  const [colaboradores, setColaboradores] = useState<Usuario[]>([]);
  const [adminData, setAdminData] = useState<Usuario | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [refugio, setRefugio] = useState<Refugio | null>(null);
  const [espaciosEnUso, setEspaciosEnUso] = useState<number>(0);

  const isAdmin = getTokenPayload()?.rol === 'propietario';


  useEffect(() => {
    const refugioId = getRefugioId();
    const usuarioId = getUsuarioId();

    Promise.all([
      ColaboradoresService.findAll(refugioId),
      refugioId ? RefugiosService.getById(refugioId) : Promise.resolve(null),
      AnimalsService.getAll(refugioId),
      refugioId ? RolesService.getByRefugio(refugioId).catch(() => []) : Promise.resolve([]),
    ]).then(([todosUsuarios, refugioData, animalesData, rolesData]: [Usuario[], Refugio | null, Animal[], Rol[]]) => {
      const admin = todosUsuarios.find((u) => u.id_usuario === usuarioId) ?? null;
      const soloColaboradores = todosUsuarios.filter((u) => u.id_usuario !== usuarioId);
      setAdminData(admin);
      setColaboradores(soloColaboradores);
      if (refugioData) setRefugio(refugioData);
      const enUso = animalesData.filter((a) => a.refugio_id === refugioId).length;
      setEspaciosEnUso(enUso);
      const rolesFiltrados = rolesData.filter((r) =>
        ['admin', 'colaborador'].includes(r.nombre.toLowerCase())
      );
      setRoles(rolesFiltrados);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveDomicilio = async (data: Partial<Refugio>) => {
    const refugioId = getRefugioId();
    if (!refugioId) return;
    const updated = await RefugiosService.update(refugioId, data);
    setRefugio(updated);
  };

const handleSaveColaborador = async (data: Omit<Usuario, 'id_usuario'> & { confirmarContrasena: string }) => {
  const { confirmarContrasena: _, contrasena, ...rest } = data;

  const payload: Partial<Usuario> = { ...rest };

  if (contrasena && contrasena.trim() !== '') {
    payload.contrasena = contrasena;
  }

  if (selectedColaborador) {
    const { refugio_id, ...updatePayload } = payload;
    const updated = await ColaboradoresService.update(selectedColaborador.id_usuario, updatePayload);
    setColaboradores(colaboradores.map((col) =>
      col.id_usuario === updated.id_usuario ? updated : col
    ));
  } else {
    const nuevo = await ColaboradoresService.create({
      ...payload,
      contrasena: contrasena,
      refugio_id: getRefugioId(),
      activo: true,
    } as Omit<Usuario, 'id_usuario'>);
    setColaboradores([...colaboradores, nuevo]);
  }
};

  const handleDeleteColaborador = async () => {
    if (!selectedColaborador) return;
    await ColaboradoresService.delete(selectedColaborador.id_usuario);
    setColaboradores(colaboradores.filter((col) => col.id_usuario !== selectedColaborador.id_usuario));
    setShowConfirmModal(false);
    setSelectedColaborador(null);
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-[#000000] text-center">
      <div className="flex items-center gap-15 mb-6">
        <h1 className="text-2xl font-semibold text-[#194566]">{refugio?.nombre ?? 'Cargando...'}</h1>
        <span className="text-[#194566] font-bold">Espacios máximos: {refugio?.capacidad_max ?? '-'}</span>
        <span className="text-[#194566] font-bold">Espacios en uso: {espaciosEnUso}</span>
      </div>

      <AdminTable
        admin={adminData ? {
          nombre: adminData.nombre,
          apellidoPaterno: adminData.apellido_p,
          apellidoMaterno: adminData.apellido_m,
          email: adminData.email,
          contrasena: '********',
        } : undefined}
        isAdmin={isAdmin}
        onEditar={() => { setSelectedColaborador(adminData); setEsPropietario(true); setShowColaboradorModal(true); }}
        onEliminar={() => { setSelectedColaborador(adminData); setShowConfirmModal(true); }}
      />

      <DomicilioTable
        refugio={refugio}
        isAdmin={isAdmin}
        onEditar={() => setShowDomicilioModal(true)}
      />

      <ColaboradoresTable
        colaboradores={colaboradores}
        isAdmin={isAdmin}
        onEditar={(col) => { setSelectedColaborador(col); setEsPropietario(false); setShowColaboradorModal(true); }}
        onEliminar={(col) => { setSelectedColaborador(col); setShowConfirmModal(true); }}
        onAgregar={() => { setSelectedColaborador(null); setEsPropietario(false); setShowColaboradorModal(true); }}
      />

      {showDomicilioModal && (
        <DomicilioModal
          refugio={refugio}
          onClose={() => setShowDomicilioModal(false)}
          onSave={handleSaveDomicilio}
        />
      )}

      {showColaboradorModal && (
        <ColaboradorModal
          colaborador={selectedColaborador}
          roles={roles}
          esPropietario={esPropietario}
          onClose={() => setShowColaboradorModal(false)}
          onSave={handleSaveColaborador}
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
  );
}