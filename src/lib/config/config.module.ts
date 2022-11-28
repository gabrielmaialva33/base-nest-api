import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { database, jwt } from '@src/lib/config/configs';
import { ValidationSchema } from '@src/lib/config/validate.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`env/.env.${process.env.NODE_ENV}`],
      load: [database, jwt],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: ValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class NestConfigModule {}
