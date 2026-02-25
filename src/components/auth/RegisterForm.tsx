'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui';
import type { RegisterFormData } from '@/schemas/auth.schema';

export const RegisterForm: React.FC<{ onSubmit?: (data: RegisterFormData) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreRefugio: '',
    capacidad: '',
    estado: '',
    municipio: '',
    colonia: '',
    calle: '',
    numeroInterior: '',
    numeroExterior: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showErrors, setShowErrors] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const requiredFields = [
    'nombreRefugio', 'capacidad', 'estado', 'municipio', 'colonia', 'calle',
    'nombres', 'apellidoPaterno', 'apellidoMaterno', 'email', 'contrasena', 'confirmarContrasena'
  ];

  const getError = (name: string) => {
    if (!showErrors && !touched[name]) return '';
    if (requiredFields.includes(name) && !formData[name as keyof typeof formData]) return 'Este campo es obligatorio';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    const hasEmpty = requiredFields.some((field) => !formData[field as keyof typeof formData]);
    if (hasEmpty) return;
    const dataToSubmit: RegisterFormData = {
      nombreRefugio: formData.nombreRefugio,
      capacidad: Number(formData.capacidad) || 0,
      estado: formData.estado,
      municipio: formData.municipio,
      colonia: formData.colonia,
      calle: formData.calle,
      numeroInterior: formData.numeroInterior !== '' ? Number(formData.numeroInterior) : 0,
      numeroExterior: formData.numeroExterior !== '' ? Number(formData.numeroExterior) : 0,
      nombres: formData.nombres,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      email: formData.email,
      contrasena: formData.contrasena,
      confirmarContrasena: formData.confirmarContrasena,
    };
    onSubmit?.(dataToSubmit);
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
            Darse de alta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="nombreRefugio"
              value={formData.nombreRefugio}
              onChange={handleInputChange}
              placeholder="Nombre del refugio"
              className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
              error={getError('nombreRefugio')}
            />
            
            <Input
              name="capacidad"
              type="number"
              value={formData.capacidad}
              onChange={handleInputChange}
              placeholder="Capacidad"
              className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
              error={getError('capacidad')}
            />

            <div className="pt-2">
              <p className="text-sm font-medium text-[#606060] mb-3">
                Dirección del refugio
              </p>
              
              <div className="space-y-4">
                <Input
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Estado"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('estado')}
                />
                
                <Input
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleInputChange}
                  placeholder="Municipio"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('municipio')}
                />
                
                <Input
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleInputChange}
                  placeholder="Colonia"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('colonia')}
                />
                
                <Input
                  name="calle"
                  value={formData.calle}
                  onChange={handleInputChange}
                  placeholder="Calle"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('calle')}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="numeroInterior"
                    type="number"
                    value={formData.numeroInterior}
                    onChange={handleInputChange}
                    placeholder="Número interior"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={getError('numeroInterior')}
                  />
                  
                  <Input
                    name="numeroExterior"
                    type="number"
                    value={formData.numeroExterior}
                    onChange={handleInputChange}
                    placeholder="Número exterior"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                    error={getError('numeroExterior')}
                  />
                </div>
              </div>
            </div>


            <div className="pt-2">
              <p className="text-sm font-medium text-[#606060] mb-3">
                Administrador de refugio
              </p>
              
              <div className="space-y-4">
                <Input
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  placeholder="Nombres"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('nombres')}
                />
                
                <Input
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Paterno"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('apellidoPaterno')}
                />
                
                <Input
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Materno"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('apellidoMaterno')}
                />
                
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('email')}
                />
                
                <Input
                  name="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('contrasena')}
                />
              </div>
            </div>

                <Input
                  name="confirmarContrasena"
                  type="password"
                  value={formData.confirmarContrasena}
                  onChange={handleInputChange}
                  placeholder="Confirmar contraseña"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  error={getError('confirmarContrasena')}
                />


            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#2B264F] text-white py-2 rounded-3xl text-lg font-semibold hover:bg-[#1F1B3D] transition-colors"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
