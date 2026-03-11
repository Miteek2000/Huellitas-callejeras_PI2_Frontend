'use client';

import { useRef, useState } from 'react';
import { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';
import { getMotivosPermitidos } from './MovimientoValidationError';

interface UseExpedienteFormOptions {
  onCancelConfirmed?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (animal: Animal, fotoFile?: File | null, movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => Promise<void>;
  initialData?: Partial<Animal>;
  initialPhotoUrl?: string;
}

export const useExpedienteForm = (options?: UseExpedienteFormOptions) => {
  const defaultFormData: Animal = {
    nombre: '',
    estado: 'recuperacion',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    peso: '',
    tamano: '',
    lugar: '',
    descripcion: '',
    es_agresivo: false,
    enfermedad_no_tratable: false,
    discapacidad: false,
  };

  const [movimientoData, setMovimientoData] = useState({
    tipo_movimiento: '',
    fecha_movimiento: '',
    motivo: '',
  });

  const [formData, setFormData] = useState<Animal>(() => ({
    ...defaultFormData,
    ...options?.initialData,
  }));

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const especiesOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
  ];

  const sexoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'Macho', label: 'Macho' },
    { value: 'Hembra', label: 'Hembra' },
  ];

  const tamanoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'miniatura', label: 'Miniatura' },
    { value: 'pequeno', label: 'Pequeño' },
    { value: 'mediano', label: 'Mediano' },
    { value: 'grande', label: 'Grande' },
    { value: 'gigante', label: 'Gigante' },
  ];

  const tipoMovimientoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'salida', label: 'Salida' },
  ];

  const todosMotivos = [
    { value: 'rescate', label: 'Rescate' },
    { value: 'retorno', label: 'Retorno' },
    { value: 'adopcion', label: 'Adopción' },
    { value: 'defuncion', label: 'Defunción' },
    { value: 'extravio', label: 'Extravío' },
  ];

  const motivosPermitidos = getMotivosPermitidos(movimientoData.tipo_movimiento);
  const motivoOptions = [
    { value: '', label: 'Seleccione...' },
    ...(motivosPermitidos.length > 0
      ? todosMotivos.filter((m) => motivosPermitidos.includes(m.value))
      : todosMotivos),
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(
    options?.initialPhotoUrl ?? null
  );

  const handleBooleanChange = (
    field: 'es_agresivo' | 'enfermedad_no_tratable' | 'discapacidad',
    value: boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEstadoChange = (apiValue: string) => {
    setFormData(prev => ({ ...prev, estado: apiValue }));
    if (errors.estado) {
      setErrors(prev => ({ ...prev, estado: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'tipo_movimiento' || name === 'fecha_movimiento' || name === 'motivo_movimiento') {
      const fieldName = name === 'motivo_movimiento' ? 'motivo' : name;
      if (name === 'tipo_movimiento') {
        const permitidos = getMotivosPermitidos(value);
        setMovimientoData(prev => ({
          ...prev,
          tipo_movimiento: value,
          motivo: permitidos.includes(prev.motivo) ? prev.motivo : '',
        }));
      } else {
        setMovimientoData(prev => ({ ...prev, [fieldName]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, boolean> = {};
    const isEmpty = (value: string) => !value || value.trim() === '';

    const edadNum = Number(formData.edad);
    const pesoNum = Number(formData.peso);

    if (isEmpty(formData.nombre)) nextErrors.nombre = true;
    if (isEmpty(formData.estado)) nextErrors.estado = true;
    if (isEmpty(formData.especie)) nextErrors.especie = true;
    if (isEmpty(formData.raza)) nextErrors.raza = true;
    if (!edadNum || edadNum <= 0) nextErrors.edad = true;
    if (isEmpty(formData.sexo)) nextErrors.sexo = true;
    if (!pesoNum || pesoNum <= 0) nextErrors.peso = true;
    if (isEmpty(formData.tamano)) nextErrors.tamano = true;
    if (isEmpty(formData.lugar)) nextErrors.lugar = true;
    if (isEmpty(formData.descripcion)) nextErrors.descripcion = true;
    if (!fotoFile && !fotoPreviewUrl) nextErrors.foto = true;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const movimiento =
      movimientoData.tipo_movimiento && movimientoData.fecha_movimiento && movimientoData.motivo
        ? movimientoData
        : undefined;

    try {
      if (options?.onSaveAnimal) {
        await options.onSaveAnimal(formData, fotoFile, movimiento);
      }
      setShowSaveSuccess(true);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => setShowCancelConfirm(true);

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    options?.onCancelConfirmed?.();
  };

  const handleCloseSaveSuccess = () => setShowSaveSuccess(false);
  const handleFotoClick = () => fileInputRef.current?.click();

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (fotoPreviewUrl) URL.revokeObjectURL(fotoPreviewUrl);
    if (file) {
      setFotoFile(file);
      setFotoPreviewUrl(URL.createObjectURL(file));
    } else {
      setFotoFile(null);
      setFotoPreviewUrl(null);
    }
    if (errors.foto) setErrors(prev => ({ ...prev, foto: false }));
  };

  return {
    formData,
    setFormData,
    movimientoData,
    errors,
    especiesOptions,
    sexoOptions,
    tamanoOptions,
    tipoMovimientoOptions,
    motivoOptions,
    fileInputRef,
    fotoFile,
    fotoPreviewUrl,
    showCancelConfirm,
    showSaveSuccess,
    handleInputChange,
    handleBooleanChange,
    handleEstadoChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleCloseSaveSuccess,
    handleFotoClick,
    handleFotoChange,
    setShowCancelConfirm,
  };
};