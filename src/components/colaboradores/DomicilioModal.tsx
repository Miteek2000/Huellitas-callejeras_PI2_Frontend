'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui';
import type { Refugio } from '@/app/services/refugios.service';

interface DomicilioModalProps {
  refugio?: Refugio | null;
  onClose: () => void;
  onSave: (data: Partial<Refugio>) => void;
}

const DomicilioModal: React.FC<DomicilioModalProps> = ({ refugio, onClose, onSave }) => {
  const [form, setForm] = useState({
    estado: refugio?.estado || '',
    municipio: refugio?.municipio || '',
    colonia: refugio?.colonia || '',
    calle: refugio?.calle || '',
    num_interior: refugio?.num_interior ?? '',
    num_exterior: refugio?.num_exterior ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      estado: form.estado,
      municipio: form.municipio,
      colonia: form.colonia,
      calle: form.calle,
      num_interior: form.num_interior !== '' ? Number(form.num_interior) : undefined,
      num_exterior: form.num_exterior !== '' ? Number(form.num_exterior) : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div
        className="bg-[#C8D1D7] rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#194566] text-white px-6 py-4 relative">
          <h2 className="text-lg font-semibold text-center">Editar domicilio</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-1">
            <Input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="municipio" value={form.municipio} onChange={handleChange} placeholder="Municipio" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="colonia" value={form.colonia} onChange={handleChange} placeholder="Colonia" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="calle" value={form.calle} onChange={handleChange} placeholder="Calle" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="num_interior" type="number" value={form.num_interior} onChange={handleChange} placeholder="Número interior" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" />
            <Input name="num_exterior" type="number" value={form.num_exterior} onChange={handleChange} placeholder="Número exterior" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" />
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

export default DomicilioModal;
