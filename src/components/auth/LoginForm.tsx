'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui';
import type { LoginFormData } from '@/schemas/auth.schema';

export const LoginForm: React.FC<{ 
  onSubmit?: (data: LoginFormData) => void;
  onVerify2FA?: (totpCode: string) => void;
  error?: string;
  step?: 'credentials' | '2fa';
  isLoading?: boolean;
}> = ({ onSubmit, onVerify2FA, error, step = 'credentials', isLoading }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [totpCode, setTotpCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'credentials') {
      onSubmit?.(formData);
    } else if (step === '2fa') {
      onVerify2FA?.(totpCode);
    }
  };

  return (
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
            Bienvenido
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'credentials' ? (
              <>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ingrese su email"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-600"
                />
                
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ingrese su contraseña"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-600"
                />
              </>
            ) : (
              <>
                <p className="text-center text-sm text-[#182F51] mb-2 font-medium">
                  Ingresa el código de 6 dígitos de tu app autenticadora
                </p>
                <div className="flex justify-center">
                  <Input
                    name="totpCode"
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    autoFocus
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-400 text-center text-3xl tracking-[0.5em] font-mono h-16 w-full max-w-xs"
                  />
                </div>
              </>
            )}

            {error && (
              <div className=" text-red-700 px-4 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || (step === '2fa' && totpCode.length !== 6)}
                className="w-full bg-[#2B264F] text-white py-3 border-none rounded-full text-lg font-medium hover:bg-[#1F1B3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cargando...' : step === 'credentials' ? 'Iniciar' : 'Verificar código'}
              </button>
            </div>

            {step === 'credentials' && (
              <p className="text-center text-sm text-[#182F51]">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/registro')}
                  className="font-bold hover:underline transition-colors"
                >
                  Regístrate
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};