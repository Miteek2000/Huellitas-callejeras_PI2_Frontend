"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AnimalsService } from '@/app/services/animals.service';
import { MovementsService } from '@/app/services/movements.service';
import { ExpedienteCard } from '@/components/animals/ExpedienteCard';
import { LogoutConfirmModal } from '@/components/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeleteConfirmModal } from '@/components/animals/DeleteConfirmModal';
import Link from 'next/link';
import Image from 'next/image';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';
import { getRefugioId, getUserRole, ROLES } from '@/app/lib/auth';

const LIMITE_POR_PAGINA = 12;

const getTipoHuella = (movimientos: Movimiento[]): 'entrada' | 'salida' | null => {
  if (!movimientos.length) return null;
  const salida = movimientos.find(m => m.tipo_movimiento === 'salida');
  if (salida) return 'salida';
  const entrada = movimientos.find(m => m.tipo_movimiento === 'entrada');
  if (entrada) return 'entrada';
  return null;
};

export default function GaleriaPage() {
  const router = useRouter();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isColaborador, setIsColaborador] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalAnimales, setTotalAnimales] = useState(0);
  const [cargando, setCargando] = useState(false);

  const cargarAnimales = async (refugioId: string, page: number) => {
    try {
      setCargando(true);
      const resultado = await AnimalsService.getAll(refugioId, page, LIMITE_POR_PAGINA);
      setAnimales(resultado?.data ?? []);
      setTotalPaginas(resultado?.meta?.totalPages ?? 1);
      setTotalAnimales(resultado?.meta?.total ?? 0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const refugioId = getRefugioId();
    setIsColaborador(getUserRole() === ROLES.COLABORADOR);
    cargarAnimales(refugioId, paginaActual);
    MovementsService.getAll().then(data => setMovimientos(data ?? []));
  }, [paginaActual]);

  const animalesFiltrados = animales.filter(animal =>
    animal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.id_animal && animal.id_animal.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    await AnimalsService.delete(deleteId);
    const refugioId = getRefugioId();
    await cargarAnimales(refugioId, paginaActual);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 gap-3">
        <div className="flex-1 flex items-center">
          <div className="bg-[#E9E9E9] flex items-center px-3 py-2 min-h-[45px] w-full max-w-xl" style={{ boxShadow: '2px 4px 6px #e0e0e0' }}>
            <button type="button" onClick={() => setShowLogoutConfirm(true)} className="flex items-center min-w-0">
              <Image src="/imagenes/flecha.svg" alt="volver" width={32} height={32} className="flex-shrink-0" />
              <span className="ml-3 text-[#22345A] font-medium text-base sm:text-lg truncate">Galeria de expedientes</span>
            </button>
            <div className="flex-1" />
            {!isColaborador && (
              <Link href="/expediente/nuevo" className="flex-shrink-0 ml-2">
                <button className="flex items-center justify-center hover:scale-105 transition-transform">
                  <Image src="/imagenes/galeria/addAnimal.svg" alt="nuevo" width={32} height={32} />
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="w-full sm:w-96 relative sm:ml-8">
          <Image src='/imagenes/galeria/buscar.svg' alt="buscar" width={20} height={20} className="absolute left-3 top-2.5" />
          <Input
            placeholder="Buscar paciente por nombre o ID"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="pl-10 h[60px] w-full"
          />
        </div>
      </div>

      <div className="bg-[#E8E8E8] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 justify-items-center" style={{ boxShadow: '2px 4px 6px #e0e0e0' }}>
        {cargando ? (
          <div className="col-span-full flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#194566] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : animalesFiltrados.length === 0 && busqueda.trim() !== '' ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-[#194566] font-semibold text-lg">No se encontró ningún paciente</p>
            <p className="text-gray-400 text-sm">Intenta buscar por otro nombre</p>
          </div>
        ) : (
          animalesFiltrados.map(animal => {
            const movimientosAnimal = movimientos.filter(m => m.animal_id === animal.id_animal);
            const tipoHuella = getTipoHuella(movimientosAnimal);
            return (
              <ExpedienteCard
                key={animal.id_animal}
                nombre={animal.nombre}
                raza={animal.raza}
                imagen={animal.imagen}
                tipoHuella={tipoHuella}
                canDelete={!isColaborador}
                onClick={() => {
                  window.location.href = `/expediente/${animal.id_animal}`;
                }}
                onDelete={() => {
                  setDeleteId(animal.id_animal ?? null);
                  setShowDeleteModal(true);
                }}
              />
            );
          })
        )}

        {totalPaginas > 1 && busqueda.trim() === '' && (
          <div className="col-span-full flex items-center justify-center gap-4 pt-4 pb-2">
            <button
              onClick={() => setPaginaActual(p => p - 1)}
              disabled={paginaActual === 1 || cargando}
              className="px-4 py-2 rounded-full bg-[#194566] text-white disabled:opacity-40 hover:bg-[#153a52] transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-[#194566] font-medium text-sm">
              Página {paginaActual} de {totalPaginas}
              <span className="ml-2 text-gray-400">({totalAnimales} Animales)</span>
            </span>
            <button
              onClick={() => setPaginaActual(p => p + 1)}
              disabled={paginaActual === totalPaginas || cargando}
              className="px-4 py-2 rounded-full bg-[#194566] text-white disabled:opacity-40 hover:bg-[#153a52] transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteModal(false); setDeleteId(null); }}
          message="¿Estás seguro de eliminar este expediente?"
        />
        <LogoutConfirmModal
          isOpen={showLogoutConfirm}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </div>
    </div>
  );
}