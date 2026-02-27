import React from 'react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message = '¿Estás seguro de eliminar este expediente?',
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      message={message}
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
