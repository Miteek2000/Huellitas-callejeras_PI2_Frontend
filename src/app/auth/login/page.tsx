'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth';
import type { LoginFormData } from '@/schemas/auth.schema';
import { AuthService } from '@/app/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const loginData = {
        email: data.email,
        contrasena: data.password, 
      };


      const response = await AuthService.login(loginData);
      
      console.log('Login exitoso:', response);
      
      router.push('/expediente/nuevo');
    } catch (error: any) {
      console.error('Error en el login:', error);
      setError(error.response?.data?.message || 'Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
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
