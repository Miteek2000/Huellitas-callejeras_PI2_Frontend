import React from 'react';
import Image from 'next/image';

interface Props {
  nombre: string;
  raza: string;
  imagen?: string | null;
  tipoHuella: 'entrada' | 'salida' | null;
  onClick?: () => void;
  onDelete?: () => void;
}

const pawIcons = {
  entrada: '/imagenes/galeria/huellaEntrada.svg',
  salida: '/imagenes/galeria/huellaSalida.svg',
};

const fondoEliminar = '/imagenes/galeria/fondoEliminar.svg';
const iconoDelete = '/imagenes/galeria/Delete.png';

export const ExpedienteCard: React.FC<Props> = ({ nombre, raza, imagen, tipoHuella, onClick, onDelete }) => {
  const srcImagen = typeof imagen === 'string' && imagen.length > 0 ? imagen : '/imagenes/galeria/ejemploAnimal.png';
  return (
     <div className="relative bg-[#F3F3F3] shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow h-80 w-56" onClick={onClick}>
      <div className="w-45 h-45 relative mb-2">
        <Image src='/imagenes/galeria/ejemploAnimal.png' alt={nombre}     
        fill
        className="object-cover"/>
      </div>
        <div className="flex items-center gap-1 mb-1 w-full self-start">
        <span className="font-semibold text-lg text-[#000000]">
            {nombre}
        </span>
        {tipoHuella && (
            <Image src={pawIcons[tipoHuella]} alt="huella" width={16} height={16} />
        )}
        </div>
      <span className=" flex items-center text-gray-700 text-md mb-4 self-start">{raza}</span>

      <div className="absolute bottom-4 right-4">
        <button
          type="button"
          className="relative flex items-center justify-center w-10 h-10 bg-transparent border-none p-0"
          onClick={e => {
            e.stopPropagation();
            if (onDelete) onDelete();
          }}
        >
          <Image src={fondoEliminar} alt="fondo eliminar" width={30} height={30} className="absolute top-1.2 left- -1 z-0" />
          <Image src={iconoDelete} alt="eliminar" width={18} height={18} className="z-10" />
        </button>
      </div>
    </div>
  );
};
