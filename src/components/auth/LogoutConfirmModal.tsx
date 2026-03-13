'use client';

import React from 'react';
import { ConfirmModal } from '@/components/ui';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      message="¿Deseas cerrar sesion?"
      confirmLabel="aceptar"
      cancelLabel="cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};