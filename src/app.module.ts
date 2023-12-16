import { Module } from '@nestjs/common';

import { NestConfigModule } from '@src/lib/config/config.module';
import { NestOrmModule } from '@src/lib/orm/orm.module';
import { NestJwtModule } from '@src/lib/jwt/jwt.module';

import { SharedModule } from '@src/modules/shared.module';
import { NestI18nModule } from '@src/lib/i18n/i18n.module';

import { RequestContext, RequestContextModule } from '@src/lib/context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from '@src/common/interceptors/context.interceptor';

@Module({
  imports: [
    NestConfigModule,
    NestOrmModule,
    NestJwtModule,
    NestI18nModule,
    RequestContextModule.forRoot({
      contextClass: RequestContext,
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
  ],
})
export class AppModule {}
