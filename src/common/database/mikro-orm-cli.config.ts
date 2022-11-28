import { UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const logger = new Logger('MikroORM-CLI');

logger.log(`🛠️  Using env ${process.cwd()}/env/.env.${process.env.NODE_ENV}\n`);

const MikroOrmConfig: MikroOrmModuleSyncOptions = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  dbName: process.env.PG_DB || 'postgres',
  type: 'postgresql',
  debug: process.env.PG_DEBUG === 'true' || false,
  driverOptions: {
    connection: { ssl: process.env.PG_SSL === 'true' || false },
  },
  filters: {
    deleted: {
      cond: { deleted_at: { $eq: null } },
    },
  },
  logger: logger.log.bind(logger),
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'dist/src/common/database/migrations',
    pathTs: 'src/common/database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
    fileName: (timestamp: string) => `migration.${timestamp}`,
  },
  seeder: {
    path: 'dist/src/common/database/seeds',
    pathTs: 'src/common/database/seeds',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) =>
      className.toLowerCase().replace(/seeder$/, '.') + 'seeder',
  },
  namingStrategy: UnderscoreNamingStrategy,
  highlighter: new SqlHighlighter(),
};

export default MikroOrmConfig;
