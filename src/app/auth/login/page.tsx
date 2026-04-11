'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth';
import type { LoginFormData } from '@/schemas/auth.schema';
import { AuthService } from '../../../services/auth.service';
import { use2FA } from '@/hooks/use2FA';

export default function LoginPage() {
  const router = useRouter();
  const { verifyTOTPAndLogin } = use2FA();
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await AuthService.login({
        email: data.email,
        contrasena: data.password,
      });

      if (response.requires2FA) {
        setUserId(response.userId ?? null);
        setStep('2fa');
      } else {
        router.push('/galeria');
      }

    } catch (error: unknown) {
      console.error('Error en el login:', error);
      const message = error instanceof Error ? error.message : 'Credenciales inválidas. Intenta de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (totpCode: string) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError('');
      const result = await verifyTOTPAndLogin(userId, totpCode);
      if (result) {
        AuthService.saveToken(result.access_token);
        router.push('/galeria');
      }
    } catch (error: unknown) {
      console.error('Error en la verificación 2FA:', error);
      const message = error instanceof Error ? error.message : 'Código inválido. Intenta de nuevo.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin} 
      onVerify2FA={handleVerify2FA} 
      step={step} 
      error={error} 
      isLoading={isLoading} 
    />
  );
}