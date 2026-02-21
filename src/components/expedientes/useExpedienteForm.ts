'use client';

import { useRef, useState } from 'react';
import { ExpedienteFormData } from '@/schemas/expediente.schema';

interface UseExpedienteFormOptions {
  onCancelConfirmed?: () => void;
  initialData?: Partial<ExpedienteFormData>;
  initialPhotoUrl?: string;
}

export const useExpedienteForm = (options?: UseExpedienteFormOptions) => {
  const todayDate = new Date().toISOString().split('T')[0];

  const defaultFormData: ExpedienteFormData = {
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    peso: '',
    tamano: '',
    tipoMovimiento: '',
    fecha: todayDate,
    motivo: '',
    lugar: '',
    descripcion: '',
    comportamientoAgresivo: false,
    enfermedadDegenerativa: false,
    discapacidades: false,
  };

  const [formData, setFormData] = useState<ExpedienteFormData>(() => ({
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
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' },
  ];

  const movimientoOptions = [
    { value: '', label: 'Seleccione...' },
    { value: 'rescate', label: 'Rescate' },
    { value: 'retorno', label: 'Retorno' },
    { value: 'defuncion', label: 'Defuncion' },
    { value: 'adopcion', label: 'Adopcion' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(options?.initialPhotoUrl ?? null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, boolean> = {};
    const isEmpty = (value: string) => value.trim() === '';

    if (isEmpty(formData.nombre)) nextErrors.nombre = true;
    if (isEmpty(formData.especie)) nextErrors.especie = true;
    if (isEmpty(formData.raza)) nextErrors.raza = true;
    if (isEmpty(formData.edad)) nextErrors.edad = true;
    if (isEmpty(formData.sexo)) nextErrors.sexo = true;
    if (isEmpty(formData.peso)) nextErrors.peso = true;
    if (isEmpty(formData.tamano)) nextErrors.tamano = true;
    if (isEmpty(formData.tipoMovimiento)) nextErrors.tipoMovimiento = true;
    if (isEmpty(formData.fecha)) nextErrors.fecha = true;
    if (isEmpty(formData.motivo)) nextErrors.motivo = true;
    if (isEmpty(formData.lugar)) nextErrors.lugar = true;
    if (isEmpty(formData.descripcion)) nextErrors.descripcion = true;
    if (!fotoFile && !fotoPreviewUrl) nextErrors.foto = true;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setShowSaveSuccess(true);
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    options?.onCancelConfirmed?.();
  };

  const handleCloseSaveSuccess = () => {
    setShowSaveSuccess(false);
  };

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (fotoPreviewUrl) {
      URL.revokeObjectURL(fotoPreviewUrl);
    }
    if (file) {
      setFotoFile(file);
      setFotoPreviewUrl(URL.createObjectURL(file));
    } else {
      setFotoFile(null);
      setFotoPreviewUrl(null);
    }

    if (errors.foto) {
      setErrors(prev => ({ ...prev, foto: false }));
    }
  };

  return {
    formData,
    setFormData,
    errors,
    especiesOptions,
    sexoOptions,
    movimientoOptions,
    fileInputRef,
    fotoPreviewUrl,
    showCancelConfirm,
    showSaveSuccess,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleCloseSaveSuccess,
    handleFotoClick,
    handleFotoChange,
    setShowCancelConfirm,
  };
};