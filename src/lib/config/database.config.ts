import 'dotenv/config';

import { registerAs } from '@nestjs/config';
import { Env } from '@src/lib/config/env';

export const database = registerAs('database', () => ({
  host: Env.HOST,
  port: Env.PORT,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
  debug: Env.DB_DEBUG,
}));
