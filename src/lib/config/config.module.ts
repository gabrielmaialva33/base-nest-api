import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Env, validateEnv } from '@src/env';
import {
  app,
  aws,
  database,
  jwt,
  mail,
  postgres,
  sqlite,
  twilio,
} from '@src/lib/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app, aws, database, jwt, mail, postgres, sqlite, twilio],
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
