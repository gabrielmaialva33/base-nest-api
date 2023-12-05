import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Env, validateEnv } from '@src/lib/config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
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
