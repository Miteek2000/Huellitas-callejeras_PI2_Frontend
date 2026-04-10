import { useState } from 'react';
import { apiFetch } from '../app/lib/interceptors';
import { ENDPOINTS } from '../app/lib/endpoints';
import { AuthService } from '../services/auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL}/api/v1`;

interface Setup2FAResponse {
  secret: string;
  qrCodeUrl: string;
  message: string;
}

interface Status2FAResponse {
  id_usuario: string;
  email: string;
  twoFactorEnabled: boolean;
}

interface LoginResponse {
  user: any;
  access_token: string;
}

export const use2FA = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * GET /auth/me/2fa
   * Obtiene el estado actual de 2FA
   */
  const getStatus = async (): Promise<Status2FAResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<Status2FAResponse>(`${BASE_URL}/auth/me/2fa`, {
        method: 'GET'
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener estado';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * POST /auth/me/2fa
   * PASO 1: Genera secret TOTP y código QR
   */
  const generateQR = async (): Promise<Setup2FAResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<Setup2FAResponse>(`${BASE_URL}/auth/me/2fa`, {
        method: 'POST'
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar QR';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /auth/me/2fa
   * PASO 2: Activa 2FA después de validar el código
   */
  const enableTwoFactor = async (
    totpCode: string,
    secret: string
  ): Promise<Status2FAResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<Status2FAResponse>(`${BASE_URL}/auth/me/2fa`, {
        method: 'PUT',
        body: JSON.stringify({ token: totpCode, secret, enabled: true })
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al activar 2FA';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /auth/me/2fa con enabled=false
   * Desactiva 2FA
   */
  const disableTwoFactor = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch<Status2FAResponse>(`${BASE_URL}/auth/me/2fa`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: false })
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al desactivar 2FA';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * POST /auth/2fa/verify
   * Verifica TOTP después de POST /auth/login
   */
  const verifyTOTPAndLogin = async (
    userId: string,
    totpCode: string
  ): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<LoginResponse>(`${BASE_URL}/auth/2fa/verify`, {
        method: 'POST',
        body: JSON.stringify({ userId, token: totpCode })
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Código TOTP inválido';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQR,
    enableTwoFactor,
    disableTwoFactor,
    verifyTOTPAndLogin,
    getStatus,
    loading,
    error,
    setError,
  };
};