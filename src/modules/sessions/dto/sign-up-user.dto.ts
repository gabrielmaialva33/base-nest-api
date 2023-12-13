import { z } from '@src/lib/validation/zod/z';

import { CreateZodDto } from '@src/lib/validation/zod';
import { isUnique } from '@src/common/validation/refine.zod';
import { User } from '@src/modules/users/entities/user.entity';
import { translate } from '@src/lib/i18n';

export const SignUpUserSchema = z.object({
  first_name: z.string().min(2).max(80).trim(),
  last_name: z.string().min(2).max(80).trim(),
  email: z
    .string()
    .email()
    .trim()
    .refine((value) => isUnique<User>(User, 'email', value), {
      message: translate('exception.field_already_exists', {
        args: { field: translate('model.user.field.email') },
      }),
    }),
  password: z.string().min(6).max(50).trim(),
  avatar_url: z.string().url().optional().nullable(),
  username: z
    .string()
    .min(4)
    .max(40)
    .transform((value) => value.toLowerCase())
    .transform((value) => value.replace(/\s/g, '').trim())
    .optional()
    .refine((value) => isUnique<User>(User, 'username', value), {
      message: translate('exception.field_already_exists', {
        args: { field: translate('model.user.field.username') },
      }),
    }),
});

export class SignUpUserDto extends CreateZodDto(SignUpUserSchema) {}
