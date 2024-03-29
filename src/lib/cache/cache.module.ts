import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from '@src/lib/cache/cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  exports: [CacheModule, CacheService],
  providers: [CacheService],
})
export class NestCacheModule {}
