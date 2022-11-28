import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { i18nValidationErrorFactory } from 'nestjs-i18n';

export const ValidationPipeConfig = {
  transform: true,
  whitelist: true,
  validateCustomDecorators: true,
  exceptionFactory: i18nValidationErrorFactory,
} as ValidationPipeOptions;
