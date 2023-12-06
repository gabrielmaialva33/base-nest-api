import * as process from 'process';

module.exports =
  process.env.DB_CLIENT === 'postgres'
    ? require('./src/lib/config/custom/postgres.config.ts').POSTGRES_CONFIG
    : require('./src/lib/config/custom/sqlite.config.ts').SQLITE_CONFIG;
