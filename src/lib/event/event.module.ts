import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';

@Module({
  imports: [EventEmitterModule.forRoot({})],
})
export class NestEventModule {}
