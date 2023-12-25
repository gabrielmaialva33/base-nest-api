import { ConfigType } from '@nestjs/config';
import { app, database, jwt, mail, postgres, sqlite, twilio } from '.';

export interface Config {
  app: ConfigType<typeof app>;
  database: ConfigType<typeof database>;
  jwt: ConfigType<typeof jwt>;
  mail: ConfigType<typeof mail>;
  postgres: ConfigType<typeof postgres>;
  sqlite: ConfigType<typeof sqlite>;
  twilio: ConfigType<typeof twilio>;
}
