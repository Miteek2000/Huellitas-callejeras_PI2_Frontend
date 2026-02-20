'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#2B264F] text-white px-6 py-4">
      <div className="max-w-full mx-auto flex items-center justify-between">

        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/Hogar.svg" alt="Inicio" width={24} height={24} />
          </Link>
          
          {/* Por el momento no tendra rutas definicas, despues les agrego un link*/}
          <button className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/Estadisticas.svg" alt="Estadísticas" width={24} height={24} />
          </button>
          
          <button className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/Configuracion.svg" alt="Configuración" width={24} height={24} />
          </button>
        </div>

        <h1 className="text-lg font-semibold text-[#DCD6D7] text-2xl">Huellitas Callejeras</h1>
      </div>
    </header>
  );
};
