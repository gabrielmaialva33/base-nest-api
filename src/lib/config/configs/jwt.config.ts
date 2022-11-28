import { registerAs } from '@nestjs/config';

export const jwt = registerAs('jwt', () => ({
  secret: process.env.SECRET_KEY,
  accessExpiry: /^\d+$/.test(process.env.ACCESS_EXPIRY)
    ? +process.env.ACCESS_EXPIRY
    : process.env.ACCESS_EXPIRY,
  refreshExpiry: +process.env.REFRESH_EXPIRY,
}));
