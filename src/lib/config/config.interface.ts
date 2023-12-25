import { ConfigType } from '@nestjs/config';
import { app, aws, database, jwt, mail, postgres, sqlite, twilio } from '.';

export interface Config {
  app: ConfigType<typeof app>;
  aws: ConfigType<typeof aws>;
  database: ConfigType<typeof database>;
  jwt: ConfigType<typeof jwt>;
  mail: ConfigType<typeof mail>;
  postgres: ConfigType<typeof postgres>;
  sqlite: ConfigType<typeof sqlite>;
  twilio: ConfigType<typeof twilio>;
}
