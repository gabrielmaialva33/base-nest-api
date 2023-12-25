import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { NestMailModule } from '@src/lib/mailer';
import { NestTwilioModule } from '@src/lib/twilio';
import { NestAwsModule } from '@src/lib/aws';

import { SharedModule } from '@src/modules/shared.module';
import { RolesGuard } from '@src/common/guards/roles.guard';

import { ContextInterceptor } from '@src/common/interceptors/context.interceptor';
import { HttpCacheInterceptor } from '@src/common/interceptors/cache.interceptor';
import { ClearCacheInterceptor } from '@src/common/interceptors';
import { RealIpMiddleware } from '@src/common/middlewares/ip.middleware';
import { ClearCacheMiddleware } from '@src/common/middlewares';

@Module({
  imports: [
    NestAwsModule,
    NestCacheModule,
    NestConfigModule,
    NestContextModule,
    NestCronModule,
    NestEventModule,
    NestHttpModule,
    NestI18nModule,
    NestJwtModule,
    NestMailModule,
    NestOrmModule,
    NestTwilioModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClearCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RealIpMiddleware, ClearCacheMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
