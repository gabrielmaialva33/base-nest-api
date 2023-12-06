import { Knex } from 'knex';
import { registerAs } from '@nestjs/config';

import { KnexLogger } from '@src/common/helpers/knex.utils';
import { Env } from '@src/env';

export const POSTGRES_CONFIG: Knex.Config = {
  client: 'pg',
  connection: {
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    user: Env.DB_USER,
    password: Env.DB_PASSWORD,
    database: Env.DB_NAME,
    debug: Env.DB_DEBUG,
  },
  debug: Env.DB_DEBUG,
  log: KnexLogger,
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/database/migrations',
  },
  seeds: {
    directory: 'src/database/seeds',
  },
};

export const postgres = () => registerAs('postgres', () => POSTGRES_CONFIG);
