'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

const RUTAS_SIN_HEADER = ['/', '/auth/login', '/auth/registro'];

export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname();

  if (RUTAS_SIN_HEADER.includes(pathname)) return null;

  return <Header />;
};
