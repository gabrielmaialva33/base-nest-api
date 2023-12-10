import { registerAs } from '@nestjs/config';
import { Env } from '@src/env';

export const jwt = registerAs('jwt', () => ({
  secret: Env.JWT_SECRET,
  access_expiry: Env.JWT_ACCESS_EXPIRY,
  refresh_expiry: Env.JWT_REFRESH_EXPIRY,
}));
