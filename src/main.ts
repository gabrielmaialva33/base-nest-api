import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as path from 'path';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import multipart from '@fastify/multipart';
import staticfy from '@fastify/static';

import { AppUtils } from '@src/common/helpers/app.utils';
import { ZodValidationPipe } from '@src/lib/validation/zod';

import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
  );
  AppUtils.killAppWithGrace(app);

  /**
   * ------------------------------------------------------
   * Security
   * ------------------------------------------------------
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'img-src': [
          "'self'",
          'data:',
          'https://telegra.ph',
          'https://cdn.redoc.ly',
        ],
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          'https://cdn.redoc.ly',
          'blob:',
        ],
        'worker-src': ["'self'", 'blob:'],
      },
    },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.register(multipart, {
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    throwFileSizeLimit: true,
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.register(staticfy, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/public/',
    decorateReply: false,
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.register(staticfy, {
    root: path.join(__dirname, '..', 'docs'),
    prefix: '/docs/',
    decorateReply: false,
  });

  /**
   * ------------------------------------------------------
   * Global Config
   * ------------------------------------------------------
   */
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ZodValidationPipe());

  await app
    .listen(process.env.PORT || 3000, '0.0.0.0')
    .then(async () =>
      Logger.log(
        `Application is running on: ${await app.getUrl()}`,
        'Bootstrap',
      ),
    );
}

(async () => await bootstrap())();
