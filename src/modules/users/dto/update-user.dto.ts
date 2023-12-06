import { z } from '@src/lib/validation/zod/z';
import { CreateZodDto } from '@src/lib/validation/zod';

export const UpdateUserSchema = z.object({
  first_name: z.string().min(2).max(255).optional(),
  last_name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
  username: z.string().min(4).max(20).optional(),
});

export class UpdateUserDto extends CreateZodDto(UpdateUserSchema) {}
