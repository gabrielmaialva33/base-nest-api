import { registerAs } from '@nestjs/config';

export const database = registerAs('database', () => ({
  host: process.env.PG_HOST || 'localhost',
  port: +process.env.PG_PORT || 5432,
  password: process.env.PG_PASSWORD || 'postgres',
  username: process.env.PG_USER || 'postgres',
  dbName: process.env.PG_DB || 'base_app_development',
  debug: process.env.PG_DEBUG === 'true' || false,
  ssl: process.env.PG_SSL === 'true' || false,
}));
