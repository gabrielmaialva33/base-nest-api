import * as path from 'path';

import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loaderOptions: {
        path: path.join(__dirname, '../../resources/i18n/'),
        watch: true,
      },
      disableMiddleware: true,
      resolvers: [
        AcceptLanguageResolver,
        { use: QueryResolver, options: ['lang'] },
      ],
    }),
  ],
  exports: [I18nModule],
})
export class NestI18nModule {}
