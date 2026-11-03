import { z } from 'zod';

export const FRIENDLY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const LOGIN_KEY_LENGTH = 10;
export const USER_CODE_LENGTH = 10;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+(?:\s[a-zA-Z0-9_-]+)*$/;
export const LOGIN_KEY_REGEX = new RegExp(`^[${FRIENDLY_ALPHABET}]{${LOGIN_KEY_LENGTH}}$`);

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserSchema = z.object({
  userId: z.uuid(),
});

export const ListUserMessagesSchema = z.object({
  userId: z.uuid(),
  conversationId: z.uuid(),
  cursor: z.uuid().nullable(),
  limit: z.coerce.number().int().min(1).max(50).default(30),
});

export const CreateUserSchema = z.object({
  role: z.enum(UserRole).default(UserRole.USER),
  username: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(
          USERNAME_MIN_LENGTH,
          `El nombre de usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres.`,
        )
        .max(
          USERNAME_MAX_LENGTH,
          `El nombre de usuario no puede superar los ${USERNAME_MAX_LENGTH} caracteres.`,
        )
        .regex(
          USERNAME_REGEX,
          'El nombre de usuario solo puede contener letras, números, guiones bajos (_), guiones (-) y espacios simples.',
        ),
    ),
});

export type UserDto = z.infer<typeof UserSchema>;
export type ListUserMessagesDto = z.infer<typeof ListUserMessagesSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
