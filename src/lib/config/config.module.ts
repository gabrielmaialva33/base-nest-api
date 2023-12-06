import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Env, validateEnv } from '@src/env';
import { app, database, postgres, sqlite } from '@src/lib/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app, database, postgres, sqlite],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env'],
      validationSchema: Env,
      validate: (config) => validateEnv(config),
      validationOptions: { abortEarly: true },
    }),
  ],
})
export class NestConfigModule {}
