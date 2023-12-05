import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppUtils } from './common/helpers/app.utils';
import { Logger } from '@nestjs/common';

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

  /**
   * ------------------------------------------------------
   * Global Config
   * ------------------------------------------------------
   */
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  await app
    .listen(3000, '0.0.0.0')
    .then(async () =>
      Logger.log(
        `Application is running on: ${await app.getUrl()}`,
        'Bootstrap',
      ),
    );
}

(async () => await bootstrap())();
