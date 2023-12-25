import { Global, Module } from '@nestjs/common';
import { RequestContextModule } from '@src/lib/context/request/request-context.module';
import { RequestContext } from '@src/lib/context/request/request-context.model';

@Global()
@Module({
  imports: [
    RequestContextModule.forRoot({
      contextClass: RequestContext,
      isGlobal: true,
    }),
  ],
})
export class NestContextModule {}
