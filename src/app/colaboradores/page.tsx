"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColaboradoresService } from '../../services/colaboradores.service';
import { RefugiosService, type Refugio } from '../../services/refugios.service';
import { AnimalsService } from '../../services/animals.service';
import { RolesService } from '../../services/roles.service';
import { getRefugioId, getUserRole, ROLES } from '../lib/auth';
import ColaboradorModal from '../../components/colaboradores/ColaboradorModal';
import DomicilioModal from '../../components/colaboradores/DomicilioModal';
import ConfirmModal from '../../components/colaboradores/ConfirmModal';
import AdminTable from '../../components/colaboradores/AdminTable';
import DomicilioTable from '../../components/colaboradores/DomicilioTable';
import ColaboradoresTable from '../../components/colaboradores/ColaboradoresTable';
import { Spinner } from '@/components/ui';
import type { Usuario } from '@/schemas/auth.schema';
import type { Rol } from '../../services/roles.service';

export default function ColaboradoresPage() {
  const router = useRouter();
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
  const [rol] = useState<string>(() => getUserRole());
  const [errorModal, setErrorModal] = useState<string>('');

  const isPropietario = rol === ROLES.PROPIETARIO;
  const isAdminOrPropietario = rol === ROLES.ADMIN || isPropietario;

  const cargarColaboradores = async (refugioId: string) => {
    const todosUsuarios = await ColaboradoresService.findAll(refugioId);
    const propietario = todosUsuarios.find((u) => u.rol?.nombre.toLowerCase() === 'propietario') ?? null;
    const soloColaboradores = todosUsuarios.filter((u) => u.rol?.nombre.toLowerCase() !== 'propietario');
    setAdminData(propietario);
    setColaboradores(soloColaboradores);
  };

  useEffect(() => {
    if (rol === ROLES.COLABORADOR) {
      router.replace('/galeria');
      return;
    }

    const refugioId = getRefugioId();

    Promise.all([
      ColaboradoresService.findAll(refugioId),
      refugioId ? RefugiosService.getById(refugioId) : Promise.resolve(null),
      AnimalsService.getAll(refugioId, 1, 1000),
      refugioId ? RolesService.getByRefugio(refugioId).catch(() => []) : Promise.resolve([]),
    ]).then(([todosUsuarios, refugioData, animalesResult, rolesData]: [Usuario[], Refugio | null, Awaited<ReturnType<typeof AnimalsService.getAll>>, Rol[]]) => {
      const propietario = todosUsuarios.find((u) => u.rol?.nombre.toLowerCase() === 'propietario') ?? null;
      const soloColaboradores = todosUsuarios.filter((u) => u.rol?.nombre.toLowerCase() !== 'propietario');
      setAdminData(propietario);
      setColaboradores(soloColaboradores);
      if (refugioData) setRefugio(refugioData);
      const enUso = animalesResult.data.filter((a) => a.refugio_id === refugioId).length;
      setEspaciosEnUso(enUso);
      setRoles(rolesData.filter((r) => ['admin', 'colaborador'].includes(r.nombre.toLowerCase())));
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveDomicilio = async (data: Partial<Refugio>) => {
    const refugioId = getRefugioId();
    if (!refugioId) return;
    const updated = await RefugiosService.update(refugioId, data);
    setRefugio(updated);
  };

  const handleSaveColaborador = async (data: Omit<Usuario, 'id_usuario'> & { confirmarContrasena: string }) => {
    try {
      const { confirmarContrasena: _, contrasena, ...rest } = data;
      const payload: Partial<Usuario> = { ...rest };
      if (contrasena && contrasena.trim() !== '') {
        payload.contrasena = contrasena;
      }

      if (selectedColaborador) {
        const { refugio_id, ...updatePayload } = payload;
        await ColaboradoresService.update(selectedColaborador.id_usuario, updatePayload);
      } else {
        await ColaboradoresService.create({
          ...payload,
          contrasena: contrasena,
          refugio_id: getRefugioId(),
          activo: true,
        } as Omit<Usuario, 'id_usuario'>);
      }

      await cargarColaboradores(getRefugioId());
      setShowColaboradorModal(false);
      setErrorModal('');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al guardar colaborador';
      setErrorModal(message);
      throw error;
    }
  };

  const handleDeleteColaborador = async () => {
    if (!selectedColaborador) return;
    await ColaboradoresService.delete(selectedColaborador.id_usuario);
    setColaboradores(colaboradores.filter((col) => col.id_usuario !== selectedColaborador.id_usuario));
    setShowConfirmModal(false);
    setSelectedColaborador(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen text-[#000000] text-center">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 mb-6 text-left">
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
        isAdmin={isPropietario}
        onEditar={() => { setSelectedColaborador(adminData); setEsPropietario(true); setErrorModal(''); setShowColaboradorModal(true); }}
        onEliminar={() => { setSelectedColaborador(adminData); setShowConfirmModal(true); }}
      />

      <DomicilioTable
        refugio={refugio}
        isAdmin={isPropietario}
        onEditar={() => setShowDomicilioModal(true)}
      />

      <ColaboradoresTable
        colaboradores={colaboradores}
        isAdmin={isAdminOrPropietario}
        canAgregar={isPropietario}
        onEditar={(col) => { setSelectedColaborador(col); setEsPropietario(false); setErrorModal(''); setShowColaboradorModal(true); }}
        onEliminar={(col) => { setSelectedColaborador(col); setShowConfirmModal(true); }}
        onAgregar={() => { setSelectedColaborador(null); setEsPropietario(false); setErrorModal(''); setShowColaboradorModal(true); }}
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
          error={errorModal}
          onClose={() => { setShowColaboradorModal(false); setErrorModal(''); }}
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