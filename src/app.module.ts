import { Module } from '@nestjs/common';
import { NestConfigModule } from '@src/lib/config/config.module';

@Module({
  imports: [NestConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
