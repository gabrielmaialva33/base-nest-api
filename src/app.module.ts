import { Module } from '@nestjs/common';

import { NestConfigModule } from '@src/lib/config/config.module';
import { NestOrmModule } from '@src/lib/orm/orm.module';
import { SharedModule } from '@src/modules/shared.module';

@Module({
  imports: [NestConfigModule, NestOrmModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
