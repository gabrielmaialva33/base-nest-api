import type { FastifyReply, FastifyRequest } from 'fastify';

import type { Config as ConfigInterface } from '@src/lib/config/config.interface';
import type { User as UserEntity } from '@src/modules/users/entities/user.entity';
import { I18nTranslations as I18nTranslationTypes } from '@src/resources/generated/i18n/i18n.types';

/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {};

declare module 'fastify' {
  interface FastifyRequest {
    realIp?: string;
    user?: UserEntity;
  }
}

declare global {
  export type I18nTranslations = I18nTranslationTypes;
  export type Configs = ConfigInterface;

  // Using this allows is to quickly switch between express and fastify and others
  export type NestifyRequest = FastifyRequest;
  export type NestifyResponse = FastifyReply;
  export type NestifyNextFunction = () => void;
}
