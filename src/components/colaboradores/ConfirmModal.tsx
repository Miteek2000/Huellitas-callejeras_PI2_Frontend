import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 text-center">
        <p className="text-gray-800 mb-6 text-sm">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#9F9F9F] text-white text-sm hover:bg-[#888888] transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-[#2B264F] text-white text-sm hover:bg-[#1F1B3D] transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
