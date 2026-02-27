import React from 'react';
import Image from 'next/image';

interface Props {
  nombre: string;
  raza: string;
  imagen?: string | null;
  tipoHuella: 'entrada' | 'salida' | null;
  onClick?: () => void;
}

const pawIcons = {
  entrada: '/imagenes/galeria/huellaEntrada.svg',
  salida: '/imagenes/galeria/huellaSalida.svg',
};

export const ExpedienteCard: React.FC<Props> = ({ nombre, raza, imagen, tipoHuella, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="w-40 h-40 relative mb-2">
        <Image
          src='/imagenes/galeria/ejemploAnimal.png'
          alt={nombre}
          width={160}
          height={160}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex items-center gap-1 mb-1">
        <span className="font-semibold text-lg text-[#194566]">{nombre}</span>
        {tipoHuella && (
          <Image src={pawIcons[tipoHuella]} alt="huella" width={20} height={20} />
        )}
      </div>
      <span className="text-gray-700 text-md">{raza}</span>
    </div>
  );
};
