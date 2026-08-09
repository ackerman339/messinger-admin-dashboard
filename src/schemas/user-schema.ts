import { z } from 'zod';

export const UserSchema = z.object({
  userId: z.uuid(),
});

export const ListUserMessagesSchema = z.object({
  userId: z.uuid(),
  conversationId: z.uuid(),
  cursor: z.uuid().nullable(),
  limit: z.coerce.number().int().min(1).max(50).default(30),
});

export type UserDto = z.infer<typeof UserSchema>;
export type ListUserMessagesDto = z.infer<typeof ListUserMessagesSchema>;
