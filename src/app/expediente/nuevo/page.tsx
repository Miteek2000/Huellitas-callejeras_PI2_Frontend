'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExpedienteForm, HistorialMovimientosModal, CapacidadAlertaBox } from '@/components/expedientes';
import { ConfirmModal } from '@/components/ui';
import type { Movimiento } from '@/schemas/movimiento.schema';
import type { Animal } from '@/schemas/animal.schema';
import { AnimalsService } from '../../../services/animals.service';
import { MovementsService } from '../../../services/movements.service';
import { StatisticsService } from '../../../services/statistics.service';
import { RefugiosService } from '../../../services/refugios.service';
import { getRefugioId, getUsuarioId, getUserRole, ROLES } from '@/app/lib/auth';
import Image from 'next/image';

export default function ExpedientePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [animalCreadoId, setAnimalCreadoId] = useState<string | null>(null);
  const [espaciosEnUso, setEspaciosEnUso] = useState<number>(0);
  const [capacidadMax, setCapacidadMax] = useState<number>(0);
  const [limitAlcanzado, setLimitAlcanzado] = useState(false);
  const [loading, setLoading] = useState(true);

  if (typeof window !== 'undefined' && getUserRole() === ROLES.COLABORADOR) {
    router.replace('/galeria');
  }

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const refugioId = getRefugioId();
        if (!refugioId) {
          router.push('/auth/login');
          return;
        }

        const [refugioData, animalesData] = await Promise.all([
          RefugiosService.getById(refugioId).catch(() => null),
          StatisticsService.getAnimalesActivos(refugioId).catch(() => null),
        ]);

        if (refugioData) {
          setCapacidadMax(refugioData.capacidad_max);
        }

        if (animalesData) {
          const totalActivos = (animalesData as any)?.total_activos ?? 0;
          setEspaciosEnUso(totalActivos);
          
          if (refugioData && totalActivos >= refugioData.capacidad_max) {
            setLimitAlcanzado(true);
          }
        }
      } catch (error) {
        console.error('Error cargando datos de capacidad:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [router]);

  const handleSaveAnimal = async (
    data: Animal,
    fotosNuevas?: File[],
    movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>,
  ) => {
    const refugioId = getRefugioId();
    const usuarioId = getUsuarioId();

    if (!refugioId || !usuarioId) {
      router.push('/auth/login');
      return;
    }

    
    const form = new FormData();
    form.append('nombre', data.nombre);
    form.append('estado', data.estado);
    form.append('especie', data.especie);
    form.append('raza', data.raza);
    form.append('edad', String(data.edad));
    form.append('unidad_edad', data.unidad_edad ?? 'meses');
    form.append('peso', String(data.peso));
    form.append('sexo', data.sexo);
    form.append('tamano', data.tamano);
    form.append('lugar', data.lugar);
    form.append('descripcion', data.descripcion);
    form.append('es_agresivo', data.es_agresivo ? '1' : '0');
    form.append('enfermedad_no_tratable', data.enfermedad_no_tratable ? '1' : '0');
    form.append('discapacidad', data.discapacidad ? '1' : '0');
    form.append('refugio_id', refugioId);
    form.append('usuario_id', usuarioId);

    if (fotosNuevas && fotosNuevas.length > 0) {
      form.append('imagen', fotosNuevas[0]);
    }

    const animalCreado = movimiento
      ? await AnimalsService.createWithFormAndMovement(form, movimiento)
      : await AnimalsService.createWithForm(form);

    if (fotosNuevas && fotosNuevas.length > 1 && animalCreado.id_animal) {
      for (const foto of fotosNuevas.slice(1)) {
        const fotoForm = new FormData();
        fotoForm.append('imagen', foto);
        await AnimalsService.updateWithForm(animalCreado.id_animal, fotoForm);
      }
    }

    setAnimalCreadoId(animalCreado.id_animal ?? null);
  };

  const handleSaveSuccess = () => setShowSaveSuccess(true);

  const handleConfirmSuccess = () => {
    setShowSaveSuccess(false);
    if (animalCreadoId) router.push(`/expediente/${animalCreadoId}`);
  };

  const handleSaveMovimiento = (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => {
    setMovimientos(prev => [{ ...movimiento, animal_id: '' }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto mb-6 mt-6">
        <div className="w-full md:w-1/2 bg-[#E8E8E8] rounded-lg shadow-sm p-2 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <button onClick={() => router.back()} className="flex items-center hover:text-gray-900">
              <Image src="/imagenes/flecha.svg" alt="Volver" width={34} height={34} />
            </button>
            <span className="ml-2 text-[#182F51]">Expediente del paciente</span>
          </div>
          <button type="button" className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/edit.svg" alt="Editar" width={34} height={34} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {!loading && (
          <CapacidadAlertaBox
            espaciosEnUso={espaciosEnUso}
            capacidadMax={capacidadMax}
            limite_alcanzado={limitAlcanzado}
          />
        )}
      </div>

      <ExpedienteForm
        onOpenHistorial={() => setIsModalOpen(true)}
        onSaveMovimiento={handleSaveMovimiento}
        onSaveAnimal={handleSaveAnimal}
        onSaveSuccess={handleSaveSuccess}
        onCancelConfirmed={() => router.push('/galeria')}
      />

      <ConfirmModal
        isOpen={showSaveSuccess}
        message="Expediente guardado correctamente"
        confirmLabel="aceptar"
        onConfirm={handleConfirmSuccess}
      />

      <HistorialMovimientosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movimientos={movimientos}
        onMovimientosChange={setMovimientos}
      />
    </div>
  );
}