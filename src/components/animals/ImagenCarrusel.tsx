'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/app/lib/endpoints';

interface AnimalImagen {
  id_animal_imagen: string;
  imagen: string;
}

interface ImageCarouselProps {
  imagenes?: AnimalImagen[];
  altText?: string;
  readOnly?: boolean;
  onDeleteImagen?: (id: string) => void;
  onAddFotoClick?: () => void;
  className?: string;
}

const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  imagenes = [],
  altText = 'Foto del animal',
  readOnly = true,
  onDeleteImagen,
  onAddFotoClick,
  className = '',
}) => {
  const [idx, setIdx] = useState(0);

  const total = imagenes.length;
  const hasImages = total > 0;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  };

  const currentImagen = hasImages ? imagenes[idx] : null;
  const currentSrc = currentImagen ? (getImageUrl(currentImagen.imagen) ?? DEFAULT_IMAGE) : DEFAULT_IMAGE;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex-shrink-0">
        <div className="absolute inset-0 bg-[#5F7A91] rounded-full" />
        <div className="absolute inset-2 bg-white rounded-full" />

        <div
          className={`absolute inset-4 bg-[#2B5278] rounded-full overflow-hidden flex items-center justify-center group ${
            !readOnly && !hasImages ? 'cursor-pointer' : ''
          }`}
          onClick={!readOnly && !hasImages ? onAddFotoClick : undefined}
        >
          {hasImages ? (
            <img
              src={currentSrc}
              alt={altText}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {!readOnly && (
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={onAddFotoClick}
                >
                  <Image
                    src="/imagenes/agregarImagen.svg"
                    alt="Agregar foto"
                    width={80}
                    height={80}
                  />
                </div>
              )}
              {readOnly && (
                <img src={DEFAULT_IMAGE} alt="Sin imagen" className="w-full h-full object-cover" />
              )}
            </>
          )}

          {!readOnly && hasImages && (
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center cursor-pointer"
              onClick={onAddFotoClick}
            >
              <Image
                src="/imagenes/agregarImagen.svg"
                alt="Agregar foto"
                width={40}
                height={40}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={prev}
            className="w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow"
            aria-label="Imagen anterior"
          >
            ‹
          </button>

          <div className="flex gap-1">
            {imagenes.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === idx ? 'bg-[#194566]' : 'bg-gray-300'
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="w-7 h-7 rounded-full bg-[#194566] text-white flex items-center justify-center hover:bg-[#153a52] transition-colors shadow"
            aria-label="Imagen siguiente"
          >
            ›
          </button>
        </div>
      )}

      {hasImages && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">
            {idx + 1} / {total}
          </span>
          {!readOnly && onDeleteImagen && currentImagen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteImagen(currentImagen.id_animal_imagen);
              }}
              className="text-xs text-red-500 hover:text-red-700 underline transition-colors"
              title="Eliminar esta imagen"
            >
              Eliminar foto
            </button>
          )}
        </div>
      )}
    </div>
  );
};