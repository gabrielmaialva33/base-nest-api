import { Module } from '@nestjs/common';

import { NestConfigModule } from '@src/lib/config/config.module';
import { NestOrmModule } from '@src/lib/orm/orm.module';

@Module({
  imports: [NestConfigModule, NestOrmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
