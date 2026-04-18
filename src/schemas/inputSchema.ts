import { z } from 'zod';

const HTML_TAG_REGEX = /<[^>]*>/;
const NAME_REGEX = /^[A-Za-z\u00C0-\u017F\u00D1\u00F1\s]+$/u;
const ANIMAL_TEXT_REGEX = /^[A-Za-z0-9\s\-=+_()]*$/;
const USER_TEXT_REGEX = ANIMAL_TEXT_REGEX;
export const USER_TEXT_ALLOWED_CHAR_REGEX = /[A-Za-z0-9\s\-=+_()]/;
const ALLOWED_TEXT_MESSAGE =
  'Solo letras A-Z, a-z, numeros 0-9 y simbolos - = + _ ( ).';

const baseTextSchema = z
  .string()
  .trim()
  .max(500, 'Maximo 500 caracteres')
  .refine((value) => !HTML_TAG_REGEX.test(value), {
    message: 'No se permite HTML.',
  });

export const generalTextSchema = baseTextSchema;

export const nameSchemaBase = baseTextSchema.regex(
  NAME_REGEX,
  'Solo letras y espacios.'
);

export const nameSchema = nameSchemaBase.min(1, 'El nombre es obligatorio');

export const animalTextSchema = baseTextSchema.regex(
  ANIMAL_TEXT_REGEX,
  ALLOWED_TEXT_MESSAGE
);

export const userTextSchema = baseTextSchema.regex(
  USER_TEXT_REGEX,
  ALLOWED_TEXT_MESSAGE
);

export const emailSchema = baseTextSchema
  .email('Email invalido')
  .max(320, 'Email demasiado largo');

export const optionalTextSchema = z.union([baseTextSchema, z.literal('')]).optional();
