import React, { useState } from 'react';
import { Input } from '@/components/ui';
import type { Rol } from '@/app/services/roles.service';
import type { Usuario } from '@/schemas/auth.schema';

interface ColaboradorModalProps {
  colaborador?: Usuario | null;
  roles: Rol[];
  esPropietario?: boolean;
  onClose: () => void;
  onSave: (data: Omit<Usuario, 'id_usuario'> & { confirmarContrasena: string }) => void;
}

const ColaboradorModal: React.FC<ColaboradorModalProps> = ({ colaborador, roles = [], esPropietario, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: colaborador?.nombre || '',
    apellidoPaterno: colaborador?.apellido_p || colaborador?.apellido_p || '',
    apellidoMaterno: colaborador?.apellido_m || colaborador?.apellido_m|| '',
    email: colaborador?.email || '',
    contrasena: '',
    confirmarContrasena: '',
    rol_id: colaborador?.rol_id || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.contrasena || form.confirmarContrasena) {
      if (form.contrasena !== form.confirmarContrasena) return alert('Las contraseñas no coinciden');
    }
    onSave({
      nombre: form.nombre,
      apellido_p: form.apellidoPaterno,
      apellido_m: form.apellidoMaterno,
      email: form.email,
      contrasena: form.contrasena,
      confirmarContrasena: form.confirmarContrasena,
      rol_id: form.rol_id,
      activo: true,
      refugio_id: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>

      <div
        className="bg-[#C8D1D7] rounded-lg shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}>

        <div className="bg-[#194566] text-white px-6 py-4 relative">
          <h2 className="text-lg font-semibold text-center">
            {esPropietario ? 'Editar propietario' : colaborador ? 'Editar colaborador' : 'Agregar colaborador'}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-1">
            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required />
            <Input name="contrasena" type="password" value={form.contrasena} onChange={handleChange} placeholder={colaborador ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"} className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required={!colaborador}/>
            <Input name="confirmarContrasena" type="password" value={form.confirmarContrasena} onChange={handleChange} placeholder={colaborador ? "Confirmar nueva contraseña" : "Confirmar contraseña"} className="bg-[#FFFFFF] border-none placeholder:text-gray-500" required={!colaborador}/>

            <div className="mb-4">
              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF] border-none text-black focus:outline-none focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20"
              >
                <option value="" disabled>Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_roles} value={rol.id_roles}>{rol.nombre}</option>
                ))}
              </select>
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

export default ColaboradorModal;
