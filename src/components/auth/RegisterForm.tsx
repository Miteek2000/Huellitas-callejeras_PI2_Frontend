'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui';

interface RegisterFormData {
  nombreRefugio: string;
  capacidad: string;
  estado: string;
  municipio: string;
  colonia: string;
  calle: string;
  numeroInterior: string;
  numeroExterior: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  contrasena: string;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
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
          backgroundImage: 'url(/imagenes/fondo.png)',
          backgroundSize: '400px 400px',
        }}
      />
      
      {/* Aqui inicia el formulario pa que no se me olvide  */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-[#2B4F5F] text-center mb-8">
            Darse de alta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="nombreRefugio"
              value={formData.nombreRefugio}
              onChange={handleInputChange}
              placeholder="Nombre del refugio"
              className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
            />
            
            <Input
              name="capacidad"
              type="number"
              value={formData.capacidad}
              onChange={handleInputChange}
              placeholder="Capacidad"
              className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
            />

            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Dirección del refugio
              </p>
              
              <div className="space-y-4">
                <Input
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Estado"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleInputChange}
                  placeholder="Municipio"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleInputChange}
                  placeholder="Colonia"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="calle1"
                  value={formData.calle}
                  onChange={handleInputChange}
                  placeholder="Calle"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="numeroInterior"
                    value={formData.numeroInterior}
                    onChange={handleInputChange}
                    placeholder="Número interior"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  />
                  
                  <Input
                    name="numeroExterior"
                    value={formData.numeroExterior}
                    onChange={handleInputChange}
                    placeholder="Número exterior"
                    className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>


            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Administrador de refugio
              </p>
              
              <div className="space-y-4">
                <Input
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  placeholder="Nombres"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Paterno"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido Materno"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
                
                <Input
                  name="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  className="bg-[#D9D9D9] border-none placeholder:text-gray-500"
                />
              </div>
            </div>


            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#2B264F] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#1F1B3D] transition-colors"
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
