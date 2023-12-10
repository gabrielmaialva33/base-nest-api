import { INestApplication } from '@nestjs/common';

/**
 * -------------------------------------------------------
 * AppUtils
 * -------------------------------------------------------
 * AppUtils is a collection of utilities for the app.
 */
export const AppUtils = {
  /**
   * Kill the app with grace on SIGINT and SIGTERM
   * @param app
   */
  killAppWithGrace: (app: INestApplication) => {
    process.on('SIGINT', async () => {
      setTimeout(() => process.exit(1), 5000);
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      setTimeout(() => process.exit(1), 5000);
      await app.close();
      process.exit(0);
    });
  },
};
