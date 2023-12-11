import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as process from 'process';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-US': 'en',
        'pt-BR': 'pt',
        'es-ES': 'es',
      },
      logging: true,
      loaderOptions: {
        path: process.cwd() + '/src/resources/i18n/',
        watch: true,
        includeSubfolders: true,
      },
      typesOutputPath: process.cwd() + '/src/generated/i18n/i18n.types.ts',
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  exports: [I18nModule],
})
export class NestI18nModule {}
