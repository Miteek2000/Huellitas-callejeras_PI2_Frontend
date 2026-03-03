'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserRole, ROLES } from '@/app/lib/auth';

export const Header: React.FC = () => {
  const [isColaborador, setIsColaborador] = useState(false);

  useEffect(() => {
    setIsColaborador(getUserRole() === ROLES.COLABORADOR);
  }, []);

  return (
    <header className="bg-[#2B264F] text-white px-6 py-4">
      <div className="max-w-full mx-auto flex items-center justify-between">

        <div className="flex items-center space-x-6">
          <Link href="/galeria" className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/Hogar.svg" alt="Inicio" width={24} height={24} />
          </Link>
          <Link href="/estadisticas" className="hover:opacity-80 transition-opacity">
            <Image src="/imagenes/Estadisticas.svg" alt="Estadísticas" width={24} height={24} />
          </Link>
          
          {!isColaborador && (
            <Link href="/colaboradores" className="hover:opacity-80 transition-opacity">
              <Image src="/imagenes/Configuracion.svg" alt="Configuración" width={24} height={24} />
            </Link>
          )}
          
        </div>

        <h1 className="text-lg font-semibold text-[#DCD6D7] text-2xl">Huellitas Callejeras</h1>
      </div>
    </header>
  );
};

