'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui';
import type { LoginFormData } from '@/schemas/auth.schema';

export const LoginForm: React.FC<{ onSubmit?: (data: LoginFormData) => void; error?: string }> = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
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
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingrese su usuario"
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

            {error && (
              <div className=" text-red-700 px-4 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#2B264F] text-white py-2 rounded-full text-lg font-medium hover:bg-[#1F1B3D] transition-colors"
              >
                Iniciar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};