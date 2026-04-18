import { z } from 'zod';

const HTML_TAG_REGEX = /<[^>]*>/;
const NAME_REGEX = /^[A-Za-z\u00C0-\u017F\u00D1\u00F1\s]+$/u;

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

export const emailSchema = baseTextSchema
  .email('Email invalido')
  .max(320, 'Email demasiado largo');

export const optionalTextSchema = z.union([baseTextSchema, z.literal('')]).optional();
