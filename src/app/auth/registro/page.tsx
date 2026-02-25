'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth';
import type { RegisterFormData, RegistroCompletoData } from '@/schemas/auth.schema';
import { AuthService } from '@/app/services/auth.service';

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');

      if (data.contrasena !== data.confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }

      const parseNumero = (valor: string): number | undefined => {
        if (!valor || valor.toUpperCase() === 'S/N') return undefined;
        const num = parseInt(valor);
        return isNaN(num) ? undefined : num;
      };

      const registroData: RegistroCompletoData = {
        refugio: {
          nombre: data.nombreRefugio,
          capacidad_max: data.capacidad,
          estado: data.estado,
          municipio: data.municipio,
          colonia: data.colonia,
          calle: data.calle,
          num_exterior: parseNumero(data.numeroExterior),
          num_interior: parseNumero(data.numeroInterior),
        },
        usuario: {
          nombre: data.nombres,
          apellido_p: data.apellidoPaterno,
          apellido_m: data.apellidoMaterno,
          email: data.email,
          contrasena: data.contrasena,
        },
      };

      const response = await AuthService.registroCompleto(registroData);
      
      console.log('Registro exitoso:', response);
      
      router.push('/expediente/nuevo');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      setError(error.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegisterForm onSubmit={handleRegister} />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}
