import React, { useState } from 'react';

interface RolModalProps {
  onClose: () => void;
  onSave: (data: { nombre: string }) => void;
}

const RolModal: React.FC<RolModalProps> = ({ onClose, onSave }) => {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nombre });
    setNombre('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div
        className="bg-[#C8D1D7] rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#194566] text-white px-6 py-4 rounded-t-lg relative">
          <h2 className="text-lg font-semibold text-center">Agregar Rol</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#194566]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#194566] text-white py-2 rounded-3xl font-semibold hover:bg-[#15374f] transition-colors mt-2"
            >
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RolModal;
