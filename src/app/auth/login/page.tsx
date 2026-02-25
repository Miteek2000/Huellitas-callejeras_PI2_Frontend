'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: any) => {
    try {
      console.log('Datos de login:', data);
      // Aquí irá la lógica de login con el backend
      // await AuthService.login(data);
      
      // Redirigir al dashboard después del login exitoso
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error en el login:', error);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
