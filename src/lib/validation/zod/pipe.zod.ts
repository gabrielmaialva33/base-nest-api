import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from './z';

import { isZodDto, ZodDto } from './create-zod.dto';
import { ZodExceptionCreator } from './exception.zod';
import { validate } from './validate.zod';

interface ZodValidationPipeOptions {
  createValidationException?: ZodExceptionCreator;
}

type ZodValidationPipeClass = new (
  schemaOrDto?: ZodSchema | ZodDto,
) => PipeTransform;

export function createZodValidationPipe({
  createValidationException,
}: ZodValidationPipeOptions = {}): ZodValidationPipeClass {
  @Injectable()
  class ZodValidationPipe implements PipeTransform {
    constructor(private schemaOrDto?: ZodSchema | ZodDto) {}

    public async transform(value: unknown, metadata: ArgumentMetadata) {
      if (this.schemaOrDto)
        return await validate(
          value,
          this.schemaOrDto,
          createValidationException,
        );

      const { metatype } = metadata;

      if (!isZodDto(metatype)) return value;

      return validate(value, metatype.schema, createValidationException);
    }
  }

  return ZodValidationPipe;
}

export const ZodValidationPipe = createZodValidationPipe();
