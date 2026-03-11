import { passwordSchema } from '@/schemas/password.schema';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const result = passwordSchema.safeParse(password);

  if (result.success) {
    return { isValid: true, errors: [] };
  }

  return {
    isValid: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
};