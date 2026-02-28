import React, { useState } from 'react';

interface ColaboradorModalProps {
  colaborador?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ColaboradorModal: React.FC<ColaboradorModalProps> = ({ colaborador, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: colaborador?.nombre || '',
    apellidoPaterno: colaborador?.apellidoPaterno || '',
    apellidoMaterno: colaborador?.apellidoMaterno || '',
    email: colaborador?.email || '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.contrasena !== form.confirmarContrasena) return alert('Las contraseñas no coinciden');
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg p-8 w-[400px] relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✖</button>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          {colaborador ? 'Editar usuario' : 'Agregar usuario'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 rounded" required />
          <input name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" className="p-2 rounded" required />
          <input name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" className="p-2 rounded" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email" className="p-2 rounded" required />
          <input name="contrasena" type="password" value={form.contrasena} onChange={handleChange} placeholder="Contraseña" className="p-2 rounded" required />
          <input name="confirmarContrasena" type="password" value={form.confirmarContrasena} onChange={handleChange} placeholder="Confirmar contraseña" className="p-2 rounded" required />
          <button type="submit" className="bg-indigo-900 text-white py-2 rounded-full font-semibold mt-2">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default ColaboradorModal;
