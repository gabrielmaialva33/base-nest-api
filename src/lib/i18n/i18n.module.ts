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
        en: 'en',
        pt: 'pt',
        es: 'es',
        'en_*': 'en',
        'pt_*': 'pt',
        'es_*': 'es',
        'en-*': 'en',
        'pt-*': 'pt',
        'es-*': 'es',
      },
      logging: true,
      loaderOptions: {
        path: process.cwd() + '/src/resources/i18n/',
        watch: true,
        includeSubfolders: true,
      },
      typesOutputPath:
        process.cwd() + '/src/resources/generated/i18n/i18n.types.ts',
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  exports: [I18nModule],
})
export class NestI18nModule {}
