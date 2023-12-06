import { Knex } from 'knex';
import { registerAs } from '@nestjs/config';

import * as process from 'process';

import { KnexLogger } from '@src/common/helpers/knex.utils';
import { Env } from '@src/env';

export const SQLITE_CONFIG: Knex.Config<Knex.Sqlite3ConnectionConfig> = {
  client: 'better-sqlite3',
  connection: process.cwd() + '/src/database/database.sqlite',
  debug: Env.DB_DEBUG,
  log: KnexLogger,
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/database/migrations',
  },
  seeds: {
    directory: 'src/database/seeds',
  },
};

export const sqlite = () => registerAs('sqlite', () => SQLITE_CONFIG);
