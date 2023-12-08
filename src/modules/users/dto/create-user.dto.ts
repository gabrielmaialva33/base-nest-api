import { z } from '@src/lib/validation/zod/z';

import { CreateZodDto } from '@src/lib/validation/zod';
import { isUnique } from '@src/common/validation/refine.zod';
import { User } from '@src/modules/users/entities/user.entity';

export const CreateUserSchema = z.object({
  first_name: z
    .string()
    .min(2)
    .max(80)
    .transform((value) => value.trim()),
  last_name: z
    .string()
    .min(2)
    .max(80)
    .transform((value) => value.trim()),
  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase().trim())
    .refine((value) => isUnique<User>(User, 'email', value), {
      message: 'Email is already taken',
    }),
  password: z
    .string()
    .min(6)
    .max(50)
    .transform((value) => value.trim()),
  avatar_url: z.string().url().optional().nullable(),
  username: z
    .string()
    .min(4)
    .max(40)
    .transform((value) => value.toLowerCase())
    .transform((value) => value.replace(/\s/g, '').trim())
    .optional()
    .refine((value) => isUnique<User>(User, 'username', value), {
      message: 'Username is already taken',
    }),
});

export class CreateUserDto extends CreateZodDto(CreateUserSchema) {}
