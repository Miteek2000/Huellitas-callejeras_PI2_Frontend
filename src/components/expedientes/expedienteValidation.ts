import type { Animal } from '@/schemas/animal.schema';
import { animalTextSchema } from '@/schemas/inputSchema';

export const EXPEDIENTE_REQUIRED_FIELD_MESSAGE = 'Este campo es obligatorio';
const EXPEDIENTE_TEXT_INVALID_MESSAGE =
  'Este campo es obligatorio y solo admite letras A-Z, a-z, numeros 0-9 y simbolos - = + _ ( ).';

export const EXPEDIENTE_AGE_LIMITS = {
  MIN: 1,
  MAX_MESES: 360,
  MAX_AÑOS: 30,
} as const;

export const EXPEDIENTE_AGE_INVALID_MESSAGE =
  'La edad debe ser un número entero válido';

export const EXPEDIENTE_WEIGHT_INVALID_MESSAGE = 'El peso debe ser mayor a 0';

export const EXPEDIENTE_FIELD_ERROR_MESSAGES = {
  nombre: EXPEDIENTE_TEXT_INVALID_MESSAGE,
  especie: EXPEDIENTE_REQUIRED_FIELD_MESSAGE,
  raza: EXPEDIENTE_TEXT_INVALID_MESSAGE,
  edad: EXPEDIENTE_AGE_INVALID_MESSAGE,
  sexo: EXPEDIENTE_REQUIRED_FIELD_MESSAGE,
  peso: EXPEDIENTE_WEIGHT_INVALID_MESSAGE,
  tamano: EXPEDIENTE_REQUIRED_FIELD_MESSAGE,
  lugar: EXPEDIENTE_TEXT_INVALID_MESSAGE,
  descripcion: EXPEDIENTE_TEXT_INVALID_MESSAGE,
  foto: EXPEDIENTE_REQUIRED_FIELD_MESSAGE,
  primer_movimiento: 'Para crear un expediente, primero debe registrar una fecha de entrada',
} as const;

export type ExpedienteFieldErrorKey = keyof typeof EXPEDIENTE_FIELD_ERROR_MESSAGES;

const isEmpty = (value: string) => !value || value.trim() === '';

export const validateExpedienteForm = (
  formData: Animal,
  hasFoto: boolean
): Record<string, boolean> => {
  const nextErrors: Record<string, boolean> = {};
  const edadValue = String(formData.edad ?? '').trim();
  const edadNum = Number(formData.edad);
  const pesoNum = Number(formData.peso);
  const maxEdad = formData.unidad_edad === 'años'
    ? EXPEDIENTE_AGE_LIMITS.MAX_AÑOS
    : EXPEDIENTE_AGE_LIMITS.MAX_MESES;

  if (isEmpty(formData.nombre)) nextErrors.nombre = true;
  if (isEmpty(formData.estado)) nextErrors.estado = true;
  if (isEmpty(formData.especie)) nextErrors.especie = true;
  if (isEmpty(formData.raza)) nextErrors.raza = true;

  if (
    isEmpty(edadValue) ||
    !Number.isInteger(edadNum) ||
    edadNum < EXPEDIENTE_AGE_LIMITS.MIN ||
    edadNum > maxEdad
  ) {
    nextErrors.edad = true;
  }

  if (isEmpty(formData.sexo)) nextErrors.sexo = true;
  if (!pesoNum || pesoNum <= 0) nextErrors.peso = true;
  if (isEmpty(formData.tamano)) nextErrors.tamano = true;
  if (isEmpty(formData.lugar)) nextErrors.lugar = true;
  if (isEmpty(formData.descripcion)) nextErrors.descripcion = true;
  if (!hasFoto) nextErrors.foto = true;

  const textoValido = (value: string) =>
    animalTextSchema.safeParse(value).success;

  if (!isEmpty(formData.nombre) && !textoValido(String(formData.nombre))) {
    nextErrors.nombre = true;
  }
  if (!isEmpty(formData.raza) && !textoValido(String(formData.raza))) {
    nextErrors.raza = true;
  }
  if (!isEmpty(formData.lugar) && !textoValido(String(formData.lugar))) {
    nextErrors.lugar = true;
  }
  if (!isEmpty(formData.descripcion) && !textoValido(String(formData.descripcion))) {
    nextErrors.descripcion = true;
  }

  return nextErrors;
};