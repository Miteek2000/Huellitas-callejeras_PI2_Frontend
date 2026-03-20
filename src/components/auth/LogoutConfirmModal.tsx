'use client';

import React from 'react';
import { ConfirmModal } from '@/components/ui';
import { AuthService } from '../../services/auth.service';

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
  const handleConfirm = () => {
    AuthService.logout();
    onConfirm();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      message="¿Deseas cerrar sesion?"
      confirmLabel="aceptar"
      cancelLabel="cancelar"
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
};