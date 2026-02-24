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
      
      // Redirigir al login después del registro exitoso
      // router.push('/auth/login');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
}
