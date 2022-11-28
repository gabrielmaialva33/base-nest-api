import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { HealthModule } from '@health/health.module';

import { LoggerModule } from '@logger/logger.module';
import { NestI18nModule } from '@src/lib/i18n/i18n.module';
import { OrmModule } from '@src/lib/orm/orm.module';
import { NestConfigModule } from '@src/lib/config/config.module';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    HealthModule,
    LoggerModule,
    CommonModule,
    NestI18nModule,
    OrmModule,
    NestConfigModule,
  ],
  exports: [],
})
export class AppModule {}
