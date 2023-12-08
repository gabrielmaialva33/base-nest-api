import { z } from '@src/lib/validation/zod/z';
import { CreateZodDto } from '@src/lib/validation/zod';
import { isExists } from '@src/common/validation/refine.zod';
import { User } from '@src/modules/users/entities/user.entity';

export const UpdateUserSchema = z.object({
  first_name: z.string().min(2).max(80).optional(),
  last_name: z.string().min(2).max(80).optional(),
  email: z
    .string()
    .optional()
    .refine(
      (value) => value === '' || z.string().email().safeParse(value).success,
      {
        message: 'Invalid email',
      },
    )
    .transform((value) => (value === '' ? undefined : value))
    .refine((value) => isExists<User>(User, { email: value }), {
      message: 'Email is already taken',
    }),
  password: z.string().min(6).max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
  username: z
    .string()
    .optional()
    .refine(
      (value) => value === '' || (value.length >= 4 && value.length <= 40),
      {
        message: 'Username must be between 4 and 20 characters',
      },
    )
    .transform((value) => (value === '' ? undefined : value))
    .refine((value) => isExists<User>(User, { username: value }), {
      message: 'Username is already taken',
    }),
});

export class UpdateUserDto extends CreateZodDto(UpdateUserSchema) {}
