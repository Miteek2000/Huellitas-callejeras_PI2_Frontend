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
    <>
      <LoginForm onSubmit={handleLogin} />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}