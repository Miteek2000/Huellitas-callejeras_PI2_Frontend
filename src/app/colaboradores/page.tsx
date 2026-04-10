"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColaboradoresService } from '../../services/colaboradores.service';
import { RefugiosService, type Refugio } from '../../services/refugios.service';
import { StatisticsService } from '../../services/statistics.service';
import { RolesService } from '../../services/roles.service';
import { getRefugioId, getUserRole, ROLES } from '../lib/auth';
import ColaboradorModal from '../../components/colaboradores/ColaboradorModal';
import DomicilioModal from '../../components/colaboradores/DomicilioModal';
import ConfirmModal from '../../components/colaboradores/ConfirmModal';
import AdminTable from '../../components/colaboradores/AdminTable';
import DomicilioTable from '../../components/colaboradores/DomicilioTable';
import ColaboradoresTable from '../../components/colaboradores/ColaboradoresTable';
import Enable2FAModal from '../../components/auth/Enable2FAModal';
import { Spinner } from '@/components/ui/Spinner';
import type { Usuario } from '@/schemas/auth.schema';
import type { Rol } from '../../services/roles.service';
import { use2FA } from '@/hooks/use2FA';

export default function ColaboradoresPage() {
  const router = useRouter();
  const { getStatus } = use2FA();
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showDomicilioModal, setShowDomicilioModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(true);
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
      refugioId ? StatisticsService.getAnimalesActivos(refugioId) : Promise.resolve(null),
      refugioId ? RolesService.getByRefugio(refugioId).catch(() => []) : Promise.resolve([]),
      getStatus(),
    ]).then(([todosUsuarios, refugioData, animalesData, rolesData, faStatus]) => {
      const propietario = todosUsuarios.find((u) => u.rol?.nombre.toLowerCase() === 'propietario') ?? null;
      const soloColaboradores = todosUsuarios.filter((u) => u.rol?.nombre.toLowerCase() !== 'propietario');
      setAdminData(propietario);
      setColaboradores(soloColaboradores);
      if (refugioData) setRefugio(refugioData);
      setEspaciosEnUso(animalesData?.total_activos ?? 0);
      setRoles(rolesData.filter((r) => ['admin', 'colaborador'].includes(r.nombre.toLowerCase())));
      if (faStatus) setIs2FAEnabled(faStatus.twoFactorEnabled);
    }).finally(() => setLoading(false));
  }, []);

  const handleToggle2FA = () => {
    setIsEnabling2FA(!is2FAEnabled);
    setShow2FAModal(true);
  };

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
          aceptacion_term: true,
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

    if (loading) return <Spinner message="Cargando colaboradores..." />;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen text-[#000000] text-center">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-8 mb-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
          <h1 className="text-2xl font-semibold text-[#194566]">{refugio?.nombre ?? 'Cargando...'}</h1>
          <span className="text-[#194566] font-bold">Espacios máximos: {refugio?.capacidad_max ?? '-'}</span>
          <span className="text-[#194566] font-bold">Espacios en uso: {espaciosEnUso}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-700">Autenticación 2FA:</span>
          <button
            onClick={handleToggle2FA}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#194566] focus:ring-offset-2 ${
              is2FAEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
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

      <Enable2FAModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onSuccess={() => setIs2FAEnabled(isEnabling2FA)}
        isEnabling={isEnabling2FA}
      />
    </div>
  );
}