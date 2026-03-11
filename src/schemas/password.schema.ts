import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    'Debe contener al menos un carácter especial (!@#$...)'
  );

export const passwordOptionalSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true; 
      return passwordSchema.safeParse(val).success;
    },
    { message: 'La contraseña no cumple los requisitos' }
  );