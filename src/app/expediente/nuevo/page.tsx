'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Checkbox, Textarea } from '@/components/ui';

export default function ExpedientePage() {
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
    { value: 'otro', label: 'Otro' },
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
    <div className="min-h-screen bg-[#e8e8e8] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <span className="mr-2">←</span>
            <span>Expediente del paciente</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Icon */}
              <div className="w-24 h-24 bg-[#2c3e50] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  <path d="M14 2v2h3l-5 5-5-5h3V2h4z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">Expediente de paciente</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button type="button" variant="outline" className="flex items-center space-x-2">
                <span>❤️</span>
                <span>Recuperación</span>
              </Button>
              <Button type="button" variant="primary">
                Historial de Movimientos
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
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

              {/* Otros datos section */}
              <div className="mt-8">
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Otros datos</h3>
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

            {/* Right Column */}
            <div className="space-y-4">
              {/* Registro de movimientos */}
              <div>
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Registro de movimientos</h3>
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

              {/* Datos de rescate */}
              <div className="mt-8">
                <div className="border-b-2 border-gray-400 pb-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Datos de rescate</h3>
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button type="submit" variant="primary" className="px-12">
              Guardar
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel} className="px-12">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
