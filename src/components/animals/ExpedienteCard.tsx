'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/app/lib/endpoints';
import type { AnimalImagen } from '@/schemas/animal.schema';

interface Props {
  nombre: string;
  raza: string;
  imagenes?: AnimalImagen[];
  tipoHuella: 'entrada' | 'salida' | null;
  onClick?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

const pawIcons = {
  entrada: '/imagenes/galeria/huellaEntrada.svg',
  salida: '/imagenes/galeria/huellaSalida.svg',
};

const fondoEliminar = '/imagenes/galeria/fondoEliminar.svg';
const iconoDelete = '/imagenes/galeria/Delete.png';
const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

export const ExpedienteCard: React.FC<Props> = ({
  nombre,
  raza,
  imagenes = [],
  tipoHuella,
  onClick,
  onDelete,
  canDelete = true,
}) => {
  const [imgIdx, setImgIdx] = useState(0);

  const hasImagenes = imagenes.length > 0;
  const currentSrc = hasImagenes
    ? (getImageUrl(imagenes[imgIdx].imagen) ?? DEFAULT_IMAGE)
    : DEFAULT_IMAGE;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + imagenes.length) % imagenes.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % imagenes.length);
  };

  return (
    <div
      className="relative bg-[#F3F3F3] shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow h-80 w-56"
      onClick={onClick}
    >
      <div className="relative w-full h-40 mb-2 overflow-hidden">
        <img
          src={currentSrc}
          alt={nombre}
          className="w-full h-full object-cover"
        />

        {hasImagenes && imagenes.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black bg-opacity-40 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors z-10 text-lg leading-none"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black bg-opacity-40 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors z-10 text-lg leading-none"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              {imagenes.map((_, i) => (
                <span
                  key={i}
                  className={`block w-1.5 h-1.5 rounded-full ${
                    i === imgIdx ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 mb-1 w-full self-start">
        <span className="font-semibold text-lg text-[#000000]">{nombre}</span>
        {tipoHuella && (
          <Image src={pawIcons[tipoHuella]} alt="huella" width={16} height={16} />
        )}
      </div>

      <span className="flex items-center text-gray-700 text-md mb-4 self-start">{raza}</span>

      <div className="absolute bottom-4 right-4">
        {canDelete && (
          <button
            type="button"
            className="relative flex items-center justify-center w-10 h-10 bg-transparent border-none p-0"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
          >
            <Image
              src={fondoEliminar}
              alt="fondo eliminar"
              width={30}
              height={30}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            />
            <Image src={iconoDelete} alt="eliminar" width={18} height={18} className="z-10" />
          </button>
        )}
      </div>
    </div>
  );
};