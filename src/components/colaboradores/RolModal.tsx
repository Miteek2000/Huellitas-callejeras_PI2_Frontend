import React, { useState } from 'react';

interface RolModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const RolModal: React.FC<RolModalProps> = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#C8D1D7] rounded-lg p-8 w-[350px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✖</button>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Roles</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="id" value={form.id} onChange={handleChange} placeholder="ID" className="p-2 rounded" required />
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 rounded" required />
          <button type="submit" className="bg-indigo-900 text-white py-2 rounded-full font-semibold mt-2">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default RolModal;
