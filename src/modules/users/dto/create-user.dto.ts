import { z } from '@src/lib/validation/zod/z';

import { CreateZodDto } from '@src/lib/validation/zod';

export const CreateUserSchema = z.object({
  first_name: z.string().min(2).max(255),
  last_name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(50),
  avatar_url: z.string().url().optional().nullable(),
  username: z.string().min(4).max(20).optional(),
});

export class CreateUserDto extends CreateZodDto(CreateUserSchema) {}
