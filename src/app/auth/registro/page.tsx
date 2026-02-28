'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth';
import type { RegisterFormData, RegistroCompletoData } from '@/schemas/auth.schema';
import { AuthService } from '@/app/services/auth.service';

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleRegister = async (data: RegisterFormData) => {
    try {
      if (data.contrasena !== data.confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }

      const registroData: RegistroCompletoData = {
        refugio: {
          nombre: data.nombreRefugio,
          capacidad_max: data.capacidad,
          estado: data.estado,
          municipio: data.municipio,
          colonia: data.colonia,
          calle: data.calle,
          num_exterior: data.numeroExterior,
          num_interior: data.numeroInterior,
        },
        usuario: {
          nombre: data.nombres,
          apellido_p: data.apellidoPaterno,
          apellido_m: data.apellidoMaterno,
          email: data.email,
          contrasena: data.contrasena,
        },
      };

      await AuthService.registroCompleto(registroData);
      router.push('/galeria');

    } catch (error: unknown) {
      console.error('Error en el registro:', error);
      const message = error instanceof Error ? error.message : 'Error al registrar. Intenta de nuevo.';
      setError(message);
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