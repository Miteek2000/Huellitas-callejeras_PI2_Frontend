'use client';

import { useRef, useState } from 'react';
import type { Animal, AnimalImagen } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';
import { getMotivosPermitidos } from './MovimientoValidationError';
import { EXPEDIENTE_AGE_LIMITS, validateExpedienteForm } from './expedienteValidation';

interface UseExpedienteFormOptions {
  onCancelConfirmed?: () => void;
  onSaveMovimiento?: (movimiento: Omit<Movimiento, 'id_movimiento' | 'animal_id'>) => void;
  onSaveAnimal?: (
    animal: Animal,
    fotosNuevas?: File[],
    movimiento?: Omit<Movimiento, 'id_movimiento' | 'animal_id'>
  ) => Promise<void>;
  onSaveSuccess?: () => void;
  onDeleteImagen?: (imagenId: string) => Promise<void>;
  initialData?: Partial<Animal>;
}

export const useExpedienteForm = (options?: UseExpedienteFormOptions) => {
  const defaultFormData: Animal = {
    nombre: '',
    estado: 'recuperacion',
    especie: '',
    raza: '',
    edad: '',
    unidad_edad: 'meses',
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

  const getEdadInicial = (initialData?: Partial<Animal>): { edad: string | number; unidad_edad: 'meses' | 'años' } => {
    if (!initialData?.edad) return { edad: '', unidad_edad: 'meses' };
    const edadMeses = Number(initialData.edad);
    if (edadMeses >= 12 && edadMeses % 12 === 0) {
      return { edad: edadMeses / 12, unidad_edad: 'años' };
    }
    return { edad: edadMeses, unidad_edad: 'meses' };
  };

  const edadInicial = getEdadInicial(options?.initialData);

  const [formData, setFormData] = useState<Animal>(() => ({
    ...defaultFormData,
    ...options?.initialData,
    edad: edadInicial.edad,
    unidad_edad: edadInicial.unidad_edad,
  }));

  const [imagenesExistentes, setImagenesExistentes] = useState<AnimalImagen[]>(
    options?.initialData?.imagenes ?? []
  );

  const [fotosNuevas, setFotosNuevas] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showFotoModal, setShowFotoModal] = useState(false);

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
  const unidadEdadOptions = [
    { value: 'meses', label: 'Meses' },
    { value: 'años', label: 'Años' },
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

  const todasParaCarrusel = [
    ...imagenesExistentes.map(img => ({ id: img.id_animal_imagen, src: img.imagen, esExistente: true })),
    ...fotoPreviews.map((src, i) => ({ id: `__nuevo__${i}`, src, esExistente: false })),
  ];

  const handleEstadoChange = (apiValue: string) => {
    setFormData(prev => ({ ...prev, estado: apiValue }));
    if (errors.estado) setErrors(prev => ({ ...prev, estado: false }));
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
    } else if (name === 'unidad_edad') {
      setFormData(prev => ({ ...prev, unidad_edad: value as 'meses' | 'años' }));
    } else if (name === 'edad') {
      const soloDigitos = value.replace(/\D/g, '');
      const maxEdad = formData.unidad_edad === 'años'
        ? EXPEDIENTE_AGE_LIMITS.MAX_AÑOS
        : EXPEDIENTE_AGE_LIMITS.MAX_MESES;
      if (soloDigitos === '') {
        setFormData(prev => ({ ...prev, edad: '' }));
      } else {
        setFormData(prev => ({
          ...prev,
          edad: Math.min(parseInt(soloDigitos, 10), maxEdad).toString(),
        }));
      }
    } else if (name === 'peso') {
      setFormData(prev => ({ ...prev, peso: value.replace(/-/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleFotoClick = () => fileInputRef.current?.click();

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const nuevasPreviews = files.map(f => URL.createObjectURL(f));
    setFotosNuevas(prev => [...prev, ...files]);
    setFotoPreviews(prev => [...prev, ...nuevasPreviews]);
    setImagenActiva(imagenesExistentes.length + fotoPreviews.length);
    if (errors.foto) setErrors(prev => ({ ...prev, foto: false }));
    e.target.value = '';
  };

  const handleDeleteImagen = async (imagenId: string) => {
    if (options?.onDeleteImagen) {
      await options.onDeleteImagen(imagenId);
    }
    setImagenesExistentes(prev => prev.filter(img => img.id_animal_imagen !== imagenId));
    setImagenActiva(0);
  };

  const handleQuitarFotoNueva = (index: number) => {
    URL.revokeObjectURL(fotoPreviews[index]);
    setFotosNuevas(prev => prev.filter((_, i) => i !== index));
    setFotoPreviews(prev => prev.filter((_, i) => i !== index));
    setImagenActiva(Math.max(0, imagenesExistentes.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const hasFoto = imagenesExistentes.length > 0 || fotosNuevas.length > 0;
    const nextErrors = validateExpedienteForm(formData, hasFoto);

    const isCreacion = !options?.initialData || !options?.initialData.id_animal;
    if (
      isCreacion &&
      (!movimientoData.tipo_movimiento || movimientoData.tipo_movimiento.toLowerCase() !== 'entrada')
    ) {
      setErrors({ ...nextErrors, primer_movimiento: true });
      return;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const movimiento =
      movimientoData.tipo_movimiento && movimientoData.fecha_movimiento && movimientoData.motivo
        ? movimientoData
        : undefined;

    try {
      setIsSaving(true);
      if (options?.onSaveAnimal) {
        await options.onSaveAnimal(formData, fotosNuevas, movimiento);
      }
      fotoPreviews.forEach(url => URL.revokeObjectURL(url));
      setFotosNuevas([]);
      setFotoPreviews([]);
      options?.onSaveSuccess?.();
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => setShowCancelConfirm(true);
  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    options?.onCancelConfirmed?.();
  };

  return {
    formData,
    setFormData,
    movimientoData,
    errors,
    isSaving,
    especiesOptions,
    sexoOptions,
    tamanoOptions,
    tipoMovimientoOptions,
    unidadEdadOptions,
    motivoOptions,
    fileInputRef,
    fotosNuevas,
    fotoPreviews,
    imagenesExistentes,
    setImagenesExistentes,
    imagenActiva,
    setImagenActiva,
    todasParaCarrusel,
    showCancelConfirm,
    showFotoModal,
    setShowFotoModal,
    handleInputChange,
    handleEstadoChange,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    handleFotoClick,
    handleFotosChange,
    handleDeleteImagen,
    handleQuitarFotoNueva,
    setShowCancelConfirm,
  };
};