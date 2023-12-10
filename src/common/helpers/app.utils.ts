import { INestApplication, Logger } from '@nestjs/common';

/**
 * -------------------------------------------------------
 * AppUtils
 * -------------------------------------------------------
 * AppUtils is a collection of utilities for the app.
 */
const logger = new Logger('App:Utils');
export const AppUtils = {
  /**
   * Kill the app with grace on SIGINT and SIGTERM
   * @param app
   */
  killAppWithGrace: (app: INestApplication) => {
    process.on('SIGINT', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGINT');
    });

    process.on('SIGTERM', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGTERM');
    });
  },

  async gracefulShutdown(app: INestApplication, code: string) {
    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`Signal received with code ${code} ⚡.`);
    logger.log('❗Closing http server with grace.');

    try {
      await app.close();
      logger.log('✅ Http server closed.');
      process.exit(0);
    } catch (error: any) {
      logger.error(`❌ Http server closed with error: ${error}`);
      process.exit(1);
    }
  },
};
