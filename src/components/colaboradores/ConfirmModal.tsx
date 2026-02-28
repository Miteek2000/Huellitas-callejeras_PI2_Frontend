import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg p-8 w-[350px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✖</button>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Confirmar acción</h2>
        <p className="mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-indigo-900 text-white px-6 py-2 rounded-full font-semibold" onClick={onConfirm}>Confirmar</button>
          <button className="bg-gray-400 text-white px-6 py-2 rounded-full font-semibold" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
