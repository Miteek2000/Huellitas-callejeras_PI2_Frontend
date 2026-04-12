'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleDownloadManual = () => {
    const link = document.createElement('a');
    link.href = '/Manual de usuario.pdf';
    link.download = 'Manual_Usuario_HuellitasCallejeras.pdf';
    link.click();
  };

  const handleDownloadVideo = () => {
    const link = document.createElement('a');
    link.href = '/tutorial-video.mp4';
    link.download = 'Tutorial_HuellitasCallejeras.mp4';
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-[#182F51]">Huellitas Callejeras</h1>
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-2 bg-[#182F51] text-white rounded-lg hover:bg-[#0f1f35] transition">
            Iniciar Sesión
          </button>
        </div>
      </header>


      <section className="relative min-h-screen bg-gradient-to-br from-[#182F51] to-[#2d5080] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute w-96 h-96 bg-white rounded-full -top-48 -left-48"/>
          <div
            className="absolute w-96 h-96 bg-white rounded-full -bottom-48 -right-48"/>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
                  Organiza y Gestiona tu Refugio
                </h2>
                <p className="text-xl text-blue-100">
                  Una solución completa para rescatistas de animales
                </p>
              </div>

              <p className="text-lg text-blue-50 leading-relaxed">
                Hemos escuchado el desafío que enfrentas: datos dispersos en libretas, información fragmentada,
                y dificultad para dar seguimiento a médicos casos cuando tienes muchos animales bajo tu cuidado.
              </p>

              <p className="text-lg text-blue-50 leading-relaxed">
                <strong>Huellitas Callejeras</strong> resuelve esto centralizando toda la información de tus
                animales, facilitando el seguimiento y optimizando espacios y mejorando tu capacidad de
                respuesta ante emergencias.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-8 py-3 bg-white text-[#182F51] font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                  Ingresar a la Aplicación
                </button>
                <button
                  onClick={() => router.push('/auth/registro')}
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#182F51] transition">
                  Registrar Refugio
                </button>
              </div>
            </div>

            {/* Si me dicen que si se queda la imagen si no, no*/}
            <div className="hidden lg:flex justify-center items-center">
              <Image
                src="/imagenes/publicidad.avf"
                alt="Huellitas Callejeras - Gestiona tu refugio"
                width={320}
                height={320}
                className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-[#182F51] mb-12">
            Los Desafíos que Resolvemos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h4 className="text-xl font-bold text-[#182F51] mb-3">Información Dispersa</h4>
              <p className="text-gray-600">
                Datos registrados en libretas y medios informales que generan pérdida de información importante
                sobre el estado de salud y características de cada animal.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h4 className="text-xl font-bold text-[#182F51] mb-3">Seguimiento Complejo</h4>
              <p className="text-gray-600">
                El seguimiento de casos se vuelve difícil con muchos animales, imposibilitando recordar
                características específicas y afectando el bienestar.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h4 className="text-xl font-bold text-[#182F51] mb-3">Falta de Planeación</h4>
              <p className="text-gray-600">
                Sin análisis de datos, es imposible planear espacios efectivamente, generando saturación o
                desaprovechamiento de recursos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-[#182F51] mb-12">
            Características Principales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-[#182F51] text-white flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#182F51] mb-2">Registro Centralizado</h4>
                <p className="text-gray-600">
                  Toda la información de tus animales en un solo lugar, accesible desde cualquier dispositivo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-[#182F51] text-white flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#182F51] mb-2">Gestión de Espacios</h4>
                <p className="text-gray-600">
                  Controla la capacidad de tu refugio y evita saturación con planificación inteligente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-[#182F51] text-white flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#182F51] mb-2">Galería de Fotos</h4>
                <p className="text-gray-600">
                  Sube y organiza fotos de tus animales con facilidad para identificación visual.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-[#182F51] text-white flex items-center justify-center text-xl">
                  ✓
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#182F51] mb-2">Colaboración</h4>
                <p className="text-gray-600">
                  Invita a tu equipo como administradores o colaboradores para trabajar en conjunto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-[#f0f4f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-[#182F51] mb-12">
            ¿Necesitas Ayuda?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition">
              <h4 className="text-2xl font-bold text-[#182F51] mb-4">Manual de Usuario</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Descarga nuestro manual con instrucciones paso a paso para aprovechar al máximo
                todas las funcionalidades de la aplicación.
              </p>
              <button
                onClick={handleDownloadManual}
                className="w-full px-6 py-3 bg-[#182F51] text-white font-bold rounded-lg hover:bg-[#0f1f35] transition transform hover:scale-105">
                Descargar Manual PDF
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition">
              <h4 className="text-2xl font-bold text-[#182F51] mb-4">Video Tutorial</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mira nuestro video tutorial en donde mostramos cómo registrar animales, y analizar estadísticas.
              </p>
              <button
                onClick={handleDownloadVideo}
                className="w-full px-6 py-3 bg-[#182F51] text-white font-bold rounded-lg hover:bg-[#0f1f35] transition transform hover:scale-105">
                Descargar Video Tutorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#182F51] to-[#2d5080] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Comienza a Organizar tu Refugio Hoy
          </h3>
          <button
            onClick={() => router.push('/auth/registro')}
            className="px-10 py-4 bg-white text-[#182F51] font-bold rounded-lg hover:bg-gray-100 transition transform hover:scale-105 text-lg"
          >
            Registra tu Refugio Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#182F51] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">Sobre Nosotros</h5>
              <p className="text-blue-100 text-sm">
                Huellitas Callejeras es una plataforma diseñada para facilitar la gestión de refugios
                de animales rescatados.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Enlaces Rápidos</h5>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>
                  <button onClick={() => router.push('/auth/login')} className="hover:text-white">
                    Iniciar Sesión
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/auth/registro')} className="hover:text-white">
                    Registrarse
                  </button>
                </li>
                <li>
                  <button onClick={handleDownloadManual} className="hover:text-white">
                    Descargar Manual
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Recursos</h5>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>
                  <button onClick={handleDownloadVideo} className="hover:text-white">
                    Video Tutorial
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-100 text-sm">
            <p>&copy; 2026 Huellitas Callejeras. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
