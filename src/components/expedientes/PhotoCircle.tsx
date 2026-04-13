import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/app/lib/endpoints';

const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

interface PhotoCircleProps {
  imagenActivaSrc: string | null;
  hasError: boolean;
  onClickPhoto: () => void;
  readOnly: boolean;
  todasParaCarrusel: Array<any>;
  imagenActiva: number;
  setImagenActiva: (index: number) => void;
  irAnterior: (e: React.MouseEvent) => void;
  irSiguiente: (e: React.MouseEvent) => void;
}

export const PhotoCircle: React.FC<PhotoCircleProps> = ({
  imagenActivaSrc,
  hasError,
  onClickPhoto,
  readOnly,
  todasParaCarrusel,
  imagenActiva,
  setImagenActiva,
  irAnterior,
  irSiguiente,
}) => {
  return (
    <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex-shrink-0">
      <div className="absolute inset-0 bg-[#5F7A91] rounded-full" />
      <div className="absolute inset-2 bg-white rounded-full" />

      <div
        className={`absolute inset-4 bg-[#2B5278] rounded-full overflow-hidden flex items-center justify-center group ${
          hasError ? 'ring-2 ring-red-500' : ''
        } ${!readOnly ? 'cursor-pointer' : ''}`}
        onClick={!readOnly ? onClickPhoto : undefined}
      >
        {imagenActivaSrc ? (
          <>
            <img src={imagenActivaSrc} alt="Foto del paciente" className="w-full h-full object-cover" />
            {!readOnly && (
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center rounded-full">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                  <Image
                    src="/imagenes/agregarImagen.svg"
                    alt="Agregar foto"
                    width={80}
                    height={80}
                    className="brightness-0"
                    style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(50%) saturate(800%) hue-rotate(185deg) brightness(90%)' }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} />
        )}
      </div>

      {todasParaCarrusel.length > 1 && (
        <>
          <button
            type="button"
            onClick={irAnterior}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow z-10 text-lg leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={irSiguiente}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow z-10 text-lg leading-none"
          >
            ›
          </button>
        </>
      )}

      {todasParaCarrusel.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
          {todasParaCarrusel.map((_, i) => (
            <span
              key={i}
              onClick={() => setImagenActiva(i)}
              className={`block w-2 h-2 rounded-full cursor-pointer transition-colors ${
                i === imagenActiva ? 'bg-[#194566]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
