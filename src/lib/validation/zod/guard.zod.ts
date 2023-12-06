import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';

import { ZodSchema } from './z';
import { ZodDto } from './create-zod.dto';
import { ZodExceptionCreator } from './exception.zod';
import { Source } from './types.zod';
import { validate } from './validate.zod';

interface ZodBodyGuardOptions {
  createValidationException?: ZodExceptionCreator;
}

type ZodGuardClass = new (
  source: Source,
  schemaOrDto: ZodSchema | ZodDto,
) => CanActivate;

export function createZodGuard({
  createValidationException,
}: ZodBodyGuardOptions = {}): ZodGuardClass {
  @Injectable()
  class ZodGuard {
    constructor(
      private source: Source,
      private schemaOrDto: ZodSchema | ZodDto,
    ) {}

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest()[this.source];

      await validate(request, this.schemaOrDto, createValidationException);

      return true;
    }
  }

  return ZodGuard;
}

export const ZodGuard = createZodGuard();

export const UseZodGuard = (source: Source, schemaOrDto: ZodSchema | ZodDto) =>
  UseGuards(new ZodGuard(source, schemaOrDto));
