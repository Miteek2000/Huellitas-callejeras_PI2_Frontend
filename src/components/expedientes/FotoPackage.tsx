import React from 'react';
import { getImageUrl } from '@/app/lib/endpoints';

const DEFAULT_IMAGE = '/imagenes/galeria/default.png';

interface FotoPackageProps {
  showFotoModal: boolean;
  setShowFotoModal: (show: boolean) => void;
  todasParaCarrusel: Array<any>;
  imagenActiva: number;
  setImagenActiva: (index: number) => void;
  imagenesExistentes: Array<any>;
  fotosNuevas: File[];
  handleDeleteImagen: (imagenId: string) => Promise<void>;
  handleQuitarFotoNueva: (index: number) => void;
  handleFotoClick: () => void;
  irAnterior: (e: React.MouseEvent) => void;
  irSiguiente: (e: React.MouseEvent) => void;
  imagenActivaItem?: any;
}

export const FotoPackage: React.FC<FotoPackageProps> = ({
  showFotoModal,
  setShowFotoModal,
  todasParaCarrusel,
  imagenActiva,
  setImagenActiva,
  imagenesExistentes,
  fotosNuevas,
  handleDeleteImagen,
  handleQuitarFotoNueva,
  handleFotoClick,
  irAnterior,
  irSiguiente,
  imagenActivaItem,
}) => {
  if (!showFotoModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => setShowFotoModal(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#194566] text-white px-5 py-4 flex items-center justify-between">
          <span className="font-semibold">Fotos del animal</span>
          <button
            type="button"
            onClick={() => setShowFotoModal(false)}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {todasParaCarrusel.length > 0 ? (
            <div className="relative rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '4/3' }}>
              <img
                src={
                  imagenActivaItem?.esExistente
                    ? (getImageUrl(imagenActivaItem.src) ?? DEFAULT_IMAGE)
                    : (imagenActivaItem?.src ?? DEFAULT_IMAGE)
                }
                alt="preview"
                className="w-full h-full object-cover"
              />
              {!imagenActivaItem?.esExistente && (
                <span className="absolute top-2 left-2 text-xs bg-[#194566] text-white px-2 py-0.5 rounded">
                  pendiente
                </span>
              )}
              {todasParaCarrusel.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={irAnterior}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white text-lg flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={irSiguiente}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black bg-opacity-40 text-white text-lg flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-100 flex items-center justify-center mb-3" style={{ aspectRatio: '4/3' }}>
              <p className="text-sm text-gray-400">Sin fotos aún</p>
            </div>
          )}

          {todasParaCarrusel.length > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400">
                {imagenActiva + 1} / {todasParaCarrusel.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (imagenActivaItem?.esExistente) {
                    handleDeleteImagen(imagenActivaItem.id);
                  } else {
                    const idx = imagenActiva - imagenesExistentes.length;
                    handleQuitarFotoNueva(idx);
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                {imagenActivaItem?.esExistente ? 'Eliminar foto' : 'Quitar foto'}
              </button>
            </div>
          )}

          {todasParaCarrusel.length > 0 && (
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {todasParaCarrusel.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setImagenActiva(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    i === imagenActiva ? 'border-[#194566]' : 'border-transparent'
                  } ${!img.esExistente ? 'opacity-70' : ''}`}
                >
                  <img
                    src={img.esExistente ? (getImageUrl(img.src) ?? DEFAULT_IMAGE) : img.src}
                    alt={`foto ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleFotoClick}
            className="w-full py-2.5 border-2 border-dashed border-[#194566] text-[#194566] rounded-lg text-sm font-medium hover:bg-[#194566] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar fotos
          </button>

          {fotosNuevas.length > 0 && (
            <p className="text-xs text-[#194566] text-center mt-2">
              {fotosNuevas.length} foto{fotosNuevas.length > 1 ? 's' : ''} pendiente{fotosNuevas.length > 1 ? 's' : ''} de guardar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
