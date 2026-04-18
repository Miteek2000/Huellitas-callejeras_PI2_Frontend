'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui';
import type { Refugio } from '../../services/refugios.service';
import { generalTextSchema } from '@/schemas/inputSchema';

interface DomicilioModalProps {
  refugio?: Refugio | null;
  onClose: () => void;
  onSave: (data: Partial<Refugio>) => void;
}

const domicilioSchema = z.object({
  estado: generalTextSchema.min(1, 'El estado es obligatorio'),
  municipio: generalTextSchema.min(1, 'El municipio es obligatorio'),
  colonia: generalTextSchema.min(1, 'La colonia es obligatoria'),
  calle: generalTextSchema.min(1, 'La calle es obligatoria'),
  num_interior: generalTextSchema.optional(),
  num_exterior: generalTextSchema.optional(),
});

type DomicilioFormData = z.infer<typeof domicilioSchema>;

const DomicilioModal: React.FC<DomicilioModalProps> = ({ refugio, onClose, onSave }) => {
  const [form, setForm] = useState({
    estado: refugio?.estado || '',
    municipio: refugio?.municipio || '',
    colonia: refugio?.colonia || '',
    calle: refugio?.calle || '',
    num_interior: refugio?.num_interior ?? '',
    num_exterior: refugio?.num_exterior ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof DomicilioFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name as keyof DomicilioFormData]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = domicilioSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof DomicilioFormData, string>> = {};
      for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
        if (messages?.length) {
          nextErrors[key as keyof DomicilioFormData] = messages[0];
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    const data = result.data;
    onSave({
      estado: data.estado,
      municipio: data.municipio,
      colonia: data.colonia,
      calle: data.calle,
      num_interior: data.num_interior ? Number(data.num_interior) : undefined,
      num_exterior: data.num_exterior ? Number(data.num_exterior) : undefined,
    });
    setFieldErrors({});
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
            <Input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.estado} required />
            <Input name="municipio" value={form.municipio} onChange={handleChange} placeholder="Municipio" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.municipio} required />
            <Input name="colonia" value={form.colonia} onChange={handleChange} placeholder="Colonia" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.colonia} required />
            <Input name="calle" value={form.calle} onChange={handleChange} placeholder="Calle" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.calle} required />
            <Input name="num_interior" type="number" value={form.num_interior} onChange={handleChange} placeholder="Número interior" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.num_interior} />
            <Input name="num_exterior" type="number" value={form.num_exterior} onChange={handleChange} placeholder="Número exterior" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" error={fieldErrors.num_exterior} />
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
