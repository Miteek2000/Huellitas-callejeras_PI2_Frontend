import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui';
import type { Rol } from '../../services/roles.service';
import type { Usuario } from '@/schemas/auth.schema';
import {
  colaboradorCreateSchema,
  colaboradorEditSchema,
  propietarioEditSchema,
  type ColaboradorFormData,
} from '@/schemas/colaborador.schema';

interface ColaboradorModalProps {
  colaborador?: Usuario | null;
  roles: Rol[];
  esPropietario?: boolean;
  onClose: () => void;
  onSave: (data: Omit<Usuario, 'id_usuario'> & { confirmarContrasena: string }) => Promise<void>;
  error?: string;
}

const ColaboradorModal: React.FC<ColaboradorModalProps> = ({
  colaborador,
  roles = [],
  esPropietario,
  onClose,
  onSave,
  error,
}) => {
  const isEditMode = !!colaborador;

  const schema = esPropietario
    ? propietarioEditSchema
    : isEditMode
    ? colaboradorEditSchema
    : colaboradorCreateSchema;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ColaboradorFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: colaborador?.nombre ?? '',
      apellidoPaterno: colaborador?.apellido_p ?? '',
      apellidoMaterno: colaborador?.apellido_m ?? '',
      email: colaborador?.email ?? '',
      contrasena: '',
      confirmarContrasena: '',
      rol_id: colaborador?.rol_id ?? '',
    },
  });

  const contrasena = watch('contrasena');

  const onFormSubmit = async (data: ColaboradorFormData) => {
    try {
      await onSave({
        nombre: data.nombre,
        apellido_p: data.apellidoPaterno,
        apellido_m: data.apellidoMaterno,
        email: data.email,
        contrasena: data.contrasena ?? '',
        confirmarContrasena: data.confirmarContrasena ?? '',
        rol_id: esPropietario ? (colaborador?.rol_id ?? '') : (data.rol_id ?? ''),
        activo: true,
        refugio_id: '',
        aceptacion_term: true,
      });
    } catch {
    }
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
          <h2 className="text-lg font-semibold text-center">
            {esPropietario
              ? 'Editar propietario'
              : colaborador
              ? 'Editar colaborador'
              : 'Agregar colaborador'}
          </h2>
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
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-1">
            <Input
              {...register('nombre')}
              placeholder="Nombre"
              className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
              error={errors.nombre?.message}
            />
            <Input
              {...register('apellidoPaterno')}
              placeholder="Apellido Paterno"
              className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
              error={errors.apellidoPaterno?.message}
            />
            <Input
              {...register('apellidoMaterno')}
              placeholder="Apellido Materno"
              className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
              error={errors.apellidoMaterno?.message}
            />
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
              error={errors.email?.message}
            />

            <div>
              <Input
                {...register('contrasena')}
                type="password"
                placeholder={isEditMode ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
                error={errors.contrasena?.message}
              />
              {contrasena && contrasena.trim() !== '' && (
                <ul className="mt-1 space-y-1">
                  {[
                    { check: contrasena.length >= 8, label: 'Mínimo 8 caracteres' },
                    { check: /[A-Z]/.test(contrasena), label: 'Una letra mayúscula' },
                    { check: /[a-z]/.test(contrasena), label: 'Una letra minúscula' },
                    { check: /[0-9]/.test(contrasena), label: 'Un número' },
                    { check: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(contrasena), label: 'Un carácter especial (!@#$...)' },
                  ].map(({ check, label }) => (
                    <li key={label} className={`text-xs flex items-center gap-1 ${check ? 'text-green-600' : 'text-red-500'}`}>
                      <span>{check ? '✓' : '✗'}</span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Input
              {...register('confirmarContrasena')}
              type="password"
              placeholder={isEditMode ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
              className="bg-[#FFFFFF] border-none placeholder:text-gray-500"
              error={errors.confirmarContrasena?.message}
            />

            {!esPropietario && (
              <div className="mb-4">
                <select
                  {...register('rol_id')}
                  className="w-full px-4 py-2 rounded-lg bg-[#FFFFFF] border-none text-black focus:outline-none focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20"
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id_roles} value={rol.id_roles}>
                      {rol.nombre.toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.rol_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.rol_id.message}</p>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-300 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#194566] text-white py-2 rounded-3xl font-semibold hover:bg-[#15374f] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorModal;