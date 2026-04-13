'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { use2FA } from '@/hooks/use2FA';

interface Enable2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEnabling: boolean;
}

export default function Enable2FAModal({
  isOpen,
  onClose,
  onSuccess,
  isEnabling,
}: Enable2FAModalProps) {
  const { generateQR, enableTwoFactor, disableTwoFactor, loading, error, setError } = use2FA();
  const [step, setStep] = useState<'confirm' | 'setup' | 'verify'>('confirm');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setTotpCode('');
      setError(null);
    }
  }, [isOpen, setError]);

  const handleConfirm = async () => {
    if (isEnabling) {
      const result = await generateQR();
      if (result) {
        setQrCode(result.qrCodeUrl);
        setSecret(result.secret);
        setStep('setup');
      }
    } else {
      const success = await disableTwoFactor();
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  const handleVerify = async () => {
    if (!secret) return;

    const result = await enableTwoFactor(totpCode, secret);
    if (result) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-[#182F51] text-center">
          {isEnabling ? 'Activar Autenticación 2FA' : 'Desactivar Autenticación 2FA'}
        </h2>

        {step === 'confirm' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              {isEnabling
                ? '¿Estás seguro que deseas activar la autenticación de dos factores? Esto añadirá una capa extra de seguridad a tu cuenta.'
                : '¿Estás seguro que deseas desactivar la autenticación de dos factores? Tu cuenta será menos segura.'}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 font-medium transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-[#182F51] text-white py-2 rounded-full hover:bg-[#0f1d35] font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center text-sm">
              Escanea este código QR con tu app autenticadora (Google Authenticator, Authy, etc)
            </p>

            {qrCode && (
              <div className="flex justify-center p-4">
                <div className="bg-white p-2 rounded-lg border-2 border-gray-200 inline-block">
                <Image
                  src={qrCode}
                  alt="QR Code para 2FA"
                  width={200}
                  height={200}
                  priority
                />
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <p className="text-xs font-semibold text-yellow-800 mb-1">Secret backup:</p>
              <code className="text-xs bg-yellow-100 p-2 rounded block break-all text-center font-mono">
                {secret}
              </code>
              <p className="text-[10px] text-yellow-700 mt-2">
                💾 Guarda este código en un lugar seguro por si pierdes acceso a tu dispositivo.
              </p>
            </div>

            <button
              onClick={() => setStep('verify')}
              disabled={loading}
              className="w-full bg-[#182F51] text-white py-2 mt-4 rounded-full font-medium hover:bg-[#0f1d35] disabled:opacity-50 transition-colors"
            >
              Ya escaneé el código
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center text-sm">
              Ingresa el código de 6 dígitos generado por tu app autenticadora
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-3 text-center text-3xl tracking-[0.5em] font-mono focus:border-[#182F51] focus:ring-0 outline-none"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setStep('setup');
                  setTotpCode('');
                  setError(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 font-medium transition-colors"
                disabled={loading}
              >
                Atrás
              </button>
              <button
                onClick={handleVerify}
                disabled={loading || totpCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Activar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}