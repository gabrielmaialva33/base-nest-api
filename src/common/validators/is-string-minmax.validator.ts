import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Sanitize } from '@common/decorators/sanitize.decorator';

interface IsStringMinMaxDecoratorOptions {
  min: number;
  max: number;
  optional?: boolean;
}

export function IsStringMinMax(ops?: IsStringMinMaxDecoratorOptions) {
  const options = { min: 2, max: 255, required: true, ...ops };
  const decoratorsToApply = [
    Sanitize(),
    IsString({
      message: i18nValidationMessage('validation.isDataType', {
        type: 'string',
      }),
    }),
    MinLength(options.min, {
      message: i18nValidationMessage('validation.minLength'),
    }),
    MaxLength(options.max, {
      message: i18nValidationMessage('validation.maxLength'),
    }),
  ];

  options.required
    ? decoratorsToApply.push(
        IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') }),
      )
    : decoratorsToApply.push(IsOptional());

  return applyDecorators(...decoratorsToApply);
}
