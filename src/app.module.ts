import { Module } from '@nestjs/common';

import { NestConfigModule } from '@src/lib/config/config.module';
import { NestOrmModule } from '@src/lib/orm/orm.module';
import { NestJwtModule } from '@src/lib/jwt/jwt.module';

import { SharedModule } from '@src/modules/shared.module';
import { NestI18nModule } from '@src/lib/i18n/i18n.module';

@Module({
  imports: [
    NestConfigModule,
    NestOrmModule,
    NestJwtModule,
    NestI18nModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
