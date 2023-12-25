import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 9000,
      maxRedirects: 5,
      withCredentials: false,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47',
      },
    }),
  ],
  exports: [HttpModule],
})
export class NestHttpModule {}
