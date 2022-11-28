import 'dotenv/config';

import { useContainer } from 'class-validator';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';

import { NestFactory } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

import { ValidationPipeConfig } from '@src/lib/config/nest/validation.pipe.config';

import { LoggerMiddleware } from '@src/common/middleware/logger.middleware';

import { AppModule } from '@src/app.module';

import { LoggerModule } from '@logger/logger.module';
import { LoggerService } from '@logger/services/logger.service';
import { UserModule } from '@user/user.module';
import { UserService } from '@user/services/user.service';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppUtils } from '@common/helpers';
import { ValidationPipe } from '@common/pipes';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  AppUtils.killAppWithGrace(app);

  /**
   * ------------------------------------------------------
   * Security
   * ------------------------------------------------------
   */
  await app.register(helmet);
  await app.register(compression);
  app.enableCors();

  /**
   * ------------------------------------------------------
   * Middleware
   * ------------------------------------------------------
   */
  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      await new LoggerMiddleware(
        app.select(LoggerModule).get(LoggerService),
        app.select(UserModule).get(UserService),
      ).onRequest(request, reply);
    },
  );

  /**
   * ------------------------------------------------------
   * Global Config
   * ------------------------------------------------------
   */
  app.enableShutdownHooks();

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT || 3333, process.env.HOST || '0.0.0.0');
}

(async () =>
  await bootstrap().then(() =>
    Logger.log(
      `Application is listening on port ${
        process.env.PORT || 3333
      } in environment ${process.env.NODE_ENV}`,
      'Bootstrap',
    ),
  ))();
