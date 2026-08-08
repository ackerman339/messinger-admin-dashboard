import { z } from 'zod';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+(?:\s[a-zA-Z0-9_-]+)*$/;

export const AdminSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe contener al menos 8 caracteres.')
    .max(100, 'La contraseña no puede superar los 100 caracteres.'),

  adminName: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(
          USERNAME_MIN_LENGTH,
          `El nombre de usuario debe contener al menos ${USERNAME_MIN_LENGTH} caracteres.`,
        )
        .max(
          USERNAME_MAX_LENGTH,
          `El nombre de usuario no puede superar los ${USERNAME_MAX_LENGTH} caracteres.`,
        )
        .regex(
          USERNAME_REGEX,
          'El nombre de usuario solo puede contener letras, números, "_", "-" y espacios simples.',
        ),
    ),
});

export type AdminDto = z.infer<typeof AdminSchema>;
