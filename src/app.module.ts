import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { NestConfigModule } from '@src/lib/config/config.module';
import { NestOrmModule } from '@src/lib/orm/orm.module';
import { NestJwtModule } from '@src/lib/jwt/jwt.module';
import { NestI18nModule } from '@src/lib/i18n/i18n.module';
import { NestHttpModule } from '@src/lib/http/http.module';
import { NestCronModule } from '@src/lib/cron/schedule.module';
import { NestEventModule } from '@src/lib/event/event.module';
import { NestCacheModule } from '@src/lib/cache/cache.module';
import { NestContextModule } from '@src/lib/context/context.module';

import { SharedModule } from '@src/modules/shared.module';

import { ContextInterceptor } from '@src/common/interceptors/context.interceptor';
import { RolesGuard } from '@src/common/guards/roles.guard';
import { NestMailModule } from '@src/lib/mailer';

@Module({
  imports: [
    NestConfigModule,
    NestOrmModule,
    NestJwtModule,
    NestI18nModule,
    NestHttpModule,
    NestCronModule,
    NestEventModule,
    NestCacheModule,
    NestContextModule,
    NestMailModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
  ],
})
export class AppModule {}
