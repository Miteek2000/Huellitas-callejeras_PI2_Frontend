import React from 'react';

interface SpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  message = 'Cargando...',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? 'min-h-screen bg-[#F1F1F1]' : 'py-12'
      }`}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#E8E8E8]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#194566] animate-spin" />
      </div>
      {message && (
        <p className="text-[#194566] font-medium text-sm tracking-wide">{message}</p>
      )}
    </div>
  );
};
