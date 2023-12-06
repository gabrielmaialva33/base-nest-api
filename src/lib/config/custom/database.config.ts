import 'dotenv/config';

import { registerAs } from '@nestjs/config';

import { POSTGRES_CONFIG, SQLITE_CONFIG } from '@src/lib/config';
import { Env } from '@src/env';

export const DEFAULT = 'default';

export const database = registerAs('database', () => ({
  isGlobal: true,
  default: DEFAULT,
  connections: {
    [DEFAULT]: Env.DB_CLIENT === 'sqlite' ? SQLITE_CONFIG : POSTGRES_CONFIG,
    postgres: POSTGRES_CONFIG,
  },
}));
