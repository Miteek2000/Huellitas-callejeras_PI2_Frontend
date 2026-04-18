'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui';
import { registroSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { USER_TEXT_ALLOWED_CHAR_REGEX } from '@/schemas/inputSchema';
import { TermsModal } from './TermsModal';

export const RegisterForm: React.FC<{
  onSubmit?: (data: RegisterFormData) => void;
  error?: string;
}> = ({ onSubmit, error }) => {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      acepta_terminos: false,
    },
  });

  const contrasena = watch('contrasena');

  const onFormSubmit = (data: RegisterFormData) => {
    setPendingData(data);
    setShowTermsModal(true);
  };

  const handleTermsConfirm = () => {
    if (pendingData) {
      onSubmit?.({ ...pendingData, acepta_terminos: true });
    }
    setShowTermsModal(false);
  };

  return (
    <>
      {showTermsModal && (
        <TermsModal onConfirm={handleTermsConfirm} onClose={() => setShowTermsModal(false)} />
      )}

      <div className="min-h-screen w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: 'url(/imagenes/Fondo-inicio-sesion.png)',
            backgroundSize: 'auto',
          }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
          <div className="bg-[#E8E8E8] rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h1 className="text-3xl font-bold text-[#182F51] text-center mb-8">
              Darse de alta
            </h1>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <Input
                {...register('nombreRefugio')}
                placeholder="Nombre del refugio"
                className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                error={errors.nombreRefugio?.message}
                allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
              />

              <Input
                {...register('capacidad')}
                type="number"
                placeholder="Capacidad"
                className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                error={errors.capacidad?.message}
              />

              <div className="pt-2">
                <p className="text-sm font-medium text-[#606060] mb-3">Dirección del refugio</p>
                <div className="space-y-4">
                  <Input
                    {...register('estado')}
                    placeholder="Estado"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.estado?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('municipio')}
                    placeholder="Municipio"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.municipio?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('colonia')}
                    placeholder="Colonia"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.colonia?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('calle')}
                    placeholder="Calle"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.calle?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...register('numeroInterior')}
                      type="number"
                      placeholder="Número interior"
                      className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                      error={errors.numeroInterior?.message}
                    />
                    <Input
                      {...register('numeroExterior')}
                      type="number"
                      placeholder="Número exterior"
                      className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                      error={errors.numeroExterior?.message}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium text-[#606060] mb-3">Administrador de refugio</p>
                <div className="space-y-4">
                  <Input
                    {...register('nombres')}
                    placeholder="Nombres"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.nombres?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('apellidoPaterno')}
                    placeholder="Apellido Paterno"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.apellidoPaterno?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('apellidoMaterno')}
                    placeholder="Apellido Materno"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.apellidoMaterno?.message}
                    allowedPattern={USER_TEXT_ALLOWED_CHAR_REGEX}
                  />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={errors.email?.message}
                  />
                  <div>
                    <Input
                      {...register('contrasena')}
                      type="password"
                      placeholder="Contraseña"
                      className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                      error={errors.contrasena?.message}
                    />
                    {contrasena && (
                      <ul className="mt-1 space-y-1">
                        {[
                          { check: contrasena.length >= 8, label: 'Mínimo 8 caracteres' },
                          { check: /[A-Z]/.test(contrasena), label: 'Una letra mayúscula' },
                          { check: /[a-z]/.test(contrasena), label: 'Una letra minúscula' },
                          { check: /[0-9]/.test(contrasena), label: 'Un número' },
                          { check: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(contrasena), label: 'Un carácter especial' },
                        ].map(({ check, label }) => (
                          <li key={label} className={`text-xs flex items-center gap-1 ${check ? 'text-green-600' : 'text-red-500'}`}>
                            <span>{check ? '✓' : '✗'}</span>
                            {label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <Input
                {...register('confirmarContrasena')}
                type="password"
                placeholder="Confirmar contraseña"
                className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                error={errors.confirmarContrasena?.message}
              />

              {error && (
                <div className="text-red-700 px-4 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#2B264F] text-white py-2 rounded-3xl text-lg font-semibold hover:bg-[#1F1B3D] transition-colors"
                >
                  Registrarse
                </button>
              </div>

              <p className="text-center text-sm text-[#182F51] pt-2">
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="font-bold hover:underline transition-colors"
                >
                  Inicia sesión
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};