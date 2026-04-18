import { z } from 'zod';
import { passwordSchema } from './password.schema';
import { emailSchema, generalTextSchema, nameSchemaBase } from './inputSchema';

const baseSchema = z.object({
  nombre: nameSchemaBase.min(1, 'El nombre es obligatorio'),
  apellidoPaterno: nameSchemaBase.min(1, 'El apellido paterno es obligatorio'),
  apellidoMaterno: nameSchemaBase.min(1, 'El apellido materno es obligatorio'),
  email: emailSchema,
  contrasena: generalTextSchema.optional(),
  confirmarContrasena: generalTextSchema.optional(),
  rol_id: generalTextSchema.optional(),
});

export const colaboradorCreateSchema = baseSchema
  .refine((data) => !!data.contrasena && data.contrasena.trim() !== '', {
    message: 'La contraseña es obligatoria',
    path: ['contrasena'],
  })
  .refine(
    (data) => {
      if (data.contrasena && data.contrasena.trim() !== '') {
        return passwordSchema.safeParse(data.contrasena).success;
      }
      return true;
    },
    { message: 'La contraseña no cumple los requisitos', path: ['contrasena'] }
  )
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  })
  .refine((data) => !!data.rol_id && data.rol_id.trim() !== '', {
    message: 'Selecciona un rol',
    path: ['rol_id'],
  });

export const colaboradorEditSchema = baseSchema
  .refine(
    (data) => {
      if (data.contrasena && data.contrasena.trim() !== '') {
        return passwordSchema.safeParse(data.contrasena).success;
      }
      return true;
    },
    { message: 'La contraseña no cumple los requisitos', path: ['contrasena'] }
  )
  .refine(
    (data) => {
      if (data.contrasena && data.contrasena.trim() !== '') {
        return data.contrasena === data.confirmarContrasena;
      }
      return true;
    },
    { message: 'Las contraseñas no coinciden', path: ['confirmarContrasena'] }
  )
  .refine((data) => !!data.rol_id && data.rol_id.trim() !== '', {
    message: 'Selecciona un rol',
    path: ['rol_id'],
  });

export const propietarioEditSchema = baseSchema
  .refine(
    (data) => {
      if (data.contrasena && data.contrasena.trim() !== '') {
        return passwordSchema.safeParse(data.contrasena).success;
      }
      return true;
    },
    { message: 'La contraseña no cumple los requisitos', path: ['contrasena'] }
  )
  .refine(
    (data) => {
      if (data.contrasena && data.contrasena.trim() !== '') {
        return data.contrasena === data.confirmarContrasena;
      }
      return true;
    },
    { message: 'Las contraseñas no coinciden', path: ['confirmarContrasena'] }
  );

export type ColaboradorFormData = z.infer<typeof baseSchema>;
export type ColaboradorCreateForm = z.infer<typeof colaboradorCreateSchema>;
export type ColaboradorEditForm = z.infer<typeof colaboradorEditSchema>;
export type PropietarioEditForm = z.infer<typeof propietarioEditSchema>;