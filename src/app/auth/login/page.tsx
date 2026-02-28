'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth';
import type { LoginFormData } from '@/schemas/auth.schema';
import { AuthService } from '@/app/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError('');
      await AuthService.login({
        email: data.email,
        contrasena: data.password,
      });

      router.push('/galeria');

    } catch (error: unknown) {
      console.error('Error en el login:', error);
      const message = error instanceof Error ? error.message : 'Credenciales inválidas. Intenta de nuevo.';
      setError(message);
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} error={error} />
  );
}