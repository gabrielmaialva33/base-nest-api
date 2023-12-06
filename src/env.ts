import 'dotenv/config';

import { bool, cleanEnv, num, str } from 'envalid';
import { Logger } from '@nestjs/common';

export const Env = cleanEnv(process.env, {
  // App
  NODE_ENV: str({ default: 'development', desc: 'The environment to run in' }),
  HOST: str({ default: '0.0.0.0', desc: 'The host to run on' }),
  PORT: num({ default: 3000, desc: 'The port to run on' }),
  API_PREFIX: str({ default: 'api', desc: 'The api prefix' }),
  // Database
  DB_CLIENT: str({
    default: 'sqlite',
    desc: 'The database client (sqlite, pg)',
  }),
  DB_HOST: str({ default: 'localhost', desc: 'The database host' }),
  DB_PORT: num({ default: 5432, desc: 'The database port' }),
  DB_USER: str({ default: 'postgres', desc: 'The database user' }),
  DB_PASSWORD: str({ default: 'postgres', desc: 'The database password' }),
  DB_NAME: str({ default: 'postgres', desc: 'The database name' }),
  DB_DEBUG: bool({ default: false, desc: 'The database debug mode' }),
});

export const validateEnv = (config: Record<any, any>) => {
  Logger.log(`Validating environment variables...`, 'Env');
  return config;
};
