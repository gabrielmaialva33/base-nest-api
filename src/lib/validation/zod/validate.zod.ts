import { ZodSchema } from './z';

import { isZodDto, ZodDto } from './create-zod.dto';
import {
  createZodValidationException,
  ZodExceptionCreator,
} from './exception.zod';

export async function validate(
  value: unknown,
  schemaOrDto: ZodSchema | ZodDto,
  createValidationException: ZodExceptionCreator = createZodValidationException,
) {
  const schema = isZodDto(schemaOrDto) ? schemaOrDto.schema : schemaOrDto;
  const result: any = await schema['safeParseAsync'](value);

  if (!result.success) throw createValidationException(result.error);
  return result.data;
}
