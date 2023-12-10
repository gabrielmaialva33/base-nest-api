import { z } from '@src/lib/validation/zod/z';
import { CreateZodDto } from '@src/lib/validation/zod';

export const SignInUserSchema = z.object({
  uid: z.string().trim(),
  password: z.string().trim(),
});

export class SignInUserDto extends CreateZodDto(SignInUserSchema) {}
