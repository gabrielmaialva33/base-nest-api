import { Module } from '@nestjs/common';

import { LoggerService } from '@logger/services/logger.service';
import { OrmModule } from '@src/lib/orm/orm.module';

@Module({
  imports: [OrmModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
