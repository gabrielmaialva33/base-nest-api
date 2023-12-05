import 'dotenv/config';

import { registerAs } from '@nestjs/config';
import { Env } from '@src/lib/config/env';

export const app = registerAs('app', () => ({
  env: Env.NODE_ENV,
  host: Env.HOST,
  port: Env.PORT,
  apiPrefix: Env.API_PREFIX,
}));
