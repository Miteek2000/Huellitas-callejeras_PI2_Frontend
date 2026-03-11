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
      const registroData: RegistroCompletoData = {
        refugio: {
          nombre: data.nombreRefugio,
          capacidad_max: Number(data.capacidad),
          estado: data.estado,
          municipio: data.municipio,
          colonia: data.colonia,
          calle: data.calle,
          num_exterior: data.numeroExterior ? Number(data.numeroExterior) : undefined,
          num_interior: data.numeroInterior ? Number(data.numeroInterior) : undefined,
        },
        usuario: {
          nombre: data.nombres,
          apellido_p: data.apellidoPaterno,
          apellido_m: data.apellidoMaterno,
          email: data.email,
          contrasena: data.contrasena,
          acepta_terminos: data.acepta_terminos,
        },
      };

      await AuthService.registroCompleto(registroData);
      router.push('/galeria');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al registrar. Intenta de nuevo.';
      setError(message);
    }
  };

  return (
    <RegisterForm onSubmit={handleRegister} error={error} />
  );
}