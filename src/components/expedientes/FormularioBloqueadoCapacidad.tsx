'use client';

import React from 'react';
import { ExpedienteForm } from './ExpedienteForm';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';

interface FormularioBloqueadoCapacidadProps {
  capacidadAlcanzada: boolean;
  onOpenHistorial?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (
    animal: Animal,
    fotosNuevas?: File[],
    movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>
  ) => Promise<void>;
  onSaveSuccess?: () => void;
  onDeleteImagen?: (imagenId: string) => Promise<void>;
  initialData?: Partial<Animal>;
  cancelMessage?: string;
  onCancelConfirmed?: () => void;
}

export const FormularioBloqueadoCapacidad: React.FC<FormularioBloqueadoCapacidadProps> = ({
  capacidadAlcanzada,
  onOpenHistorial,
  onSaveMovimiento,
  onSaveAnimal,
  onSaveSuccess,
  onDeleteImagen,
  initialData,
  cancelMessage,
  onCancelConfirmed,
}) => {
  return (
    <div>
      <ExpedienteForm
        onOpenHistorial={onOpenHistorial}
        onSaveMovimiento={onSaveMovimiento}
        onSaveAnimal={onSaveAnimal}
        onSaveSuccess={onSaveSuccess}
        onDeleteImagen={onDeleteImagen}
        initialData={initialData}
        readOnly={capacidadAlcanzada}
        cancelMessage={cancelMessage}
        onCancelConfirmed={onCancelConfirmed}
      />
    </div>
  );
};
