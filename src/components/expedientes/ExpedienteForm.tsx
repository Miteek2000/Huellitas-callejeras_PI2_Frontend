'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Checkbox, Textarea } from '@/components/ui';
import { ExpedienteActionButtons } from './ExpedienteActionButtons';
import Image from 'next/image';

interface Movimiento {
  fecha: string;
  tipoMovimiento: string;
  motivo: string;
}

interface ExpedienteFormProps {
  onOpenHistorial?: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({ onOpenHistorial }) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    peso: '',
    tamano: '',
    tipoMovimiento: '',
    fecha: '',
    motivo: '',
    lugar: '',
    descripcion: '',
    comportamientoAgresivo: false,
    enfermedadDegenerativa: false,
    discapacidades: false,
  });

  const especiesOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
  ];

  const sexoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí iría la lógica para guardar
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto bg-[#E8E8E8] rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-60 h-60 flex-shrink-0">
            <div className="absolute inset-0 bg-[#5F7A91] rounded-full"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-4 bg-[#2B5278] rounded-full flex items-center justify-center">
              <button type="button" className="hover:opacity-80 transition-opacity">
                <Image src="/imagenes/agregarImagen.svg" alt="Agregar foto" width={80} height={80} />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#194566] mb-4">Expediente de paciente</h1>
            <ExpedienteActionButtons onHistorialClick={onOpenHistorial} />
          </div>
        </div>

        <div className="text-[#2B264F] grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder=""
            />

            <Select
              label="Especie"
              name="especie"
              value={formData.especie}
              onChange={handleInputChange}
              options={especiesOptions}
            />

            <Input
              label="Raza"
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              placeholder=""
            />

            <Input
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleInputChange}
              placeholder=""
            />

            <Select
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              options={sexoOptions}
            />

            <Input
              label="Peso"
              name="peso"
              type="number"
              value={formData.peso}
              onChange={handleInputChange}
              placeholder=""
            />

            <Input
              label="Tamaño"
              name="tamano"
              value={formData.tamano}
              onChange={handleInputChange}
              placeholder=""
            />

            <div className="mt-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Otros datos</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-700 mb-2">¿Presenta comportamientos agresivos?</p>
                  <div className="flex space-x-4">
                    <Checkbox 
                      label="Si"
                      name="comportamientoAgresivo"
                      checked={formData.comportamientoAgresivo}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="comportamientoAgresivo"
                      checked={!formData.comportamientoAgresivo}
                      onChange={(e) => setFormData(prev => ({ ...prev, comportamientoAgresivo: !e.target.checked }))}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-2">¿Presenta alguna enfermedad degenerativa o sin cura?</p>
                  <div className="flex space-x-4">
                    <Checkbox 
                      label="Si"
                      name="enfermedadDegenerativa"
                      checked={formData.enfermedadDegenerativa}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="enfermedadDegenerativa"
                      checked={!formData.enfermedadDegenerativa}
                      onChange={(e) => setFormData(prev => ({ ...prev, enfermedadDegenerativa: !e.target.checked }))}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-2">¿Presenta discapacidades?</p>
                  <div className="flex space-x-4">
                    <Checkbox 
                      label="Si"
                      name="discapacidades"
                      checked={formData.discapacidades}
                      onChange={handleInputChange}
                    />
                    <Checkbox 
                      label="No"
                      name="discapacidades"
                      checked={!formData.discapacidades}
                      onChange={(e) => setFormData(prev => ({ ...prev, discapacidades: !e.target.checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Registro de movimientos</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <Input
                label="Tipo de movimiento"
                name="tipoMovimiento"
                value={formData.tipoMovimiento}
                onChange={handleInputChange}
                placeholder=""
              />
              <Input
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleInputChange}
              />
              <Textarea
                label="Motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                rows={3}
                placeholder=""
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-4">
                <div className="bg-[#5A7A8F] text-white px-6 py-2 rounded-l-md">
                  <h3 className="text-sm font-medium">Datos de rescate</h3>
                </div>
                <div className="flex-1 h-1 bg-[#5A7A8F]"></div>
              </div>
              <Input
                label="Lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleInputChange}
                placeholder=""
              />
              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder=""
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-16">
          <Button type="submit" variant="primary" className="!bg-[#2B264F] !text-white px-54 h-10 flex items-center justify-center font-semibold">
            Guardar
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} className=" !bg-[#A7A7A7] !text-white px-54 h-10 flex items-center justify-center font-semibold">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export type { Movimiento };
