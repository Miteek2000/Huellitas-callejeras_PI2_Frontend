'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth';

export default function RegistroPage() {
  const router = useRouter();

  const handleRegister = async (data: any) => {
    try {
      console.log('Datos de registro:', data);
      // Aquí irá la lógica de registro con el backend
      // await AuthService.register(data);
      
      // TODO: Redirigir al dashboard después del registro exitoso
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
}
